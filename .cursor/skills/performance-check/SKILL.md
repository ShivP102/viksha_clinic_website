---
name: performance-check
description: Checks image file sizes, lazy-loading, and script counts against a simple performance budget. Use when the user asks for Core Web Vitals, image weight, LCP, or to run performance-check.
---

# Performance check

## Instructions

1. Run from the website repo root:

```bash
python3 tools/checks/performance.py
```

2. Read `tools/reports/performance.md`.
3. Compress or convert images over the budget. Keep the hero image with fetchpriority="high"; lazy-load the rest.
4. Do not add a JS framework to “fix” performance.

## Examples

- "Run performance-check"
- "Check image sizes"
