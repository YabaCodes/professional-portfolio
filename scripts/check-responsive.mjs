import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const root = path.resolve('dist');
const base = '/professional-portfolio/';
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
const server = createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
    const relative = decodeURIComponent(url.pathname.slice(base.length));
    let file = path.resolve(root, relative);
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file,'index.html');
    res.writeHead(200, {'Content-Type':types[path.extname(file)] ?? 'application/octet-stream'}).end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser = await chromium.launch({headless:true});
  for (const width of [320,390,768,1024,1440]) {
    const page = await browser.newPage({viewport:{width,height:900}, reducedMotion:'reduce'});
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(response.url() + ' ' + response.status()); });
    await page.goto(`http://127.0.0.1:${server.address().port}${base}`,{waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(async () => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      columns: getComputedStyle(document.querySelector('[data-grid]')).gridTemplateColumns.split(' ').length,
      fonts: await Promise.all(['700 32px "Manrope Variable"','400 16px "Inter Variable"','400 12px "IBM Plex Mono"'].map(async font => (await document.fonts.load(font)).length > 0 && document.fonts.check(font))),
      target: document.querySelector('main .action-link').getBoundingClientRect().height,
      headingCount: document.querySelectorAll('h1').length
    }));
    assert.equal(metrics.overflow,false,`horizontal overflow at ${width}`);
    assert.equal(metrics.columns,width>=1024?12:width>=768?8:4);
    assert.ok(metrics.fonts.every(Boolean), 'local fonts not loaded');
    assert.ok(metrics.target>=44);
    assert.equal(metrics.headingCount,1);
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()),'Skip to content');
    const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(axe.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})),[]);
    assert.deepEqual(errors,[]);
    console.log(`${width}px: layout, local fonts, keyboard focus, target size and axe smoke PASS`);
    await page.close();
  }
} finally { if(browser) await browser.close(); await new Promise(resolve=>server.close(resolve)); }
