/**
 * Owner-approved public wording for the one-page résumé.
 * PP-008 approved 2026-11-26; revised under PP-009 and approved by the owner 2026-11-27
 * (standard phase names, owner's own description of the procedure, track record, IQ/OQ/PQ,
 * team lead, international work). It names no customer, supplier, product, machine or project.
 * Change only with fresh owner approval.
 */
export const hero = {
  titleLine: 'Senior Process Development Engineer (Team\u00A0Lead) · SHL Medical · Taiwan',
  headline: 'From requirements definition to mass production.',
  introduction: 'I lead automation projects from concept to production: specifying requirements, reviewing supplier designs, verifying and testing equipment, and transferring it to manufacturing on time and in compliance.',
} as const;

export const atAGlance = {
  machines: [
    { value: '11', label: 'Equipment projects completed', detail: '3 automated assembly machines, 8 manual assembly fixtures' },
    { value: '3', label: 'Equipment projects ongoing', detail: 'Automated assembly machines' },
  ],
  facts: [
    { value: '4 countries', label: 'Based in Taiwan; machine testing and installation in Germany, Switzerland and the US', wide: true },
    { value: 'PMP®', label: 'Project Management Professional', wide: false },
    { value: '1', label: 'Granted US patent', wide: false },
  ],
} as const;

export const process = {
  heading: 'Manufacturing Equipment Development Lifecycle',
  introduction: [
    'End-to-end technical leadership of manufacturing equipment development for medical devices, from process characterization and engineering requirements definition through supplier development, equipment integration, acceptance testing, validation support and manufacturing transfer.',
    'Responsible for translating product and process requirements into scalable manufacturing solutions, ensuring technical compliance, process robustness, equipment performance and operational readiness.',
  ],
} as const;

/**
 * Owner-written wording (PP-011, 2026-11-28). Titles and keyword lines follow the owner's flow;
 * detail text is the owner's, with "equipment manufacturing" changed to "equipment development"
 * in step 04 at his request.
 */
