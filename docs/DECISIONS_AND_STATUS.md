# Decisions and status

2026-11-22: PP-001 professional identity approved; PP-002 content architecture approved; PP-003A Technical Editorial creative direction approved; PP-003B detailed design approved. See PRODUCT_SPEC and DESIGN_SYSTEM.
PP-004A accepted 2026-11-22: PR #1 merged by owner, feature branch deleted. Final CI run 44996785562 passed lockfile, install, check and build. Main merge commit 1b748968a528fcd4240ae1ce785ce10aacd953bb. Initial lockfile failure resolved. No actual deployment.
PP-004B: design foundation candidate v0.2.0; exact font and browser-test versions resolved through CI and the verified lockfile committed. Permanent CI uses npm ci without bootstrap. Initial browser smoke run encountered an axe harness context error; explicit browser context fix implemented; final verification pending. Design specimen only, no employer-specific content. No automatic merge/deployment. Domain unverified and unpurchased.

PP-004B accepted 2026-11-22: final CI run 44997297761 passed all checks; owner merged PR #2 and deleted branch. Main merge commit d46084115117167aae6f3c65f8a680857bf33042.
PP-004C: v0.3.0 candidate; native details navigation to avoid client JS, shared layouts and metadata, route shells only. Retain noindex, preserve separate design specimen, no employer claims and no deployment. No new dependencies. Final CI passed after skip-link overlap and touch-target corrections.

PP-004C accepted 2026-11-22: final CI 45000430191 passed; owner merged PR #3 and deleted feature branch. Main merge commit 0c7653f768432a979bf0e320123a5b42725f71ef.
PP-004D: v0.4.0 candidate, eight strict JSON-backed Astro content collections; approval-only public records; pure TS calculation logic and Node native unit tests; no new dependencies. Real content remains empty. Case-study, article, demo detail templates activate only when approved records exist. Final CI passed. No deployment.

PP-004D accepted 2026-11-22: final CI 45001992732 passed; owner merged PR #4 and deleted branch. Main merge commit 4f6a923beb6c14d4fbb5c8954c926737a70478d3.
PP-004E: v0.5.0 release-readiness candidate. Publication manifest disabled; manual-only Pages workflow, separate preflight and deploy permissions. CI on PRs and main pushes, static output/size budgets and browser link audit. No Pages activation or deployment authorized. No new dependencies. Final CI/owner acceptance pending.

PP-004E accepted 2026-11-22: final CI 45002722201 passed; owner merged PR #5 and deleted branch. Main merge commit 9ae4114010577837709ed3230bb81f8fbb3ef567. Phase 4 complete; v0.5.0 accepted, not deployed. PP-005A active: private inventory, verification and item-level approval. PP-005B–F milestone breakdown proposed; no professional records added; separate release approval remains required.

2026-11-22: PP-005A documentation PR #6 merged; CI run 45003775794 passed. Owner approved CR-001–007 editorial review v1.0 (no corrections). Authorization limited to reviewed wording; case study topic approval is not authorization to publish employer case studies. PP-005B v0.6.0 candidate implements approved homepage/profile, career and credentials records. Owner-confirmed qualifications are distinguished from public-source verification; no certificate identifiers, GPAs, logos, employer performance data, ORCID or case-study records added. Public release remains disabled; final verification and owner merge pending.

2026-11-22: PP-005B accepted; owner merged PR #7 and deleted branch, final CI 45004609189 passed. Main merge commit 5ebc60c82d027590522d97ff185e01ce37d61405.
CS-004 editorial review v1.0 approved all six categories without corrections. PP-005C first implementation candidate v0.6.1 includes CS-004 only, reusable case detail presentation and cards. Normalized stiffness values derived approximately from the 2022 abstract and labeled not raw measurements; public DOI references, original conceptual artwork, EL-010 planned only. Remaining CS-001–003 require individual approval. v0.7.0 reserved for complete case-study milestone. No deployment authorization; CI and review pending.

2026-11-22: PP-005C.1 / CS-004 accepted v0.6.1; final CI 45006138027 passed after semantic chart correction; owner merged PR #8 and deleted branch; main bc356ea0c69514f5644385e105de362b44f346b9.
CS-001 editorial review v1.0 approved all eight categories, no corrections. PP-005C.2 v0.6.2 candidate includes only owner-approved thematic professional experience, general methodology and independently defined schematic, qualitative outcomes and planned tools; no proprietary equipment details, project outcomes or external employer authorization inferred. CS-004 preserved; CS-002 and CS-003 still awaiting individual review. CI and owner merge pending. Deployment disabled.
