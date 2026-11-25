# PP-007B.1 — Publication Content & Production Readiness
Version: v0.13.0 candidate (not released)
Approved scope: S01–S07, Gate A/B/C workflow, AC-01–16 and B01–B05, owner-approved 2026-11-25.
Branch: feat/pp-007b1-production-readiness. This is **not** a production release.
Source baseline: main c4170ee8234385a7843905fab3dbb4e4fd297fa6 (PP-007A accepted).

## Scope and current implementation

| Scope | Prepared | Owner-dependent closure |
| --- | --- | --- |
| S01 Professional contact | Existing accessible cards and fail-closed destination validator retained; release additionally requires approval before launch | Exact email or LinkedIn path, label and repository-publication permission |
| S02 Publication-safe résumé | Existing PDF-only validator retained; release additionally verifies the final approved asset exists | Approved full PDF, independent content/metadata review |
| S03 Development specimen | Static artifact preparation removes `design-system/` **only** when `config/release.json.publicationEnabled=true` and release version + reference are valid; prelaunch QA specimen retained | Test final authorized production artifact, verify no specimen files or stale links |
| S04 Production metadata | Prelaunch indexing remains noindex and robots.txt Disallow; production-template conditional robots tag and build-time robots.txt Allow prepared, static metadata/canonical/OG/Twitter checks added | Final approved hostname, SEO, link-preview tests |
| S05 Claims and evidence | All existing approved work, competencies, research, granted patent and synthetic EL-001 content preserved | Confidentiality/employer policy, team-versus-individual outcome and public citation review |
| S06 Quality verification | Existing full CI plus unit test for specimen removal; new static metadata/asset and privacy audit runs in CI | Manual keyboard/screen-reader, physical devices, actual Lighthouse/Core Web Vitals evidence |
| S07 Release governance | Manual workflow unchanged; release precondition now requires approved contact and résumé before build | Protected Pages environment, owner sign-off on SHA/version/domain and manual dispatch |

**No production run was requested or performed.** `publicationEnabled` stays false; the production transformation is prepared and tested exclusively with synthetic, temporary fixture files. Production-specific assertions must be rerun against an explicitly approved release candidate.

## Separate authorization gates

**Gate A — content/confidentiality review.** Privately examine exact wording, original résumé, employer constraints and public evidence outside any public repository. Record only opaque review reference and conclusion when permitted. Gate A does not authorize placing private data into Git.

**Gate B — specific public repository item approval.** Owner authorizes the exact email/profile destination with visible link label, and separately the exact publication-safe PDF bytes/metadata and href. Until authorization, `config/public-facing.json` stays null/pending. A draft PR and PR diff are themselves public. Only after Gate B may approved items be committed. Unit tests and build checks are *not* substitutes for approval.

**Gate C — website production approval.** After B01–B04 are closed, owner approves exact final main SHA, version and release URL, environment protection and manual release confirmation. No GitHub Pages activation, domain purchase, robots/indexing change or deploy without this separate consent. Release workflow checks Gate C state and now fails if Gate B fields/assets remain pending.

## AC-01–16 acceptance criteria and evidence

