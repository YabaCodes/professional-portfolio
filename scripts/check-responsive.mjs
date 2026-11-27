import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
import { hero, phases, skills } from '../src/lib/portfolio.ts';
const root = path.resolve('dist');
const release = JSON.parse(await readFile('config/release.json','utf8'));
const production = release.publicationEnabled === true;
const publication = JSON.parse(await readFile('config/public-facing.json','utf8'));
const base = '/professional-portfolio/';
const sectionIds = ['process','experience','skills','publications','contact'];
const allowedHosts = ['doi.org','patents.google.com'];
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff'};
const server = createServer(async (req,res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    if (!url.pathname.startsWith(base)) { res.writeHead(404).end(); return; }
    let file = path.resolve(root, decodeURIComponent(url.pathname.slice(base.length)));
    if (file !== root && !file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    if ((await stat(file)).isDirectory()) file = path.join(file,'index.html');
    res.writeHead(200, {'Content-Type':types[path.extname(file)] ?? 'application/octet-stream'}).end(await readFile(file));
  } catch { res.writeHead(404).end(); }
});
const axeTags = ['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa'];
const scan = async page => (await new AxeBuilder({page}).withTags(axeTags).analyze()).violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)}));
const minTarget = async (locator, label) => {
  for (const item of await locator.all()) {
    const box = await item.boundingBox();
    assert.ok(box && box.width >= 44 && box.height >= 44, label + ' target smaller than 44px');
  }
};
await new Promise(resolve => server.listen(0,'127.0.0.1',resolve));
let browser;
try {
  browser = await chromium.launch({headless:true});
  await mkdir('test-results', {recursive:true});
  const origin = `http://127.0.0.1:${server.address().port}`;
  for (const width of [320,390,768,1024,1440]) {
    const context = await browser.newContext({viewport:{width,height:900}, reducedMotion:'reduce'});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(response.url() + ' ' + response.status()); });
    await page.goto(origin + base, {waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(async () => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      fonts: await Promise.all(['600 32px "Instrument Sans Variable"','400 16px "Instrument Sans Variable"'].map(async font => (await document.fonts.load(font)).length > 0 && document.fonts.check(font))),
      h1: [...document.querySelectorAll('h1')].map(h => h.textContent.trim()),
      ids: [...document.querySelectorAll('main section[id]')].map(s => s.id),
    }));
    assert.equal(metrics.overflow,false,`horizontal overflow at ${width}`);
    assert.ok(metrics.fonts.every(Boolean), 'local fonts not loaded');
    assert.deepEqual(metrics.h1,[hero.headline]);
    assert.deepEqual(metrics.ids,sectionIds,'section order');
    if (production) assert.equal(await page.locator('meta[name="robots"]').count(),0,'must be indexable');
    else assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');

    // Links stay on the base path or go to approved public destinations only.
    const links = await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
    const approved = [publication.contact.href, publication.email.href, publication.resume.assetPath].filter(Boolean);
    assert.ok(links.every(href => href.startsWith('#') || href.startsWith(base) || approved.includes(href) ||
      (href.startsWith('https://') && allowedHosts.includes(new URL(href).hostname))), 'unexpected link destination');

    // Keyboard: skip link first, then into main.
    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()),'Skip to content');
    assert.deepEqual(await scan(page),[]);
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'main-content');
    await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
    assert.deepEqual(await scan(page),[]);

    // Navigation: desktop bar or mobile menu, both jumping to page sections.
    const mobile = width < 900;
    const header = page.locator('header');
    const menu = header.locator('details.mobile-nav');
    const nav = mobile ? header.locator('.mobile-links') : header.getByRole('navigation',{name:'Primary navigation'});
    if (mobile) {
      assert.equal(await menu.isVisible(),true);
      assert.equal(await menu.getAttribute('open'),null);
      await menu.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.notEqual(await menu.getAttribute('open'),null);
    } else {
      assert.equal(await nav.isVisible(),true);
      assert.equal(await menu.isVisible(),false);
    }
    assert.deepEqual(await nav.locator('a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))),sectionIds.map(id=>base+'#'+id));
    await minTarget(nav.locator('a'),'navigation');
    await nav.getByRole('link',{name:'Experience'}).click();
    assert.ok(page.url().endsWith(base+'#experience'));
    if (mobile) assert.equal(await menu.getAttribute('open'),null,'mobile menu closes after choosing a section');
    await page.evaluate(()=>window.scrollTo(0,0));

    // Eight phases: one open at a time, operable from the keyboard; earlier phases read as done.
    const phaseItems = page.locator('[data-phase] details.phase');
    const openStates = () => phaseItems.evaluateAll(nodes=>nodes.map(n=>n.open));
    const only = index => phases.map((_, i) => i === index);
    assert.equal(await phaseItems.count(),phases.length);
    assert.deepEqual(await openStates(),only(0));
    assert.deepEqual(await page.locator('[data-phase] .phase-title').allTextContents(),phases.map(p=>p.title));
    await minTarget(page.locator('[data-phase] summary'),'phase summary');
    const fat = phases.findIndex(p => p.id === 'fat');
    await page.locator('[data-phase="fat"] summary').focus();
    await page.keyboard.press('Enter');
    assert.deepEqual(await openStates(),only(fat),'exclusive accordion');
    assert.equal(await page.locator('[data-phase="fat"] .phase-body').isVisible(),true);
    assert.ok((await page.locator('[data-phase="fat"] .phase-body').innerText()).includes('IQ, OQ and PQ'));
    await page.waitForTimeout(100); // let colour transitions settle
    const dotColors = await page.locator('[data-phase] .step-dot').evaluateAll(nodes=>nodes.map(n=>getComputedStyle(n).backgroundColor));
    assert.equal(dotColors[fat],'rgb(35, 66, 176)','open phase marked in cobalt');
    assert.ok(dotColors.slice(0,fat).every(c=>c==='rgb(232, 236, 251)'),'earlier phases marked done');
    assert.ok(dotColors.slice(fat+1).every(c=>c==='rgb(255, 255, 255)'),'later phases unmarked');
    assert.deepEqual(await scan(page),[]);
    await page.keyboard.press('Enter');
    assert.equal(await page.locator('[data-phase="fat"] details').evaluate(n=>n.open),false);
    assert.equal(await page.locator('[data-track-record] li').count(),5,'track record items');

    // Résumé content.
    assert.equal(await page.locator('[data-record-id]').count(),3);
    assert.equal(await page.locator('[data-credential-id]').count(),4);
    assert.equal(await page.locator('[data-publication-id]').count(),3);
    assert.equal(await page.locator('[data-patent-id]').count(),1);
    assert.deepEqual(await page.locator('[data-skill-group]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-skill-group'))),skills.groups.map(g=>g.group));

    // Contact: exactly the approved destinations.
    const contact = page.locator('#contact');
    assert.equal(await contact.locator('[data-approved-contact-link]').getAttribute('href'),publication.contact.href);
    assert.equal(await contact.locator('[data-approved-email-link]').getAttribute('href'),publication.email.href);
    assert.equal(await contact.locator('[data-approved-email-link]').innerText(),publication.email.href.replace(/^mailto:/,''));
    await minTarget(contact.locator('a'),'contact');
    await minTarget(page.locator('section[aria-labelledby="hero-heading"] a'),'hero action');
    assert.equal(await page.locator('main form, a[href^="tel:"]').count(),0);
    if (production) assert.equal(await page.locator('[data-approved-resume-link]').getAttribute('href'),publication.resume.assetPath);
    else assert.equal(await page.locator('a[download], a[href$=".pdf"]').count(),0);
    assert.equal(await page.locator('footer [data-prelaunch-footer-notice]').count(),production?0:1);
    assert.equal(await page.locator('a[href*="/design-system/"]').count(),0);

    await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
    await page.screenshot({path:`test-results/home-${width}.png`,fullPage:true});
    assert.deepEqual(errors,[]);
    console.log(`${width}px: layout, fonts, keyboard, navigation, phases, contact gates, targets and axe PASS`);
    await context.close();
  }
  if (!production) {
    const context = await browser.newContext({viewport:{width:1440,height:900}});
    const page = await context.newPage();
    const response = await page.goto(origin + base + 'design-system/', {waitUntil:'networkidle'});
    assert.equal(response.status(),200);
    assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow');
    await page.screenshot({path:'test-results/design-specimen-1440.png',fullPage:true});
    await context.close();
    console.log('Internal design specimen: prelaunch only, noindex PASS');
  }
} finally { if(browser) await browser.close(); await new Promise(resolve=>server.close(resolve)); }
