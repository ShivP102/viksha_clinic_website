# Viksha Clinic Website

Premium, mobile-first, SEO-optimized website for **Dr. Chethan Kumar** — Consultant Orthopedic Surgeon, Bengaluru (JP Nagar & RR Nagar).

## Project docs

| File | Description |
|------|-------------|
| [plans/website-build-plan.md](plans/website-build-plan.md) | Site build plan — architecture, phases, design system |
| [plans/website-agents-plan.md](plans/website-agents-plan.md) | Maintenance agents, Hostinger exclude, how to run checks |
| [AGENTS.md](AGENTS.md) | Invoke NAP, links, SEO, and medical QA skills |
| [CONTENT.md](CONTENT.md) | Placeholder contact data still to replace |
| [website_builing_prompt.md](website_builing_prompt.md) | Original website build prompt |

## Tech stack

- Plain HTML5, CSS3, vanilla JavaScript (no framework)
- Mobile-first, semantic HTML, SEO-optimized
- Static deploy-ready files

## Getting started

Preview from this folder (`python3 -m http.server 8080`). Do not serve `tools/`, `plans/`, or `.cursor/` as the public site.

## Hostinger

Publish only HTML, `assets/`, `sitemap.xml`, `robots.txt`, and `.htaccess`. Use [tools/deploy/publish.sh](tools/deploy/publish.sh) and [tools/deploy/rsync-exclude.txt](tools/deploy/rsync-exclude.txt). See [plans/website-agents-plan.md](plans/website-agents-plan.md).

## Maintenance checks

From the repo root:

```bash
python3 tools/checks/nap_placeholders.py
python3 tools/checks/links.py
python3 tools/checks/seo_meta.py
python3 tools/checks/medical_qa.py
python3 tools/checks/a11y.py
python3 tools/checks/performance.py
```
