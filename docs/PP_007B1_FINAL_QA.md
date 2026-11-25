# PP-007B.1 — Final Engineering QA & Release-Candidate Handoff

**Version:** v0.14.0 candidate. **Status:** pending CI and owner review/merge. **Production publication:** disabled.
**Source main:** `3c79a79b2e067bbf75e9f2e588b93999763f7ae3`, PP-007B.1 v0.13.0 owner-merged PR #17 (CI #48 successful).

## What this increment actually completes

1. **Production-aware quality and confidentiality audit.** `scripts/check-mvp.mjs` supports both disabled prelaunch output and the later explicitly authorized production state. It preserves four case studies, sixteen competency groups, three research publications, one patent and one independently developed synthetic EL-001. It asserts exact authorized contact and PDF link references, prevents unapproved PDF inclusion, checks release version/approval and distinguishes internal development specimen, prelaunch and production indexing. It must pass in both CI and the manual release workflow.
2. **Release parity.** The manual GitHub Pages workflow now runs the same critical content, production-asset and navigation/accessibility checks as normal CI: unit, design, build, static content/privacy, production-preparation, links, responsive/axe and local performance diagnostics. A unit contract verifies ordering and fail-closed owner/SHA/version/approval checks. The release configuration and external Pages settings remain unchanged.
3. **Cross-mode browser behavior.** Contact and résumé test branches use the exact approved publication configuration in production mode and enforce their absence in prelaunch mode. Internal Design System specimen is excluded from production-mode route coverage. The baseline automated viewport coverage continues at 320, 390, 768, 1024, 1440 px.
4. **Local Chromium performance diagnostics.** Collect first-contentful paint, available largest-contentful-paint and layout-shift records, navigation duration and local resource counts at 390/1440 px across eight site sections, without introducing external page requests. Store measurements in `test-results/performance-diagnostics.json` and additional route screenshots. This is an indicative CI-lab check, **not Lighthouse certification nor field Core Web Vitals/INP**.
5. **Visual QA evidence.** Reviewed the previously generated desktop/mobile CI screenshots (including the full homepage and 390px Contact page). No obvious severe text clipping was visible in these inspected examples; that does not mean every page was manually certified. Browser smoke tests continue to assert horizontal overflow, minimum target sizes, keyboard access, responsive navigation, semantic headings and axe rules.
6. **Release-candidate handoff.** This document separates automated verification from owner-controlled personal publication and real production checks. No private claims, contact information, social destinations, résumé, employer record or new published article was added.

## Exact acceptance contract (QA stabilization)

| ID | Automated requirement | Evidence |
| --- | --- | --- |
| QA-01 | All accepted content counts and EL-001 disclosure unchanged | `npm run test:mvp` |
| QA-02 | Unapproved contact/résumé absent and release flag disabled | `test:mvp`, publication validator, file audit |
| QA-03 | Future production requires approved contact, precise PDF and release reference/version | `test:mvp`, `check-release.mjs` |
| QA-04 | Production excludes development specimen/prelaunch labels and has appropriate indexing | `test:build`, `test:production-prep`, unit fixture tests |
| QA-05 | Release pipeline runs full critical suite and retains manual-only trigger | `tests/deployment-workflow.test.mjs` |
| QA-06 | All internal links/fragments/assets resolve | `npm run test:links` |
| QA-07 | Mobile and desktop interactions, keyboard and automated accessibility assertions remain green | `npm run test:responsive` |
| QA-08 | Chromium local lab timing/resource and selected screenshots recorded with limitations | `npm run test:performance` |
| QA-09 | Production canonical, Open Graph, title, descriptions and Twitter metadata audited | `npm run test:production-prep` |
| QA-10 | No permission to merge, change hosting, enable production or publish actual personal content | Source/release diff review and explicit owner acceptance |

## Remaining approval-dependent work (not passed or certified)

| ID | Owner | Required action and evidence | Current state |
| --- | --- | --- | --- |
| B01 | Portfolio owner | Approve exact professional email or LinkedIn URL and displayed label *for public Git repository* | **Open — no contact destination committed** |
| B02 | Portfolio owner | Provide and review final public résumé PDF, source assertions, metadata, links and exact hash, then authorize that exact file for public Git | **Open — no résumé committed** |
| B03 | Engineering + owner | Inspect the final **authorized production build** excluding Design System specimen and all prelaunch copy; verify exact output | **Prepared and unit-tested only; real release untested** |
| B04 | Engineering + owner | Manual assistive-technology/keyboard and real-device tests, source/employer-policy disclosure sign-off, local Lighthouse, and approved-hostname/TLS/SEO/OG preview. Production field CWV only after actual lawful hosting | **Partially automated; manual/real-host checks open** |
| B05 | Portfolio owner | Approve public launch SHA/version, hosting source, protection/environment reviewer configuration and manual workflow dispatch in PP-007B.2 | **Not authorized** |

No custom domain has been approved. The currently configured prospective Pages base is `https://yabacodes.github.io/professional-portfolio/`; this is not asserted to be deployed. If owner approves another hostname, revisit canonical URL and configured base before launch.

## Production final runbook (requires separate owner permission)

1. Complete Gate A private wording and confidentiality review. Record only allowable approval reference.
2. Complete Gate B **for each** final contact and résumé artifact before adding them to any Git branch/PR. Review exact public URLs/bytes and metadata.
3. Produce separate, reviewed v1.0.0 production-release PR with final approved content and `config/release.json` release reference. Confirm the canonical hostname and production indexing. Do **not** treat merge as deployment consent.
4. Run full CI against the exact approved production candidate; validate every output file, visitor links, metadata, accessibility and metrics. Correct any issues in a review PR.
5. Independently verify Pages settings, `github-pages` environment approvals, GitHub Actions publishing source and protected branch permissions. Owner reviews the exact SHA and production version.
6. Obtain Gate C explicit deployment authorization. Only then dispatch the manual release workflow with the approved SHA and confirmation. Verify public URL, SSL/TLS, links, mobile, canonical tags, live robots, social previews and performance. Preserve an approved rollback plan using a reviewed revert/rebuild, not automatic secrets or unapproved dispatches.

**Acceptance boundary:** Passing the QA PR confirms completion of engineering-side prelaunch hardening only. Without owner item-level approvals, physical/assistive-technology testing, production hostname evidence and explicit Gate C, the site is **not** launch-ready. The public GitHub repository has always been public even while Pages is disabled.
