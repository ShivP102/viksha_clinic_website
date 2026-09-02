#!/usr/bin/env python3
"""Flag placeholder NAP, fake reviews, and site-config drift."""
from __future__ import annotations

import json
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib import iter_html_files, repo_root, write_report

JS_KEYS = {
    "phone": re.compile(r'phone:\s*"([^"]+)"'),
    "phoneDisplay": re.compile(r'phoneDisplay:\s*"([^"]+)"'),
    "whatsapp": re.compile(r'whatsapp:\s*"([^"]+)"'),
    "email": re.compile(r'email:\s*"([^"]+)"'),
}


def parse_site_config(text: str) -> dict:
    out = {}
    for key, rx in JS_KEYS.items():
        m = rx.search(text)
        if m:
            out[key] = m.group(1)
    return out


def main() -> int:
    root = repo_root()
    facts = json.loads((root / "tools/facts/clinic-facts.json").read_text(encoding="utf-8"))
    js_path = root / "assets/js/site-config.js"
    js = js_path.read_text(encoding="utf-8")
    cfg = parse_site_config(js)
    findings = []

    contact = facts.get("contact") or {}
    for key in ("phone", "phoneDisplay", "whatsapp", "email"):
        expected = contact.get(key)
        actual = cfg.get(key)
        if expected and actual and expected != actual:
            findings.append({
                "severity": "Blocker",
                "file": "assets/js/site-config.js",
                "message": "site-config %s (%s) does not match clinic-facts.json (%s)" % (key, actual, expected),
            })

    if contact.get("isPlaceholder"):
        findings.append({
            "severity": "Blocker",
            "file": "tools/facts/clinic-facts.json",
            "message": "Contact details are still marked isPlaceholder. Replace before public launch.",
        })

    stats = (facts.get("doctor") or {}).get("stats") or {}
    if stats.get("verified") is False:
        findings.append({
            "severity": "Review",
            "file": "index.html",
            "message": "Experience/surgery/patient stats are not verified in clinic-facts.json.",
        })

    signals = facts.get("placeholderSignals") or []
    for html in iter_html_files(root):
        text = html.read_text(encoding="utf-8", errors="replace")
        rel = str(html.relative_to(root))
        lower = text.lower()
        for sig in signals:
            if sig.lower() in lower:
                findings.append({
                    "severity": "Review",
                    "file": rel,
                    "message": "Placeholder signal found: %s" % sig,
                })
        if 'href="#"' in text and facts.get("socialMustNotBeHash"):
            if "footer__social" in text or "instagram" in lower:
                findings.append({
                    "severity": "Review",
                    "file": rel,
                    "message": "Social or empty href=\"#\" present. Replace with real URLs or remove icons.",
                })
        if "maps?q=" in text or ("maps/embed" in text and "0x0%3A0x0" in text):
            findings.append({
                "severity": "Review",
                "file": rel,
                "message": "Generic or placeholder Google Maps embed.",
            })
        if "review-card" in text and ("R. S." in text or "placeholder" in lower):
            findings.append({
                "severity": "Blocker",
                "file": rel,
                "message": "Review carousel looks fictional. Do not present as real Google reviews.",
            })
        if "doctor-placeholder" in text:
            findings.append({
                "severity": "Review",
                "file": rel,
                "message": "Generated/placeholder doctor photo still referenced.",
            })

    # Deduplicate similar rows (same file+message)
    seen = set()
    unique = []
    for item in findings:
        key = (item["file"], item["message"])
        if key in seen:
            continue
        seen.add(key)
        unique.append(item)

    out = root / "tools/reports/nap.md"
    write_report(out, "NAP and placeholder report", unique)
    print("Wrote", out, "(%s findings)" % len(unique))
    return 1 if any(i["severity"] == "Blocker" for i in unique) else 0


if __name__ == "__main__":
    raise SystemExit(main())
