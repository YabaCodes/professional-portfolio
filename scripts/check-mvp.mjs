import assert from 'node:assert/strict';
import {mkdir,readFile,readdir,writeFile,stat} from 'node:fs/promises';
import path from 'node:path';

const root=path.resolve('dist');
const required=['','about','work','expertise','insights','insights/lab','research','contact',
 'work/requirements-to-manufacturing-readiness','work/engineering-for-manufacturing-performance',
 'work/leading-complex-engineering-programs','work/advanced-lattice-structures',
 'insights/lab/manufacturing-performance-oee-analyzer'];
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
assert.deepEqual(counts,{caseStudies:4,competencies:16,publications:3,patents:1,demonstrations:1,insights:0},'Unexpected approved MVP inventory');
const demo=demonstrations[0];
assert.equal(demo.id,'EL-001');assert.equal(demo.evidenceType,'independent-demonstration');
assert.deepEqual(demo.relatedIds,['CS-002']);
const lab=await html('insights/lab/manufacturing-performance-oee-analyzer');
assert.match(lab,/data-el001-analyzer/);assert.match(lab,/Synthetic production inputs/);
assert.match(lab,/Independent technical demonstration/);
assert.match(lab,/Illustrative or simulated results/);
const approvedAssets=JSON.parse(await readFile('config/public-facing.json','utf8'));
assert.deepEqual(approvedAssets,{
 contact:{status:'pending',label:null,href:null,approvalReference:null},
 resume:{status:'pending',label:null,assetPath:null,approvalReference:null},
},'No personal contact destination or résumé asset has received item-level approval');
const insightsPage=await html('insights');
assert.match(insightsPage,/Exploring engineering through evidence and experimentation\./,'Insights landing headline');
assert.match(insightsPage,/data-featured-demonstration="EL-001"/,'Featured accepted lab demonstration');
assert.match(insightsPage,/data-featured-lab-link/,'Functional Lab CTA');
assert.doesNotMatch(insightsPage,/Development specimen|Section foundation|Final professional content has not been approved/,'No development-only Insights shell');
assert.equal(insights.length,0,'Do not fabricate Insights articles');
const designSpecimen=await readFile(path.join(root,'design-system','index.html'),'utf8');
assert.match(designSpecimen,/noindex, nofollow/,'Internal design specimen must remain noindexed');
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
 assert.match(pages[i],/data-prelaunch-footer-notice/,'Missing prelaunch-only disclosure: '+route);
 assert.doesNotMatch(pages[i],/href="\/professional-portfolio\/design-system\/"/,'Internal design specimen must not be linked from public navigation: '+route);
}
const blockers=[
 {id:'CONTACT',owner:'Portfolio owner',phase:'PP-007B',status:'open',requirement:'Exact professional email or profile URL requires item-level publication approval.',closure:'Review exact URL, label, approval reference and final rendered destination before commit.'},
 {id:'RESUME',owner:'Portfolio owner',phase:'PP-007B',status:'open',requirement:'Final publication-safe résumé PDF requires document-level approval.',closure:'Review complete PDF, metadata and every personal/employer claim, then approve exact artifact and link.'},
 {id:'SPECIMEN',owner:'Engineering implementation',phase:'PP-007B',status:'open',requirement:'Internal Design System specimen is still in the prelaunch build, though no longer linked from public navigation.',closure:'Remove specimen from published build and update QA fixtures only in the separately authorized launch PR.'},
 {id:'PRODUCTION_QA',owner:'Portfolio owner and engineering review',phase:'PP-007B',status:'open',requirement:'Manual content/confidentiality and employer-policy review, production SEO, device and screen-reader checks, actual Core Web Vitals, hosting and domain configuration.',closure:'Record actual results and explicit owner sign-off against production URLs and assets.'},
 {id:'RELEASE',owner:'Portfolio owner',phase:'PP-007B',status:'open',requirement:'Pages activation and deployment remain prohibited until separate exact owner authorization.',closure:'Approve main commit SHA and production version, verify protected GitHub Pages configuration and explicitly dispatch authorized release.'},
];
const report={milestone:'PP-007A',version:'0.12.0',mode:'prelaunch',websiteDeployedByThisWorkflow:false,
 catalog:counts,primaryRoutes:required.length,insightsLandingComplete:true,
 contactDetailsPublished:false,resumeAssetPublished:false,internalDesignSpecimenLinked:false,
 publicationEnabled:release.publicationEnabled,launchReady:false,blockingRequirements:blockers};
await mkdir('test-results',{recursive:true});
await writeFile('test-results/mvp-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
console.log('PP-007A prelaunch editorial, privacy, inventory and launch gates PASS; production authorization remains blocked.');
