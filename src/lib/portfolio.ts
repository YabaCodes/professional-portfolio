/**
 * Owner-approved public wording for the one-page résumé.
 * PP-008 approved 2026-11-26; revised under PP-009 and approved by the owner 2026-11-27
 * (standard phase names, owner's own description of the procedure, track record, IQ/OQ/PQ,
 * team lead, international work). It names no customer, supplier, product, machine or project.
 * Change only with fresh owner approval.
 */
export const hero = {
  titleLine: 'Senior Process Development Engineer (Team Lead) · SHL Medical · Taiwan',
  headline: 'From requirements definition to mass production.',
  introduction: 'I lead automation projects from concept to production: specifying requirements, reviewing supplier designs, verifying and testing equipment, and transferring it to manufacturing on time and in compliance.',
} as const;

export const atAGlance = [
  { value: '3', label: 'Assembly machines completed' },
  { value: '8', label: 'Manual assembly fixtures completed' },
  { value: '3', label: 'Automated machines in progress' },
  { value: '3 countries', label: 'Germany, Switzerland and the US' },
  { value: 'PMP®', label: 'Project Management Professional' },
  { value: '01', label: 'Granted US patent' },
] as const;

export const process = {
  heading: 'How I deliver a machine, on every project.',
  introduction: 'Almost every project I run follows the same procedure, from the lab to mass production. I write and execute every protocol up to SAT, with IQ, OQ and PQ tests at process integration, FAT and SAT, and I support validation and mass production. Tap a phase to see what I do.',
} as const;

export const phases = [
  {
    id: 'urs', title: 'User requirement specification (URS)',
    summary: 'Turn the lab-developed assembly process and the assembly risk assessment into the machine requirements.',
    role: 'We develop the assembly process in the lab, testing it to define the parameters for building the autoinjector, and carry out an assembly risk assessment. I turn the parameters and the risk assessment into the URS. Besides how the product must be assembled, it sets every inspection and detection, and the safety, documentation and machine functions the machine must fulfil before we accept it. Writing the URS is my main task.',
    deliver: 'The URS.',
  },
  {
    id: 'srm', title: 'Supplier response matrix and kickoff',
    summary: 'Agree with the supplier which requirements will be met, and how.',
    role: 'The supplier answers each requirement: can fulfil, cannot fulfil, or an alternative solution. I review the answers with the supplier, with feedback from our quality engineering and validation teams. I sign off the supplier response matrix, agree the final solutions, and kick off the project. From kickoff I run a weekly alignment meeting with the supplier and the whole project team, using standard project-management tools.',
    deliver: 'Signed supplier response matrix, project kickoff and weekly alignment.',
  },
  {
    id: 'design', title: 'Design review and approval',
    summary: 'Trace every requirement through the machine design, then approve it.',
    role: 'The supplier designs the machine in sections: hardware, software, controls, inputs and outputs, and safety. In several design phases and workshops I review every aspect with the supplier and trace each requirement through the design to a specific machine function. I lead this work, then approve the design so the supplier can start procurement and manufacturing.',
    deliver: 'Design reviews, requirements traceability and design approval.',
  },
  {
    id: 'build', title: 'Machine build',
    summary: 'Track the supplier’s manufacturing and tests, and assess risk continuously.',
    role: 'While the supplier manufactures, commissions and internally qualifies the machine, I keep the weekly alignment to track progress and make sure tests are completed on time. Throughout development I keep a continuous risk assessment of project delay, machine function and quality, and of where we can improve.',
    deliver: 'Progress tracking and a continuous risk assessment.',
  },
  {
    id: 'pi', title: 'Process integration',
    summary: 'Challenge the commissioned machine at the supplier to find its limits.',
    role: 'Once the supplier has commissioned the machine, I go to the supplier with a process engineer from our team. We challenge the machine: we run it at the upper and lower specification limits and with component variation, define the critical parameters, and identify where it could fail and what to improve. I write the protocol and execute it, including IQ, OQ and PQ tests. The supplier resolves the issues before its internal qualification.',
    deliver: 'Process-integration protocol with IQ, OQ and PQ tests, and its execution: critical parameters, failure points and improvements.',
  },
  {
    id: 'fat', title: 'Factory acceptance test (FAT)',
    summary: 'Test every requirement at the supplier before shipment.',
    role: 'After the supplier’s internal qualification, I run the FAT. I write the protocol myself: every requirement, test item, test method and acceptance criterion, with IQ, OQ and PQ tests, so each aspect of the machine is tested. Besides producing the product, the machine must integrate with our IT and MES infrastructure, SAP and other enterprise software, so I test those integrations too.',
    deliver: 'FAT protocol with IQ, OQ and PQ tests, and its execution.',
  },
  {
    id: 'sat', title: 'Site acceptance test (SAT)',
    summary: 'Repeat acceptance testing after the machine arrives on site.',
    role: 'After the supplier ships the machine to our site, I write and execute the SAT protocol the same way, including IQ, OQ and PQ tests, before validation starts.',
    deliver: 'SAT protocol with IQ, OQ and PQ tests, and its execution.',
  },
  {
    id: 'validation', title: 'Validation, handover and mass production',
    summary: 'Support validation and handover, transfer the knowledge, and support mass production.',
    role: 'After SAT the machine is validated and handed over to mass production. I support validation and keep supporting mass production. I write the work instructions and train operators and maintenance staff, so all the knowledge is transferred.',
    deliver: 'Work instructions, operator and maintenance training, and mass-production support.',
  },
] as const;

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
  label: 'Throughout every project',
  statement: 'I apply good manufacturing practice, good documentation practice and our quality system, with standard project-management tools and continuous risk assessment.',
  international: 'The work is international. Most of our machines are built by suppliers in Germany, and some are installed at our sites in Switzerland and the US, so I travel to all three countries for project activities.',
  labels: ['GMP', 'Good documentation practice', 'ISO 13485', 'FDA regulations', 'Project management (PMP)', 'Continuous risk assessment'],
} as const;