export const phases = [
  {
    id: 'urs', title: 'Requirements Engineering',
    tags: ['URS', 'Process requirements', 'Risk-based specifications'],
    lead: 'Translation of product, process and risk-based requirements into comprehensive equipment engineering specifications.',
    responsibilities: [
      'Translate laboratory-developed assembly processes, process parameters and assembly risk assessments into functional and technical equipment requirements.',
      'Define assembly specifications, inspection and detection requirements, process controls, machine functionality and safety requirements.',
      'Establish equipment documentation requirements and technical acceptance criteria.',
      'Lead the development of the URS as the technical baseline for supplier engagement, equipment design and subsequent verification activities.',
    ],
    deliverables: 'User Requirements Specification (URS), functional and technical requirements, risk-based process control requirements and equipment acceptance criteria.',
  },
  {
    id: 'srm', title: 'Supplier Technical Alignment',
    tags: ['Feasibility', 'Technical baseline', 'Project governance'],
    lead: 'Establishment of an agreed technical baseline and supplier execution framework.',
    responsibilities: [
      'Lead the technical evaluation of supplier responses against established user requirements.',
      'Assess proposed engineering solutions, technical deviations, feasibility constraints and alternative concepts.',
      'Coordinate cross-functional technical alignment with Quality Engineering, Validation and other relevant stakeholders.',
      'Approve the supplier response matrix and establish the agreed technical scope.',
      'Lead recurring supplier alignment meetings, coordinating technical decisions, deliverables, project milestones and risk mitigation.',
    ],
    deliverables: 'Approved supplier response matrix, agreed technical scope, project kickoff and recurring supplier project governance.',
  },
  {
    id: 'design', title: 'Engineering Design Assurance',
    tags: ['Design reviews', 'Traceability', 'Approval'],
    lead: 'Verification of equipment design compliance against functional, technical and process requirements.',
    responsibilities: [
      'Lead multidisciplinary equipment design reviews covering mechanical systems, electrical hardware, automation software, control architecture, I/O interfaces and machine safety.',
      'Evaluate proposed engineering solutions against assembly process requirements and product quality expectations.',
      'Maintain requirements traceability between the URS and corresponding equipment design solutions.',
      'Coordinate technical clarification and resolution of design-related issues.',
      'Approve equipment designs for progression into procurement and manufacturing.',
    ],
    deliverables: 'Engineering design review records, requirements traceability, technical issue resolution and equipment design approval.',
  },
  {
    id: 'build', title: 'Equipment Development & Commissioning',
    tags: ['Supplier oversight', 'Risk mitigation', 'Readiness'],
    lead: 'Technical oversight of equipment development, commissioning and supplier readiness.',
    responsibilities: [
      'Monitor supplier execution throughout equipment development, assembly, commissioning and internal qualification.',
      'Track technical deliverables, development milestones and testing progress against the project schedule.',
      'Assess emerging technical, quality and schedule-related risks and coordinate mitigation activities.',
      'Evaluate equipment functionality and identify opportunities for engineering improvements throughout development.',
      'Coordinate supplier and cross-functional activities to maintain equipment readiness for subsequent integration and acceptance testing.',
    ],
    deliverables: 'Supplier progress assessments, technical risk assessments, mitigation actions and equipment readiness evaluations.',
  },
  {
    id: 'pi', title: 'Process Integration & Characterization',
    tags: ['Process boundaries', 'Robustness', 'Optimization'],
    lead: 'Experimental evaluation and optimization of equipment functionality, process robustness and operating boundaries.',
    responsibilities: [
      'Lead equipment process integration and engineering characterization activities at the supplier facility.',
      'Develop and execute structured engineering test protocols incorporating installation, operational and performance qualification tests.',
      'Evaluate equipment performance under upper and lower specification limits and representative component variation.',
      'Characterize process behavior, identify critical process parameters and assess process robustness.',
      'Identify potential failure modes, functional limitations and opportunities for process optimization.',
      'Coordinate corrective actions and engineering improvements with suppliers prior to internal qualification and formal acceptance testing.',
    ],
    deliverables: 'Process integration protocols and test results, process characterization, critical process parameter identification, failure-mode assessments and engineering improvement actions.',
  },
  {
    id: 'fat', title: 'Factory Acceptance Testing',
    tags: ['Requirements verification', 'FAT'],
    lead: 'Formal verification of equipment compliance, functionality and performance prior to shipment.',
    responsibilities: [
      'Develop comprehensive, requirements-driven FAT protocols defining test methods, test conditions and acceptance criteria.',
      'Lead the execution of installation, operational and performance qualification tests at the supplier facility.',
      'Verify equipment functionality, assembly performance, inspection systems, process controls and safety mechanisms against established requirements.',
      'Evaluate equipment integration with IT infrastructure, Manufacturing Execution Systems (MES), SAP and other enterprise manufacturing systems.',
      'Assess acceptance test results and coordinate the resolution of identified technical nonconformities.',
    ],
    deliverables: 'FAT protocol, executed qualification test records, requirements verification evidence and technical nonconformity resolution.',
  },
  {
    id: 'sat', title: 'Site Acceptance Testing',
    tags: ['Site integration', 'SAT', 'Validation readiness'],
    lead: 'Verification of equipment functionality and performance within the intended manufacturing environment.',
    responsibilities: [
      'Develop and execute site-specific equipment acceptance test protocols following installation at the receiving manufacturing facility.',
      'Perform installation, operational and performance qualification tests to verify equipment compliance and functionality.',
      'Evaluate equipment performance and integration under actual site operating conditions.',
      'Verify continued compliance with established technical, functional and process requirements following transportation and installation.',
      'Establish equipment readiness for subsequent process validation activities.',
    ],
    deliverables: 'SAT protocol, executed qualification test records, site-specific verification evidence and equipment readiness assessment.',
  },
  {
    id: 'validation', title: 'Manufacturing Transfer & Production',
    tags: ['Validation support', 'Knowledge transfer', 'Ramp-up'],
    lead: 'Transition of qualified manufacturing equipment into validated and sustainable production operations.',
    responsibilities: [
      'Provide technical engineering support throughout process validation and manufacturing transfer.',
      'Support equipment and process readiness assessments for mass production.',
      'Develop manufacturing work instructions and operational documentation.',
      'Lead technical knowledge transfer and training for production operators and maintenance personnel.',
      'Provide ongoing engineering support for manufacturing operations, equipment troubleshooting and process performance improvement.',
    ],
    deliverables: 'Manufacturing work instructions, technical training, engineering knowledge transfer, validation support and ongoing production engineering support.',
  },
] as const;

/** Short phase labels used by the equipment-layout links. */
export const phaseShort = {
  urs: 'Requirements', srm: 'Supplier', design: 'Design', build: 'Development',
  pi: 'Integration', fat: 'FAT', sat: 'SAT', validation: 'Production',
} as const;
export type PhaseId = keyof typeof phaseShort;

