import assert from 'node:assert/strict';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {resolveContact,resolveResume} from '../src/lib/publication-gates.ts';

const root=path.resolve('dist');
const routes=['','about','work','expertise','insights','insights/lab','research','contact',
 'work/requirements-to-manufacturing-readiness','work/engineering-for-manufacturing-performance',
 'work/leading-complex-engineering-programs','work/advanced-lattice-structures',
 'insights/lab/manufacturing-performance-oee-analyzer'];
const html=route=>readFile(path.join(root,route,'index.html'),'utf8');
const pages=await Promise.all(routes.map(html));
const readJson=async file=>JSON.parse(await readFile(file,'utf8'));
const [release,publicFacing,packageInfo]=await Promise.all([
 readJson('config/release.json'),readJson('config/public-facing.json'),readJson('package.json')]);
assert.equal(typeof release.publicationEnabled,'boolean','Release flag must be boolean');
const prelaunch=release.publicationEnabled===false;
if(prelaunch)assert.deepEqual(release,{publicationEnabled:false,approvalReference:null,releaseVersion:null});
else {
 assert.ok(/^PP-007[A-Z]?(?:-[0-9]{3})?$/.test(release.approvalReference??''),'Production approval reference is missing');
 assert.equal(release.releaseVersion,packageInfo.version,'Production version must be exact');
 assert.ok(Number(packageInfo.version.split('.')[0])>=1,'Production version must be v1.x+');
}
const approvedContact=resolveContact(publicFacing.contact);
const approvedResume=resolveResume(publicFacing.resume);
if(prelaunch){
 assert.deepEqual(publicFacing,{
  contact:{status:'approved',label:'Connect on LinkedIn',href:'https://www.linkedin.com/in/yabam',approvalReference:'PP-007B-LINKEDIN-001'},
  resume:{status:'pending',label:null,assetPath:null,approvalReference:null}
 },'Prelaunch must contain only the exact separately approved LinkedIn destination and no résumé');
 assert.deepEqual(approvedContact,{label:'Connect on LinkedIn',href:'https://www.linkedin.com/in/yabam'});
 assert.equal(approvedResume,null);
}else {
 assert.ok(approvedContact&&approvedResume,'Production requires separately approved contact and résumé');
}
for(const [index,page] of pages.entries()){
 if(prelaunch)assert.match(page,/name="robots" content="noindex, nofollow"/,'Missing prelaunch noindex '+routes[index]);
 else assert.doesNotMatch(page,/<meta[^>]+name="robots"[^>]+noindex/i,'Production page must not be noindexed: '+routes[index]);
 assert.match(page,/data-contact-callout/,'Missing contact navigation: '+routes[index]);
 if(prelaunch)assert.match(page,/data-prelaunch-footer-notice/,'Missing review disclosure: '+routes[index]);
 else assert.doesNotMatch(page,/data-prelaunch-footer-notice|Development specimen|Not authorized for production deployment/i,
  'Production may not contain development labels: '+routes[index]);
 assert.doesNotMatch(page,/href="\/professional-portfolio\/design-system\//,'Internal fixture link forbidden: '+routes[index]);
}
const readCollection=async name=>readJson('src/content/'+name+'.json');
const [cases,competencies,publications,patents,demonstrations,insights]=await Promise.all(
 ['case-studies','competencies','publications','patents','demonstrations','insights'].map(readCollection));
const counts={caseStudies:cases.length,competencies:competencies.length,
 publications:publications.length,patents:patents.length,
 demonstrations:demonstrations.length,insights:insights.length};
assert.deepEqual(counts,{caseStudies:4,competencies:16,publications:3,
 patents:1,demonstrations:1,insights:0},'Approved evidence inventory changed');
assert.equal(demonstrations[0].id,'EL-001');
assert.equal(demonstrations[0].evidenceType,'independent-demonstration');
assert.deepEqual(demonstrations[0].relatedIds,['CS-002']);
const lab=await html('insights/lab/manufacturing-performance-oee-analyzer');
assert.match(lab,/data-el001-analyzer/);
assert.match(lab,/Synthetic production inputs/);
assert.match(lab,/Independent technical demonstration/);
assert.match(lab,/Illustrative or simulated results/);
const insightsPage=await html('insights');
assert.match(insightsPage,/Exploring engineering through evidence and experimentation\./);
assert.match(insightsPage,/data-featured-demonstration="EL-001"/);
assert.match(insightsPage,/data-featured-lab-link/);
assert.doesNotMatch(insightsPage,/Development specimen|Section foundation|Final professional content has not been approved/);
const contact=await html('contact');
assert.match(contact,/Connect on engineering, technology and delivery\./);
assert.doesNotMatch(contact,/<form\b/i,'No unapproved data collection/contact form');
if(prelaunch){
 assert.equal((contact.match(/data-contact-state="approved"/g)??[]).length,1);
 assert.equal((contact.match(/data-resume-state="pending-approval"/g)??[]).length,1);
 assert.match(contact,/data-approved-contact-link/);
 assert.ok(contact.includes('href="'+approvedContact.href+'"'),'The exact approved LinkedIn URL must render');
 assert.ok(contact.includes('Connect on LinkedIn'),'The exact approved link label must render');
 assert.doesNotMatch(contact,/<a\b[^>]*href="(?:mailto:|tel:)/i,'Unapproved direct email/phone');
 assert.doesNotMatch(contact,/<a\b[^>]*(?:\bdownload\b|href="[^"]*\.(?:pdf|docx)(?:[#?][^"]*)?")/i,'Unapproved résumé link');
 assert.equal((contact.match(/href="https:\/\/www\.linkedin\.com\/in\/yabam"/g)??[]).length,1,'One explicitly approved LinkedIn destination only');
}else{
 assert.match(contact,/data-contact-state="approved"/);
 assert.match(contact,/data-resume-state="approved"/);
 assert.ok(contact.includes('href="'+approvedContact.href+'"'),'Exact authorized contact destination missing');
 assert.ok(contact.includes('href="'+approvedResume.assetPath+'"'),'Exact authorized résumé URL missing');
 assert.match(contact,/data-approved-contact-link/);
 assert.match(contact,/data-approved-resume-link/);
 assert.doesNotMatch(contact,/data-contact-state="pending-approval"|data-resume-state="pending-approval"/);
}
async function collect(dir){
 const names=[];
 for(const item of await readdir(dir,{withFileTypes:true})){
  const file=path.join(dir,item.name);
  if(item.isDirectory())names.push(...await collect(file));
  else if(item.isFile())names.push(path.relative(root,file).replaceAll(path.sep,'/'));
 }
 return names;
}
const assets=await collect(root);
const pdfs=assets.filter(p=>/\.pdf$/i.test(p));
if(prelaunch)assert.deepEqual(pdfs,[],'No unapproved PDF may enter a prelaunch artifact');
else {
 const approvedPath=approvedResume.assetPath.replace(/^\/professional-portfolio\//,'');
 assert.deepEqual(pdfs,[approvedPath],'Exactly one approved public résumé PDF may be deployed');
}
assert.equal(assets.includes('design-system/index.html'),prelaunch,
 'Internal specimen must exist only in prelaunch build');
if(prelaunch)assert.match(await html('design-system'),/noindex, nofollow/);
const robots=await readFile(path.join(root,'robots.txt'),'utf8');
if(prelaunch)assert.match(robots,/Disallow:\s*\//);
else {assert.match(robots,/Allow:\s*\//);assert.doesNotMatch(robots,/Disallow:\s*\//)}
const blockers=[
 {id:'B01-CONTACT',status:'exact-LinkedIn-destination-approved-for-public-repository'},
 {id:'B02-RESUME',status:prelaunch?'pending-exact-pdf':'structure-verified-manual-document-review-required'},
 {id:'B03-SPECIMEN',status:prelaunch?'production-filter-prepared':'excluded-from-artifact'},
 {id:'B04-QA',status:'manual-device-accessibility-performance-and-confidentiality-open'},
 {id:'B05-LAUNCH',status:'owner-release-authorization-required'}
];
const report={milestone:'PP-007B.1 / final QA',version:packageInfo.version,
 mode:prelaunch?'prelaunch':'production-candidate',
 websiteDeployedByThisWorkflow:false,approvedEvidence:counts,primaryRoutes:routes.length,
 releaseEnabled:release.publicationEnabled,contactAssetState:'exact-LinkedIn-approved-for-public-repository',
 resumeAssetState:prelaunch?'pending':'approved-structure-only',
 automatedContentAndPrivacyChecksPassed:true,
 manualAccessibilityCertified:false,fieldCoreWebVitalsVerified:false,
 launchReady:false,blockingRequirements:blockers};
await mkdir('test-results',{recursive:true});
await writeFile('test-results/mvp-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
console.log('Evidence inventory, contact/résumé authorization states, prelaunch/production assets and disclosure gates PASS');
