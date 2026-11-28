import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {readFile,readdir,stat} from 'node:fs/promises';
import path from 'node:path';
import {chromium} from 'playwright';
const root=path.resolve('dist'),base='/';
const type={'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript','.svg':'image/svg+xml','.woff2':'font/woff2','.woff':'font/woff','.png':'image/png','.jpg':'image/jpeg','.webp':'image/webp'};
const server=createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(!url.pathname.startsWith(base)){res.writeHead(404).end();return;}
  let file=path.resolve(root,decodeURIComponent(url.pathname.slice(base.length)));
  if(file!==root&&!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}
  if((await stat(file)).isDirectory())file=path.join(file,'index.html');
  res.writeHead(200,{'Content-Type':type[path.extname(file)]??'application/octet-stream'}).end(await readFile(file));
 }catch{res.writeHead(404).end();}
});
async function htmlPaths(dir){
 const result=[];
 for(const e of await readdir(dir,{withFileTypes:true})){
  const p=path.join(dir,e.name);
  if(e.isDirectory())result.push(...await htmlPaths(p));else if(e.name.endsWith('.html'))result.push(p);
 }
 return result;
}
await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
let browser;
try{
 browser=await chromium.launch({headless:true});
 const context=await browser.newContext();
 const origin='http://127.0.0.1:'+server.address().port;
 const pages=new Map(),links=[];
 let external=0;
 const page=await context.newPage();
 for(const p of await htmlPaths(root)){
  const route=path.relative(root,p).split(path.sep).join('/').replace(/(^|\/)index\.html$/,'$1');
  const url=origin+base+route;
  const errors=[];
  const monitor=response=>{if(response.status()>=400)errors.push(response.url()+' '+response.status());};
  page.on('response',monitor);
  const response=await page.goto(url,{waitUntil:'networkidle'});
  assert.equal(response.status(),200,url);
  const snapshot=await page.evaluate(()=>({
    ids:[...document.querySelectorAll('[id]')].map(n=>n.id),
    urls:[...document.querySelectorAll('a[href],link[rel="icon"],link[rel="stylesheet"],img[src],script[src]')].map(n=>({value:n.getAttribute('href')??n.getAttribute('src'),tag:n.tagName}))
  }));
  assert.equal(snapshot.ids.length,new Set(snapshot.ids).size,'Duplicate fragment ID '+url);
  pages.set(new URL(url).pathname,new Set(snapshot.ids));
  page.off('response',monitor);assert.deepEqual(errors,[],url);
  for(const item of snapshot.urls){
   const dest=new URL(item.value,url);
   if(dest.origin===origin)links.push({from:url,dest});
   else if(dest.protocol==='https:' && item.tag==='A')external++;
   else if(dest.protocol==='mailto:' && item.tag==='A')external++;
   else if(dest.protocol!=='data:')throw new Error('Unexpected external resource or scheme '+item.value);
  }
 }
 for(const {from,dest} of links){
  assert.ok(dest.pathname.startsWith(base),from+' links outside base: '+dest.href);
  const response=await context.request.get(dest.href);
  assert.equal(response.status(),200,from+' broken link '+dest.href);
  if(dest.hash){
   const ids=pages.get(dest.pathname)??pages.get(dest.pathname.replace(/index\.html$/,''));
   assert.ok(ids?.has(decodeURIComponent(dest.hash.slice(1))),from+' missing fragment '+dest.href);
  }
 }
 await context.close();
 console.log('Verified '+pages.size+' HTML pages and '+links.length+' internal link/asset occurrences; '+external+' external reference occurrences require separate review.');
}finally{if(browser)await browser.close();await new Promise(resolve=>server.close(resolve));}
