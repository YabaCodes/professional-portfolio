/**
 * Owner-approved public wording for the one-page résumé.
 * PP-008 approved 2026-11-26; revised under PP-009 and approved by the owner 2026-11-27
 * (standard phase names, owner's own description of the procedure, track record, IQ/OQ/PQ,
 * team lead, international work). It names no customer, supplier, product, machine or project.
 * Change only with fresh owner approval.
 */
export const hero = {
  name: 'Yeabsra Mekdim',
  titleLine: 'Senior Process Development Engineer (Team\u00A0Lead) · SHL Medical · Taiwan',
  headline: 'From Concept to Mass Production',
  /** Owner-approved bio (PP-023), two paragraphs. */
  introduction: [
    'I lead multidisciplinary engineering programs across the full equipment development lifecycle, from requirements engineering and supplier technical alignment through process integration and equipment qualification to mass production.',
    'My professional interests lie at the intersection of engineering, technical program management and operational excellence, with a focus on delivering robust, scalable and compliant manufacturing solutions.',
  ],
} as const;

/** Whole years since a YYYY-MM start, rounded down, at the given date. */
export function yearsSince(start: string, at: Date = new Date()): number {
  const [y, m] = start.split('-').map(Number);
  return Math.floor(((at.getFullYear() - y) * 12 + (at.getMonth() + 1 - m)) / 12);
}

