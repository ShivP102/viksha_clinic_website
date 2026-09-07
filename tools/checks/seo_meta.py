#!/usr/bin/env python3
"""SEO meta, JSON-LD, breadcrumbs, image alt, robots.txt."""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib import iter_html_files, repo_root, write_report

TITLE_RE = re.compile(r"<title>(.*?)</title>", re.I | re.S)
DESC_RE = re.compile(
    r'<meta[^>]+name=["\']description["\'][^>]+content=["\']([^"\']*)["\']',
    re.I,
)
DESC_RE_REV = re.compile(
    r'<meta[^>]+content=["\']([^"\']*)["\'][^>]+name=["\']description["\']',
    re.I,
)
JSONLD_RE = re.compile(r'<script[^>]+type=["\']application/ld\+json["\'][^>]*>(.*?)</script>', re.I | re.S)


class ImgParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.missing_alt = 0
        self.total = 0

    def handle_starttag(self, tag, attrs):
        if tag != "img":
            return
        self.total += 1
        attr = {k.lower(): v for k, v in attrs}
        alt = attr.get("alt")
        if alt is None or not str(alt).strip():
            self.missing_alt += 1


def meta_desc(html: str) -> str | None:
    m = DESC_RE.search(html) or DESC_RE_REV.search(html)
    return m.group(1).strip() if m else None


def main() -> int:
    root = repo_root()
    findings = []
    titles = {}
    descs = {}

    robots = (root / "robots.txt").read_text(encoding="utf-8")
    if "sitemap" not in robots.lower():
        findings.append({
            "severity": "Review",
            "file": "robots.txt",
            "message": "robots.txt has no Sitemap directive.",
        })
    elif "sitemap.xml" not in robots:
        findings.append({
            "severity": "Nit",
            "file": "robots.txt",
            "message": "Sitemap path may not point at sitemap.xml.",
        })

    for html_path in iter_html_files(root):
        rel = str(html_path.relative_to(root)).replace("\\", "/")
        text = html_path.read_text(encoding="utf-8", errors="replace")
        tm = TITLE_RE.search(text)
        title = re.sub(r"\s+", " ", tm.group(1)).strip() if tm else ""
        if not title:
            findings.append({"severity": "Blocker", "file": rel, "message": "Missing <title>."})
        else:
            titles.setdefault(title, []).append(rel)
            visible_len = len(re.sub(r"&[a-z]+;", "x", title))
            if visible_len > 60:
                findings.append({
                    "severity": "Nit",
                    "file": rel,
                    "message": "Title is %s characters (warn if over 60): %s" % (visible_len, title),
                })
        desc = meta_desc(text)
        if not desc:
            if rel != "404.html":
                findings.append({"severity": "Review", "file": rel, "message": "Missing meta description."})
        else:
            descs.setdefault(desc, []).append(rel)

        is_home = rel == "index.html"
        if not is_home and rel != "404.html":
            if "breadcrumbs" not in text:
                findings.append({"severity": "Review", "file": rel, "message": "No breadcrumb markup found."})

        if is_home:
            blob = " ".join(JSONLD_RE.findall(text))
            if "Physician" not in blob:
                findings.append({"severity": "Review", "file": rel, "message": "Home JSON-LD missing Physician."})
            if "FAQPage" not in blob:
                findings.append({"severity": "Nit", "file": rel, "message": "Home JSON-LD missing FAQPage."})
        if rel == "contact.html":
            blob = " ".join(JSONLD_RE.findall(text))
            if "MedicalBusiness" not in blob and "MedicalClinic" not in blob:
                findings.append({
                    "severity": "Review",
                    "file": rel,
                    "message": "Contact JSON-LD missing MedicalBusiness or MedicalClinic.",
                })

        imgs = ImgParser()
        try:
            imgs.feed(text)
        except Exception:
            pass
        if imgs.missing_alt:
            findings.append({
                "severity": "Review",
                "file": rel,
                "message": "%s image(s) missing alt text." % imgs.missing_alt,
            })

    for title, files in titles.items():
        if len(files) > 1:
            findings.append({
                "severity": "Review",
                "file": ", ".join(files),
                "message": "Duplicate title: %s" % title,
            })
    for desc, files in descs.items():
        if len(files) > 1:
            findings.append({
                "severity": "Review",
                "file": ", ".join(files),
                "message": "Duplicate meta description.",
            })

    out = root / "tools/reports/seo.md"
    write_report(out, "SEO meta report", findings)
    print("Wrote", out, "(%s findings)" % len(findings))
    return 1 if any(i["severity"] == "Blocker" for i in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
