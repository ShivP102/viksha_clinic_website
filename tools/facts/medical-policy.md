# Medical copy policy (QA heuristics)

This file is for the medical-qa checker and skill. It is **not** clinical approval.

## Role of the agent

- Flag issues. Do not rewrite service or blog copy as if a surgeon signed it.
- Do not invent citations. Compare to a source only if the user supplies a URL or paste.
- A registered clinician must approve medical edits before they go live.

## Required on public pages

- Educational disclaimer (footer or dedicated line): not a substitute for consultation.
- Emergency path: open fractures, saddle anaesthesia, sudden inability to walk, loss of consciousness → nearest hospital / ER, not WhatsApp booking.

## Banned or high-risk phrasing (Blocker)

- Guaranteed cure, 100% success, no-risk surgery
- “Guaranteed outcomes” or similar
- Instructing patients to use WhatsApp for emergencies

## Review (not always wrong)

- “Best orthopedic surgeon” as a **statement of fact** (SEO FAQ questions that quote search terms are Review, not automatic Blocker)
- Specific surgery counts or years of experience if `clinic-facts.json` has `stats.verified: false`
- Recovery timelines stated as universal rather than typical/individual

## Spine and trauma pages should mention

- Cauda equina / saddle numbness / bladder or bowel change → emergency
- Open fracture, severe deformity, numbness after injury → emergency hospital care

## Testimonials

- No fabricated Google reviews presented as real
- No guaranteed results from anonymized stories
