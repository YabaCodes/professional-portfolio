# PP-008 — One-page résumé overhaul (v0.15.0 candidate)

## Owner decision (2026-11-26)
The portfolio becomes a résumé with more detail: experience, skills, education, publications and patent, centred on the procedure the owner follows on every machine project. All individual project examples are removed. Target roles: engineering project management and NPI leadership.

## Exact-item approvals
| Reference | Item | Scope |
|---|---|---|
| PP-008-COPY-001 | All public wording in `src/lib/portfolio.ts` | Title line, headline, introduction (option B), six phases, practice statement, documents list, skills, languages, contact text |
| PP-008-EMAIL-001 | `mailto:yeabcb@gmail.com`, label "Email me" | Hero and contact band |
| PP-007B-LINKEDIN-001 | `https://www.linkedin.com/in/yabam` (unchanged) | Hero and contact band |

Not approved: résumé PDF, phone, other profiles, forms, deployment, indexing, merge.

Owner clarifications applied: title "Senior Process Development Engineer" kept; FAT/SAT protocol page counts not mentioned; protocols up to SAT are written and executed by the owner, validation and mass production are supported; control systems, PLC, HMI, SCADA and robotics are listed as specification, design review and testing, not programming.

## Confidentiality
The wording describes a general way of working. It names no customer, supplier, product, machine, project, metric, schedule or internal document. Requirement examples ("stop on force or distance", "centre the part on dimension X", camera inspection for a breakable component) are generic and come from the owner's public role description.

## Structure
`/` only: hero and at-a-glance facts → How I work (six phases) → Throughout every project → Experience → Skills → Education and certifications, Publications and patent → Contact. `/design-system/` remains a prelaunch-only internal specimen.

Removed: `/about`, `/work` and four case studies, `/expertise`, `/insights`, `/insights/lab` and the OEE analyzer, `/research`, `/contact`; case-study, competency, insight and demonstration collections; `src/lib/engineering`; their components, illustrations and unit tests.

## Acceptance criteria
1. Approved copy renders word for word (`test:mvp`).
2. Exactly six phases; keyboard-operable; one open at a time (`test:responsive`).
3. Career, credentials, publications and patent records render completely (4/4/3/1).
4. Only the approved LinkedIn and email destinations; no résumé, phone or form.
5. Prelaunch `noindex, nofollow`, robots disallow and footer notice; one public page.
6. No horizontal overflow, 44 px targets and zero axe WCAG 2.2 AA violations at 320, 390, 768, 1024 and 1440 px.
7. Motion respects reduced motion; content readable without JavaScript.
8. All CI checks pass; owner review and separate merge.

## Known limitations
Lab measurements only; no field Core Web Vitals, physical-device or screen-reader certification. The exclusive accordion relies on the `name` attribute on `<details>`; older browsers may allow several phases open at once, which is harmless. Launch still requires an approved résumé, production QA and explicit release authorization.
