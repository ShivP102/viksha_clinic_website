# Agents for this repo

Open this folder in Cursor. Ops files (`.cursor/`, `tools/`, `plans/`) are **not** the public website. Hostinger must exclude them (see [plans/website-agents-plan.md](plans/website-agents-plan.md) and [tools/deploy/rsync-exclude.txt](tools/deploy/rsync-exclude.txt)).

## Skills

| Say this | Skill | Command |
|----------|--------|---------|
| Run nap-placeholders | nap-placeholders | `python3 tools/checks/nap_placeholders.py` |
| Check links | link-ia | `python3 tools/checks/links.py` |
| SEO audit | seo-meta | `python3 tools/checks/seo_meta.py` |
| Medical QA | medical-qa | `python3 tools/checks/medical_qa.py` |

Reports land in `tools/reports/` (gitignored except `.gitkeep`).

Medical QA is heuristic only. A clinician must approve medical copy before launch.
