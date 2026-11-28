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

Custom domain: `https://yeabsramekdim.com/` (PP-024, owner-registered at Cloudflare), served from the domain root by GitHub Pages; the former project address `yabacodes.github.io/professional-portfolio/` redirects to it once the domain is set in the repository's Pages settings. Manual-only deployment workflow configured. Since PP-008 (v0.15.0) the public site is a single page: a résumé built around the owner's standard machine-delivery procedure, with experience, skills, education, publications and patent. PP-009 (v0.16.0) applies the owner-selected Cleanroom design and the owner's corrected wording. All public wording is owner-approved and kept in `src/lib/portfolio.ts`. The internal Design System specimen remains at /design-system/ for prelaunch QA only and is not linked publicly. See [AGENTS.md](AGENTS.md) and [project documentation](docs/PRODUCT_SPEC.md) before changes. Only publication-safe material may enter this public repository.

**Contact & résumé:** the owner has approved exactly two public contact items: the LinkedIn URL `https://www.linkedin.com/in/yabam` (label **Connect on LinkedIn**) and the address `yeabcb@gmail.com` (label **Email me**). There is no approved phone, alternative profile, résumé PDF, download link or contact form; the résumé configuration remains null/pending. Any change requires a separate exact-item approval. See `docs/PP_008_RESUME_OVERHAUL.md` and `config/public-facing.json`. Launch v1.0.0 (PP-010-001) is authorized without a résumé PDF; publication happens only through the manual deploy workflow after the owner's merge. Live URL: https://yabacodes.github.io/professional-portfolio/

Publication is disabled in config/release.json; do not activate Pages or invoke deployment before explicit launch approval. See docs/RELEASE_PROCESS.md. Size budgets are not measured Core Web Vitals.

**Prepared future artifact pipeline:** When an explicitly authorized v1.x production manifest eventually enables publishing, `postbuild` removes the internal design specimen and adjusts robots.txt; current prelaunch builds retain the internal specimen for QA and remain noindexed. Production metadata and accessibility/performance require separate final review. This change does not enable GitHub Pages or grant permission to publish personal details.
