import assert from 'node:assert/strict';
import {mkdir,readFile,readdir,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve('dist');
const required=['','about','work','expertise','insights','insights/lab','research','contact',
 'work/requirements-to-manufacturing-readiness','work/engineering-for-manufacturing-performance',
 'work/leading-complex-engineering-programs','work/advanced-lattice-structures'];
const html=async(route)=>readFile(path.join(root,route,'index.html'),'utf8');
const pages=await Promise.all(required.map(html));
const release=JSON.parse(await readFile('config/release.json','utf8'));
assert.deepEqual(release,{publicationEnabled:false,approvalReference:null,releaseVersion:null},'Prelaunch release gate must remain closed');
for(let i=0;i<pages.length;i++)assert.match(pages[i],/name="robots" content="noindex, nofollow"/,'Prelaunch indexing protection missing: '+required[i]);
const readCollection=async(name)=>JSON.parse(await readFile('src/content/'+name+'.json','utf8'));
const [cases,competencies,publications,patents,demonstrations,insights]=await Promise.all(
 ['case-studies','competencies','publications','patents','demonstrations','insights'].map(readCollection));
const counts={caseStudies:cases.length,competencies:competencies.length,publications:publications.length,patents:patents.length,
 demonstrations:demonstrations.length,insights:insights.length};
assert.deepEqual(counts,{caseStudies:4,competencies:16,publications:3,patents:1,demonstrations:0,insights:0},'Unexpected approved MVP inventory');
const contact=await html('contact');
assert.match(contact,/data-contact-state="pending-approval"/);
assert.match(contact,/data-resume-state="pending-approval"/);
assert.match(contact,/Connect on engineering, technology and delivery\./);
assert.doesNotMatch(contact,/<form\b/i,'Contact form without approval');
assert.doesNotMatch(contact,/<a\b[^>]*href="(?:mailto:|tel:|https:\/\/(?:www\.)?linkedin\.com)/i,'Unapproved direct contact destination');
assert.doesNotMatch(contact,/<a\b[^>]*(?:\bdownload\b|href="[^"]*\.(?:pdf|docx)(?:[#?][^"]*)?")/i,'Unapproved résumé link or downloadable asset');
assert.equal((contact.match(/data-contact-state="pending-approval"/g)??[]).length,1);
async function collect(dir){
 const files=[];
 for(const e of await readdir(dir,{withFileTypes:true})){
  const f=path.join(dir,e.name);
  if(e.isDirectory())files.push(...await collect(f));else if(e.isFile())files.push(path.relative(root,f).replaceAll(path.sep,'/'));
 }
 return files;
}
const assets=await collect(root);
assert.ok(!assets.some(p=>/(?:^|\/)(?:resume|résumé|cv|curriculum[-_ ]?vitae)[^/]*\.(?:pdf|docx)$/i.test(p)),'Unapproved résumé asset emitted');
for(const [i,route] of required.entries()){
 assert.match(pages[i],/data-contact-callout/,'Missing cross-site contact navigation: '+route);
}
const blockers=[
 {id:'CONTACT',phase:'PP-005F/PP-007',requirement:'Exact public email or professional profile URL must receive item-level publication approval.'},
 {id:'RESUME',phase:'PP-005F/PP-007',requirement:'Publication-safe final résumé PDF must receive file-level approval before any downloadable asset is added.'},
 {id:'ENGINEERING_LAB',phase:'PP-006',requirement:'At least one complete independently developed functional engineering demonstration must be implemented and accepted; the CS-002 example does not satisfy this launch requirement.'},
 {id:'INSIGHTS',phase:'PP-006/PP-007',requirement:'Empty Insights content and development-only pages must be resolved for launch.'},
 {id:'PUBLICATION',phase:'PP-007',requirement:'Separate owner approval, confidentiality/employer-policy review where applicable, production SEO, accessibility/device review, performance measurements and GitHub Pages release gate are required.'},
];
const report={milestone:'PP-005F',version:'0.10.0',mode:'prelaunch',websiteDeployedByThisWorkflow:false,
 catalog:counts,primaryRoutes:required.length,contactDetailsPublished:false,resumeAssetPublished:false,
 publicationEnabled:release.publicationEnabled,launchReady:false,blockingRequirements:blockers};
await mkdir('test-results',{recursive:true});
await writeFile('test-results/mvp-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
console.log('PP-005F prelaunch MVP inventory and confidentiality assertions PASS; launch blockers remain intentionally unresolved.');
