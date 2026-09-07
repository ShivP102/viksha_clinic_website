---
name: seo-meta
description: Audits unique titles and meta descriptions, title length over 60 characters, breadcrumbs, JSON-LD on home and contact, empty image alt, and robots.txt sitemap. Use when the user asks for an SEO audit, meta tags, schema, or to run seo-meta.
---

# SEO meta

## Instructions

1. Run from the website repo root:

```bash
python3 tools/checks/seo_meta.py
```

2. Read `tools/reports/seo.md` and summarize Blocker / Review / Nit.
3. Prefer unique titles under 60 characters without stuffing extra keywords.
4. Do not add a domain to sitemap `loc` until a real domain is chosen.

## Examples

- "SEO audit"
- "Run seo-meta"
