#!/usr/bin/env python3
"""Heuristic accessibility checks for the static site."""
from __future__ import annotations

import re
import sys
from html.parser import HTMLParser
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib import iter_html_files, repo_root, write_report


class PageParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.html_lang = ""
        self.has_h1 = False
        self.skip = False
        self.buttons_missing_name = 0
        self.inputs_missing_label = 0
        self._open_label_for = None
        self.ids = set()
        self.label_fors = set()
        self.input_ids = []
        self.tag_stack = []

    def handle_starttag(self, tag, attrs):
        attr = {k.lower(): (v or "") for k, v in attrs}
        if tag == "html":
            self.html_lang = attr.get("lang", "")
        if tag == "h1":
            self.has_h1 = True
        if tag == "a" and attr.get("class") == "skip-link":
            self.skip = True
        if tag == "label" and attr.get("for"):
            self.label_fors.add(attr["for"])
        if tag in ("input", "textarea", "select"):
            iid = attr.get("id")
            if iid:
                self.input_ids.append(iid)
            itype = attr.get("type", "text")
            if itype not in ("hidden", "submit", "button") and not iid and not attr.get("aria-label"):
                self.inputs_missing_label += 1
        if tag == "button":
            if not attr.get("aria-label") and not attr.get("aria-labelledby"):
                # text content checked in feed via data; conservative: ok if type submit inside form
                pass
        if attr.get("id"):
            self.ids.add(attr["id"])


def main() -> int:
    root = repo_root()
    findings = []
    for html in iter_html_files(root):
        rel = str(html.relative_to(root)).replace("\\", "/")
        text = html.read_text(encoding="utf-8", errors="replace")
        if 'lang="' not in text[:400].lower() and "lang='" not in text[:400].lower():
            findings.append({"severity": "Review", "file": rel, "message": "html lang attribute missing."})
        if "<h1" not in text.lower():
            findings.append({"severity": "Review", "file": rel, "message": "No h1 heading."})
        if rel == "index.html" and 'class="skip-link"' not in text:
            findings.append({
                "severity": "Nit",
                "file": rel,
                "message": "No skip-link in HTML (main.js injects one at runtime).",
            })
        unlabeled = re.findall(r"<input(?![^>]*type=\"hidden\")(?![^>]*(?:id=|aria-label=))[^>]*>", text, re.I)
        # simpler: inputs without id
        for m in re.finditer(r"<input([^>]*)>", text, re.I):
            attrs = m.group(1)
            if re.search(r'type\s*=\s*["\']hidden["\']', attrs, re.I):
                continue
            if re.search(r'type\s*=\s*["\']submit["\']', attrs, re.I):
                continue
            if "id=" not in attrs.lower() and "aria-label" not in attrs.lower():
                findings.append({"severity": "Review", "file": rel, "message": "Input without id or aria-label."})
                break
        if "<iframe" in text.lower():
            if not re.search(r"<iframe[^>]*title=", text, re.I):
                findings.append({"severity": "Review", "file": rel, "message": "iframe without title."})
        if "whatsapp-float" in text and 'aria-label' not in text[text.find("whatsapp-float"):text.find("whatsapp-float")+120]:
            findings.append({"severity": "Nit", "file": rel, "message": "WhatsApp float may need aria-label (main.js also sets it)."})

    out = root / "tools/reports/a11y.md"
    write_report(out, "Accessibility heuristic report", findings)
    print("Wrote", out, "(%s findings)" % len(findings))
    return 1 if any(i["severity"] == "Blocker" for i in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
