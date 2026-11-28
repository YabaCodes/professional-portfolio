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
## Cleanroom — PP-009 (supersedes the Technical Editorial palette and fonts above)
Owner-selected 2026-11-27 (PP-009-DESIGN-001). Calm, bright and precise, like a cleanroom: white ground, mist panels, ink text and a single cobalt accent.

| Token | Hex | Use |
|---|---|---|
| White | #FFFFFF | Page ground |
| Mist | #EEF2F5 | Panels, chips, glance box |
| Ink | #15191E | Headings and text |
| Body | #2B323A | Long text |
| Steel | #55606B | Secondary text |
| Outline | #7D8995 | Secondary button and menu edges (3:1) |
| Line | #E3E8EC | Dividers |
| Cobalt | #2342B0 | Primary action, open phase, labels |
| Cobalt deep | #16297A | Hover |
| Cobalt tint | #E8ECFB | Open phase panel, completed phases |

Type: Instrument Sans Variable (weight and width axes), self-hosted through Fontsource; headings 600 at 92 % width with tight tracking; body 16–17 px, line height 1.6. Shapes: pill buttons and chips, 22 px panels, 14 px inner panels, no shadows except the mobile menu. The delivery phases are a numbered stepper: earlier phases turn cobalt tint with a cobalt line, the open phase is solid cobalt. Numbers are used only because the phases are a sequence. Motion is unchanged from PP-008 and respects reduced motion. Contrast is checked by `npm run test:design`.

## Diagrams — PP-013
Type scale (PP-017): page title 44 px on desktop (scales with its column), section headings up to 36 px (28 px on phones), panel headings 22 px, item titles 19 px, body 17 px, interface text 15 px, labels, meta and captions 14 px. Spacing: 16 px under section headings, 32 px from introductions to content, panel padding 24 px (phones) and 32 px (desktop), contact panel 40 px. Paragraphs use the body colour; steel is for meta and captions only. Desktop widths (PP-015): from 1024 px, sections use the full container width; long introductions are set in two columns and panel text runs to the panel edge, so no text wraps early beside empty space. Diagrams are original line drawings in the Cleanroom palette: ink strokes 1–2 px, mist and white fills, cobalt for the selected item. The process flow uses the phase icons (24 px grid, 1.6 px stroke) and plain arrows. The equipment layout follows layout-drawing conventions: top view, guarding as a heavy outline with door swings, a closed-loop transfer track with pallets and direction arrows, stations as blocks carrying numbered balloons for every topic they serve, feeders and peripherals outside the guarding, and the caption "Schematic, not to scale. Not a specific machine." Pattern (PP-014): a drawing grid like engineering graph paper (8 px minor, 40 px major lines, cobalt at 4–11 % on light surfaces, white at 4–8 % on deep blue), used at the top right of the hero (fading out before the text), behind the Equipment Layout section (mist drawing sheet) and in the deep-blue contact panel. Colour is added only with the approved blues: cobalt glance figures, a cobalt-tint Working Standards panel and a cobalt-deep contact panel with white buttons. The hero carries the owner's portrait (rounded square, 88 px on phones, 132 px from 768 px). No decorative animation; motion is limited to responses to the visitor's actions and respects reduced motion.

