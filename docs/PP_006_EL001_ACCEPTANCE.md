# PP-006 / EL-001 — Manufacturing Performance & OEE Analyzer

**Milestone:** v0.11.0 candidate. **Scope:** eight approved EL-001 components, user-approved synthetic inputs only. **Status:** CI and owner review required. No deployment.

## Engineering calculation
Inputs: planned production time P (min), operating time R (min), ideal cycle time c (min/unit), total pieces T (integer), good pieces G (integer).

Validate finite, nonnegative values; P and c strictly positive; 0 ≤ R ≤ P; 0 ≤ G ≤ T; safe integer counts; T > 0 requires R > 0; cT must not exceed R beyond a small numerical tolerance. Only floating-point roundoff-sized cT excess is clipped to R to maintain physical time conservation.

Availability = R/P. Performance = cT/R if R > 0, otherwise undefined. Quality = G/T if T > 0, otherwise undefined. OEE = (cG)/P for feasible observations (with the roundoff correction applied to cT), or zero when there is no good output. Undefined Performance and Quality are displayed **Not defined**, never misrepresented as measured 0%.

Planned-time partition (minutes): availability loss P−R, performance loss R−min(R,cT), quality-equivalent loss min(R,cT)×(1−G/T), effective good production min(R,cT)×(G/T), with quality ratios of zero only for the arithmetic when no units exist. Components sum to P. Chart expresses them in percentages of P; text also reports original minutes. Dominant loss identifies an *investigation priority*, not root cause.

## Synthetic example acceptance
| Case | Input [P,R,c,T,G] | Expected result |
| --- | --- | --- |
| Reference | [480,432,0.5,760,744] | OEE 77.50%; 48 min availability loss, 52 min performance loss, 8 min quality loss, 372 effective |
| Availability-constrained | [480,300,0.5,560,554] | 180 / 20 / 3 / 277 minutes |
| Quality-constrained | [480,450,0.5,880,660] | OEE 68.75%; 30 / 10 / 110 / 330 minutes |
| No output | [480,0,0.5,0,0] | OEE 0%; Performance and Quality undefined |
| Ideal | [480,480,0.5,960,960] | OEE 100%; no modeled losses |

## Implementation and quality
- Independent full analyzer route: `/insights/lab/manufacturing-performance-oee-analyzer/` under Pages base.
- Static accessible default output, labeled numeric inputs with units, five synthetic scenario buttons, interactive calculation and reset, contrast-safe text legend and meaningful error/status feedback.
- Pure TypeScript model with numerical tests including roundoff, conservation, invalid operating time/cycle time/counts, zero production, ties and scenario categories.
- Linked from Lab catalog, homepage, CS-002 and COMP-010; existing CS-002 percentage-factor preview remains separately identified. EL-002 and EL-006 remain planned.
- Tests include npm ci, check, unit, design, build, budget, MVP privacy/availability audit, internal link/fragment audit, mobile/desktop interaction, keyboard and axe.
- No user inputs saved, collected, transmitted or processed outside this browser. Inputs are visitor-supplied hypothetical or predefined synthetic values; no employer datasets, internal program names or production metrics.

## Limitations and future scope
This aggregate model does not infer root cause or equipment reliability from OEE, nor does it implement a downtime event Pareto, actual bottleneck analysis, uncertainty quantification, production integration or validated industrial monitoring. Further EL tools require separate scoping and review.

## Launch boundary
Do not merge automatically or deploy. The user must approve the review PR. Exact public contact destination, approved résumé PDF, Insights content and production-specific legal/confidentiality, accessibility, Core Web Vitals, SEO/metadata, release-protection and hosting/launch approvals remain outstanding. The previous PP-005F audit remains a historical snapshot; the continuously run `test:mvp` report now reflects one implemented independent demonstration.
