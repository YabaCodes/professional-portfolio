import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, stat } from 'node:fs/promises';
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
  await mkdir('test-results', {recursive:true});
  for (const width of [320,390,768,1024,1440]) {
    const context = await browser.newContext({viewport:{width,height:900}, reducedMotion:'reduce'});
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', err => errors.push(err.message));
    page.on('response', response => { if (response.status() >= 400) errors.push(response.url() + ' ' + response.status()); });
    await page.goto(`http://127.0.0.1:${server.address().port}${base}`,{waitUntil:'networkidle'});
    await page.evaluate(() => document.fonts.ready);
    const metrics = await page.evaluate(async () => ({
      overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth,
      columns: getComputedStyle(document.querySelector('[data-grid]')).gridTemplateColumns.split(' ').length,
      fonts: await Promise.all(['700 32px "Manrope Variable"','400 16px "Inter Variable"','400 12px "IBM Plex Mono"'].map(async font => (await document.fonts.load(font)).length > 0 && document.fonts.check(font))),
      target: document.querySelector('main section[aria-labelledby="hero-heading"] .action-link').getBoundingClientRect().height,
      headingCount: document.querySelectorAll('h1').length
    }));
    assert.equal(metrics.overflow,false,`horizontal overflow at ${width}`);
    assert.equal(metrics.columns,width>=1024?12:width>=768?8:4);
    assert.ok(metrics.fonts.every(Boolean), 'local fonts not loaded');
    assert.ok(metrics.target>=44);
    assert.equal(metrics.headingCount,1);
    assert.equal(await page.locator('.credibility-grid dd').count(),4);
    assert.deepEqual(await page.locator('.credibility-grid dd').allTextContents(),['M.Sc.','PMP®','03','01']);
    assert.equal(await page.locator('main section[aria-labelledby="selected-work"] [data-case-id="CS-004"]').count(),1);
    assert.ok((await page.locator('main h1').innerText()).includes('Engineering complex systems.'));

    await page.keyboard.press('Tab');
    assert.equal(await page.evaluate(() => document.activeElement?.textContent?.trim()),'Skip to content');
    const skip = page.locator('.skip-link');
    const brand = page.locator('.brand-link');
    const skipBox = await skip.boundingBox();
    const brandBox = await brand.boundingBox();
    assert.ok(skipBox && brandBox);
    assert.ok(brandBox.width >= 44 && brandBox.height >= 44, 'brand target must be at least 44px');
    assert.ok(skipBox.y + skipBox.height <= brandBox.y || brandBox.y + brandBox.height <= skipBox.y || skipBox.x + skipBox.width <= brandBox.x || brandBox.x + brandBox.width <= skipBox.x, 'focused skip link overlaps the brand target');
    const axe = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(axe.violations.map(v=>({id:v.id,impact:v.impact,targets:v.nodes.map(n=>n.target)})),[]);
    await page.keyboard.press('Enter');
    assert.equal(await page.evaluate(()=>document.activeElement?.id),'main-content');
    await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
    const defaultScan = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
    assert.deepEqual(defaultScan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[]);
    assert.deepEqual(errors,[]);
    console.log(`${width}px: layout, local fonts, keyboard focus, target size and axe smoke PASS`);
    const mobile = width < 1024;
    const header = page.locator('header');
    const menu = header.locator('details.mobile-nav');
    if (mobile) {
      assert.equal(await menu.isVisible(),true);
      assert.equal(await menu.getAttribute('open'),null);
      await menu.locator('summary').focus();
      await page.keyboard.press('Enter');
      assert.notEqual(await menu.getAttribute('open'),null);
      assert.equal(await menu.getByRole('link',{name:'Selected Work'}).isVisible(),true);
      await page.keyboard.press('Enter');
      assert.equal(await menu.getAttribute('open'),null);
    } else {
      assert.equal(await header.getByRole('navigation',{name:'Primary navigation'}).isVisible(),true);
      assert.equal(await menu.isVisible(),false);
    }
    await page.evaluate(()=>document.activeElement?.blur());
    await page.screenshot({path:`test-results/design-${width}.png`,fullPage:true});
    if (width === 390 || width === 1440) {
      const routes = ['about','work','work/advanced-lattice-structures','expertise','insights','research','contact','insights/lab','design-system'];
      const origin = `http://127.0.0.1:${server.address().port}`;
      for (const route of routes) {
        const response = await page.goto(origin + base + route + '/', {waitUntil:'networkidle'});
        assert.equal(response.status(),200,route);
        assert.equal(await page.locator('h1').count(),1,route);
        assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow',route);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth),false,route);
        const links = await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
        assert.ok(links.every(href=>href.startsWith('#') || href.startsWith('/professional-portfolio/') || href.startsWith('https://doi.org/')),route+' base path');
        if(route !== 'design-system') {
          assert.ok(await page.locator('meta[name="description"]').getAttribute('content'),route);
          assert.ok(await page.locator('meta[property="og:title"]').getAttribute('content'),route);
          assert.equal(await page.locator('header').count(),1);
          assert.equal(await page.locator('footer').count(),1);
          const nav=page.locator(mobile?'header .mobile-nav':'header .desktop-nav');
          const expected=route.split('/')[0];
          assert.equal(await nav.locator('a[aria-current]').getAttribute('href'),base+expected+'/');
        }
        if(route==='about'){
          assert.equal(await page.locator('[data-record-id]').count(),6);
          assert.equal(await page.locator('[data-credential-id]').count(),4);
          assert.deepEqual(await page.locator('[data-record-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-record-id'))),['CAR-004','CAR-003','CAR-002','CAR-001','CRED-001','CRED-002']);
          assert.ok((await page.locator('[data-record-id="CAR-004"]').innerText()).includes('Additional leadership assignment'));
          assert.ok((await page.locator('main').innerText()).includes('My approach to technical leadership is grounded in clarity of requirements'));
          await page.screenshot({path:`test-results/profile-${width}.png`,fullPage:true});
        }
        if(route==='work'){
          assert.equal(await page.locator('[data-case-id="CS-004"]').count(),1);
          assert.equal(await page.locator('[data-case-id="CS-004"] a').getAttribute('href'),base+'work/advanced-lattice-structures/');
        }
        if(route==='work/advanced-lattice-structures'){
          assert.deepEqual(await page.locator('[data-case-section]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-case-section'))),['overview','challenge','contribution','methodology','decisions','outcomes','demonstration','reflection']);
          assert.equal(await page.locator('ul[aria-label="Relative torsional stiffness values"] > li[data-comparison-row]').count(),3);
          assert.deepEqual(await page.locator('[data-comparison-row] [data-comparison-value]').allTextContents(),['≈109','100','≈55']);
          assert.equal(await page.locator('#references + ul a').count(),2);
          assert.ok((await page.locator('[data-comparison]').innerText()).includes('not raw experimental measurements'));
          const toc=page.locator(mobile?'.mobile-toc':'.desktop-toc');
          if(mobile) await toc.locator('summary').click();
          await toc.getByRole('link',{name:'Results & outcomes',exact:true}).click();
          assert.equal(new URL(page.url()).hash,'#outcomes');
          if(mobile) await toc.locator('summary').click();
          await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
          await page.screenshot({path:`test-results/case-study-${width}.png`,fullPage:true});
        }
        const scan = await new AxeBuilder({page}).withTags(['wcag2a','wcag2aa','wcag21a','wcag21aa','wcag22aa']).analyze();
        assert.deepEqual(scan.violations.map(v=>({id:v.id,targets:v.nodes.map(n=>n.target)})),[],route);
        console.log(`${width}px / ${route}: route and axe smoke PASS`);
      }
      await page.goto(origin+base,{waitUntil:'networkidle'});
      if (mobile) await page.locator('header .mobile-nav summary').click();
      await page.locator(mobile?'header .mobile-nav':'header .desktop-nav').getByRole('link',{name:'Selected Work'}).click();
      assert.ok(page.url().endsWith(base+'work/'));
      await page.locator('header .brand-link').click();
      assert.ok(page.url().endsWith(base));
      const actions = [
        ['Explore selected work','work/'],
        ['Explore Engineering Lab','insights/lab/'],
        ['Résumé & contact','contact/'],
      ];
      for (const [label,destination] of actions) {
        await page.goto(origin+base,{waitUntil:'networkidle'});
        const link=page.locator('main').getByRole('link',{name:label,exact:true});
        assert.equal(await link.count(),1,label);
        const box=await link.boundingBox();
        assert.ok(box && box.width>=44 && box.height>=44,label+' target size');
        await link.click();
        assert.ok(page.url().endsWith(base+destination),label+' destination');
      }
    }
    assert.deepEqual(errors,[]);
    await context.close();
  }
} finally { if(browser) await browser.close(); await new Promise(resolve=>server.close(resolve)); }
