import { hero } from './portfolio';

export const identity = {
  name: 'Yeabsra Mekdim',
  positioning: 'Senior Process Development Engineer',
  /** Search and link-preview description: role and employer first, then the first bio paragraph. */
  introduction: 'Senior Process Development Engineer and Team Lead at SHL Medical. ' + hero.introduction[0],
} as const;

/** One-page résumé: navigation jumps to sections of the home page. */
export const sections = [
  { id: 'process', label: 'How I Work' },
  { id: 'machine', label: 'Technologies' },
  { id: 'experience', label: 'Experience' },
  { id: 'skills', label: 'Skills' },
  { id: 'publications', label: 'Publications' },
  { id: 'contact', label: 'Contact' },
] as const;

/** Resolve an internal logical route or asset beneath the configured Pages base. */
export function sitePath(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/+$/, '');
  return base + '/' + path.replace(/^\/+/, '');
}
export function routeHref(slug: string): string {
  return sitePath(slug ? slug.replace(/\/+$/, '') + '/' : '');
}
export function sectionHref(id: string): string {
  return routeHref('') + '#' + id;
}
