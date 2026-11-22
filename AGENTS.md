# Engineering and publication rules

## Authority
The owner approves product scope, design, employer-related content, merges and releases separately. Read docs/DECISIONS_AND_STATUS.md, PRODUCT_SPEC.md, DESIGN_SYSTEM.md, CONTENT_GOVERNANCE.md, MILESTONE_TRACKER.md and ROADMAP.md before making changes. Do not invent career details or imply approval of individual claims.

## Development
Work on dedicated feature branches; keep PRs reviewable and changes scoped to the active milestone. Never automatically merge, tag a release, deploy, purchase a domain, change visibility or modify a separate project. No direct writes to main. Update relevant docs, tests and changelog. Report actual results and blockers. Use Astro static output, Tailwind Vite plugin and strict TypeScript. Prefer semantic HTML, CSS and small isolated client modules; avoid unnecessary dependencies. Keep calculation logic independent of UI.

## Public repository boundary
Never commit private career records, internal designs, screenshots, datasets, supplier details, confidential identifiers, proprietary solutions, credentials or employer content without explicit publication approval. This applies to branches, history, PRs, artifacts and test fixtures. Anonymization alone is insufficient. Perform private review externally. Use original conceptual graphics and synthetic data with clear disclosures. Never imply simulated results are employment outcomes.

## Quality
Run npm ci, npm run check and npm run build; extend tests when features are added. Verify relevant responsive layouts, accessibility, links and calculations. Do not claim a check passed unless executed and verified. Manual publication gate remains separate from merge.
