"""Shared copy extraction, normalization, and export sequencing for HTML pages."""
from __future__ import annotations

import html
import re
from dataclasses import dataclass
from html.parser import HTMLParser
from pathlib import Path

SKIP_TAGS = frozenset(
    {
        "script",
        "style",
        "noscript",
        "header",
        "footer",
        "nav",
        "button",
        "form",
        "select",
        "textarea",
        "svg",
    }
)

SKIP_CLASS_PARTS = frozenset(
    {
        "breadcrumbs",
        "nav",
        "nav__",
        "btn",
        "btn-group",
        "card__link",
        "footer__",
        "whatsapp-float",
        "nav-toggle",
        "lang-toggle",
        "faq-item__icon",
        "skip-link",
        "logo",
        "flip-card__front",
        "flip-card__hint",
    }
)

HEADING_TAGS = frozenset({"h1", "h2", "h3", "h4"})

BLOCK_TAGS = frozenset({"p", "li", "dd", "blockquote"})

CONTENT_CLASS_PARTS = frozenset(
    {
        "faq-item__answer",
        "faq-item__question",
        "section-label",
        "section-subtitle",
        "hero__eyebrow",
        "hero__sub",
        "card__text",
        "stat__label",
        "story-card__label",
    }
)

NAP_DATA_ATTRS = frozenset(
    {
        "data-clinic-address",
        "data-clinic-phone",
        "data-clinic-map",
        "data-clinic-map-link",
        "data-clinic-whatsapp",
        "data-email-href",
        "data-email-text",
        "data-phone-href",
        "data-phone-text",
    }
)

PLACEHOLDER_PHRASES = (
    "placeholder",
    "will be listed here",
    "will be published after",
    "currently placeholders",
    "addresses are currently placeholders",
    "placeholder until",
    "placeholder hours",
    "after the clinic confirms",
    "after the clinic verifies",
    "once real contact details",
)

SECTION_LABELS = frozenset(
    {
        "personal brand",
        "personal branding",
        "areas of expertise",
        "related conditions",
        "symptoms",
        "causes",
        "diagnosis",
        "treatment options",
        "recovery timeline",
        "faqs",
        "faq",
        "need personal advice?",
        "about the doctor",
        "patient trust",
        "mobility stories",
        "appointments",
        "services",
        "conditions treated",
        "send a whatsapp booking",
        "jp nagar clinic",
        "rr nagar clinic",
        "questions patients search before visiting",
        "common orthopedic problems seen in clinic",
        "pain, injury and arthritis — assessed locally",
        "orthopedic care for jp nagar, rr nagar & south bengaluru",
        "book a consultation in jp nagar or rr nagar",
        "consult in jp nagar or rr nagar",
        "discuss this with dr. chethan kumar",
    }
)

PAGE_PATH_RE = re.compile(r"^[a-z0-9_./-]+\.html$", re.I)


@dataclass
class CopyBlock:
    kind: str  # h1..h4 or text
    text: str
    parent_heading: str = ""
    source_index: int = -1


def classes_match_skip(class_value: str) -> bool:
    for part in class_value.split():
        for skip in SKIP_CLASS_PARTS:
            if part == skip or part.startswith(skip):
                return True
    return False


def normalize_text(text: str) -> str:
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if not text or re.fullmatch(r"[\s./|·\-–—+]+", text):
        return ""
    return text


def normalize_spelling(text: str) -> str:
    """American orthopedic → British orthopaedic."""
    replacements = (
        ("Orthopedics", "Orthopaedics"),
        ("orthopedics", "orthopaedics"),
        ("Orthopedic", "Orthopaedic"),
        ("orthopedic", "orthopaedic"),
    )
    for old, new in replacements:
        text = text.replace(old, new)
    return text


def is_placeholder_text(text: str) -> bool:
    lower = normalize_text(text).lower()
    return any(phrase in lower for phrase in PLACEHOLDER_PHRASES)


def heading_key(text: str) -> str:
    return re.sub(r"[^a-z0-9]+", "", normalize_text(text).lower())


