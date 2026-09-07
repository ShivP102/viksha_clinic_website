#!/usr/bin/env python3
"""Parse doctor-reviewed PDF or markdown into CopyBlock sequences per HTML page."""
from __future__ import annotations

import re
from pathlib import Path

from copy_lib import (
    HEADING_TAGS,
    PAGE_PATH_RE,
    SECTION_LABELS,
    CopyBlock,
    heading_key,
    normalize_spelling,
    normalize_text,
)

PDF_PAGE_MARKER = re.compile(r"^--\s*\d+\s+of\s+\d+\s*--$", re.I)
COVER_TITLE_RE = re.compile(r"^Viksha Clinic", re.I)

KNOWN_H2_LABELS = SECTION_LABELS | frozenset(
    {
        "related conditions",
        "discuss this with dr. chethan kumar",
        "need personal advice?",
        "book an appointment",
        "send a whatsapp booking",
        "orthopaedic services",
        "orthopedic services",
        "patient education blog",
        "privacy policy",
        "conditions treated",
        "common orthopaedic problems seen in clinic",
        "common orthopedic problems seen in clinic",
    }
)


def extract_pdf_text(path: Path) -> str:
    try:
        from pypdf import PdfReader
    except ImportError as exc:
        raise SystemExit(
            "pypdf is required. Install with: pip install -r tools/requirements.txt"
        ) from exc

    reader = PdfReader(str(path))
    parts: list[str] = []
    for page in reader.pages:
        # Layout mode preserves visual lines and paragraphs (default is word-per-line).
        text = page.extract_text(extraction_mode="layout") or ""
        parts.append(text)
    return "\n".join(parts)


def _is_page_path(line: str) -> bool:
    return bool(PAGE_PATH_RE.match(line.strip()))


def _is_section_label(line: str) -> bool:
    key = heading_key(line)
    if key in KNOWN_H2_LABELS:
        return True
    # Short title-case lines without sentence punctuation
    if len(line) < 80 and not line.endswith(".") and not line.startswith("Q:"):
        words = line.split()
        if 1 <= len(words) <= 6 and line[0].isupper():
            lower = line.lower()
            if any(
                lower.startswith(prefix)
                for prefix in (
                    "related ",
                    "discuss ",
                    "need ",
                    "book ",
                    "send ",
                    "consult ",
                    "orthopaedic",
                    "orthopedic",
                    "patient ",
                    "privacy",
                    "conditions",
                    "common ",
                    "areas of",
                    "personal ",
                    "mobility",
                    "appointments",
                    "services",
                    "symptoms",
                    "causes",
                    "diagnosis",
                    "treatment",
                    "recovery",
                    "faq",
                )
            ):
                return True
    return False


def _infer_kind(line: str, state: dict) -> str:
    """Infer block kind for a standalone line after reflow."""
    if line.startswith("Q:"):
        return "text"
    if state.get("after_path") and not state.get("h1_done"):
        return "h1"
    if _is_section_label(line):
        return "h2"
    # Card-style h3: short title under an h2 section, next line is longer body
    if state.get("current_h2") and len(line) < 70 and not line.endswith("."):
        words = line.split()
        if 1 <= len(words) <= 8:
            return "h3"
    return "text"


def layout_paragraphs(lines: list[str]) -> list[str]:
    """
    Build complete paragraphs from layout-mode PDF lines.
    Blank lines separate paragraphs; soft-wrapped lines within a paragraph are joined.
    """
    paragraphs: list[str] = []
    buffer: list[str] = []

    def flush() -> None:
        if buffer:
            paragraphs.append(normalize_text(" ".join(buffer)))
            buffer.clear()

    for raw in lines:
        line = raw.strip()
        if not line:
            flush()
            continue
        if PDF_PAGE_MARKER.match(line) or COVER_TITLE_RE.match(line):
            flush()
            continue
        if _is_page_path(line):
            flush()
            paragraphs.append(line)
            continue
        if line.startswith("Q:"):
            flush()
            paragraphs.append(line)
            continue
        if _is_section_label(line):
            flush()
            paragraphs.append(line)
            continue
        # Soft wrap within a paragraph (line broken mid-sentence in PDF layout)
        if buffer and (
            buffer[-1].endswith((",", "—", "-", ":", ";"))
            or (not buffer[-1].endswith((".", "?", "!")) and line[0].islower())
            or (
                not buffer[-1].endswith((".", "?", "!"))
                and len(buffer[-1].split()) >= 8
            )
        ):
            buffer.append(line)
        else:
            flush()
            buffer.append(line)
    flush()
    return [p for p in paragraphs if p]


def reflow_paragraphs(lines: list[str]) -> list[str]:
    """Alias for layout_paragraphs — join wrapped lines into logical paragraphs."""
    return layout_paragraphs(lines)


def _text_similarity(a: str, b: str) -> float:
    """Rough overlap score for matching template blocks to PDF paragraphs."""
    a_words = set(re.findall(r"[a-z0-9]+", normalize_spelling(a).lower()))
    b_words = set(re.findall(r"[a-z0-9]+", normalize_spelling(b).lower()))
    if not a_words or not b_words:
        return 0.0
    overlap = len(a_words & b_words)
    return overlap / max(len(a_words), len(b_words))