export const experienceHeading = 'SHL Medical, Taiwan · since 2022';

export const skills = {
  heading: 'What I bring to the project.',
  groups: [
    { group: 'Equipment and process', items: ['Industrialization of automated assembly equipment', 'User requirement specification (URS)', 'Requirements traceability', 'Design review', 'Process integration and challenge testing', 'FAT and SAT', 'Equipment qualification and validation support', 'IT, MES and SAP integration testing', 'Root-cause investigation', 'Process improvement'] },
    { group: 'Quality and compliance', items: ['GMP', 'Good documentation practice', 'ISO 13485', 'FDA regulations', 'Risk analysis into requirements'] },
    { group: 'Automation technology', items: ['Control systems, PLC, HMI, SCADA and robotics: specification, design review and testing', 'CAD'] },
    { group: 'Project and people', items: ['Project management (PMP)', 'Project planning: milestones, resources, risk', 'Supplier management', 'Cross-functional coordination', 'Senior-management reporting', 'Team lead for three engineers', 'Training and knowledge transfer'] },
    { group: 'Analysis', items: ['Design for Six Sigma (Green Belt)', 'Statistics', 'Measurement system analysis'] },
    { group: 'Languages', items: ['English (advanced)', 'Amharic (native)'] },
  ],
} as const;

export const contact = {
  heading: 'Connect on engineering, technology and delivery.',
  introduction: 'Open to conversations about engineering leadership, manufacturing technology, new product introduction and complex technical programs.',
} as const;

/** Calendar precision is preserved; missing months are never invented. */
export function displayDate(date: string): string {
  if (date.length === 4) return date;
  return new Intl.DateTimeFormat('en', { month: 'short', year: 'numeric', timeZone: 'UTC' })
    .format(new Date((date.length === 7 ? date + '-01' : date) + 'T00:00:00Z'));
}
