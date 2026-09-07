---
name: apply-copy
description: Parse doctor-reviewed PDF or markdown and apply updated copy to HTML pages. Skips NAP/contact fields and normalizes to British Orthopaedic spelling. Use when the user asks to apply copy review, apply doctor text, or run apply-copy.
---

# Apply copy review

## Instructions

1. Place the doctor's reviewed file in `tools/inbox/` (gitignored) or pass the full path.

2. Dry-run first (default):

```bash
python3 tools/extract/apply_copy.py "tools/inbox/Viksha Clinic - Dr.pdf"
```

3. Read `tools/reports/apply-copy-report.md` and summarize updates, NAP skips, placeholders, and warnings.

4. Apply only after user confirms:

```bash
python3 tools/extract/apply_copy.py "tools/inbox/Viksha Clinic - Dr.pdf" --write
```

5. Post-apply checks:

```bash
python3 tools/checks/medical_qa.py
python3 tools/checks/links.py
python3 tools/checks/nap_placeholders.py
```

## Notes

- NAP fields (addresses, phones, timings, maps) are never auto-updated.
- American "Orthopedic" in the review file is normalized to British "Orthopaedic".
- PDF parsing uses pypdf `extraction_mode="layout"` for full lines and paragraphs (not word-per-line).
- `data-i18n` changes may need manual Kannada sync in `assets/js/i18n.js`.

## Dependencies

```bash
pip install -r tools/requirements.txt
```

## Examples

- "Apply copy review"
- "Run apply-copy on the doctor PDF"
- "Dry-run apply_copy on tools/inbox/reviewed.pdf"
