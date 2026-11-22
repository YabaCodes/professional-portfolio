# Architecture

Astro static output, Tailwind CSS v4 via official Vite plugin, TypeScript strict configuration, npm lockfile and Node 24 LTS. Exact dependencies and transitive resolution must be validated in CI. No backend, auth, runtime database or private data synchronization. Use base-aware links and asset URLs; GitHub project Pages base /professional-portfolio, future root custom domain requires separate config review.

src/pages: routes; src/layouts: page/article shells; src/components: shared UI; src/styles: tokens; src/assets: original optimized assets; src/content and src/content.config.ts: validated collections; src/lib/engineering: pure calculation logic; tests: unit/browser/accessibility.
Planned collections: case-studies, competencies, insights, demonstrations, publications, patents, credentials, career. Stable public IDs, slug, title, summary, evidence type, pillar, related competencies, public references, publication and revision dates. Validate referential integrity and evidence disclosure; approval register remains external. Do not populate with unapproved records.

CI checks build and type diagnostics at foundation; expanded unit/browser/axe tests in later increments. GitHub Pages deployment is separately authorized and manually triggered; no deployment workflow in this milestone. No React/Vue at foundation. Avoid dependencies without a documented need.

## Application shell — PP-004C
BaseLayout centralizes fonts, metadata, noindex, skip link, header/footer and main landmark. Site identity, route definitions and base-aware helpers live in src/lib/site.ts. Static section index routes generated from definitions; nested lab uses ArticleLayout with responsive TOC. Case study dynamic pages and content collections will be introduced in PP-004D. Native details navigation works without client JS. Development design specimen retained under /design-system/. Robots and metadata discourage indexing but are not confidentiality/access controls. Launch must explicitly remove development safeguards and add final social images and approved content.
