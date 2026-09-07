---
name: medical-qa
description: Heuristic scan of orthopedic service, condition, blog, and FAQ copy for dangerous claims, missing disclaimers, and emergency red flags. Use when the user asks for medical QA, legitimacy of content, or medical-qa. Never treat the report as a doctor's sign-off. Do not invent citations.
---

# Medical legitimacy QA

This skill **flags** copy. It does **not** certify that pages are medically correct.

## Instructions

1. Run from the website repo root:

```bash
python3 tools/checks/medical_qa.py
```

Optional: limit to one page and record a user-supplied source (do not fetch extra sources yourself unless the user gives a URL and asks you to read it):

```bash
python3 tools/checks/medical_qa.py --page knee-replacement --source "user pasted NICE note"
```

2. Read `tools/facts/medical-policy.md` and `tools/reports/medical-qa.md`.
3. Summarize Blocker / Review / Nit.
4. Do **not** auto-publish medical rewrites. Propose edits only; a clinician must approve before go-live.
5. Do **not** invent citations. Compare to a source only if the user supplied it.

## Examples

- "Medical QA on knee replacement"
- "Run medical-qa"
