# Decisions and status

2026-11-22: PP-001 professional identity approved; PP-002 content architecture approved; PP-003A Technical Editorial creative direction approved; PP-003B detailed design approved. See PRODUCT_SPEC and DESIGN_SYSTEM.
PP-004A accepted 2026-11-22: PR #1 merged by owner, feature branch deleted. Final CI run 44996785562 passed lockfile, install, check and build. Main merge commit 1b748968a528fcd4240ae1ce785ce10aacd953bb. Initial lockfile failure resolved. No actual deployment.
PP-004B: design foundation candidate v0.2.0; exact font and browser-test versions resolved through CI and the verified lockfile committed. Permanent CI uses npm ci without bootstrap. Initial browser smoke run encountered an axe harness context error; explicit browser context fix implemented; final verification pending. Design specimen only, no employer-specific content. No automatic merge/deployment. Domain unverified and unpurchased.

PP-004B accepted 2026-11-22: final CI run 44997297761 passed all checks; owner merged PR #2 and deleted branch. Main merge commit d46084115117167aae6f3c65f8a680857bf33042.
PP-004C: v0.3.0 candidate; native details navigation to avoid client JS, shared layouts and metadata, route shells only. Retain noindex, preserve separate design specimen, no employer claims and no deployment. No new dependencies. Final CI passed after skip-link overlap and touch-target corrections.

PP-004C accepted 2026-11-22: final CI 45000430191 passed; owner merged PR #3 and deleted feature branch. Main merge commit 0c7653f768432a979bf0e320123a5b42725f71ef.
PP-004D: v0.4.0 candidate, eight strict JSON-backed Astro content collections; approval-only public records; pure TS calculation logic and Node native unit tests; no new dependencies. Real content remains empty. Case-study, article, demo detail templates activate only when approved records exist. Final CI/owner acceptance pending. No deployment.