/**
 * Machine explorer on a generic, original illustration (not a specific machine).
 * Draft wording for owner review (PP-013), each line taken from the owner's lifecycle text.
 */
export const machine = {
  heading: 'Equipment Layout',
  introduction: 'Schematic top view of a typical automated assembly cell, with what I specify, review and test in each area.',
  spots: [
    { id: 'assembly', title: 'Assembly process', x: 49.5, y: 22, phases: ['urs', 'pi'],
      text: 'I translate lab-developed assembly processes and process parameters into assembly specifications, then challenge them at upper and lower specification limits with representative component variation.' },
    { id: 'inspection', title: 'Inspection and detection', x: 65.5, y: 22, phases: ['urs', 'fat'],
      text: 'I define inspection and detection requirements from the assembly risk assessment and verify the inspection systems against them at FAT.' },
    { id: 'controls', title: 'Controls, I/O and HMI', x: 93, y: 27.5, phases: ['design', 'fat'],
      text: 'I review the control architecture, I/O interfaces and automation software in multidisciplinary design reviews, and verify the process controls at FAT.' },
    { id: 'safety', title: 'Machine safety', x: 13, y: 38.5, phases: ['urs', 'design', 'fat'],
      text: 'I define the safety requirements in the URS, review machine safety in design reviews and verify the safety mechanisms at FAT.' },
    { id: 'integration', title: 'IT, MES and SAP', x: 94, y: 61.5, phases: ['fat', 'sat'],
      text: 'I evaluate the equipment’s integration with IT infrastructure, MES, SAP and other enterprise systems at FAT, and again under site conditions at SAT.' },
    { id: 'operation', title: 'Operation and maintenance', x: 47.5, y: 78, phases: ['validation'],
      text: 'I develop the work instructions and train production operators and maintenance personnel for the transfer to production.' },
  ],
} as const;

export const trackRecord = {
  heading: 'Track record',
  completed: [
    { count: 1, item: 'Fully automated assembly machine' },
    { count: 2, item: 'Final assembly machines' },
    { count: 8, item: 'Manual assembly fixtures' },
  ],
  inProgress: [
    { count: 2, item: 'Fully automated assembly machines, approaching FAT' },
    { count: 1, item: 'Automated assembly machine, in the final supplier response matrix stage' },
  ],
} as const;

export const practice = {
  label: 'Working Standards',
  statement: 'I apply good manufacturing practice, good documentation practice and our quality system, with standard project-management tools and continuous risk assessment.',
  international: 'I work from Taiwan, and the work is international: most of our machines are built by suppliers in Germany, and some are installed at our sites in Switzerland and the US, so I travel to all three for machine testing, installation and other project activities.',
  labels: ['GMP', 'Good documentation practice', 'ISO 13485', 'FDA regulations', 'Project management (PMP)', 'Continuous risk assessment'],
} as const;

export const experienceHeading = 'Experience';
export const experienceSubheading = 'SHL Medical, Taiwan · since 2022';

export const skills = {
  heading: 'Skills',
  groups: [
    { group: 'Equipment and process', items: ['Industrialization of automated assembly equipment', 'User requirement specification (URS)', 'Requirements traceability', 'Design review', 'Process integration and challenge testing', 'FAT and SAT', 'Equipment qualification and validation support', 'IT, MES and SAP integration testing', 'Root-cause investigation', 'Process improvement'] },
    { group: 'Quality and compliance', items: ['GMP', 'Good documentation practice', 'ISO 13485', 'FDA regulations', 'Risk analysis into requirements'] },
    { group: 'Automation technology', note: 'Specification, design review and testing of control systems, PLC, HMI, SCADA and robotics.', items: ['Control systems', 'PLC', 'HMI', 'SCADA', 'Robotics', 'CAD'] },
    { group: 'Project and people', items: ['Project management (PMP)', 'Supplier management', 'Cross-functional coordination', 'Training and knowledge transfer'] },
    { group: 'Analysis', items: ['Design for Six Sigma (Green Belt)', 'Statistics', 'Measurement system analysis'] },
    { group: 'Languages', items: ['English (advanced)', 'Amharic (native)'] },
  ],
} as const;

export const contact = {
  heading: 'Contact',
  introduction: 'Open to conversations about engineering leadership, manufacturing technology, new product introduction and complex technical programs.',
} as const;

/** Calendar precision is preserved; missing months are never invented. */
export function displayDate(date: string): string {
  if (date.length === 4) return date;
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date((date.length === 7 ? date + '-01' : date) + 'T00:00:00Z'));
}
