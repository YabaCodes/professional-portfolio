# PP-005F — Integrated MVP readiness review (v0.10.0 candidate)

## Status and scope
- Editorial review v1.0: all six PP-005F categories approved by the owner, with no changes.
- PP-005E v0.9.0: owner merged PR #13 on 2026-11-23 (main b4e5c8d2328cc79f09c5ddbd9f7268215288028c) after CI run 45171203738 passed; branch deleted.
- PP-005F: implementation candidate in review. No authorization for an exact email address, LinkedIn/profile URL, résumé artifact, release, Pages activation or deployment.
- A public GitHub repository already exposes tracked content even before Pages is activated; review all PR additions accordingly. The prelaunch Contact page contains **no contact destinations, form or résumé file**.

## Implemented section inventory
| Area | Evidence / status |
| --- | --- |
| Home / About | Approved positioning, experience, credentials and existing functional navigation |
| Selected Work | Four approved case studies with individual/team attribution and independently labeled synthetic models |
| Expertise | Sixteen competency records with bidirectional evidence relationships |
| Research | Three peer-reviewed publication records, one granted US patent, verified references and owner-approved ORCID |
| Contact | Approved editorial copy, prelaunch direct-contact and résumé panels with no active personal destinations or downloadable asset |
| Navigation | Direct Contact access via existing site navigation, homepage CTA and shared footer callout |

## Automated QA (candidate acceptance)
Run npm ci; npm run check; npm run test:unit; npm run test:design; npm run build; npm run test:build; npm run test:mvp; install Chromium; npm run test:links; npm run test:responsive. Do not claim success before CI verifies these steps. The new MVP check asserts exact public-record counts, production-disabled manifest, development noindex status, no unapproved contact URLs or résumé files, and shared contact navigation. Screenshots and axe WCAG-tagged checks cover key widths; they are not a full manual accessibility certification.

## Outstanding release blockers — intentional
1. **Exact contact destinations:** owner must separately approve precise public email and/or LinkedIn URL, or approve an alternative contact arrangement. Do not copy identifiers from private materials or old chats.
2. **Final résumé PDF:** separate document-specific content/privacy approval before any downloadable asset or link. No résumé is generated or copied in this increment.
3. **Functional Engineering Lab:** at least one independently developed, polished tool (EL-001 recommended), with transparent assumptions and acceptance tests. Existing CS-002 OEE preview is not a substitute.
4. **Insights and development specimens:** empty Insights content, temporary Lab description, footer/design-system development labels and noindex must be reconciled as part of a separately approved production milestone.
5. **Launch compliance and delivery:** content/employer-policy authorization where applicable, final owner review, manual keyboard/screen-reader/device tests, actual Core Web Vitals, production metadata/indexing, approved hosting/domain, GitHub Pages protections and explicit owner-approved release configuration. No deployment until PP-007.

## Release decision
**NOT LAUNCH READY**. This is expected and does not fail PP-005F prelaunch CI. The build/audit asserts known blockers instead of silently treating a completed navigation shell as publication authorization.
