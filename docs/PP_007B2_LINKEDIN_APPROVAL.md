# PP-007B.2 — LinkedIn contact publication: exact-item approval

**Scope:** Public Git repository inclusion of one explicitly approved professional contact item. This is **not** website launch approval.

- **Approved exact destination:** `https://www.linkedin.com/in/yabam`
- **Approved exact display label:** `Connect on LinkedIn`
- **Approved placement:** Professional Contact section on the portfolio Contact page
- **Approval reference:** `PP-007B-LINKEDIN-001`
- **Authority:** The portfolio owner explicitly authorized this precise URL and label for commit to the public `YabaCodes/professional-portfolio` repository on 2026-11-25; this public document only records approved scope, not private approval evidence.

## Enforcement and restrictions

- `config/public-facing.json` holds the exact approved contact; the existing `resolveContact` gate validates its HTTPS LinkedIn profile path and approval reference.
- The page uses the existing Contact card and the approved label as accessible link text. No invented email address, alternate profile, tracking parameter or phone is added.
- The résumé record remains strictly `pending` with null label, path and approval reference; **no PDF, download link or résumé metadata may be published**.
- The build and browser checks now explicitly permit this one approved LinkedIn URL **in the otherwise noindexed prelaunch build**, while continuing to reject other contact destinations.
- Production deployment remains blocked by `config/release.json` (`publicationEnabled: false`) and by the unresolved résumé approval. No GitHub Pages setting, indexing, domain or manual publishing workflow is changed.
- Any future change to the URL or visible label requires **fresh exact-item authorization** before public Git commit.
- This is a small publication-gated contact increment; prior editorial, employer and CI safeguards are retained.

## Acceptance checks

1. Exact URL and label render on Contact using `data-approved-contact-link`.
2. Only that approved LinkedIn URL is exposed; no mailto, telephone, other profile or résumé link is emitted.
3. The linked card and approved label pass mobile/desktop browser, navigation and axe accessibility smoke checks.
4. All accepted portfolio evidence, EL-001 synthetic labels, production-asset and deployment tests remain green.
5. `config/release.json` stays disabled and no website deployment is performed.
6. A draft review PR is opened; merging remains an explicit, separate owner action.
