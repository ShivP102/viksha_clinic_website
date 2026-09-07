---
name: a11y-check
description: Heuristic accessibility scan of static HTML (lang, h1, input labels, iframe titles). Use when the user asks for an accessibility audit, a11y, WCAG, or to run a11y-check.
---

# Accessibility check

## Instructions

1. Run from the website repo root:

```bash
python3 tools/checks/a11y.py
```

2. Read `tools/reports/a11y.md` and summarize Blocker / Review / Nit.
3. Skip-link is injected by `assets/js/main.js`; do not flag that as a launch blocker on index if the script is present.
4. Fix unlabeled inputs and missing iframe titles when asked.

## Examples

- "Run a11y-check"
- "Accessibility audit"