export const atAGlance = {
  /** Years are counted from the first role (Project Engineer, February 2022) at build time and rounded down. */
  experience: { since: '2022-02', label: 'Medical Device Assembly Equipment Development' },
  machines: [
    { value: '12', label: 'Equipment Projects Completed', detail: '4 automated assembly machines, 8 manual assembly fixtures' },
    { value: '3', label: 'Equipment Projects Ongoing', detail: 'Automated assembly machines' },
  ],
  scale: { value: 'Up to USD 10M', label: 'CapEx per Fully Automated Machine' },
  facts: [
    { value: '4 countries', label: 'Based in Taiwan; machine testing and installation in Germany, Switzerland and the US', wide: true },
    { value: 'PMP®', label: 'Project Management Professional', wide: false },
    { value: '1', label: 'Granted US Patent', wide: false },
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
 * Equipment layout: schematic of a typical automated assembly machine with a closed-loop transfer
 * system, drawn from the owner's sketch (PP-013): feeding from tray loader and bowl feeder,
 * assembly stations combining handling and assembly with control and inspection or process
 * monitoring, reject, final inspection and unloading to the tray unloader, labeling, and safety
 * guarding. Generic; no real machine, supplier or product. "function" describes the area;
 * "role" is the owner's responsibility, from his lifecycle text.
 */
export const machine = {
  heading: 'Assembly Automation Technologies',
  introduction: 'An interactive schematic of a typical automated assembly machine with a closed-loop transfer system, illustrating the key automation technologies within my scope of engineering specification and verification. Select a numbered element to explore its functionality and my associated technical responsibilities.',
  spots: [
    { id: 'feeding', title: 'Feeding', phases: ['urs', 'fat', 'sat'],
      function: 'A device has many components, so they are fed at stations all around the machine, from bowl feeders and tray loaders. Both can be integrated with an automated storage and retrieval system (ASRS) for automated component feeding and replenishment.',
      role: 'I define the feeding and detection requirements, including the tray loader interface, and verify them at FAT and SAT.' },
    { id: 'assembly', title: 'Handling and Assembly', phases: ['urs', 'pi'],
      function: 'At the feeding stations, grippers and suction cups place each component on the Work Piece Carrier (WPC) and the station assembles it, step by step.',
      role: 'I translate the lab-developed assembly process and its parameters into assembly specifications, then challenge them at the upper and lower specification limits during process integration.' },
    { id: 'inspection', title: 'Control and Inspection', phases: ['urs', 'fat'],
      function: 'Inspection takes place within assembly stations or at dedicated inspection stations, for example force-displacement monitoring and vision inspection; bad parts are removed at the reject station before unloading.',
      role: 'I define the inspection and detection requirements from the assembly risk assessment and verify the inspection systems at FAT.' },
    { id: 'monitoring', title: 'Process Monitoring and Optimization', phases: ['pi', 'fat', 'sat'],
      function: 'Critical process parameters are monitored and recorded at the stations, and the data is used to make the process robust and optimize it.',
      role: 'I identify the critical process parameters during process integration, optimize the process within its boundaries and verify the monitoring at FAT and SAT.' },
    { id: 'qc', title: 'Final Inspection', phases: ['urs', 'fat', 'sat'],
      function: 'Final inspection confirms each assembled device meets the specified conditions; the reject station removes nonconforming devices.',
      role: 'I define the acceptance criteria for final inspection and verify them, including rejection, at FAT and SAT.' },
    { id: 'unloading', title: 'Unloading', phases: ['urs', 'fat'],
      function: 'Good devices are unloaded from the Work Piece Carriers (WPCs) into trays by the tray unloader.',
      role: 'I specify the unloading and tray-handling functions and verify the integration with the tray unloader.' },
    { id: 'labeling', title: 'Labeling', phases: ['urs', 'fat', 'sat'],
      function: 'Filled trays are labeled for identification and traceability and can be transferred to the automated storage and retrieval system (ASRS).',
      role: 'I define the labeling and traceability requirements and verify them with MES at FAT and SAT.' },
    { id: 'safety', title: 'Safety', phases: ['urs', 'design', 'fat'],
      function: 'Guarding with access doors encloses the machine, and its safety functions protect operators and maintenance staff.',
      role: 'I define the safety requirements in the URS, review machine safety in design reviews and verify the safety mechanisms at FAT.' },
    { id: 'mes', title: 'MES Integration', phases: ['urs', 'fat', 'sat'],
      function: 'The machine control system exchanges data with the manufacturing execution system (MES): batch and product data, results for each device, audit trails and reports, for full traceability.',
      role: 'I define the MES interface, data and audit-trail requirements and verify the communication at FAT and SAT.' },
  ],
} as const;

export const trackRecord = {
  heading: 'Track Record',
  introduction: 'From low-volume semi-automated machines for clinical trials, design analysis and design verification (DV) to high-volume fully automated machines at up to 160\u00A0parts per minute (ppm), with CapEx up to USD\u00A010\u00A0million per fully automated machine.',
  completed: [
    { count: 1, item: 'High-volume fully automated assembly machine, 60\u00A0ppm' },
    { count: 1, item: 'Flexible robotic assembly line (SMART), 20\u00A0ppm' },
    { count: 2, item: 'Final assembly machines for QC batch release' },
    { count: 8, item: 'Manual assembly fixtures' },
  ],
  inProgress: [
    { count: 2, item: 'Fully automated assembly machines, 160\u00A0ppm, approaching FAT' },
    { count: 1, item: 'Automated assembly machine, in the final supplier response matrix stage' },
  ],
} as const;

export const practice = {
  label: 'Working Standards & Global Operations',
  statement: 'My work is governed by Good Manufacturing Practices (GMP), Good Documentation Practices (GDP), and established Quality Management System (QMS) requirements, complemented by structured project management methodologies and continuous risk assessment.',
  international: 'Based in Taiwan, I operate within an international engineering and manufacturing environment, collaborating primarily with equipment suppliers in Germany and manufacturing sites in Switzerland and the United States. My responsibilities involve international travel to support equipment testing, installation, process integration, and project execution.',
  labels: ['GMP', 'Good documentation practice', 'ISO 13485', 'FDA regulations', 'Project management (PMP)', 'Continuous risk assessment'],
} as const;

export const experienceHeading = 'Experience';
export const experienceSubheading = 'SHL Medical, Taiwan · since 2022';

export const skills = {
  heading: 'Skills',
  groups: [
    { group: 'Equipment and Process', items: ['Industrialization of automated assembly equipment', 'User requirement specification (URS)', 'Requirements traceability', 'Design review', 'Process integration and challenge testing', 'FAT and SAT', 'Equipment qualification and validation support', 'IT, MES and SAP integration testing', 'Root-cause investigation', 'Process improvement'] },
    { group: 'Quality and Compliance', items: ['GMP', 'Good documentation practice', 'ISO 13485', 'FDA regulations', 'Risk analysis into requirements'] },
    { group: 'Automation Technology', items: ['Control systems', 'PLC', 'HMI', 'SCADA', 'Robotics', 'CAD'] },
    { group: 'Project and People', items: ['Project management (PMP)', 'Supplier management', 'Cross-functional coordination', 'Training and knowledge transfer'] },
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
