#!/usr/bin/env python3
"""Heuristic medical-copy QA. Flags only — not clinical approval."""
from __future__ import annotations

import argparse
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from lib import iter_html_files, repo_root, write_report

BLOCKER_PHRASES = [
    (r"guaranteed cure", "Guaranteed-cure language"),
    (r"100%\s*success", "100% success claim"),
    (r"no[- ]risk surgery", "No-risk surgery claim"),
    (r"guaranteed outcomes?", "Guaranteed outcomes"),
]

REVIEW_PHRASES = [
    (r"best orthopedic surgeon", "‘Best surgeon’ as a claim (OK if clearly a search-query FAQ)"),
    (r"cure arthritis", "Cure-arthritis phrasing"),
]

DISCLAIMER_HINTS = ("not a substitute", "educational", "not medical advice", "disclaimer")

SPINE_HINTS = ("saddle", "bladder", "cauda", "emergency")
TRAUMA_HINTS = ("open fracture", "emergency", "hospital")


def strip_tags(html: str) -> str:
    text = re.sub(r"<script[\s\S]*?</script>", " ", html, flags=re.I)
    text = re.sub(r"<style[\s\S]*?</style>", " ", text, flags=re.I)
    text = re.sub(r"<[^>]+>", " ", text)
    return re.sub(r"\s+", " ", text)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--page", help="Limit to a path fragment, e.g. knee-replacement")
    parser.add_argument("--source", help="Optional user-supplied source note (do not fetch unless given)")
    args = parser.parse_args()

    root = repo_root()
    findings = []
    policy = root / "tools/facts/medical-policy.md"
    if not policy.exists():
        findings.append({"severity": "Blocker", "file": "tools/facts/medical-policy.md", "message": "Policy file missing."})

    targets = []
    for html in iter_html_files(root):
        rel = str(html.relative_to(root)).replace("\\", "/")
        if rel.startswith("services/") or rel.startswith("conditions/") or rel.startswith("blog/"):
            targets.append(html)
        elif rel == "index.html":
            targets.append(html)
    if args.page:
        targets = [p for p in targets if args.page in str(p)]

    for html in targets:
        rel = str(html.relative_to(root)).replace("\\", "/")
        raw = html.read_text(encoding="utf-8", errors="replace")
        text = strip_tags(raw).lower()

        for rx, label in BLOCKER_PHRASES:
            if re.search(rx, text, re.I):
                findings.append({"severity": "Blocker", "file": rel, "message": label})
        for rx, label in REVIEW_PHRASES:
            if re.search(rx, text, re.I):
                findings.append({"severity": "Review", "file": rel, "message": label})

        if "whatsapp" in text and "emergency" in text and "not for emergenc" not in text:
            if re.search(r"whatsapp.{0,80}emergenc", text):
                findings.append({
                    "severity": "Review",
                    "file": rel,
                    "message": "WhatsApp mentioned near emergency — confirm patients are not told to chat for ER care.",
                })

        if rel.startswith("services/") or rel.startswith("blog/"):
            if not any(h in text for h in DISCLAIMER_HINTS):
                findings.append({
                    "severity": "Review",
                    "file": rel,
                    "message": "No educational disclaimer snippet found on this page (footer counts).",
                })

        if "back-pain" in rel or "slip-disc" in rel or rel.startswith("conditions/"):
            if "sciatica" in text or "disc" in text:
                if not any(h in text for h in SPINE_HINTS):
                    findings.append({
                        "severity": "Review",
                        "file": rel,
                        "message": "Spine-related copy may be missing emergency red-flag language.",
                    })
        if "fracture" in rel or "trauma" in rel:
            if not any(h in text for h in TRAUMA_HINTS):
                findings.append({
                    "severity": "Blocker",
                    "file": rel,
                    "message": "Trauma page missing emergency/hospital guidance for open or severe fractures.",
                })

    if args.source:
        findings.append({
            "severity": "Nit",
            "file": args.page or "(session)",
            "message": "User supplied a source for comparison. Do not invent citations. Source note: %s" % args.source[:300],
        })

    findings.append({
        "severity": "Nit",
        "file": "tools/facts/medical-policy.md",
        "message": "This report is heuristic only. A clinician must approve medical copy before go-live.",
    })

    out = root / "tools/reports/medical-qa.md"
    write_report(out, "Medical legitimacy QA (heuristic)", findings)
    print("Wrote", out, "(%s findings)" % len(findings))
    return 1 if any(i["severity"] == "Blocker" for i in findings) else 0


if __name__ == "__main__":
    raise SystemExit(main())
