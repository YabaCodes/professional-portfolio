# PP-009 — Cleanroom redesign and accurate content (v0.16.0 candidate)

## Owner decisions (2026-11-27)
- **PP-009-DESIGN-001:** of three private design directions (Cleanroom, Drawing sheet, Machine yellow), the owner chose Cleanroom.
- **PP-009-COPY-001:** the owner said the PP-008 text was not accurate and the phase headers did not use standard terms. The procedure was rewritten only from the owner's own description of his work, and he approved the complete draft ("All good") before commit.

## What changed in the wording
| Area | Now |
|---|---|
| Phases | Eight standard phases: User requirement specification (URS); Supplier response matrix and kickoff; Design review and approval; Machine build; Process integration; Factory acceptance test (FAT); Site acceptance test (SAT); Validation, handover and mass production |
| Removed (came from the job description, not the owner) | Historical data for the process team; detailed plan with milestones, resources and risk strategy; SOPs; suppliers in Europe; post-handover monitoring; "Documents I write" list |
| Qualification | IQ, OQ and PQ tests executed at process integration, FAT and SAT; phase 8 keeps the name "Validation" |
| Figures (owner-supplied) | Completed: 1 fully automated assembly machine, 2 final assembly machines, 8 manual assembly fixtures. In progress: 2 fully automated assembly machines approaching FAT; 1 automated assembly machine in the final supplier response matrix stage |
| Experience | Three official titles; "Senior Process Development Engineer (Team Lead)"; the separate team-lead record CAR-004 is retired |
| International | Machines mostly built by suppliers in Germany, some installed at company sites in Switzerland and the US; the owner travels to all three |

Unchanged: headline, introduction, contact text, skills (except "Team lead for three engineers"), education, publications and patent, LinkedIn and email. Résumé PDF still pending.

## Confidentiality
No customer, supplier, product, platform, machine name, project, budget or schedule is named. Figures are counts the owner chose to publish. Countries are named; sites and suppliers are not.

## Acceptance criteria
1. Approved wording, glance figures and track record render word for word (`test:mvp`).
2. Eight phases in standard order; keyboard-operable; one open at a time; earlier phases marked done (`test:responsive`).
3. Records: career 3, credentials 4, publications 3, patent 1.
4. Only the approved LinkedIn and email destinations; no résumé, phone or form.
5. Cleanroom palette contrast (`test:design`); no overflow, 44 px targets and zero axe WCAG 2.2 AA violations at 320–1440 px.
6. Prelaunch noindex, robots disallow and footer notice unchanged; one public page.

## Known limitations
The done marking uses CSS `:has()`; browsers without it show plain open and closed phases. Lab measurements only; no field Core Web Vitals or physical-device certification.
