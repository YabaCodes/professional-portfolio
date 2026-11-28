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
 * Equipment layout: schematic of a typical modular automated assembly line, in the order the
 * device is built (owner's flow, PP-013): feeding, handling and assembly, control and inspection,
 * process monitoring, quality control and final inspection, device unloading, tray labeling,
 * with AS/RS, MES, audit trails and reports. Generic; no real machine, supplier or product.
 * "function" describes the area; "role" is the owner's responsibility, from his lifecycle text.
 */
export const machine = {
  heading: 'Equipment Layout',
  introduction: 'Schematic top view of a typical modular automated assembly line, in the order the device is built. Select an area to see what it does and what I specify and verify there.',
  spots: [
    { id: 'feeding', title: 'Feeding', phases: ['urs', 'fat', 'sat'],
      function: 'Components enter the line from bowl feeders or from tray loaders supplied by the automated storage and retrieval system (AS/RS).',
      role: 'I define the feeding and detection requirements, including the tray loader interface, and verify them at FAT and SAT.' },
    { id: 'assembly', title: 'Handling and assembly', phases: ['urs', 'pi'],
      function: 'Grippers and suction cups transfer parts between process modules, where joining stations assemble the device.',
      role: 'I translate the lab-developed assembly process and its parameters into assembly specifications, then challenge them at the upper and lower specification limits during process integration.' },
    { id: 'inspection', title: 'Control and inspection', phases: ['urs', 'fat'],
      function: 'In-process controls such as force-displacement monitoring and vision inspection check each assembly step; bad parts are rejected.',
      role: 'I define the inspection and detection requirements from the assembly risk assessment and verify the inspection systems and bad-part rejection at FAT.' },
    { id: 'monitoring', title: 'Process monitoring', phases: ['pi', 'fat'],
      function: 'Critical process parameters are recorded and checked against their limits during production.',
      role: 'I identify the critical process parameters during process integration and verify their monitoring and limits at FAT.' },
    { id: 'qc', title: 'Quality control and final inspection', phases: ['urs', 'fat', 'sat'],
      function: 'Final inspection confirms each assembled device before unloading; nonconforming devices are rejected.',
      role: 'I define the acceptance criteria for final inspection and verify them, including rejection, at FAT and SAT.' },
    { id: 'unloading', title: 'Device unloading', phases: ['urs', 'fat'],
      function: 'Good devices are placed into trays by the tray unloader.',
      role: 'I specify the unloading and tray-handling functions and verify the integration with the tray unloader.' },
    { id: 'labeling', title: 'Tray labeling', phases: ['urs', 'fat', 'sat'],
      function: 'Filled trays are labeled for identification and traceability, then returned to storage.',
      role: 'I define the labeling and traceability requirements and verify them with MES at FAT and SAT.' },
    { id: 'data', title: 'Data and integration', phases: ['fat', 'sat'],
      function: 'The line keeps audit trails and reports, communicates with MES, and exchanges trays with the AS/RS.',
      role: 'I evaluate the integration with IT infrastructure, MES, SAP and the storage system, including audit trails and reports, at FAT and under site conditions at SAT.' },
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
