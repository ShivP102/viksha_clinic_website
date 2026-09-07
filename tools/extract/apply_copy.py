#!/usr/bin/env python3
"""Apply doctor-reviewed PDF/markdown copy to HTML pages (dry-run by default)."""
from __future__ import annotations

import _bootstrap  # noqa: F401

import argparse
import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "checks"))

from lib import repo_root

from copy_lib import (
    align_blocks,
    export_sequence,
    is_placeholder_text,
    normalize_spelling,
    normalize_text,
)
from html_walker import extract_elements, is_nap_element, replace_element_text
from parse_review import parse_review_file


def truncate(text: str, limit: int = 120) -> str:
    text = normalize_text(text)
    if len(text) <= limit:
        return text
    return text[: limit - 1] + "…"


def apply_page(html_path: Path, review_blocks: list, write: bool) -> dict:
    root = repo_root()
    rel = html_path.relative_to(root).as_posix()
    result = {
        "page": rel,
        "updated": [],
        "unchanged": 0,
        "skipped_nap": [],
        "skipped_placeholder": [],
        "skipped_review": [],
        "skipped_current": [],
        "warnings": [],
        "errors": [],
        "changed": False,
    }

    if not html_path.exists():
        result["errors"].append(f"HTML file not found: {rel}")
        return result

    all_blocks, elements, soup = extract_elements(html_path)
    if len(all_blocks) != len(elements):
        result["errors"].append("Block/element count mismatch in HTML walker")
        return result

    seq_indices = export_sequence(all_blocks)
    current_seq = [all_blocks[i] for i in seq_indices]
    pairs = align_blocks(current_seq, review_blocks)

    pending: list[tuple] = []

    for ci, ri, status in pairs:
        if status == "match":
            result["unchanged"] += 1
            continue
        if status == "skip_review":
            if ri is not None:
                result["skipped_review"].append(review_blocks[ri].text)
            continue
        if status == "skip_current":
            if ci is not None:
                result["skipped_current"].append(current_seq[ci].text)
            continue
        if ci is None or ri is None:
            continue

        cur_block = current_seq[ci]
        rev_block = review_blocks[ri]
        new_text = normalize_spelling(rev_block.text)
        old_text = cur_block.text

        if normalize_text(old_text) == normalize_text(new_text):
            result["unchanged"] += 1
            continue
        if is_placeholder_text(new_text):
            result["skipped_placeholder"].append({"old": old_text, "new": new_text})
            continue

        block_index = seq_indices[ci]
        el = elements[block_index]
        if is_nap_element(el):
            result["skipped_nap"].append({"old": old_text, "new": new_text})
            continue
        if el and el.has_attr("data-i18n"):
            result["warnings"].append(
                f"data-i18n={el['data-i18n']}: {truncate(old_text)} → {truncate(new_text)}"
            )

        result["updated"].append({"old": old_text, "new": new_text})
        pending.append((el, new_text, old_text))

    if write and pending:
        for el, new_text, old_text in pending:
            if el is not None:
                replace_element_text(el, new_text, old_text)
        html_path.write_text(str(soup), encoding="utf-8")
        result["changed"] = True

    return result


def write_report(results: list[dict], out_path: Path, write_mode: bool) -> None:
    lines = [
        "# Apply copy report",
        "",
        f"Generated: {date.today().isoformat()}",
        f"Mode: {'write' if write_mode else 'dry-run'}",
        "",
    ]

    total_updated = sum(len(r["updated"]) for r in results)
    total_unchanged = sum(r["unchanged"] for r in results)
    total_nap = sum(len(r["skipped_nap"]) for r in results)
    total_placeholder = sum(len(r["skipped_placeholder"]) for r in results)
    pages_changed = sum(1 for r in results if r["changed"])

    lines.append("## Summary")
    lines.append("")
    lines.append(f"- Pages processed: {len(results)}")
    lines.append(f"- Pages changed: {pages_changed}")
    lines.append(f"- Blocks updated: {total_updated}")
    lines.append(f"- Blocks unchanged: {total_unchanged}")
    lines.append(f"- Skipped (NAP protected): {total_nap}")
    lines.append(f"- Skipped (placeholder text): {total_placeholder}")
    lines.append("")

    for r in results:
        if not (
            r["updated"]
            or r["skipped_nap"]
            or r["skipped_placeholder"]
            or r["warnings"]
            or r["errors"]
            or r["skipped_review"]
        ):
            continue
        lines.append(f"## {r['page']}")
        lines.append("")
        if r["errors"]:
            lines.append("### Errors")
            for e in r["errors"]:
                lines.append(f"- {e}")
            lines.append("")
        if r["updated"]:
            lines.append(f"### Updated ({len(r['updated'])})")
            for item in r["updated"]:
                lines.append(f"- **Old:** {truncate(item['old'])}")
                lines.append(f"  **New:** {truncate(item['new'])}")
            lines.append("")
        if r["skipped_nap"]:
            lines.append(f"### Skipped NAP ({len(r['skipped_nap'])})")
            for item in r["skipped_nap"]:
                lines.append(f"- {truncate(item['new'])}")
            lines.append("")
        if r["skipped_placeholder"]:
            lines.append(f"### Skipped placeholder ({len(r['skipped_placeholder'])})")
            for item in r["skipped_placeholder"]:
                lines.append(f"- {truncate(item['new'])}")
            lines.append("")
        if r["warnings"]:
            lines.append("### Warnings")
            for w in r["warnings"]:
                lines.append(f"- {w}")
            lines.append("")
        if r["skipped_review"]:
            lines.append(f"### Unmatched review blocks ({len(r['skipped_review'])})")
            for t in r["skipped_review"][:10]:
                lines.append(f"- {truncate(t)}")
            if len(r["skipped_review"]) > 10:
                lines.append(f"- … and {len(r['skipped_review']) - 10} more")
            lines.append("")

    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_path.write_text("\n".join(lines), encoding="utf-8")


def main() -> int:
    parser = argparse.ArgumentParser(description="Apply reviewed copy to HTML pages")
    parser.add_argument("review_file", type=Path, help="PDF or markdown review file")
    parser.add_argument(
        "--write",
        action="store_true",
        help="Write changes to HTML files (default is dry-run)",
    )
    args = parser.parse_args()

    if not args.review_file.exists():
        print(f"Review file not found: {args.review_file}", file=sys.stderr)
        return 1

    root = repo_root()
    review_pages = parse_review_file(args.review_file, root)
    print(f"Parsed {len(review_pages)} pages from {args.review_file.name}")

    results: list[dict] = []
    for rel, blocks in sorted(review_pages.items()):
        html_path = root / rel
        result = apply_page(html_path, blocks, args.write)
        results.append(result)
        if result["updated"]:
            print(f"  {rel}: {len(result['updated'])} update(s)")

    report_path = root / "tools" / "reports" / "apply-copy-report.md"
    write_report(results, report_path, args.write)
    print(f"Wrote report to {report_path}")
    if not args.write:
        print("Dry-run only. Pass --write to apply changes.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
