import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,mkdir,stat,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';

const root=path.resolve('dist'),base='/professional-portfolio/';
const types={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml',
 '.woff2':'font/woff2','.woff':'font/woff','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(!url.pathname.startsWith(base)){res.writeHead(404).end();return}
  let file=path.resolve(root,decodeURIComponent(url.pathname.slice(base.length)));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return}
  if((await stat(file)).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'Content-Type':types[path.extname(file)]??'application/octet-stream'}).end(await readFile(file));
 }catch{res.writeHead(404).end()}
});
const routes=['','about','work','expertise','insights','research','contact',
 'insights/lab/manufacturing-performance-oee-analyzer'];
const widths=[390,1440];
await mkdir('test-results',{recursive:true});
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true});
 const origin='http://127.0.0.1:'+server.address().port;
 const results=[];
 for(const width of widths){
  const ctx=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'});
  const page=await ctx.newPage();
  const external=[],failures=[];
  page.on('request',req=>{if(new URL(req.url()).origin!==origin)external.push(req.url())});
  page.on('response',response=>{if(response.status()>=400)failures.push(response.url()+' '+response.status())});
  page.on('pageerror',error=>failures.push(error.message));
  await page.addInitScript(()=>{
   window.__qaPaint={lcp:null,cls:0};
   try{
    new PerformanceObserver(list=>{
     for(const entry of list.getEntries())window.__qaPaint.lcp=entry.startTime;
    }).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(list=>{
     for(const entry of list.getEntries())if(!entry.hadRecentInput)window.__qaPaint.cls+=entry.value;
    }).observe({type:'layout-shift',buffered:true});
   }catch{}
  });
  for(const route of routes){
   external.length=0;failures.length=0;
   const response=await page.goto(origin+base+(route?route+'/':''),{waitUntil:'networkidle'});
   assert.equal(response?.status(),200,'Performance route HTTP status '+route);
   await page.evaluate(()=>document.fonts.ready);
   // Lab values are indicative CI diagnostics, not field Core Web Vitals.
   const performance=await page.evaluate(()=>{
    const nav=performance.getEntriesByType('navigation')[0];
    const paint=performance.getEntriesByName('first-contentful-paint')[0];
    const resources=performance.getEntriesByType('resource');
    return {
     navigationDurationMs:nav?Number(nav.duration.toFixed(1)):null,
     firstContentfulPaintMs:paint?Number(paint.startTime.toFixed(1)):null,
     largestContentfulPaintMs:Number.isFinite(window.__qaPaint?.lcp)?Number(window.__qaPaint.lcp.toFixed(1)):null,
     cumulativeLayoutShift:Number((window.__qaPaint?.cls??0).toFixed(4)),
     localResourceCount:resources.length,
     transferredBytes:resources.reduce((sum,r)=>sum+(r.transferSize||0),0),
     localFontReady:document.fonts.status==='loaded',
     pageOverflow:document.documentElement.scrollWidth>document.documentElement.clientWidth
    };
   });
   assert.deepEqual(failures,[],route+' browser errors');
   assert.deepEqual(external,[],route+' must not load third-party runtime resources');
   assert.equal(performance.pageOverflow,false,route+' responsive layout overflow');
   assert.equal(performance.localFontReady,true,route+' local fonts ready');
   assert.ok(performance.localResourceCount<120,route+' unexpected resource explosion');
   if(['','contact','insights/lab/manufacturing-performance-oee-analyzer'].includes(route)){
    const name=route===''?'home':route==='contact'?'contact':'engineering-lab';
    await page.screenshot({path:'test-results/release-review-'+name+'-'+width+'.png',fullPage:true});
   }
   results.push({route:route||'home',viewportWidth:width,...performance});
   console.log(width+'px / '+(route||'home')+': browser performance diagnostic PASS');
  }
  await ctx.close();
 }
 const data={milestone:'PP-007B.1 / final QA',source:'headless Chromium local built site',
  labOnly:true,fieldCoreWebVitals:false,lighthouseAudit:false,physicalDeviceTested:false,
  manualScreenReaderTested:false,results};
 await writeFile('test-results/performance-diagnostics.json',JSON.stringify(data,null,2)+'\n');
}finally{
 if(browser)await browser.close();
 await new Promise(resolve=>server.close(resolve));
}
