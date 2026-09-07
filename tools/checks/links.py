#!/usr/bin/env python3
"""Check internal links, sitemap coverage, and orphan HTML pages."""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib import iter_html_files, repo_root, write_report

SITEMAP_LOC = re.compile(r"<loc>\s*([^<]+)\s*</loc>", re.I)


class HrefParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.hrefs = []

    def handle_starttag(self, tag, attrs):
        attr = dict(attrs)
        if tag == "a" and "href" in attr:
            self.hrefs.append(attr["href"])


def skip_href(href: str) -> bool:
    if not href or href.startswith("#"):
        return True
    lower = href.lower()
    if lower.startswith(("mailto:", "tel:", "javascript:", "data:")):
        return True
    if "wa.me" in lower or lower.startswith("https://") or lower.startswith("http://"):
        return True
    return False


def resolve(from_file: Path, href: str, root: Path) -> Path | None:
    href = href.split("#")[0].split("?")[0]
    if not href:
        return None
    href = unquote(href)
    if href.startswith("/"):
        return (root / href.lstrip("/")).resolve()
    return (from_file.parent / href).resolve()


def sitemap_paths(root: Path) -> set:
    xml = (root / "sitemap.xml").read_text(encoding="utf-8")
    found = set()
    for loc in SITEMAP_LOC.findall(xml):
        path = urlparse(loc.strip()).path or loc.strip()
        path = path.lstrip("/")
        if path:
            found.add(path)
    return found


def main() -> int:
    root = repo_root()
    findings = []
    html_files = list(iter_html_files(root))
    html_rel = {str(p.relative_to(root)).replace("\\", "/") for p in html_files}

    for html in html_files:
        rel = str(html.relative_to(root)).replace("\\", "/")
        parser = HrefParser()
        try:
            parser.feed(html.read_text(encoding="utf-8", errors="replace"))
        except Exception as exc:
            findings.append({"severity": "Review", "file": rel, "message": "Could not parse HTML: %s" % exc})
            continue
        for href in parser.hrefs:
            if skip_href(href):
                continue
            target = resolve(html, href, root)
            if target is None:
                continue
            try:
                target.relative_to(root)
            except ValueError:
                continue
            if not target.exists():
                findings.append({
                    "severity": "Blocker",
                    "file": rel,
                    "message": "Broken internal link: %s" % href,
                })

    sm = sitemap_paths(root)
    for rel in sorted(html_rel):
        if rel not in sm and rel != "404.html":
            findings.append({
                "severity": "Review",
                "file": rel,
                "message": "HTML page is not listed in sitemap.xml",
            })
    for loc in sorted(sm):
        disk = root / loc
        if not disk.exists():
            findings.append({
                "severity": "Blocker",
                "file": "sitemap.xml",
                "message": "Sitemap loc does not exist on disk: %s" % loc,
            })

    seen = set()
    unique = []
    for item in findings:
        key = (item["file"], item["message"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)

    out = root / "tools/reports/links.md"
    write_report(out, "Link and information-architecture report", unique)
    print("Wrote", out, "(%s findings)" % len(unique))
    return 1 if any(i["severity"] == "Blocker" for i in unique) else 0


if __name__ == "__main__":
    raise SystemExit(main())
