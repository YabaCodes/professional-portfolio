# Professional Portfolio

Static-first professional portfolio for Yeabsra Mekdim.

**Status:** v0.14.1 exact-item LinkedIn contact publication candidate. v0.14.0 Final Engineering QA accepted; website not deployed.

## Development
Use Node.js 24 LTS (`nvm use`). After dependencies are locked, run `npm ci`.
- `npm run dev` — local application shell.
- `npm run check` — Astro and TypeScript diagnostics.
- `npm run build` — static output in `dist/`.
- `npm run preview` — inspect built output.
- `npm run test:unit` — synthetic content integrity and engineering calculation tests.
- `npm run test:build` — static output integrity and artifact budgets (after build).
- `npm run test:mvp` — approved inventory, contact/resume publication guard and prelaunch blockers (after build).
- `npm run test:production-prep` — 13-page metadata/canonical audit, prelaunch privacy/indexing and production asset-preparation report (after build).
- `npm run test:performance` — local Chromium timing, resource and layout diagnostics, with desktop/mobile release-review screenshots; not field Core Web Vitals.
- `npm run test:links` — internal link/fragment/asset audit (after build and Chromium install).
- `npm run test:design` — approved color and contrast checks.
- `npx playwright install chromium`, then `npm run test:responsive` after building — browser smoke tests.

Project Pages base: `/professional-portfolio`. Manual-only deployment workflow configured; release gate disabled; custom domain unapproved. Homepage, About, Selected Work, Expertise, Research and prelaunch Contact contain approved editorial wording; Insights now has an approved Lab-led landing page featuring accepted EL-001; the independent article catalog is intentionally empty. The internal Design System specimen remains at /design-system/ for prelaunch QA only and is not linked in public navigation. See [AGENTS.md](AGENTS.md) and [project documentation](docs/PRODUCT_SPEC.md) before changes. Only publication-safe material may enter this public repository.

Career, credentials, all four case studies, sixteen competency groups, three public research records and one granted US patent contain approved wording. No independent Insights articles have been authorized; accepted functional synthetic EL-001 is the featured Lab demonstration. Add only externally reviewed and authorized public records; do not insert private draft data. See docs/CONTENT_GOVERNANCE.md and docs/ARCHITECTURE.md. CS-002 includes an independent percentage-factor OEE preview; CS-003 includes a hypothetical readiness assessment, not release authorization. The full time/count-based EL-001 analyzer is accepted as a separate independent tool (v0.11.0), with synthetic inputs and no employer data.

**Contact & résumé:** the portfolio owner has explicitly approved **only** the LinkedIn URL `https://www.linkedin.com/in/yabam` and the Contact page label **Connect on LinkedIn** for inclusion in this public repository. There is no approved email address, phone, alternative profile, résumé PDF, download link or contact form. The résumé configuration remains null/pending. Any contact change or new asset requires a separate exact-item approval. See `docs/PP_007B2_LINKEDIN_APPROVAL.md` and `config/public-facing.json`. See docs/PP_007B1_FINAL_QA.md for production-aware regression and final release handoff, and PP_007B1_PRODUCTION_READINESS.md for the original scope;  earlier PP-005F/EL-001 documents remain historical. The site is **not launch ready**. No Pages activation or deployment is authorized.

Publication is disabled in config/release.json; do not activate Pages or invoke deployment before explicit launch approval. See docs/RELEASE_PROCESS.md. Size budgets are not measured Core Web Vitals.

**Prepared future artifact pipeline:** When an explicitly authorized v1.x production manifest eventually enables publishing, `postbuild` removes the internal design specimen and adjusts robots.txt; current prelaunch builds retain the internal specimen for QA and remain noindexed. Production metadata and accessibility/performance require separate final review. This change does not enable GitHub Pages or grant permission to publish personal details.