| AC | Acceptance criterion | Automated / manual | Status in v0.13.0 candidate |
| --- | --- | --- | --- |
| 01 | Contact editorial layout production-ready | Existing Contact page and accessible nav tests | Prepared; owner destination pending |
| 02 | Exact item-level approval before contact link | Typed publication gate + unit tests + artifact guard | Enforced; destination absent |
| 03 | Résumé format verified and consistent | Human PDF content/ATS/metadata review | Open; no approved artifact |
| 04 | No unapproved PDF enters public Git | Source review, prelaunch static artifact scan | Enforced; no PDF included |
| 05 | Internal design fixture absent in production artifact | Fixture-driven prune tests and production path | Prepared; final production build not authorized |
| 06 | All pages editorially consistent | Metadata/canonical and existing browser reviews | Automated checks prepared; manual final review open |
| 07 | Work, research and evidence provenance preserved | Content graph, source and publication tests | Existing test coverage retained |
| 08 | EL-001 mathematical and UI behavior preserved | Unit/property/browser regression | Existing test coverage retained |
| 09 | Navigation, anchors and approved assets function | Playwright link and fragment audit | Existing test coverage retained |
| 10 | WCAG 2.2 AA target verified | Axe, tab/focus and manual assistive tech | Automated coverage retained; manual open |
| 11 | Production metadata and measured performance | Static meta audit + future approved-domain Lighthouse/field metrics | Metadata checked; actual metrics open |
| 12 | Confidentiality reviewed | Owner/employer policy review outside public repo | Open, explicit approval required |
| 13 | Full CI regression green | Node 24 CI, no skipped checks | Must pass before acceptance |
| 14 | Launch blockers have owner and evidence | This file and generated audit JSON | Documented, open where noted |
| 15 | No deployment or indexing enabled | Release JSON, robots and noindex audits | Maintained; actual production disabled |
| 16 | Review PR and merge authority separate | Draft PR, owner approval required | Pending owner acceptance |

Automated smoke checks and size budgets are **not** equivalent to manual accessibility certification, real-user Core Web Vitals, approved employer disclosure or a verified production URL.

## B01–B05 launch blocker closure register

| Blocker | Responsible owner | Closure evidence | Current disposition |
| --- | --- | --- | --- |
| B01 — CONTACT | Portfolio owner | Exact email or profile href and public label; separate explicit Git-publication authorization | Open — nothing approved or added |
| B02 — RESUME | Portfolio owner | Review exact final PDF for dates/claims/privacy, ATS/accessibility, links and metadata; approve file hash and public link | Open — no PDF included |
| B03 — DEVELOPMENT | Engineering reviewer | Authorized production artifact excludes `design-system/`, no broken links/development language, replace remaining QA fixture checks | Partially prepared — output-pruning path and unit tests |
| B04 — PRODUCTION QUALITY | Portfolio owner and engineering reviewer | Review claims and confidentiality, screen-reader/keyboard/physical-device results, production social preview, real Lighthouse numbers, approved hostname/TLS | Open — no public deployment evidence |
| B05 — LAUNCH | Portfolio owner | Approved exact SHA + v1.x release, confirmed GitHub Pages environment restrictions and explicit manual deployment decision | Not authorized |

## Security and editorial rules

1. GitHub repo/branches/PRs/CI artifacts are public even without a live site. Never stage actual private résumé drafts or unapproved contact details.
2. Continue using the previously accepted portfolio copy; do not add new employer metrics, awards, ownership or patent claims.
3. All OEE examples remain independent and synthetic, with model assumptions and limits.
4. Page and asset preparation is a **source-code feature**, not production activation. No live hostname, Pages settings, release manifest or indexing has been changed.
5. To prepare authorized publication later, Gate B comes first for contact and résumé, then Gate C for production. All existing scripts remain fail-closed until explicit approval.

## Proposed private manual QA worksheet (not executed)

| Evidence item | Acceptance condition | Current result |
| --- | --- | --- |
| Keyboard/screen reader | Logical tab/focus order, headings, descriptions, forms absent, announcements for OEE errors | NOT TESTED MANUALLY |
| Device matrix | Physical iPhone Safari, Android Chrome, desktop Safari/Firefox/Chromium | NOT TESTED ON PHYSICAL DEVICES |
| Performance | Local Lighthouse metrics and post-launch field LCP/CLS/INP | NOT MEASURED |
| Source and claim review | Each case study, publication, patent, credential, résumé, contact reviewed by owner | NOT RECONFIRMED FOR LAUNCH |
| Approved hostname | TLS, canonical, redirects, OG previews, robots and verified Pages configuration | NOT CONFIGURED/TESTED |
| Environment protection | GitHub Pages source GitHub Actions, protected main and required reviewers as available | NOT VERIFIED |

## Acceptance boundary

PR green CI + owner merge can accept *PP-007B.1 non-sensitive preparation only*. **It cannot authorize Gate B release of personal details or Gate C production deployment.** The final public launch requires PP-007B.2 and separate explicit owner authorization.
