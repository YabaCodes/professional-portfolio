import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { mkdir, readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import { chromium } from 'playwright';
import AxeBuilder from '@axe-core/playwright';
const root = path.resolve('dist');
const base = '/professional-portfolio/';
const competencyMap={"COMP-001":["CS-001"],"COMP-002":["CS-001","CS-004","CRED-002","PAT-001"],"COMP-003":["CS-001"],"COMP-004":["CS-001","CS-003"],"COMP-005":["CS-003","CRED-003"],"COMP-006":["CS-001","CS-003"],"COMP-007":["CS-001","CS-003"],"COMP-008":["CS-001","CS-003"],"COMP-009":["CS-003"],"COMP-010":["CS-002","EL-001"],"COMP-011":["CS-002"],"COMP-012":["CS-002","CRED-004"],"COMP-013":["CS-004","CRED-001","PUB-001","PUB-002"],"COMP-014":["CS-004","CRED-001","PUB-001","PUB-002","PUB-003"],"COMP-015":["CS-004","CS-002","PUB-001","PUB-002"],"COMP-016":["CS-004","PUB-001","PUB-002","PUB-003","PAT-001"]};
const caseRoutes={"CS-001":"requirements-to-manufacturing-readiness","CS-002":"engineering-for-manufacturing-performance","CS-003":"leading-complex-engineering-programs","CS-004":"advanced-lattice-structures"};
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
    assert.deepEqual(await page.locator('main section[aria-labelledby="selected-work"] [data-case-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-case-id'))),['CS-001','CS-002','CS-003','CS-004']);
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
      const routes = ['about','work','work/requirements-to-manufacturing-readiness','work/engineering-for-manufacturing-performance','work/leading-complex-engineering-programs','work/advanced-lattice-structures','expertise','insights','research','contact','insights/lab','insights/lab/manufacturing-performance-oee-analyzer','design-system'];
      const origin = `http://127.0.0.1:${server.address().port}`;
      for (const route of routes) {
        const response = await page.goto(origin + base + route + '/', {waitUntil:'networkidle'});
        assert.equal(response.status(),200,route);
        assert.equal(await page.locator('h1').count(),1,route);
        assert.equal(await page.locator('meta[name="robots"]').getAttribute('content'),'noindex, nofollow',route);
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth > document.documentElement.clientWidth),false,route);
        const links = await page.locator('a[href]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href')));
        assert.ok(links.every(href=>href.startsWith('#') || href.startsWith('/professional-portfolio/') || (href.startsWith('https://') && ['doi.org','orcid.org','patents.google.com','patentimages.storage.googleapis.com'].includes(new URL(href).hostname))),route+' base path');
        if(route !== 'design-system') {
          assert.ok(await page.locator('meta[name="description"]').getAttribute('content'),route);
          assert.ok(await page.locator('meta[property="og:title"]').getAttribute('content'),route);
          assert.equal(await page.locator('header').count(),1);
          assert.equal(await page.locator('footer').count(),1);
          const nav=page.locator(mobile?'header .mobile-nav':'header .desktop-nav');
          const expected=route.split('/')[0];
          assert.equal(await nav.locator('a[aria-current]').getAttribute('href'),base+expected+'/');
        }
        if(route.startsWith('work/')){
          const caseId=Object.keys(caseRoutes).find(id=>'work/'+caseRoutes[id]===route);
          const expected=Object.keys(competencyMap).filter(id=>competencyMap[id].includes(caseId));
          assert.deepEqual(await page.locator('[data-related-competency]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-related-competency'))),expected);
          for(const id of expected)assert.equal(await page.locator('[data-related-competency="'+id+'"] a').getAttribute('href'),base+'expertise/#'+id.toLowerCase());
        }
        if(route==='expertise'){
          assert.equal(await page.locator('[data-competency-id]').count(),16);
          assert.deepEqual(await page.locator('[data-pillar-group]').evaluateAll(nodes=>nodes.map(n=>n.querySelectorAll('[data-competency-id]').length)),[4,4,4,4]);
          for(const [id,sources] of Object.entries(competencyMap)){
            const card=page.locator('[data-competency-id="'+id+'"]');
            assert.deepEqual(await card.locator('[data-evidence-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-evidence-id'))),sources);
            for(const source of sources){
              const expected=source.startsWith('CRED-')?base+'about/#'+source.toLowerCase():(source.startsWith('PUB-')||source.startsWith('PAT-'))?base+'research/#'+source.toLowerCase():source.startsWith('EL-')?base+'insights/lab/manufacturing-performance-oee-analyzer/':base+'work/'+caseRoutes[source]+'/';
              assert.equal(await card.locator('[data-evidence-id="'+source+'"] a').getAttribute('href'),expected);
            }
          }
          assert.equal(await page.locator('[data-embedded-example] a').getAttribute('href'),base+'work/engineering-for-manufacturing-performance/#oee-example');
          assert.equal(await page.locator('[data-evidence-id="EL-001"] a').getAttribute('href'),base+'insights/lab/manufacturing-performance-oee-analyzer/');
          assert.equal(await page.locator('[data-planned-evidence]').count(),0);
          assert.match(await page.locator('[data-competency-id="COMP-005"] [data-evidence-id="CRED-003"]').innerText(),/owner-confirmed qualification/i);
          assert.match(await page.locator('[data-competency-id="COMP-013"] [data-evidence-id="CS-004"]').innerText(),/published research/i);
          assert.match(await page.locator('[data-competency-id="COMP-001"] [data-evidence-id="CS-001"]').innerText(),/owner-approved professional experience/i);
          for(const id of ['engineering','program-delivery','leadership','research']){
            const button=page.locator('[data-pillar-filter="'+id+'"]');
            const bounds=await button.boundingBox();assert.ok(bounds&&bounds.width>=44&&bounds.height>=44);
            await button.focus();await button.press('Enter');
            assert.equal(await button.getAttribute('aria-pressed'),'true');
            assert.equal(await page.locator('[data-competency-id]:visible').count(),4);
            assert.equal(await page.locator('[data-competency-count]').textContent(),'4 competency groups');
          }
          // Hero anchor must reveal a group hidden by the current filter.
          await page.locator('a[href="#pillar-engineering"]').click();
          await page.locator('#pillar-engineering').waitFor({state:'visible'});
          assert.equal(new URL(page.url()).hash,'#pillar-engineering');
          assert.equal(await page.locator('[data-pillar-filter="engineering"]').getAttribute('aria-pressed'),'true');
          assert.equal(await page.locator('[data-competency-id]:visible').count(),4);
          // Same-hash navigation must restore the target after a filter change.
          await page.locator('[data-pillar-filter="research"]').click();
          assert.equal(await page.locator('#pillar-engineering').isVisible(),false);
          await page.locator('a[href="#pillar-engineering"]').click();
          await page.locator('#pillar-engineering').waitFor({state:'visible'});
          assert.equal(await page.locator('[data-pillar-filter="engineering"]').getAttribute('aria-pressed'),'true');
          assert.equal(await page.locator('[data-competency-id]:visible').count(),4);
          await page.locator('[data-pillar-filter="all"]').click();
          assert.equal(await page.locator('[data-competency-id]:visible').count(),16);
          assert.equal(await page.locator('[data-competency-count]').textContent(),'16 competency groups');
          await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
          await page.screenshot({path:`test-results/expertise-${width}.png`,fullPage:true});
          // Inspect actual round-trip navigation, not only href attributes.
          await page.locator('[data-competency-id="COMP-010"] [data-evidence-id="CS-002"] a').click();
          assert.ok(page.url().endsWith(base+'work/engineering-for-manufacturing-performance/'));
          await page.locator('[data-related-competency="COMP-010"] a').click();
          assert.ok(page.url().endsWith(base+'expertise/#comp-010'));
          assert.equal(await page.locator('#comp-010').isVisible(),true);
          await page.locator('[data-embedded-example] a').click();
          assert.ok(page.url().endsWith(base+'work/engineering-for-manufacturing-performance/#oee-example'));
          assert.equal(await page.locator('#oee-example').isVisible(),true);
          await page.goto(origin+base+'expertise/',{waitUntil:'networkidle'});
          await page.locator('[data-competency-id="COMP-005"] [data-evidence-id="CRED-003"] a').click();
          assert.ok(page.url().endsWith(base+'about/#cred-003'));
          assert.equal(await page.locator('#cred-003').isVisible(),true);
          await page.goto(origin+base+'expertise/',{waitUntil:'networkidle'});
          const noJs=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:900}});
          try{
            const staticPage=await noJs.newPage();
            await staticPage.goto(origin+base+'expertise/#comp-016');
            assert.equal(await staticPage.locator('[data-competency-id]:visible').count(),16);
            assert.equal(await staticPage.locator('[data-pillar-filters]').isVisible(),false);
            assert.equal(await staticPage.locator('#comp-016').isVisible(),true);
          }finally{await noJs.close();}
        }
        if(route==='research'){
          assert.equal(await page.locator('h1').innerText(),'Engineering through investigation and invention.');
          assert.deepEqual(await page.locator('[data-publication-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-publication-id'))),['PUB-001','PUB-002','PUB-003']);
          assert.equal(await page.locator('[data-patent-id]').count(),1);
          for(const item of [
           ['PUB-001','10.3390/ma14216521','First author','Yeabsra Mekdim Hailu, Aamer Nazir, Shang-Chih Lin, Jeng-Ywan Jeng'],
           ['PUB-002','10.1007/s00170-022-08681-8','First author','Yeabsra Mekdim Hailu, Aamer Nazir, Chi-Pin Hsu, Shang-Chih Lin, Jeng-Ywan Jeng'],
           ['PUB-003','10.1007/s40964-022-00262-1','Co-author','Eyob Messele Sefene, Yeabsra Mekdim Hailu, Assefa Asmare Tsegaw']
          ]){
            const card=page.locator('[data-publication-id="'+item[0]+'"]');
            assert.equal(await card.locator('[data-publication-authors]').innerText(),item[3]);
            assert.equal(await card.locator('a[href^="https://doi.org/"]').getAttribute('href'),'https://doi.org/'+item[1]);
            assert.ok((await card.locator('.technical-label').first().innerText()).toLowerCase().includes(item[2].toLowerCase()));
            assert.equal(await card.locator('[data-portfolio-author]').count(),1);
          }
          const patent=page.locator('[data-patent-id="PAT-001"]');
          assert.ok((await patent.innerText()).includes('US11280073B1'));
          assert.ok((await patent.innerText()).includes('National Taiwan University of Science and Technology'));
          assert.ok((await patent.innerText()).includes('does not imply patent ownership'));
          assert.equal(await patent.locator('[data-portfolio-inventor]').innerText(),'Yeabsra Mekdim Hailu');
          assert.equal(await patent.locator('[data-inventor-list]').innerText(),'Jeng-Ywan Jeng, Aamer Nazir, Yeabsra Mekdim Hailu');
          assert.equal(await patent.locator('a[href="https://patents.google.com/patent/US11280073B1"]').count(),1);
          assert.equal(await patent.locator('a[href^="https://patentimages.storage.googleapis.com/"]').count(),1);
          assert.equal(await page.locator('[data-orcid-link]').getAttribute('href'),'https://orcid.org/0000-0003-1044-453X');
          assert.equal(await page.locator('[data-related-research-case]').getAttribute('href'),base+'work/advanced-lattice-structures/');
          assert.deepEqual(await page.locator('#pub-001 [data-related-competency]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-related-competency'))),['COMP-013','COMP-014','COMP-015','COMP-016']);
          assert.deepEqual(await page.locator('#pat-001 [data-related-competency]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-related-competency'))),['COMP-002','COMP-016']);
          await page.screenshot({path:'test-results/research-'+width+'.png',fullPage:true});
          await page.locator('#pub-001 [data-related-competency="COMP-013"] a').click();
          assert.ok(page.url().endsWith(base+'expertise/#comp-013'));
          await page.goto(origin+base+'research/',{waitUntil:'networkidle'});
        }
        if(route!=='design-system'){
          const footerCta=page.locator('footer [data-contact-callout]');
          assert.equal(await footerCta.getAttribute('href'),base+'contact/');
          const footerBox=await footerCta.boundingBox();
          assert.ok(footerBox&&footerBox.width>=44&&footerBox.height>=44,'shared contact CTA target');
        }
        if(route==='contact'){
          assert.equal(await page.locator('h1').innerText(),'Connect on engineering, technology and delivery.');
          assert.match(await page.locator('main').innerText(),/new product introduction/i);
          assert.equal(await page.locator('[data-contact-state="pending-approval"]').count(),1);
          assert.equal(await page.locator('[data-resume-state="pending-approval"]').count(),1);
          assert.equal(await page.locator('main a[href^="mailto:"]').count(),0);
          assert.equal(await page.locator('main a[href^="tel:"]').count(),0);
          assert.equal(await page.locator('main a[href*="linkedin.com"]').count(),0);
          assert.equal(await page.locator('main a[download]').count(),0);
          assert.equal(await page.locator('main a[href$=".pdf"]').count(),0);
          assert.equal(await page.locator('main form').count(),0);
          const navigation=page.locator('[data-contact-navigation]');
          assert.deepEqual(await navigation.locator('a').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))),[base+'work/',base+'about/',base+'research/']);
          for(const link of await navigation.locator('a').all()){
            const box=await link.boundingBox();assert.ok(box&&box.width>=44&&box.height>=44,'contact navigation hit target');
          }
          await page.screenshot({path:'test-results/contact-'+width+'.png',fullPage:true});
          await navigation.getByRole('link',{name:/Explore selected work/}).click();
          assert.ok(page.url().endsWith(base+'work/'));
          await page.goto(origin+base+'contact/',{waitUntil:'networkidle'});
          await page.locator('footer [data-contact-callout]').click();
          assert.ok(page.url().endsWith(base+'contact/'));
        }
        if(route==='insights/lab'){
          assert.equal(await page.locator('main a[href="'+base+'insights/lab/manufacturing-performance-oee-analyzer/"]').count(),1);
          assert.match(await page.locator('main').innerText(),/functional OEE analyzer/i);
        }
        if(route==='insights/lab/manufacturing-performance-oee-analyzer'){
          const a=page.locator('[data-el001-analyzer]');
          assert.equal(await a.count(),1);
          assert.equal(await a.locator('input[type="number"]').count(),5);
          assert.equal(await a.locator('button[data-preset]').count(),5);
          assert.equal(await a.locator('[data-oee-number]').innerText(),'77.50%');
          assert.deepEqual(await a.locator('[data-oee-factor]').allTextContents(),['90.00%','87.96%','97.89%']);
          assert.deepEqual(await a.locator('[data-loss-minutes]').allTextContents(),['48.00 min','52.00 min','8.00 min','372.00 min']);
          assert.equal(await a.locator('[data-oee-dominant]').innerText(),'Performance loss');
          for(const element of await a.locator('input[type="number"],button[data-preset]').all()){
            assert.equal(await element.isEnabled(),true);
            const rect=await element.boundingBox();assert.ok(rect&&rect.width>=44&&rect.height>=44);
          }
          await a.locator('button[data-preset="quality"]').click();
          assert.equal(await a.locator('[data-oee-number]').innerText(),'68.75%');
          assert.equal(await a.locator('[data-oee-dominant]').innerText(),'Quality loss');
          assert.deepEqual(await a.locator('[data-loss-minutes]').allTextContents(),['30.00 min','10.00 min','110.00 min','330.00 min']);
          await a.locator('button[data-preset="no-output"]').click();
          assert.equal(await a.locator('[data-oee-number]').innerText(),'0.00%');
          assert.deepEqual(await a.locator('[data-oee-factor]').allTextContents(),['0.00%','Not defined','Not defined']);
          await a.locator('button[data-preset="ideal"]').click();
          assert.equal(await a.locator('[data-oee-number]').innerText(),'100.00%');
          assert.equal(await a.locator('[data-oee-dominant]').innerText(),'No losses');
          await a.locator('input[name="plannedMinutes"]').fill('-1');
          assert.equal(await a.locator('[data-analyzer-error]').isVisible(),true);
          assert.equal(await a.locator('[data-analyzer-output]').isVisible(),false);
          await a.locator('button[data-preset="reference"]').click();
          await a.locator('input[name="idealMinutesPerUnit"]').fill('2');
          assert.match(await a.locator('[data-analyzer-error]').innerText(),/ideal production time exceeds operating time/i);
          await a.locator('button[data-preset="reference"]').click();
          await a.locator('input[name="goodUnits"]').fill('800');
          assert.match(await a.locator('[data-analyzer-error]').innerText(),/invalid unit counts/i);
          await a.locator('[data-analyzer-reset]').click();
          assert.equal(await a.locator('[data-oee-number]').innerText(),'77.50%');
          assert.equal(await a.locator('[data-analyzer-error]').isVisible(),false);
          await a.locator('input[name="operatingMinutes"]').focus();
          await a.locator('input[name="operatingMinutes"]').press('ArrowDown');
          assert.equal(await a.locator('input[name="operatingMinutes"]').inputValue(),'431');
          await a.locator('[data-analyzer-reset]').click();
          assert.deepEqual(await a.locator('input[type="number"]').evaluateAll(nodes=>nodes.map(n=>n.value)),['480','432','0.5','760','744']);
          await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0)});
          await page.screenshot({path:'test-results/engineering-lab-'+width+'.png',fullPage:true});
          const staticCtx=await browser.newContext({javaScriptEnabled:false,viewport:{width,height:900}});
          try{
            const staticPage=await staticCtx.newPage();
            await staticPage.goto(origin+base+route+'/');
            assert.equal(await staticPage.locator('[data-oee-number]').innerText(),'77.50%');
            assert.notEqual(await staticPage.locator('[data-analyzer-controls]').getAttribute('disabled'),null);
            assert.equal(await staticPage.locator('[data-analyzer-input="plannedMinutes"]').isDisabled(),true);
          }finally{await staticCtx.close();}
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
          assert.deepEqual(await page.locator('[data-case-id]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-case-id'))),['CS-001','CS-002','CS-003','CS-004']);
          assert.equal(await page.locator('[data-case-id="CS-001"] a').getAttribute('href'),base+'work/requirements-to-manufacturing-readiness/');
          assert.equal(await page.locator('[data-case-id="CS-002"] a').getAttribute('href'),base+'work/engineering-for-manufacturing-performance/');
          assert.equal(await page.locator('[data-case-id="CS-003"] a').getAttribute('href'),base+'work/leading-complex-engineering-programs/');
          assert.equal(await page.locator('[data-case-id="CS-004"] a').getAttribute('href'),base+'work/advanced-lattice-structures/');
        }
        if(route==='work/requirements-to-manufacturing-readiness'){
          assert.deepEqual(await page.locator('[data-case-section]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-case-section'))),['overview','challenge','contribution','methodology','decisions','outcomes','demonstration','reflection']);
          assert.equal(await page.locator('[data-contributions] > li').count(),7);
          assert.equal(await page.locator('[data-case-section="methodology"] ol > li').count(),6);
          assert.equal(await page.locator('[data-tradeoffs] tbody tr').count(),6);
          assert.equal(await page.locator('[data-independent-example] figure').count(),2);
          assert.ok((await page.locator('[data-independent-example]').innerText()).includes('Neither concept represents actual employer equipment'));
          assert.equal(await page.locator('[data-planned-tools] li').count(),3);
          assert.match(await page.locator('[data-planned-tools] .technical-label').innerText(),/planned independent demonstrations\s*—\s*not implemented/i);
          assert.equal(await page.locator('[data-comparison]').count(),0);
          assert.ok((await page.locator('[data-professional-evidence]').innerText()).includes('does not present independent validation'));
          assert.equal(await page.locator('[data-professional-evidence] a').getAttribute('href'),base+'about/');
          const toc=page.locator(mobile?'.mobile-toc':'.desktop-toc');
          if(mobile) await toc.locator('summary').click();
          await toc.getByRole('link',{name:'Technical decisions & trade-offs',exact:true}).click();
          assert.equal(new URL(page.url()).hash,'#decisions');
          if(mobile) await toc.locator('summary').click();
          await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
          await page.screenshot({path:`test-results/case-study-cs001-${width}.png`,fullPage:true});
        }
        if(route==='work/engineering-for-manufacturing-performance'){
          assert.deepEqual(await page.locator('[data-case-section]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-case-section'))),['overview','challenge','contribution','methodology','decisions','outcomes','demonstration','reflection']);
          assert.equal(await page.locator('[data-contributions] > li').count(),7);
          assert.equal(await page.locator('[data-case-section="methodology"] ol > li').count(),7);
          assert.equal(await page.locator('[data-tradeoffs] tbody tr').count(),6);
          assert.equal(await page.locator('[data-planned-tools] li').count(),2);
          assert.match(await page.locator('[data-planned-tools] .technical-label').innerText(),/planned independent demonstrations\s*—\s*not implemented/i);
          assert.ok((await page.locator('[data-professional-evidence]').innerText()).includes('does not present independent validation'));
          const example=page.locator('[data-oee-example]');
          assert.equal(await example.count(),1);
          assert.ok((await example.innerText()).includes('does not represent actual employer equipment, processes or manufacturing results'));
          assert.ok((await example.innerText()).includes('separate from the completed EL-001'));
          assert.equal(await example.locator('[data-oee-result]').textContent(),'83.79%');
          assert.deepEqual(await example.locator('[data-loss-value]').allTextContents(),['10.00%','4.50%','1.71%','83.79%']);
          assert.equal(await example.locator('[data-largest-loss]').textContent(),'Availability loss');
          for(const key of ['availability','performance','quality']){
            const slider=example.locator('[data-factor="'+key+'"]');
            assert.equal(await slider.isEnabled(),true);
            const bounds=await slider.boundingBox();
            assert.ok(bounds&&bounds.height>=44&&bounds.width>=44);
            await slider.focus();
            await slider.press('End');
          }
          await page.waitForFunction(()=>document.querySelector('[data-oee-result]')?.textContent==='100.00%');
          assert.equal(await example.locator('[data-largest-loss]').textContent(),'No losses');
          await example.locator('[data-factor="availability"]').press('Home');
          await page.waitForFunction(()=>document.querySelector('[data-oee-result]')?.textContent==='0.00%');
          assert.deepEqual(await example.locator('[data-loss-value]').allTextContents(),['100.00%','0.00%','0.00%','0.00%']);
          await example.getByRole('button',{name:'Reset',exact:true}).click();
          await page.waitForFunction(()=>document.querySelector('[data-oee-result]')?.textContent==='83.79%');
          assert.deepEqual(await example.locator('input[type="range"]').evaluateAll(nodes=>nodes.map(n=>n.value)),['90','95','98']);
          assert.deepEqual(await example.locator('[data-loss-value]').allTextContents(),['10.00%','4.50%','1.71%','83.79%']);
          const toc=page.locator(mobile?'.mobile-toc':'.desktop-toc');
          if(mobile)await toc.locator('summary').click();
          await toc.getByRole('link',{name:'Technical decisions & trade-offs',exact:true}).click();
          assert.equal(new URL(page.url()).hash,'#decisions');
          if(mobile)await toc.locator('summary').click();
          await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
          await page.screenshot({path:`test-results/case-study-cs002-${width}.png`,fullPage:true});
        }
        if(route==='work/leading-complex-engineering-programs'){
          assert.deepEqual(await page.locator('[data-case-section]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('data-case-section'))),['overview','challenge','contribution','methodology','decisions','outcomes','demonstration','reflection']);
          assert.equal(await page.locator('[data-contributions] > li').count(),8);
          assert.ok((await page.locator('[data-case-section="contribution"]').innerText()).includes('functional and technical in nature'));
          assert.equal(await page.locator('[data-case-section="methodology"] ol > li').count(),7);
          assert.equal(await page.locator('[data-tradeoffs] tbody tr').count(),6);
          assert.equal(await page.locator('[data-planned-tools] li').count(),4);
          assert.match(await page.locator('[data-planned-tools] .technical-label').innerText(),/planned independent demonstrations\s*—\s*not implemented/i);
          assert.equal(await page.locator('[data-case-section="reflection"] ul > li').count(),10);
          assert.ok((await page.locator('[data-professional-evidence]').innerText()).includes('does not present independent validation'));
          const example=page.locator('[data-readiness-example]');
          assert.equal(await example.locator('[data-criterion]').count(),6);
          assert.equal(await example.locator('input[type="radio"]').count(),24);
          assert.equal(await example.locator('input[type="checkbox"]').count(),6);
          assert.ok((await example.innerText()).includes('do not represent employer procedures or regulatory release requirements'));
          assert.ok((await example.innerText()).includes('not an automated release authorization system'));
          assert.equal(await example.locator('[data-ready-count]').textContent(),'2/6');
          assert.equal(await example.locator('[data-blocked-count]').textContent(),'2');
          assert.equal(await example.locator('[data-readiness-status]').textContent(),'Gate blocked');
          assert.deepEqual(await example.locator('[data-blockers] li').allTextContents(),['Verification evidence','Manufacturing readiness']);
          assert.deepEqual(await example.locator('[data-maturity-count]').allTextContents(),['0','2','2','2']);
          for(const label of await example.locator('label.choice').all()){
            const b=await label.boundingBox();assert.ok(b&&b.width>=44&&b.height>=44,'readiness choice target size');
          }
          for(const i of [2,3,4]){
            const radio=example.locator('input[name="maturity-'+i+'"][value="3"]');
            assert.equal(await radio.isEnabled(),true);
            await radio.check();
          }
          assert.equal(await example.locator('[data-ready-count]').textContent(),'5/6');
          assert.equal(await example.locator('[data-readiness-status]').textContent(),'Gate blocked');
          assert.deepEqual(await example.locator('[data-blockers] li').allTextContents(),['Manufacturing readiness']);
          const lastMandatory=example.locator('input[name="mandatory-5"]');
          await lastMandatory.focus();
          await lastMandatory.press('Space');
          assert.equal(await example.locator('[data-readiness-status]').textContent(),'Review required');
          assert.equal(await example.locator('[data-blocked-count]').textContent(),'0');
          assert.equal(await example.locator('[data-blockers-panel]').isVisible(),false);
          await example.locator('input[name="maturity-5"][value="3"]').check();
          assert.equal(await example.locator('[data-readiness-status]').textContent(),'Ready for review');
          assert.equal(await example.locator('[data-ready-count]').textContent(),'6/6');
          await example.getByRole('button',{name:'Reset example',exact:true}).click();
          assert.equal(await example.locator('[data-readiness-status]').textContent(),'Gate blocked');
          assert.equal(await example.locator('[data-ready-count]').textContent(),'2/6');
          assert.deepEqual(await example.locator('[data-blockers] li').allTextContents(),['Verification evidence','Manufacturing readiness']);
          assert.deepEqual(await example.locator('input[type="radio"]:checked').evaluateAll(nodes=>nodes.map(n=>n.value)),['3','3','2','1','2','1']);
          assert.deepEqual(await example.locator('input[type="checkbox"]:checked').evaluateAll(nodes=>nodes.map(n=>n.name)),['mandatory-3','mandatory-5']);
          const toc=page.locator(mobile?'.mobile-toc':'.desktop-toc');
          if(mobile)await toc.locator('summary').click();
          await toc.getByRole('link',{name:'Technical decisions & trade-offs',exact:true}).click();
          assert.equal(new URL(page.url()).hash,'#decisions');
          if(mobile)await toc.locator('summary').click();
          await page.evaluate(()=>{document.activeElement?.blur();window.scrollTo(0,0);});
          await page.screenshot({path:`test-results/case-study-cs003-${width}.png`,fullPage:true});
        }
        if(route==='work/advanced-lattice-structures'){
          assert.deepEqual(await page.locator('section[aria-label="Related evidence"] a[href^="/professional-portfolio/research/"]').evaluateAll(nodes=>nodes.map(n=>n.getAttribute('href'))),[base+'research/#pub-001',base+'research/#pub-002']);
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
