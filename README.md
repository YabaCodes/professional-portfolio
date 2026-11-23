# Professional Portfolio

Static-first professional portfolio for Yeabsra Mekdim.

**Status:** v0.9.0 research and invention candidate. v0.8.0 accepted; website not deployed.

## Development
Use Node.js 24 LTS (`nvm use`). After dependencies are locked, run `npm ci`.
- `npm run dev` — local application shell.
- `npm run check` — Astro and TypeScript diagnostics.
- `npm run build` — static output in `dist/`.
- `npm run preview` — inspect built output.
- `npm run test:unit` — synthetic content integrity and engineering calculation tests.
- `npm run test:build` — static output integrity and artifact budgets (after build).
- `npm run test:links` — internal link/fragment/asset audit (after build and Chromium install).
- `npm run test:design` — approved color and contrast checks.
- `npx playwright install chromium`, then `npm run test:responsive` after building — browser smoke tests.

Project Pages base: `/professional-portfolio`. Manual-only deployment workflow configured; release gate disabled; custom domain unapproved. Homepage, About, Selected Work, Expertise and Research contain approved editorial content; remaining sections remain in development. Design specimen: /design-system/ under configured base. See [AGENTS.md](AGENTS.md) and [project documentation](docs/PRODUCT_SPEC.md) before changes. Only publication-safe material may enter this public repository.

Career, credentials, all four case studies, sixteen competency groups, three public research records and one granted US patent contain approved wording. Insights and Lab catalogs remain empty pending separate approval. Add only externally reviewed and authorized public records; do not insert private draft data. See docs/CONTENT_GOVERNANCE.md and docs/ARCHITECTURE.md. CS-002 includes an independent percentage-factor OEE preview; CS-003 includes a hypothetical readiness assessment, not release authorization. The full time/count-based EL-001 analyzer remains planned.

Publication is disabled in config/release.json; do not activate Pages or invoke deployment before explicit launch approval. See docs/RELEASE_PROCESS.md. Size budgets are not measured Core Web Vitals.
