# Technical Editorial — approved baseline v1.0

PP-003A/B: Swiss editorial discipline + technical modernism. Personal rather than corporate identity.
Primary full-name wordmark; secondary geometric YM monogram (implementation to be reviewed). Dark navy hero/footer and selective technical sections; archival ivory editorial reading surfaces. Original technical line illustrations, no stock industrial assets.

| Token | Hex | Use |
|---|---|---|
| Midnight Navy | #101E2A | Hero/footer |
| Archival Ivory | #F6F5F0 | Reading canvas |
| Graphite | #23313A | Text |
| Engineering Teal | #347D73 | Graphic accents |
| Deep Teal | #286B62 | Functional text/links |
| Muted Jade | #83BAB3 | Dark surfaces |
| Structural Grey | #CDD2CC | Decorative grid/borders |
| Slate | #52636A | Secondary text |

Manrope headings, Inter body, IBM Plex Mono metadata; local hosting subject to license and asset review. 12/8/4-column grid; 1280px content max; 20px mobile and 32px tablet margins; 4px spacing scale; 65–75 characters reading width. Hero 64–72px desktop and 36–44px mobile; body 16–18px. Verify contrast in implementation, never rely on color alone. 44px touch targets, 150–250ms restrained motion and reduced-motion support. Mostly square or subtly rounded components.

Homepage sequence: hero, profile/credentials, selected work, expertise, lab, research, contact. Case study dark hero, disclosure caption, metadata, eight editorial sections, desktop sticky TOC and mobile expandable TOC. Reusable cards, citations, figures, tables, equations, navigation and footer; accessible error states. Lab workspace: clear inputs, outputs, formulas, assumptions, units, reference material and limitations; visibly label simulated information.

Targets: WCAG 2.2 AA; review 320/390/768/1024/1440px; LCP <=2.5s, CLS <=0.1, INP <=200ms (real-user metrics when available). Targets are not measured results.

## Implementation — PP-004B
Use Fontsource packages bundled as local assets by Astro/Vite; Manrope Variable and Inter Variable for display/body and IBM Plex Mono 400 for metadata. The package lock records exact versions and SIL OFL-1.1 license metadata; build copies each package's OFL notice to dist/licenses. No runtime external font service. Central tokens and responsive utilities live in src/styles/global.css. Browser screenshot artifacts are development specimens, not approved publication content.
## One-page résumé — PP-008
Homepage sequence: dark hero with title line, headline, introduction, actions and an at-a-glance list; six-phase delivery accordion; dark practice band; experience list; grouped skill chips; education, certifications, publications and patent; dark contact band; minimal footer. Palette, type, grid, 44 px targets and contrast rules unchanged. Motion: 150–250 ms press and hover feedback, a 300 ms phase-open height transition and a scroll-driven fade-in, all disabled under reduced motion and invisible to print.
