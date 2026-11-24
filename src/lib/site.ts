export const identity = {
  name: 'Yeabsra Mekdim',
  positioning: 'Engineering & Technical Program Leadership',
  headline: ['Engineering complex systems.', 'Delivering meaningful outcomes.'],
  introduction: 'Mechanical engineer and technical leader with expertise in manufacturing automation, equipment development, industrialization and the delivery of complex engineering programs.',
} as const;

export const sections = [
  { slug: 'about', label: 'About', title: 'Professional profile', description: 'Professional journey, engineering philosophy and leadership approach.' },
  { slug: 'work', label: 'Selected Work', title: 'Engineering in practice', description: 'Selected work, engineering methodology and authorized professional evidence.' },
  { slug: 'expertise', label: 'Expertise', title: 'Technical and leadership expertise', description: 'Engineering, program delivery, operational excellence and innovation.' },
  { slug: 'insights', label: 'Insights', title: 'Engineering insights', description: 'Independent engineering analysis and evidence-labeled functional demonstrations.' },
  { slug: 'research', label: 'Research', title: 'Research & innovation', description: 'Publicly verified research and innovation records.' },
  { slug: 'contact', label: 'Contact', title: 'Résumé & contact', description: 'Professional contact and résumé information.' },
] as const;
export const pillars = [
  'Engineering & Technology', 'Technical Program Delivery',
  'Leadership & Operational Excellence', 'Research & Innovation'
] as const;

/** Resolve an internal logical route or asset beneath the configured Pages base. */
export function sitePath(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return base + '/' + path.replace(/^\/+/, '');
}
export function routeHref(slug: string): string {
  return sitePath(slug ? slug.replace(/\/+$/, '') + '/' : '');
}
export function currentSection(slug: string, current: string): boolean {
  return current === slug || current.startsWith(slug + '/');
}