class CopyExtractor(HTMLParser):
    """Extract copy between header and footer, skipping nav and controls."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.in_body = False
        self.past_header = False
        self.before_footer = True
        self.tag_stack: list[str] = []
        self.class_stack: list[str] = []
        self.blocks: list[CopyBlock] = []
        self._text_parts: list[str] = []

    def _current_classes(self) -> str:
        return " ".join(self.class_stack)

    def _active(self) -> bool:
        return (
            self.in_body
            and self.past_header
            and self.before_footer
            and self.skip_depth == 0
        )

    def _inside_block(self) -> bool:
        return any(t in self.tag_stack for t in BLOCK_TAGS)

    def _parent_heading(self) -> str:
        for block in reversed(self.blocks):
            if block.kind in HEADING_TAGS:
                return block.text
        return ""

    def _append_block(self, kind: str, text: str) -> None:
        self.blocks.append(
            CopyBlock(
                kind=kind,
                text=text,
                parent_heading=self._parent_heading() if kind == "text" else "",
                source_index=len(self.blocks),
            )
        )

    def _flush_inline(self, tag: str | None = None) -> None:
        if not self._text_parts:
            return
        text = normalize_text(" ".join(self._text_parts))
        if not text or not self._active():
            return
        flush_tag = tag or (self.tag_stack[-1] if self.tag_stack else "")
        classes = self._current_classes()
        emitted = False
        if flush_tag in HEADING_TAGS:
            self._append_block(flush_tag, text)
            emitted = True
        elif flush_tag in BLOCK_TAGS or any(p in classes for p in CONTENT_CLASS_PARTS):
            self._append_block("text", text)
            emitted = True
        elif flush_tag == "a" and "card" in classes and "card__link" not in classes:
            self._append_block("text", text)
            emitted = True
        elif flush_tag in ("span", "div") and any(p in classes for p in CONTENT_CLASS_PARTS):
            self._append_block("text", text)
            emitted = True
        if emitted:
            self._text_parts = []

    def handle_starttag(self, tag: str, attrs: list[tuple[str, str | None]]) -> None:
        attr = {k.lower(): (v or "") for k, v in attrs}
        classes = attr.get("class", "")
        self.tag_stack.append(tag)
        self.class_stack.append(classes)

        if tag == "body":
            self.in_body = True
        if tag == "footer":
            self.before_footer = False
        is_faq_question = tag == "button" and "faq-item__question" in classes
        should_skip = (tag in SKIP_TAGS and not is_faq_question) or classes_match_skip(classes)
        if should_skip:
            self.skip_depth += 1
        if tag == "br" and self._active() and self._inside_block():
            self._text_parts.append(" ")

    def handle_endtag(self, tag: str) -> None:
        if tag == "header":
            self.past_header = True
        ended_classes = self.class_stack[-1] if self.class_stack else ""
        is_faq_question = tag == "button" and "faq-item__question" in ended_classes
        if (tag in SKIP_TAGS and not is_faq_question) or classes_match_skip(ended_classes):
            if self.skip_depth > 0:
                self.skip_depth -= 1

        if self._active():
            classes = ended_classes
            if tag in ("p", "li", "dd", "blockquote", "h1", "h2", "h3", "h4"):
                self._flush_inline(tag)
            elif tag == "div" and (
                "faq-item__answer" in classes
                or any(p in classes for p in CONTENT_CLASS_PARTS)
            ):
                self._flush_inline(tag)
            elif tag == "span" and any(p in classes for p in CONTENT_CLASS_PARTS):
                self._flush_inline(tag)

        if self.tag_stack:
            self.tag_stack.pop()
        if self.class_stack:
            self.class_stack.pop()

    def handle_data(self, data: str) -> None:
        if not self._active():
            return
        text = data.strip()
        if not text:
            return
        classes = self._current_classes()
        tag = self.tag_stack[-1] if self.tag_stack else ""

        if tag in HEADING_TAGS:
            self._text_parts.append(text)
            return

        if tag == "button" and "faq-item__question" in classes:
            q = normalize_text(text)
            if q:
                self._append_block("text", f"Q: {q}")
            return

        if self._inside_block():
            if tag == "a" and "card__link" in classes:
                return
            if tag == "a" and text.strip().endswith("→"):
                return
            self._text_parts.append(text)
            return

        if tag in BLOCK_TAGS or any(p in classes for p in CONTENT_CLASS_PARTS):
            self._text_parts.append(text)
            return

        if tag == "span" and "section-label" in classes:
            label = normalize_text(text)
            if label:
                self._append_block("text", label)
            return

        if tag == "a" and "card" in classes and "card__link" not in classes:
            self._text_parts.append(text)
            return

        if tag in ("div", "span") and "stat__number" in classes:
            num = normalize_text(text)
            if num:
                self._append_block("text", num)


def extract_blocks(path: Path) -> list[CopyBlock]:
    parser = CopyExtractor()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    for i, block in enumerate(parser.blocks):
        block.source_index = i
    return parser.blocks


def export_sequence(blocks: list[CopyBlock]) -> list[int]:
    """Indices into blocks that appear in the review export (format_page dedupe rules)."""
    indices: list[int] = []
    current_h2: str | None = None
    current_h3: str | None = None
    last_heading: str | None = None
    seen_under_h2: set[str] = set()
    seen_under_h3: set[str] = set()
    seen_page: set[str] = set()

    for i, block in enumerate(blocks):
        kind, text = block.kind, block.text
        if kind == "h1":
            if text == last_heading:
                continue
            last_heading = text
            indices.append(i)
            current_h2 = None
            current_h3 = None
            seen_under_h2 = set()
            seen_under_h3 = set()
        elif kind == "h2":
            if text == last_heading:
                continue
            last_heading = text
            current_h2 = text
            current_h3 = None
            seen_under_h2 = set()
            seen_under_h3 = set()
            indices.append(i)
        elif kind == "h3":
            if text == last_heading:
                continue
            last_heading = text
            current_h3 = text
            indices.append(i)
        elif kind == "h4":
            if text == last_heading:
                continue
            last_heading = text
            indices.append(i)
        elif kind == "text":
            if not text or text in seen_page:
                continue
            if current_h3 and text not in seen_under_h3:
                indices.append(i)
                seen_under_h3.add(text)
                seen_page.add(text)
            elif current_h2 and not current_h3 and text not in seen_under_h2:
                indices.append(i)
                seen_under_h2.add(text)
                seen_page.add(text)
            elif not current_h2:
                indices.append(i)
                seen_page.add(text)
    return indices


def format_page(rel_path: str, blocks: list[CopyBlock]) -> list[str]:
    lines: list[str] = []
    lines.append(f"## {rel_path}")
    lines.append("")

    if not blocks:
        lines.append("_No extractable copy found._")
        lines.append("")
        return lines

    current_h2: str | None = None
    current_h3: str | None = None
    last_heading: str | None = None
    seen_under_h2: set[str] = set()
    seen_under_h3: set[str] = set()
    seen_page: set[str] = set()

    def emit_text(text: str) -> None:
        if text in seen_page:
            return
        seen_page.add(text)
        lines.append(text)
        lines.append("")

    for block in blocks:
        kind, text = block.kind, block.text
        if kind == "h1":
            if text == last_heading:
                continue
            last_heading = text
            lines.append(f"### {text}")
            lines.append("")
            current_h2 = None
            current_h3 = None
            seen_under_h2 = set()
            seen_under_h3 = set()
        elif kind == "h2":
            if text == last_heading:
                continue
            last_heading = text
            current_h2 = text
            current_h3 = None
            seen_under_h2 = set()
            seen_under_h3 = set()
            lines.append(f"#### {text}")
            lines.append("")
        elif kind == "h3":
            if text == last_heading:
                continue
            last_heading = text
            current_h3 = text
            if current_h2:
                lines.append(f"##### {text}")
            else:
                lines.append(f"#### {text}")
            lines.append("")
        elif kind == "h4":
            if text == last_heading:
                continue
            last_heading = text
            prefix = "#####" if current_h2 else "####"
            lines.append(f"{prefix} {text}")
            lines.append("")
        elif kind == "text":
            if not text:
                continue
            if text in seen_page:
                continue
            if current_h3 and text not in seen_under_h3:
                emit_text(text)
                seen_under_h3.add(text)
            elif current_h2 and not current_h3 and text not in seen_under_h2:
                emit_text(text)
                seen_under_h2.add(text)
            elif not current_h2:
                emit_text(text)

    lines.append("---")
    lines.append("")
    return lines


def align_blocks(
    current: list[CopyBlock], review: list[CopyBlock]
) -> list[tuple[int | None, int | None, str]]:
    """
    Align review blocks to current export sequence.
    Returns list of (current_index, review_index, status).
    """
    pairs: list[tuple[int | None, int | None, str]] = []
    ci = 0
    ri = 0
    while ci < len(current) or ri < len(review):
        if ci >= len(current):
            pairs.append((None, ri, "skip_review"))
            ri += 1
            continue
        if ri >= len(review):
            pairs.append((ci, None, "skip_current"))
            ci += 1
            continue

        cur = current[ci]
        rev = review[ri]

        if cur.kind in HEADING_TAGS and rev.kind in HEADING_TAGS:
            if heading_key(cur.text) == heading_key(rev.text) or cur.kind == rev.kind:
                status = (
                    "match"
                    if normalize_text(cur.text) == normalize_text(rev.text)
                    else "update"
                )
                pairs.append((ci, ri, status))
                ci += 1
                ri += 1
                continue
            if rev.kind == "h2" and heading_key(rev.text) in SECTION_LABELS:
                pairs.append((None, ri, "skip_review"))
                ri += 1
                continue
            pairs.append((ci, ri, "update"))
            ci += 1
            ri += 1
            continue

        if cur.kind == "text" and rev.kind == "text":
            if normalize_text(cur.text) == normalize_text(rev.text):
                pairs.append((ci, ri, "match"))
            else:
                pairs.append((ci, ri, "update"))
            ci += 1
            ri += 1
            continue

        if cur.kind in HEADING_TAGS:
            pairs.append((ci, None, "skip_current"))
            ci += 1
            continue
        if rev.kind in HEADING_TAGS:
            pairs.append((None, ri, "skip_review"))
            ri += 1
            continue
        pairs.append((ci, ri, "update"))
        ci += 1
        ri += 1
    return pairs
