#!/usr/bin/env python3
"""Walk HTML with BeautifulSoup using the same rules as CopyExtractor."""
from __future__ import annotations

from copy_lib import (
    CONTENT_CLASS_PARTS,
    HEADING_TAGS,
    SKIP_TAGS,
    CopyBlock,
    classes_match_skip,
    normalize_text,
)

try:
    from bs4 import BeautifulSoup, NavigableString, Tag
except ImportError:
    BeautifulSoup = None  # type: ignore
    NavigableString = None  # type: ignore
    Tag = None  # type: ignore


def _class_str(el: Tag) -> str:
    classes = el.get("class") or []
    return " ".join(classes)


def extract_from_soup(soup: BeautifulSoup) -> tuple[list[CopyBlock], list[Tag | None]]:
    """Return parallel lists of CopyBlocks and their source DOM elements."""
    body = soup.body
    if not body:
        return [], []

    blocks: list[CopyBlock] = []
    elements: list[Tag | None] = []
    past_header = False
    before_footer = True

    def parent_heading() -> str:
        for block in reversed(blocks):
            if block.kind in HEADING_TAGS:
                return block.text
        return ""

    def walk(node, skip_depth: int = 0) -> None:
        nonlocal past_header, before_footer

        if isinstance(node, NavigableString):
            return
        if not isinstance(node, Tag):
            return

        tag = node.name or ""
        classes = _class_str(node)

        if tag == "header":
            for child in node.children:
                walk(child, skip_depth)
            past_header = True
            return

        if tag == "footer":
            before_footer = False
            return

        is_faq_question = tag == "button" and "faq-item__question" in classes
        should_skip = (tag in SKIP_TAGS and not is_faq_question) or classes_match_skip(classes)
        child_skip = skip_depth + 1 if should_skip else skip_depth
        active = past_header and before_footer and skip_depth == 0

        if active and tag in HEADING_TAGS:
            text = normalize_text(node.get_text())
            if text:
                blocks.append(CopyBlock(kind=tag, text=text, source_index=len(blocks)))
                elements.append(node)
            return

        if active and tag == "button" and "faq-item__question" in classes:
            q_parts = [
                normalize_text(s)
                for s in node.strings
                if normalize_text(s) and normalize_text(s) != "+"
            ]
            q = normalize_text(" ".join(q_parts))
            if q:
                blocks.append(CopyBlock(kind="text", text=f"Q: {q}", source_index=len(blocks)))
                elements.append(node)
            return

        if active and tag in ("p", "li", "dd", "blockquote"):
            text = normalize_text(node.get_text())
            if text:
                blocks.append(
                    CopyBlock(
                        kind="text",
                        text=text,
                        parent_heading=parent_heading(),
                        source_index=len(blocks),
                    )
                )
                elements.append(node)
            return

        if active and tag == "div" and (
            "faq-item__answer" in classes
            or any(p in classes for p in CONTENT_CLASS_PARTS)
        ):
            text = normalize_text(node.get_text())
            if text:
                blocks.append(
                    CopyBlock(
                        kind="text",
                        text=text,
                        parent_heading=parent_heading(),
                        source_index=len(blocks),
                    )
                )
                elements.append(node)
            return

        if active and tag == "span" and (
            "section-label" in classes or any(p in classes for p in CONTENT_CLASS_PARTS)
        ):
            text = normalize_text(node.get_text())
            if text:
                blocks.append(
                    CopyBlock(
                        kind="text",
                        text=text,
                        parent_heading=parent_heading(),
                        source_index=len(blocks),
                    )
                )
                elements.append(node)
            return

        if active and tag == "a" and "card" in classes and "card__link" not in classes:
            text = normalize_text(node.get_text())
            if text and not text.endswith("→"):
                blocks.append(
                    CopyBlock(
                        kind="text",
                        text=text,
                        parent_heading=parent_heading(),
                        source_index=len(blocks),
                    )
                )
                elements.append(node)
            return

        if active and tag in ("div", "span") and "stat__number" in classes:
            text = normalize_text(node.get_text())
            if text:
                blocks.append(CopyBlock(kind="text", text=text, source_index=len(blocks)))
                elements.append(node)
            return

        for child in node.children:
            walk(child, child_skip)

    for child in body.children:
        walk(child)

    return blocks, elements


def extract_elements(path) -> tuple[list[CopyBlock], list[Tag | None], BeautifulSoup]:
    if BeautifulSoup is None:
        raise ImportError("beautifulsoup4 is required. pip install -r tools/requirements.txt")
    html = path.read_text(encoding="utf-8", errors="replace")
    soup = BeautifulSoup(html, "html.parser")
    blocks, elements = extract_from_soup(soup)
    return blocks, elements, soup


def is_nap_element(el: Tag | None) -> bool:
    if el is None:
        return False
    from copy_lib import NAP_DATA_ATTRS

    for attr in NAP_DATA_ATTRS:
        if el.has_attr(attr):
            return True
    node: Tag | None = el
    while node:
        if any(node.has_attr(a) for a in NAP_DATA_ATTRS):
            return True
        node = node.parent if isinstance(node.parent, Tag) else None
    if el.name == "iframe":
        return True
    return "footer__contact" in _class_str(el)


def replace_element_text(el: Tag, new_text: str, old_text: str) -> None:
    if el.name == "button" and "faq-item__question" in _class_str(el):
        if new_text.startswith("Q: "):
            new_text = new_text[3:].strip()
        icon = el.find(class_="faq-item__icon")
        el.clear()
        el.append(new_text + " ")
        if icon:
            el.append(icon)
        else:
            new_span = el.new_tag("span", attrs={"class": "faq-item__icon"})
            new_span.string = "+"
            el.append(new_span)
        return

    strong = el.find("strong")
    if strong and el.name == "p":
        label = normalize_text(strong.get_text())
        if label.endswith(":") and new_text.lower().startswith(label.lower()):
            rest = new_text[len(label) :].strip()
            for child in list(el.children):
                if child is not strong:
                    child.extract()
            if rest:
                el.append(" " + rest)
            return

    el.clear()
    el.append(new_text)
