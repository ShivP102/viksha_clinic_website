#!/usr/bin/env python3
"""Tests for copy extract/apply roundtrip."""
from __future__ import annotations

import _bootstrap  # noqa: F401

import sys
import tempfile
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))

from copy_lib import (
    CopyBlock,
    align_blocks,
    export_sequence,
    extract_blocks,
    normalize_spelling,
    normalize_text,
)
from html_walker import extract_elements, replace_element_text
from parse_review import layout_paragraphs


SAMPLE_HTML = """<!DOCTYPE html>
<html lang="en">
<head><title>Test</title></head>
<body>
  <header><nav>Skip</nav></header>
  <section class="page-hero">
    <h1>About Dr. Test</h1>
    <p>First paragraph here.</p>
  </section>
  <section class="section">
    <h2>Symptoms</h2>
    <ul><li>Pain item one</li><li>Pain item two</li></ul>
    <div class="faq-item">
      <button class="faq-item__question" type="button">Old question? <span class="faq-item__icon">+</span></button>
      <div class="faq-item__answer">Old answer text.</div>
    </div>
  </section>
  <footer><p>Footer skip</p></footer>
</body>
</html>
"""


def test_normalize_spelling() -> None:
    assert normalize_spelling("Orthopedic surgeon") == "Orthopaedic surgeon"
    assert normalize_spelling("MS (Orthopedics)") == "MS (Orthopaedics)"


def test_extract_blocks() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "test.html"
        path.write_text(SAMPLE_HTML, encoding="utf-8")
        blocks = extract_blocks(path)
        kinds = [b.kind for b in blocks]
        assert "h1" in kinds
        assert blocks[0].text == "About Dr. Test"
        texts = [b.text for b in blocks if b.kind == "text"]
        assert "First paragraph here." in texts
        assert "Pain item one" in texts
        assert any(t.startswith("Q: ") for t in texts)


def test_export_sequence_dedupes() -> None:
    blocks = [
        CopyBlock(kind="h1", text="Title"),
        CopyBlock(kind="text", text="Same"),
        CopyBlock(kind="h2", text="Section"),
        CopyBlock(kind="text", text="Same"),
    ]
    seq = export_sequence(blocks)
    assert 0 in seq
    assert 1 in seq
    assert 3 not in seq  # duplicate under h2 skipped


def test_align_blocks_match() -> None:
    current = [
        CopyBlock(kind="h1", text="About Dr. Test"),
        CopyBlock(kind="text", text="First paragraph here."),
    ]
    review = [
        CopyBlock(kind="h1", text="About Dr. Test"),
        CopyBlock(kind="text", text="Updated paragraph here."),
    ]
    pairs = align_blocks(current, review)
    assert pairs[0][2] == "match"
    assert pairs[1][2] == "update"


def test_replace_element() -> None:
    with tempfile.TemporaryDirectory() as tmp:
        path = Path(tmp) / "test.html"
        path.write_text(SAMPLE_HTML, encoding="utf-8")
        blocks, elements, soup = extract_elements(path)
        h1 = next(el for el, b in zip(elements, blocks) if b and b.kind == "h1")
        replace_element_text(h1, "New Title", "About Dr. Test")
        assert "New Title" in str(soup)


def test_layout_paragraphs_joins_wrapped_lines() -> None:
    lines = [
        "About Dr. Chethan Kumar",
        "",
        "Consultant Orthopedic Surgeon — JP Nagar & RR Nagar, Bengaluru. Patient-first,",
        "evidence-based orthopedic care.",
        "",
        "Personal branding",
    ]
    paras = layout_paragraphs(lines)
    assert paras[0] == "About Dr. Chethan Kumar"
    assert "evidence-based orthopedic care." in paras[1]
    assert paras[2] == "Personal branding"


def run_all() -> None:
    test_normalize_spelling()
    test_extract_blocks()
    test_export_sequence_dedupes()
    test_align_blocks_match()
    test_replace_element()
    test_layout_paragraphs_joins_wrapped_lines()
    print("All tests passed.")


if __name__ == "__main__":
    run_all()
