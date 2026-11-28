import { hero } from './portfolio';

export const identity = {
  name: 'Yeabsra Mekdim',
  positioning: 'Senior Process Development Engineer',
  introduction: hero.introduction,
} as const;

/** One-page résumé: navigation jumps to sections of the home page. */
export const sections = [
  { id: 'process', label: 'How I work' },
  { id: 'machine', label: 'Layout' },
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
