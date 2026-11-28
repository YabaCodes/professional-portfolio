import { chromium } from 'playwright';
const out = process.argv[2];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1243/chrome-linux64/chrome' });
for (const [w, s] of [[1440, 1], [390, 2]]) {
  const d = await b.newPage({ viewport: { width: w, height: 900 }, deviceScaleFactor: s, reducedMotion: 'reduce' });
  await d.goto('http://127.0.0.1:4321/professional-portfolio/', { waitUntil: 'networkidle' });
  await d.evaluate(() => document.fonts.ready);
  await d.evaluate(() => document.querySelectorAll('[data-reveal]').forEach(e => e.classList.add('is-visible')));
  await d.screenshot({ path: `${out}/full-${w}.png`, fullPage: true });
  await d.close();
}
await b.close();
