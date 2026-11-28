/**
 * Small progressive enhancements for the one-page résumé. Everything they touch is readable
 * without them: phases open natively and the equipment layout shows its first topic.
 */
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// 1. Links to a lifecycle step (#phase-<id>) open that step and scroll to it.
function openPhase(id: string, scroll: boolean): void {
  const item = document.getElementById('phase-' + id);
  const details = item?.querySelector('details');
  if (!item || !details) return;
  details.open = true;
  if (scroll) item.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
}
document.addEventListener('click', event => {
  const link = (event.target as Element | null)?.closest?.('a[href^="#phase-"]');
  if (!link) return;
  event.preventDefault();
  const id = link.getAttribute('href')!.slice('#phase-'.length);
  openPhase(id, true);
  history.replaceState(null, '', '#phase-' + id);
});
if (location.hash.startsWith('#phase-')) openPhase(location.hash.slice('#phase-'.length), false);

// 2. Single-choice group: machine-explorer topics.
function choiceGroup(root: HTMLElement, key: 'spot', panelKey: string): void {
  const choices = Array.from(root.querySelectorAll<HTMLElement>(`[data-${key}]`));
  const panels = Array.from(root.querySelectorAll<HTMLElement>(`[data-${panelKey}]`));
  const select = (value: string) => {
    for (const el of choices) {
      const on = el.dataset[key] === value;
      el.classList.toggle('is-active', on);
      if (el.tagName === 'BUTTON') el.setAttribute('aria-pressed', String(on));
    }
    for (const panel of panels) panel.hidden = panel.dataset.spotPanel !== value;
    // Drawing elements can serve several topics (e.g. a station that assembles and inspects).
    root.querySelectorAll<SVGElement>('[data-topics]').forEach(el => el.classList.toggle('is-active', (el.dataset.topics ?? '').split(' ').includes(value)));
  };
  for (const el of choices) if (el.tagName === 'BUTTON') el.addEventListener('click', () => select(el.dataset[key]!));
}
document.querySelectorAll<HTMLElement>('[data-explorer]').forEach(root => choiceGroup(root, 'spot', 'spot-panel'));

// 3. The section bar marks the section being read and keeps its link in view.
const barLinks = new Map(Array.from(document.querySelectorAll<HTMLAnchorElement>('[data-section-link]')).map(a => [a.dataset.sectionLink!, a]));
if (barLinks.size && 'IntersectionObserver' in window) {
  const bar = document.querySelector<HTMLElement>('.section-bar ul');
  const sectionObserver = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      const link = barLinks.get(entry.target.id);
      if (!link) continue;
      barLinks.forEach(a => a.removeAttribute('aria-current'));
      link.setAttribute('aria-current', 'true');
      if (bar && getComputedStyle(bar).display !== 'none') {
        bar.scrollTo({ left: link.offsetLeft - 16, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
  }, { rootMargin: '-30% 0px -60% 0px' });
  barLinks.forEach((_, id) => { const section = document.getElementById(id); if (section) sectionObserver.observe(section); });
}
