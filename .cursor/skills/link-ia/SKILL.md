---
name: link-ia
description: Crawls site HTML for broken internal links, sitemap loc that do not exist, and HTML pages missing from sitemap.xml. Use when the user asks to check links, sitemap, IA, orphan pages, or run link-ia.
---

# Link and information architecture

## Instructions

1. Run from the website repo root:

```bash
python3 tools/checks/links.py
```

2. Read `tools/reports/links.md` and summarize.
3. Skip `tools/` and `plans/` HTML (scripts already skip those dirs).
4. Fix broken hrefs in the matching HTML files when the user wants repairs. Do not add sitemap rows for `tools/` or `plans/`.

## Examples

- "Check links"
- "Run link-ia"
