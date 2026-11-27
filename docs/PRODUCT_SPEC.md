# Product specification

## Purpose
A premium public professional portfolio that complements a résumé and LinkedIn profile, demonstrates engineering capability through evidence, supports cross-industry career opportunities and evolves independently of any employer.

## Current scope (PP-009, 2026-11-27)
One-page résumé in the Cleanroom look. Title line: Senior Process Development Engineer (Team Lead) · SHL Medical · Taiwan. Headline: From requirements definition to mass production. Sections: hero with at-a-glance figures; how I deliver a machine (eight standard phases: URS; supplier response matrix and kickoff; design review and approval; machine build; process integration; FAT; SAT; validation, handover and mass production) with a track record; throughout every project, including international work; experience (three roles); skills; education and certifications; publications and patent; contact (LinkedIn, email). No case studies, project examples, competency pages, articles or lab tools. Exact wording: src/lib/portfolio.ts. Earlier sections below are history and are superseded where they conflict.

## Approved identity (PP-001)
Name: Yeabsra Mekdim. Positioning: Engineering & Technical Program Leadership.
Headline: Engineering complex systems. Delivering meaningful outcomes.
Introduction: Mechanical engineer and technical leader with expertise in manufacturing automation, equipment development, industrialization and the delivery of complex engineering programs.
Pillars: Engineering & Technology; Technical Program Delivery; Leadership & Operational Excellence; Research & Innovation.

## Approved content architecture (PP-002)
Routes: /, /about, /work, /work/[slug], /expertise, /insights, /insights/lab, /research, /contact. These are logical routes relative to the configured base.
Home establishes positioning, credibility, selected work, pillars, lab, research and contact. About covers professional journey, philosophy, leadership and credentials. Work presents case studies. Expertise links claims to evidence. Insights covers articles and independent tools. Research lists verified publications and publicly documented inventions. Contact provides approved résumé and professional links. No authentication or installation.

Four selected-work topic candidates: automated assembly equipment development; manufacturing equipment performance optimization; technical program and engineering team leadership; advanced additive manufacturing research. These are topic choices, not approved public claims or descriptions. Later topics include manual assembly, platform and process standardization, and independent innovation.
Case study structure: executive overview, challenge, individual contribution, methodology, decisions/trade-offs, authorized outcomes, independent demonstration, reflection/competencies. Distinguish individual work from team outcomes.

Launch: seven primary sections, four approved case studies, verified research and invention records where available, and at least one functional independent engineering demonstration. No unfinished placeholders. All employer-related content needs separate publication authorization; no metrics or claims inferred from scope approval.

## Nonfunctional
Static-first, mobile-first, semantic HTML, WCAG 2.2 AA target, SEO, social metadata, no unnecessary JS or backend, efficient assets, documented source, strict public-content boundary. See DESIGN_SYSTEM and CONTENT_GOVERNANCE.
