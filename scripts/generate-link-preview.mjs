// Generates public/link-preview.jpg, the 1200 x 630 image shown when the site link is shared
// (LinkedIn, messaging apps). Run manually after changing the name, title line, headline or portrait:
//   npm run generate:link-preview
// Uses the approved portrait (src/assets/portrait.jpg), the site font and the Cleanroom palette.
// Nothing here changes with time (no years or counts), so the image does not go stale.
import { chromium } from 'playwright';
import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
const fontFile = require.resolve('@fontsource-variable/instrument-sans/files/instrument-sans-latin-wdth-normal.woff2');
const font = (await readFile(fontFile)).toString('base64');
const portrait = (await readFile(path.join(root, 'src/assets/portrait.jpg'))).toString('base64');
const { hero, atAGlance } = await import(path.join(root, 'src/lib/portfolio.ts'));

const [role, employer, place] = hero.titleLine.split(' · ').map(s => s.replace(/ /g, ' '));
const escape = s => s.replace(/&/g, '&amp;').replace(/</g, '&lt;');

const html = `<!doctype html><html><head><meta charset="utf-8"><style>
@font-face { font-family: 'Instrument Sans'; src: url(data:font/woff2;base64,${font}) format('woff2'); font-weight: 400 700; font-stretch: 75% 100%; }
* { margin: 0; box-sizing: border-box; }
body { width: 1200px; height: 630px; font-family: 'Instrument Sans', sans-serif; color: #15191E; background: #FFFFFF; position: relative; overflow: hidden; }
.grid { position: absolute; inset: 0;
  background-image: linear-gradient(rgb(35 66 176 / .11) 1px, transparent 1px), linear-gradient(90deg, rgb(35 66 176 / .11) 1px, transparent 1px),
    linear-gradient(rgb(35 66 176 / .055) 1px, transparent 1px), linear-gradient(90deg, rgb(35 66 176 / .055) 1px, transparent 1px);
  background-size: 40px 40px, 40px 40px, 8px 8px, 8px 8px; background-position: -1px -1px;
  -webkit-mask-image: radial-gradient(90% 120% at 100% 0%, #000 25%, transparent 75%); }
.copy { position: absolute; left: 80px; top: 104px; height: 330px; width: 640px; display: flex; flex-direction: column; justify-content: center; }
.name { font-size: 64px; font-weight: 600; font-stretch: 92%; letter-spacing: -0.02em; line-height: 1.05; }
.role { margin-top: 18px; font-size: 27px; line-height: 1.35; color: #55606B; }
.headline { margin-top: 44px; font-size: 44px; font-weight: 600; font-stretch: 92%; letter-spacing: -0.015em; line-height: 1.1; color: #2342B0; }
.photo { position: absolute; right: 80px; top: 104px; width: 330px; height: 330px; border-radius: 22px; border: 1px solid #D5DCE3; object-fit: cover; }
.band { position: absolute; left: 0; right: 0; bottom: 0; height: 92px; background: #16297A; color: #FFFFFF; display: flex; align-items: center; padding: 0 80px; font-size: 26px; font-weight: 500; letter-spacing: 0.005em; }
</style></head><body>
<div class="grid"></div>
<div class="copy">
  <div class="name">${escape(hero.name)}</div>
  <div class="role">${escape(role)}<br>${escape(employer)} · ${escape(place)}</div>
  <div class="headline">${escape(hero.headline)}</div>
</div>
<img class="photo" src="data:image/jpeg;base64,${portrait}" alt="">
<div class="band">${escape(atAGlance.experience.label)}</div>
</body></html>`;

const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 1 });
await page.setContent(html, { waitUntil: 'load' });
await page.evaluate(() => document.fonts.ready);
const out = path.join(root, 'public/link-preview.jpg');
await writeFile(out, await page.screenshot({ type: 'jpeg', quality: 88 }));
await browser.close();
console.log('Wrote', path.relative(root, out));
