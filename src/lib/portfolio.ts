/**
 * Owner-approved public wording for the one-page résumé (PP-008, approved 2026-11-26).
 * Describes the owner's standard way of working. It names no customer, supplier, product,
 * machine, project, figure or internal document. Change only with fresh owner approval.
 */
export const hero = {
  titleLine: 'Senior Process Development Engineer · SHL Medical · Taiwan',
  headline: 'From requirements definition to mass production.',
  introduction: 'I lead automation projects from concept to production: specifying requirements, reviewing supplier designs, verifying and testing equipment, and transferring it to manufacturing on time and in compliance.',
} as const;

export const atAGlance = [
  { value: '2022', label: 'In medical-device automation since' },
  { value: 'PMP®', label: 'Project Management Professional' },
  { value: 'Green Belt', label: 'Design for Six Sigma' },
  { value: '01', label: 'Granted US patent' },
  { value: 'M.Sc.', label: 'Mechanical Engineering, NTUST' },
] as const;

export const process = {
  heading: 'How I deliver a machine, on every project.',
  introduction: 'Six phases from the lab to the production floor. Up to SAT I write and execute every protocol; after that I support validation and production. Tap a phase to see my role and what I deliver.',
} as const;

export const phases = [
  {
    id: 'requirements', title: 'Define the requirements',
    summary: 'Translate the lab-developed process and the risk analysis into the machine requirement (URS).',
    role: 'I give the process team historical data on which assembly steps need de-risking and testing in the lab. Once the process is defined, I translate it into requirements for the supplier, for example “stop on force or distance” or “centre the part on dimension X”. I translate the assembly risk analysis the same way: if a component might break, the machine must have a camera inspection. The URS also sets the safety, documentation, machine functions and IT integration we need before we accept the machine. Writing it is the core of my job.',
    deliver: 'The user requirement specification (URS).',
  },
  {
    id: 'supplier', title: 'Align with the supplier',
    summary: 'Agree exactly which requirements the supplier will meet, and how.',
    role: 'The supplier answers each requirement: met, not met, or an alternative solution. I review the answers with the supplier and with our quality engineering and validation teams, agree the final solutions, and sign off the supplier response matrix. Then I kick off the project with a detailed plan: milestones, resources and risk strategy.',
    deliver: 'A signed supplier response matrix and the project plan.',
  },
  {
    id: 'design', title: 'Review the design',
    summary: 'Oversee the supplier’s design and trace every requirement into it.',
    role: 'The supplier designs the hardware, software, controls, inputs and outputs, and safety, in phases. I lead the design reviews and workshops, guide the supplier’s engineers technically, and trace each requirement to a specific machine function, so nothing is lost between the URS and the machine. Then I approve the design for procurement and build.',
    deliver: 'Design review records, requirements traceability and design approval.',
  },
  {
    id: 'build', title: 'Track the build',
    summary: 'Weekly alignment, continuous risk assessment and regular updates to management.',
    role: 'From kickoff to delivery I run a weekly alignment with the supplier and the project team, and track progress against the plan with standard project-management tools. I keep a running risk assessment of schedule, machine function and quality, and present regular updates to senior management and stakeholders.',
    deliver: 'Weekly alignment, timelines and status updates, the risk register and management updates.',
  },
  {
    id: 'prove', title: 'Prove the machine',
    summary: 'Challenge it at the supplier, then accept it at the factory and on site.',
    role: 'After commissioning, I go to the supplier with a process engineer for process integration. We run the machine at its upper and lower limits and with component variation, define the critical parameters, and find where it can fail. Once the supplier has fixed the issues and finished its internal qualification, I run the factory acceptance test (FAT) and, after shipment, the site acceptance test (SAT). I write and execute every protocol: each requirement, test item, test method and acceptance criterion. They include integration with our IT, MES, SAP and other enterprise systems.',
    deliver: 'Process-integration, FAT and SAT protocols and reports, and engineering reports.',
  },
  {
    id: 'production', title: 'Support validation and production',
    summary: 'Support validation, train the teams, and transfer the machine to manufacturing.',
    role: 'After SAT, I support the validation team through equipment qualification and validation, and then support mass production. I write the work instructions, training materials and SOPs, train manufacturing and maintenance teams, and transfer the knowledge to manufacturing. After handover I monitor performance, investigate root causes of technical issues, and drive improvements.',
    deliver: 'Work instructions, training materials and SOPs, training, and ongoing production support.',
  },
] as const;

export const practice = {
  label: 'Throughout every project',
  statement: 'On every project I apply GMP, good documentation practice and our quality system, with standard project-management tools and continuous risk assessment. I coordinate quality engineering, validation, process engineering, IT and manufacturing with our external automation partners, and I work on site with suppliers in Europe. With suppliers, manufacturing and validation, I also maintain and improve our general machine specifications and workflows.',
  labels: ['GMP', 'Good documentation practice', 'ISO 13485', 'Project management (PMP)', 'Continuous risk assessment'],
  documents: 'User requirement specifications · Supplier response matrices · Engineering reports · Process-integration, FAT and SAT protocols and reports · Work instructions, training materials and SOPs · Timelines and status updates',
} as const;

export const experienceHeading = 'SHL Medical, Taiwan · since 2022';

export const skills = {
  heading: 'What I bring to the project.',
  groups: [
    { group: 'Equipment and process', items: ['Industrialization of automated assembly equipment', 'User requirement specification (URS)', 'Requirements traceability', 'Design review', 'Process integration and challenge testing', 'FAT and SAT', 'Equipment qualification and validation support', 'IT, MES and SAP integration testing', 'Root-cause investigation', 'Process improvement'] },
    { group: 'Quality and compliance', items: ['GMP', 'Good documentation practice', 'ISO 13485', 'FDA regulations', 'Risk analysis into requirements'] },
    { group: 'Automation technology', items: ['Control systems, PLC, HMI, SCADA and robotics: specification, design review and testing', 'CAD'] },
    { group: 'Project and people', items: ['Project management (PMP)', 'Project planning: milestones, resources, risk', 'Supplier management', 'Cross-functional coordination', 'Senior-management reporting', 'Functional lead for three engineers', 'Training and knowledge transfer'] },
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
