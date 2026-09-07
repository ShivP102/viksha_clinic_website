#!/usr/bin/env python3
"""Performance budget checks: image size, script count, missing lazy-load."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib import iter_html_files, repo_root, write_report

MAX_BYTES = {
    "assets/images/doctor/doctor-placeholder.jpg": 250_000,
}
BUDGET_KB = 300


def main() -> int:
    root = repo_root()
    findings = []
    img_root = root / "assets" / "images"
    if img_root.exists():
        for img in img_root.rglob("*"):
            if not img.is_file() or img.suffix.lower() not in {".jpg", ".jpeg", ".png", ".webp", ".gif"}:
                continue
            size = img.stat().st_size
            rel = str(img.relative_to(root)).replace("\\", "/")
            if size > BUDGET_KB * 1024:
                findings.append({
                    "severity": "Review",
                    "file": rel,
                    "message": "Image is %.0f KB (budget %s KB)." % (size / 1024, BUDGET_KB),
                })
            if img.suffix.lower() in {".png"} and size > 80_000:
                findings.append({
                    "severity": "Nit",
                    "file": rel,
                    "message": "Consider WebP for PNG assets over 80 KB.",
                })

    for html in iter_html_files(root):
        rel = str(html.relative_to(root)).replace("\\", "/")
        text = html.read_text(encoding="utf-8", errors="replace")
        scripts = text.lower().count("<script")
        if scripts > 8:
            findings.append({
                "severity": "Nit",
                "file": rel,
                "message": "Page includes %s script tags." % scripts,
            })
        # below-fold images should lazy-load except hero fetchpriority
        img_tags = text.count("<img")
        lazy = text.count("loading=\"lazy\"") + text.count("loading='lazy'")
        if img_tags > 1 and lazy == 0 and "fetchpriority" not in text:
            findings.append({
                "severity": "Review",
                "file": rel,
                "message": "Images present without loading=lazy.",
            })

    out = root / "tools/reports/performance.md"
    write_report(out, "Performance budget report", findings)
    print("Wrote", out, "(%s findings)" % len(findings))
    return 1 if any(i["severity"] == "Blocker" for i in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
