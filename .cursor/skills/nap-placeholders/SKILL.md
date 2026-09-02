---
name: nap-placeholders
description: Checks clinic name, address, phone, WhatsApp, email, maps, reviews, and placeholder strings against clinic-facts.json and site-config.js. Use when the user asks to run nap-placeholders, check placeholders, verify contact details, NAP, or fake reviews.
---

# NAP and placeholders

## Instructions

1. Run from the website repo root:

```bash
python3 tools/checks/nap_placeholders.py
```

2. Read `tools/reports/nap.md` and summarize Blocker / Review / Nit.
3. Do not invent real clinic data. If `clinic-facts.json` has `isPlaceholder: true`, say the site is not launch-ready for contact details.
4. After the clinic supplies real NAP, update `tools/facts/clinic-facts.json` and `assets/js/site-config.js` together, then re-run.

## Examples

- "Run nap-placeholders"
- "Are we still shipping fake phone numbers?"