def parse_pdf_page_guided(lines: list[str], template: list[CopyBlock]) -> list[CopyBlock]:
    """
    Match layout PDF paragraphs to template blocks in order.
    Falls back to unchanged template text when no paragraph matches.
    """
    paragraphs = [p for p in layout_paragraphs(lines) if not _is_page_path(p)]
    if not paragraphs or not template:
        return []

    review: list[CopyBlock] = []
    para_idx = 0

    for block in template:
        if para_idx >= len(paragraphs):
            review.append(CopyBlock(kind=block.kind, text=block.text))
            continue

        best_j: int | None = None
        best_score = 0.0
        window = 5 if block.kind in HEADING_TAGS else 4
        for j in range(para_idx, min(para_idx + window, len(paragraphs))):
            para = paragraphs[j]
            score = _text_similarity(block.text, para)
            if heading_key(block.text) == heading_key(para):
                score = max(score, 0.9)
            if block.text.startswith("Q:") and para.startswith("Q:"):
                score = max(score, _text_similarity(block.text[2:], para[2:]))
            if score > best_score:
                best_score = score
                best_j = j

        threshold = 0.25 if block.kind in HEADING_TAGS else 0.2
        if best_j is not None and best_score >= threshold:
            review.append(CopyBlock(kind=block.kind, text=paragraphs[best_j]))
            para_idx = best_j + 1
        else:
            review.append(CopyBlock(kind=block.kind, text=block.text))

    return review


def parse_page_blocks(paragraphs: list[str]) -> list[CopyBlock]:
    blocks: list[CopyBlock] = []
    state = {"after_path": False, "h1_done": False, "current_h2": None}

    for para in paragraphs:
        if _is_page_path(para):
            state = {"after_path": True, "h1_done": False, "current_h2": None}
            continue

        kind = _infer_kind(para, state)
        if kind == "h1":
            blocks.append(CopyBlock(kind="h1", text=para))
            state["h1_done"] = True
            state["after_path"] = False
            continue
        if kind == "h2":
            blocks.append(CopyBlock(kind="h2", text=para))
            state["current_h2"] = para
            continue
        if kind == "h3":
            blocks.append(CopyBlock(kind="h3", text=para))
            continue
        blocks.append(CopyBlock(kind="text", text=para))

    return blocks


def split_pdf_pages(text: str) -> dict[str, list[str]]:
    lines = text.splitlines()
    pages: dict[str, list[str]] = {}
    current_path: str | None = None
    current_lines: list[str] = []

    for raw in lines:
        line = raw.strip()
        if _is_page_path(line):
            if current_path and current_lines:
                pages[current_path] = current_lines
            current_path = line
            current_lines = []
            continue
        if current_path is not None:
            current_lines.append(raw)

    if current_path and current_lines:
        pages[current_path] = current_lines

    return pages


def parse_markdown(path: Path) -> dict[str, list[CopyBlock]]:
    text = path.read_text(encoding="utf-8")
    pages: dict[str, list[CopyBlock]] = {}
    current_path: str | None = None
    current_h2: str | None = None
    blocks: list[CopyBlock] = []

    for raw in text.splitlines():
        line = raw.strip()
        if line.startswith("## ") and line.endswith(".html"):
            if current_path and blocks:
                pages[current_path] = blocks
            current_path = line[3:].strip()
            blocks = []
            current_h2 = None
            continue
        if not current_path or line in ("", "---"):
            continue
        if line.startswith("### "):
            blocks.append(CopyBlock(kind="h1", text=line[4:].strip()))
            current_h2 = None
        elif line.startswith("##### "):
            blocks.append(CopyBlock(kind="h3", text=line[6:].strip()))
        elif line.startswith("#### "):
            blocks.append(CopyBlock(kind="h2", text=line[5:].strip()))
            current_h2 = line[5:].strip()
        else:
            blocks.append(CopyBlock(kind="text", text=line))

    if current_path and blocks:
        pages[current_path] = blocks
    return pages


def parse_review_file(path: Path, html_root: Path | None = None) -> dict[str, list[CopyBlock]]:
    from copy_lib import export_sequence, extract_blocks

    suffix = path.suffix.lower()
    if suffix == ".pdf":
        text = extract_pdf_text(path)
        raw_pages = split_pdf_pages(text)
        pages: dict[str, list[CopyBlock]] = {}
        for rel, lines in raw_pages.items():
            if html_root:
                html_path = html_root / rel
                if html_path.exists():
                    blocks = extract_blocks(html_path)
                    template = [blocks[i] for i in export_sequence(blocks)]
                    pages[rel] = parse_pdf_page_guided(lines, template)
                    continue
            pages[rel] = parse_page_blocks(layout_paragraphs(lines))
        return pages
    if suffix in (".md", ".markdown"):
        return parse_markdown(path)
    raise ValueError(f"Unsupported review file type: {suffix}")
