import assert from 'node:assert/strict';
import { readdir,readFile,stat } from 'node:fs/promises';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const root=path.resolve('dist');
const base='/professional-portfolio/';
const state=JSON.parse(await readFile('config/release.json','utf8'));
async function walk(dir) {
 const out=[];
 for(const entry of await readdir(dir,{withFileTypes:true})) {
  const filename=path.join(dir,entry.name);
  if(entry.isSymbolicLink()) throw new Error('Unexpected symbolic link: '+filename);
  if(entry.isDirectory()) out.push(...await walk(filename));
  else if(entry.isFile()) out.push(filename);
  else throw new Error('Unexpected build entry: '+filename);
 }
 return out;
}
const files=await walk(root);
const byPath=new Map();
for(const file of files)byPath.set(path.relative(root,file).split(path.sep).join('/'),file);
const required=['index.html','favicon.svg','robots.txt'];
const retired=['about','work','expertise','insights','research','contact'];
for(const route of retired)assert.ok(![...byPath.keys()].some(p=>p.startsWith(route+'/')),'Retired route still built: '+route);
for(const name of required)assert.ok(byPath.has(name),'Missing build output '+name);
const htmlFiles=[...byPath].filter(([p])=>p.endsWith('.html'));
const forbidden=/(^|\/)(\.env(?:\.|$)|\.git(?:\/|$)|node_modules(?:\/|$)|package(?:-lock)?\.json$|AGENTS\.md$)|\.(?:pem|key|map|zip|csv|xlsx|docx|step|stp|dwg|dxf)$/i;
for(const [name] of byPath)assert.ok(!forbidden.test(name),'Unexpected output asset: '+name);
let total=0,js=0,css=0;
for(const [name,file] of byPath){
 const data=await readFile(file);total+=data.length;
 if(name.endsWith('.js'))js+=gzipSync(data).length;
 if(name.endsWith('.css'))css+=gzipSync(data).length;
}
for(const [name,file] of htmlFiles){
 const html=await readFile(file,'utf8');
 if(!state.publicationEnabled) assert.match(html,/<meta\s+name="robots"\s+content="noindex, nofollow"/i,'Missing development noindex: '+name);
 else {
  assert.doesNotMatch(html,/<meta[^>]+name="robots"[^>]+content="[^"]*noindex/i,'Production noindex: '+name);
  assert.doesNotMatch(html,/Development specimen|Not authorized for production deployment/i,'Development content: '+name);
 }
 assert.ok(gzipSync(html).length<=64*1024,'HTML budget exceeded: '+name);
}
if(!state.publicationEnabled)assert.match(await readFile(byPath.get('robots.txt'),'utf8'),/Disallow:\s*\//);
else {
 assert.doesNotMatch(await readFile(byPath.get('robots.txt'),'utf8'),/^Disallow:\s*\/\s*$/m,'Production robots.txt blocks crawling');
 assert.ok(!byPath.has('design-system/index.html'),'Development design specimen remains');
}
assert.ok(js<=150*1024,'Total generated JS gzip budget exceeded: '+js);
assert.ok(css<=100*1024,'Total generated CSS gzip budget exceeded: '+css);
assert.ok(total<=12*1024*1024,'Static build size budget exceeded: '+total);
console.log(JSON.stringify({htmlPages:htmlFiles.length,totalBytes:total,gzipJsBytes:js,gzipCssBytes:css,budgets:{totalBytes:12*1024*1024,gzipJsBytes:150*1024,gzipCssBytes:100*1024,gzipHtmlPerPageBytes:64*1024}},null,2));
console.log('Static output, release mode and size budget checks PASS');
