#!/usr/bin/env python3
"""Extract paragraph-style copy from HTML pages for external text review."""
from __future__ import annotations

import html
import re
import sys
from datetime import date
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "checks"))
from lib import iter_html_files, repo_root

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


class CopyExtractor(HTMLParser):
    """Extract copy between <header> and <footer>, skipping nav and controls."""

    def __init__(self) -> None:
        super().__init__(convert_charrefs=True)
        self.skip_depth = 0
        self.in_body = False
        self.past_header = False
        self.before_footer = True
        self.tag_stack: list[str] = []
        self.class_stack: list[str] = []
        self.blocks: list[tuple[str, str, str]] = []
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
        for kind, text, _ in reversed(self.blocks):
            if kind in HEADING_TAGS:
                return text
        return ""

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
            self.blocks.append((flush_tag, text, ""))
            emitted = True
        elif flush_tag in BLOCK_TAGS or any(p in classes for p in CONTENT_CLASS_PARTS):
            self.blocks.append(("text", text, self._parent_heading()))
            emitted = True
        elif flush_tag == "a" and "card" in classes and "card__link" not in classes:
            self.blocks.append(("text", text, self._parent_heading()))
            emitted = True
        elif flush_tag in ("span", "div") and any(p in classes for p in CONTENT_CLASS_PARTS):
            self.blocks.append(("text", text, self._parent_heading()))
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
                self.blocks.append(("text", f"Q: {q}", self._parent_heading()))
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
                self.blocks.append(("text", label, self._parent_heading()))
            return

        if tag == "a" and "card" in classes and "card__link" not in classes:
            self._text_parts.append(text)
            return

        if tag in ("div", "span") and "stat__number" in classes:
            num = normalize_text(text)
            if num:
                self.blocks.append(("text", num, self._parent_heading()))


def extract_page(path: Path) -> list[tuple[str, str, str]]:
    parser = CopyExtractor()
    parser.feed(path.read_text(encoding="utf-8", errors="replace"))
    return parser.blocks


def format_page(rel_path: str, blocks: list[tuple[str, str, str]]) -> list[str]:
    lines: list[str] = []
    lines.append(f"## {rel_path}")
    lines.append("")

    if not blocks:
        lines.append("_No extractable copy found._")
        lines.append("")
        return lines

    h1_text = next((t for k, t, _ in blocks if k == "h1"), None)
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

    for kind, text, _parent in blocks:
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


def main() -> int:
    root = repo_root()
    out = root / "tools" / "reports" / "website-copy-for-review.md"
    pages: list[str] = []

    pages.append("# Website copy for external review")
    pages.append("")
    pages.append(
        "Paragraph-style text extracted from HTML pages. Navigation, buttons, forms, "
        "and footer boilerplate are excluded."
    )
    pages.append("")
    pages.append(f"Generated: {date.today().isoformat()}")
    pages.append("")
    pages.append("---")
    pages.append("")

    html_files = sorted(iter_html_files(root), key=lambda p: str(p.relative_to(root)))
    for path in html_files:
        rel = path.relative_to(root).as_posix()
        blocks = extract_page(path)
        pages.extend(format_page(rel, blocks))

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(pages), encoding="utf-8")
    print(f"Wrote {len(html_files)} pages to {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
