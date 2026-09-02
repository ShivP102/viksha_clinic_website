# In-repo maintenance agents (Hostinger-safe)

v1 agents: **NAP/placeholders**, **links/sitemap**, **SEO meta**, **medical copy QA**, plus **Hostinger exclude**. Cursor project skills plus Python check scripts (stdlib only). Agents do not run on Hostinger and must not be web-accessible.

## Docs in this folder

| File | Description |
|------|-------------|
| [website-build-plan.md](website-build-plan.md) | Original site build plan |
| [website-agents-plan.md](website-agents-plan.md) | This file |

## What gets deployed vs not

Site files stay at repo root. Ops files sit beside them but are excluded from hosting.

**Never upload / never serve:** `.cursor/`, `tools/`, `plans/`, `.git/`

**Always upload:** `*.html`, `assets/`, `sitemap.xml`, `robots.txt`, root `.htaccess` (deny rules for ops paths).

## Hostinger

1. Prefer `tools/deploy/publish.sh` with `tools/deploy/rsync-exclude.txt` so ops folders never land in `public_html`.
2. If Git deploys the whole repo, `.htaccess` still forbids HTTP access to `.cursor`, `tools`, and `plans`.
3. Do not set the document root inside `tools/` or `.cursor/`.

## Layout

```text
.cursor/rules/viksha-ops.mdc
.cursor/skills/
  nap-placeholders/SKILL.md
  link-ia/SKILL.md
  seo-meta/SKILL.md
  medical-qa/SKILL.md
tools/
  facts/clinic-facts.json
  facts/medical-policy.md
  checks/*.py
  reports/
AGENTS.md
```

## How to assign work

In Cursor, with this repo open:

- “Run nap-placeholders”
- “Check links”
- “SEO audit”
- “Medical QA on knee replacement”

The agent loads the matching skill, runs the script, and summarizes `tools/reports/*.md`.

Medical QA **flags only**. A clinician must approve copy before it goes live. Do not invent citations.

## Out of v1

A11y, performance, page factory, changelog — same `tools/` + skills pattern later.
