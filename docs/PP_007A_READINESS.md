# PP-007A — Prelaunch Gap Closure | Readiness Review

**Status:** v0.12.0 candidate pending CI and owner acceptance. Editorial review v1.0 approved all seven categories without changes. Implementation is limited to public-safe prelaunch content and verification. **Not launch-ready. No deployment.**

## Verified engineering foundation

- PP-005A–F accepted: homepage, career profile and credentials, four engineering case studies, sixteen competency records and reciprocal evidence links, three publications, granted US patent and owner-approved ORCID identifier.
- PP-006 / EL-001 v0.11.0: owner merged PR #15 (main ba6bba7ce703b106a511e2d86ab4b5405a72661f), deleted feature branch, CI run #43 (45181903529) passed. One functional independent OEE analyzer meets the minimum Engineering Lab capability required by the product specification. EL-002 and other analyzers remain optional post-launch development, not additional mandatory launch blockers.
- Production manifest remains `publicationEnabled:false` with null approval/version. All prerendered pages retain `noindex, nofollow`; the existing manual-only deployment workflow is not invoked. **A public repository is still publicly readable; noindex is not access control.**

## PP-007A editorial changes

1. **Insights:** A complete Lab-led landing page, with owner-approved headline and introduction, one featured EL-001 demonstration and links to already-approved research and work. The Insights article catalog remains empty. No unfinished article cards, fictional technical articles or development-only disclosure on this landing page.
2. **Development specimen and prelaunch labels:** Remove the Design System specimen link from shared public navigation. Retain its static noindexed route temporarily for internal CI screenshots/visual regression; its URL remains directly reachable in a local build and must be excluded before production. Shared footer's prelaunch notice is rendered only while release is disabled and is not a public claim.
3. **Contact:** A typed fail-closed publication gate reads `config/public-facing.json`. Exact email/profile href, label and approval reference are required before any direct contact channel can render. All are null/pending in this candidate; no public destination, form, tracking or personal data added.
4. **Résumé:** The same typed fail-closed gate requires a separately approved PDF path, label and approval reference. All are null/pending; no résumé bytes, download link or metadata added. The exact completed PDF remains subject to separate claim/confidentiality and metadata review.
5. **Cross-site consistency:** Keep approved professional history and outcomes, author order, patent attribution, evidence labels, synthetic EL-001 outputs and direct case-study/competency navigation intact. Replace any misleading "published articles" page promise with the approved Lab-led framing. No other new claims.
6. **Testing:** Existing Node 24 lockfile, TypeScript/Astro, content/model unit, design/contrast, build budgets, prelaunch inventory, Playwright/axe accessibility/navigation and link/anchor checks stay mandatory. Add unit regression for approval gates and browser assertions at 390/1440px for Insights content, EL-001 links, internal navigation and footer removal. Machine audit `test-results/mvp-audit.json` retains explicit `launchReady:false`. A passing axe smoke is not a manual accessibility certification.
7. **Release handoff:** Keep the blockers and exact closure evidence below; update historical milestone records, not production release authority.

## Acceptance criteria matrix

| ID | Required demonstration | Verification path |
| --- | --- | --- |
| AC-01 | Insights page uses approved headline/introduction and one functional EL-001 feature | Prerendered page and Playwright assertions |
| AC-02 | Empty Insights articles produce no fabricated article or placeholder | Zero article records and no development disclosure on Insights page |
| AC-03 | Design specimen is not in visitor navigation; its temporary QA use is explicit | Footer and build tests; launch blocker retained |
| AC-04 | Contact destination requires exact separate approval; no link/contact form added | JSON gate, unit and built HTML audit |
| AC-05 | Résumé destination requires PDF-specific approval; no asset or download link added | JSON gate, unit and build asset scan |
| AC-06 | Accepted evidence and claims remain unchanged | Content inventory and cross-link tests |
| AC-07 | EL-001 model, synthetic labels, numerical tests, and interactions remain functional | Unit and browser regression |
| AC-08 | Site links, anchors, shared layout and Calls to Action work | Link/fragment audit and click-through tests |
| AC-09 | Accessibility/responsiveness at 320/390/768/1024/1440px retained | Existing browser/axe checks; manual audit deferred |
| AC-10 | Static content is public-safe and confidentiality controls remain intact | Source review and automated guards; employer authorization requires manual evidence |
| AC-11 | Noindex, fail-closed manifest and manual-only deployment are unchanged | Build/audit/source review |
| AC-12 | Outstanding blockers have owner, closure criterion and planned phase | This document and machine-readable MVP audit |
| AC-13 | All prior functionality remains intact, full CI green | Required GitHub Actions workflow before owner-controlled merge |

**Acceptance boundary:** A successful PP-007A is **prelaunch gap closure**, not public launch approval, and may retain the production blockers below. Mark PP-007A accepted only after CI and explicit owner merge.

## Open PP-007B production/approval blockers

| ID | Owner | Closure requirement / required evidence |
| --- | --- | --- |
| CONTACT | Portfolio owner | Review and separately approve precise public email or professional profile URL, label and publication reference; inspect rendered link |
| RESUME | Portfolio owner | Examine final publication-safe PDF including employer/confidentiality claims, contact details and file metadata; approve the exact artifact and link |
| SPECIMEN | Engineering implementation | Remove internal Design System page from production output, replace dedicated QA fixtures, confirm no public links and inspect final asset inventory |
| PRODUCTION_QA | Portfolio owner + engineering reviewer | Review all public-facing claims against employer rules and source evidence; perform manual keyboard/screen-reader/device checks, actual Core Web Vitals, production social/SEO metadata and indexing, and approved hostname/TLS verification |
| RELEASE | Portfolio owner | Explicitly authorize production main SHA/version, configure GitHub Pages with appropriate environment protection and manually dispatch release after all launch tests |

No domain purchase, release configuration change, GitHub Pages activation, search indexing, publication, PR merge or external data transfer is permitted by this milestone. Do not confuse the repository being public with a permission to disclose new private material.

## Handoff

When PP-007A is accepted, handle CONTACT and RESUME as **individual publication approval requests** and production/specimen/QA/release in a separate explicitly authorized PP-007B review. Re-run all verification against the exact production candidate. Retain documented failures/uncertainty instead of treating review status as measured compliance.
