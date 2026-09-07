#!/usr/bin/env python3
"""Extract paragraph-style copy from HTML pages for external text review."""
from __future__ import annotations

import _bootstrap  # noqa: F401

import sys
from datetime import date
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "checks"))
from lib import iter_html_files, repo_root

from copy_lib import extract_blocks, format_page


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
        blocks = extract_blocks(path)
        pages.extend(format_page(rel, blocks))

    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text("\n".join(pages), encoding="utf-8")
    print(f"Wrote {len(html_files)} pages to {out}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
