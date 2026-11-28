import assert from 'node:assert/strict';
import {readFile,readdir,mkdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
const root=path.resolve('dist');
const release=JSON.parse(await readFile('config/release.json','utf8'));
const facing=JSON.parse(await readFile('config/public-facing.json','utf8'));
const pkg=JSON.parse(await readFile('package.json','utf8'));
assert.equal(typeof release.publicationEnabled,'boolean','Publication flag must be explicitly boolean');
const prelaunch=!release.publicationEnabled;
if(prelaunch)assert.deepEqual(release,{publicationEnabled:false,approvalReference:null,releaseVersion:null});
else assert.deepEqual(release,{publicationEnabled:true,approvalReference:'PP-010-001',releaseVersion:pkg.version});
{
 assert.deepEqual(facing,{
  contact:{status:'approved',label:'Connect on LinkedIn',href:'https://www.linkedin.com/in/yabam',approvalReference:'PP-007B-LINKEDIN-001'},
  email:{status:'approved',label:'Connect by Email',href:'mailto:yeabcb@gmail.com',approvalReference:'PP-008-EMAIL-001'},
  resume:{status:'pending',label:null,assetPath:null,approvalReference:null}
 },'Only the approved LinkedIn and email destinations; résumé not published');
}
async function collect(dir){
 const entries=[];
 for(const item of await readdir(dir,{withFileTypes:true})){
  const full=path.join(dir,item.name);
  if(item.isDirectory())entries.push(...await collect(full));
  else if(item.isFile())entries.push(path.relative(root,full).replaceAll(path.sep,'/'));
 }
 return entries;
}
const assets=await collect(root);
const pages=assets.filter(p=>p.endsWith('/index.html')||p==='index.html').sort();
const contentPages=pages.filter(p=>p!=='design-system/index.html');
assert.deepEqual(contentPages,['index.html'],'Expected the single approved one-page résumé');
assert.ok(prelaunch?pages.includes('design-system/index.html'):!pages.includes('design-system/index.html'),
 'Design specimen must exist only in the prelaunch QA artifact');
assert.ok(!assets.some(file=>/\.(?:pdf|docx|xlsx|csv|key|pem)$/i.test(file)) || !prelaunch,
 'Unapproved document or data assets must not be included in prelaunch output');
const expectedBase='https://yabacodes.github.io/professional-portfolio/';
function tag(html,tagName,attrName,attrValue) {
 const nodes=html.match(new RegExp('<'+tagName+'\\b[^>]*>','gi'))??[];
 return nodes.find(node=>node.includes(attrName+'="'+attrValue+'"'))??null;
}
function attr(node,name) {return node?.match(new RegExp('\\b'+name+'="([^"]*)"'))?.[1]??null;}
const errors=[];
for(const page of contentPages){
 const html=await readFile(path.join(root,page),'utf8');
 const route=page==='index.html'?'':page.slice(0,-'index.html'.length);
 const canonical=expectedBase+route;
 const found={
  lang:/<html\s+lang="en"/.test(html),
  title:/<title>[^<]+<\/title>/.test(html),
  description:attr(tag(html,'meta','name','description'),'content'),
  canonical:attr(tag(html,'link','rel','canonical'),'href'),
  ogTitle:attr(tag(html,'meta','property','og:title'),'content'),
  ogDescription:attr(tag(html,'meta','property','og:description'),'content'),
  ogUrl:attr(tag(html,'meta','property','og:url'),'content'),
  twitterCard:attr(tag(html,'meta','name','twitter:card'),'content'),
  robots:attr(tag(html,'meta','name','robots'),'content'),
 };
 const valid=found.lang&&found.title&&found.description&&found.ogTitle&&found.ogDescription&&
  found.twitterCard==='summary'&&found.canonical===canonical&&found.ogUrl===canonical&&
  (prelaunch?found.robots==='noindex, nofollow':!found.robots);
 if(!valid)errors.push({route:page,problem:'Metadata, canonical URL, or indexing-state mismatch',actual:found});
 assert.ok(!/href="\/professional-portfolio\/design-system\//.test(html),page+' exposes internal design specimen navigation');
 if(prelaunch)assert.match(html,/data-prelaunch-footer-notice/,page+' must carry prelaunch notice');
 else assert.doesNotMatch(html,/data-prelaunch-footer-notice/,page+' must omit prelaunch notice');
}
assert.deepEqual(errors,[],'Metadata and indexing review failed');
const robots=await readFile(path.join(root,'robots.txt'),'utf8');
if(prelaunch)assert.match(robots,/Disallow:\s*\//);
else {assert.match(robots,/Allow:\s*\//);assert.doesNotMatch(robots,/Disallow:\s*\//)}
const blockers=[
 {id:'B01-CONTACT',owner:'Portfolio owner',status:facing.contact.status==='approved'&&facing.email?.status==='approved'?'approved-scope-only':'open',closure:'Exact publication-approved destination, label, review reference and rendered link audit'},
 {id:'B02-RESUME',owner:'Portfolio owner',status:facing.resume.status==='approved'?'approved-scope-only':prelaunch?'open':'launch-without-resume-approved',closure:'Exact PDF approval, source confidentiality, metadata/links and file integrity review'},
 {id:'B03-SPECIMEN',owner:'Engineering reviewer',status:prelaunch?'production-filter-prepared':'production-exclusion-verified',closure:'Approved production artifact must omit internal specimen; final build review'},
 {id:'B04-MANUAL-QA',owner:'Portfolio owner and engineering reviewer',status:'open',closure:'Real keyboard, assistive technology, physical-device, claim review and measured performance evidence'},
 {id:'B05-LAUNCH',owner:'Portfolio owner',status:prelaunch?'not-authorized':'authorized-'+release.approvalReference,closure:'Final main SHA/version, hosting protection, launch approval and authorized manual dispatch'}
];
const result={
 milestone:'PP-010',candidateVersion:pkg.version,
 releaseEnabled:release.publicationEnabled,mode:prelaunch?'prelaunch':'production',
 checkedContentPages:contentPages.length,
 designSpecimenInStaticOutput:pages.includes('design-system/index.html'),
 metadataAndIndexingChecks:'passed',privacyGate:prelaunch?'exact-LinkedIn-and-email-approved-resume-locked':'approval-reference-required',
 manualAccessibilityTested:false,realCoreWebVitalsMeasured:false,productionHostnameVerified:false,
 launchReady:false,blockingRequirements:blockers,
};
await mkdir('test-results',{recursive:true});
await writeFile('test-results/production-prep-audit.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify(result,null,2));
