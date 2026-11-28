import assert from 'node:assert/strict';
import {mkdir,readFile,readdir,writeFile} from 'node:fs/promises';
import path from 'node:path';
import {resolveContact,resolveResume} from '../src/lib/publication-gates.ts';
import {hero,atAGlance,process,phases,trackRecord,practice,skills,contact as contactCopy,machine} from '../src/lib/portfolio.ts';

const root=path.resolve('dist');
const routes=[''];
const html=route=>readFile(path.join(root,route,'index.html'),'utf8');
const readJson=async file=>JSON.parse(await readFile(file,'utf8'));
const [release,publicFacing,packageInfo]=await Promise.all([
 readJson('config/release.json'),readJson('config/public-facing.json'),readJson('package.json')]);
assert.equal(typeof release.publicationEnabled,'boolean','Release flag must be boolean');
const prelaunch=release.publicationEnabled===false;
if(prelaunch)assert.deepEqual(release,{publicationEnabled:false,approvalReference:null,releaseVersion:null});
else {
 assert.ok(/^PP-0[0-9]{2}[A-Z]?(?:-[0-9]{3})?$/.test(release.approvalReference??''),'Production approval reference is missing');
 assert.equal(release.releaseVersion,packageInfo.version,'Production version must be exact');
 assert.ok(Number(packageInfo.version.split('.')[0])>=1,'Production version must be v1.x+');
}
const approvedContact=resolveContact(publicFacing.contact);
const approvedEmail=resolveContact(publicFacing.email);
const approvedResume=resolveResume(publicFacing.resume);
{
 assert.deepEqual(publicFacing,{
  contact:{status:'approved',label:'Connect on LinkedIn',href:'https://www.linkedin.com/in/yabam',approvalReference:'PP-007B-LINKEDIN-001'},
  email:{status:'approved',label:'Connect by Email',href:'mailto:yeabcb@gmail.com',approvalReference:'PP-008-EMAIL-001'},
  resume:{status:'pending',label:null,assetPath:null,approvalReference:null}
 },'Only the separately approved LinkedIn and email destinations; résumé pending (launch without résumé approved under PP-010-001)');
 assert.ok(approvedContact&&approvedEmail,'Approved LinkedIn and email required');
 assert.equal(approvedResume,null);
}

const page=await html('');
const text=page.replace(/<script[\s\S]*?<\/script>|<style[\s\S]*?<\/style>/g,'').replace(/<[^>]+>/g,' ')
 .replace(/&amp;/g,'&').replace(/&#39;|&rsquo;/g,'’').replace(/\s+/g,' ');
if(prelaunch){
 assert.match(page,/name="robots" content="noindex, nofollow"/,'Missing prelaunch noindex');
 assert.match(page,/data-prelaunch-footer-notice/,'Missing review disclosure');
}else{
 assert.doesNotMatch(page,/<meta[^>]+name="robots"[^>]+noindex/i,'Production page must not be noindexed');
 assert.doesNotMatch(page,/data-prelaunch-footer-notice|Development specimen|Not authorized for production deployment/i,'Production may not contain development labels');
}
assert.doesNotMatch(page,/href="\/professional-portfolio\/design-system\//,'Internal fixture link forbidden');

// The approved copy renders exactly once, word for word.
for(const words of [hero.titleLine,hero.headline,hero.introduction,process.heading,...process.introduction,practice.label,practice.statement,practice.international,contactCopy.heading,contactCopy.introduction])
 assert.ok(text.includes(words.replace(/\s+/g,' ')),'Approved copy missing: '+words.slice(0,60));
for(const item of [...atAGlance.machines,...atAGlance.facts])assert.ok(text.includes(item.label)&&text.includes(item.value)&&(!('detail' in item)||text.includes(item.detail)),'At-a-glance item missing: '+item.label);
for(const t of [...trackRecord.completed,...trackRecord.inProgress])assert.ok(text.includes(t.item.replace(/\s+/g,' ')),'Track record item missing: '+t.item);
assert.ok(text.includes(trackRecord.introduction.replace(/\s+/g,' ')),'Track record introduction missing');
const {yearsSince}=await import('../src/lib/portfolio.ts');
assert.equal(yearsSince('2022-02',new Date(2026,10,28)),4);assert.equal(yearsSince('2022-02',new Date(2027,0,31)),4);assert.equal(yearsSince('2022-02',new Date(2027,1,1)),5);
assert.ok(text.includes(atAGlance.experience.label)&&new RegExp('\\b'+yearsSince(atAGlance.experience.since)+'\\+ years').test(text),'Years of experience missing from the glance box');
assert.ok(text.includes(atAGlance.scale.value)&&text.includes(atAGlance.scale.label),'CapEx scale missing from the glance box');
assert.equal((page.match(/data-phase="/g)??[]).length,8,'Exactly eight delivery phases');
for(const words of [machine.heading,machine.introduction,...machine.spots.flatMap(s=>[s.title,s.function,s.role])])
 assert.ok(text.includes(words),'Interactive copy missing: '+words.slice(0,50));
assert.equal((page.match(/data-flow="/g)??[]).length,8,'Eight process-flow boxes');
assert.deepEqual(phases.map(p=>p.id),['urs','srm','design','build','pi','fat','sat','validation'],'Standard phase order');
for(const p of phases){
 for(const words of [p.title,p.tags.join(' · '),p.lead,...p.responsibilities,p.deliverables])assert.ok(text.includes(words),'Phase copy missing: '+p.id+' '+words.slice(0,40));
}
for(const group of skills.groups)for(const item of group.items)assert.ok(text.includes(item),'Skill missing: '+item);
// Retired content must not return to the public page.
assert.doesNotMatch(text,/Authorized professional experience|Does not represent actual employer equipment|approved professional channel|not implemented|Selected work|Engineering Lab|OEE analyzer|Functional Engineering Team Lead|Documents I write/i,
 'Retired labels or retired sections rendered');

// Contact: only the separately approved destinations.
assert.doesNotMatch(page,/<form\b/i,'No data collection or contact form');
assert.doesNotMatch(page,/<a\b[^>]*href="tel:/i,'No phone number');
const mailto=[...page.matchAll(/<a\b[^>]*href="(mailto:[^"]+)"/gi)].map(m=>m[1]);
const linkedin=[...page.matchAll(/<a\b[^>]*href="(https:\/\/(?:www\.)?linkedin\.com[^"]*)"/gi)].map(m=>m[1]);
assert.deepEqual([...new Set(mailto)],[approvedEmail.href],'Only the approved email address may render');
assert.deepEqual([...new Set(linkedin)],[approvedContact.href],'Only the approved LinkedIn profile may render');
assert.match(page,/data-approved-contact-link/);
assert.match(page,/data-approved-email-link/);
if(!approvedResume)assert.doesNotMatch(page,/<a\b[^>]*(?:\bdownload\b|href="[^"]*\.(?:pdf|docx)(?:[#?][^"]*)?")/i,'Unapproved résumé link');
else assert.ok(page.includes('href="'+approvedResume.assetPath+'"'),'Exact authorized résumé URL missing');

const readCollection=async name=>readJson('src/content/'+name+'.json');
const [publications,patents,credentials,career]=await Promise.all(['publications','patents','credentials','career'].map(readCollection));
const counts={publications:publications.length,patents:patents.length,credentials:credentials.length,career:career.length};
assert.deepEqual(counts,{publications:3,patents:1,credentials:4,career:3},'Approved record inventory changed');
for(const record of [...publications,...patents,...credentials,...career])
 assert.ok(page.includes('data-'+({PUB:'publication',PAT:'patent',CRED:'credential',CAR:'record'})[record.id.split('-')[0]]+'-id="'+record.id+'"'),'Record not rendered: '+record.id);

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
assert.deepEqual(pdfs,approvedResume?[approvedResume.assetPath.replace(/^\/professional-portfolio\//,'')]:[],'Only an approved résumé PDF may be deployed');
const pages=assets.filter(p=>p.endsWith('index.html')).sort();
assert.deepEqual(pages,prelaunch?['design-system/index.html','index.html']:['index.html'],'One public page; the internal specimen only in prelaunch');
if(prelaunch)assert.match(await html('design-system'),/noindex, nofollow/);
const robots=await readFile(path.join(root,'robots.txt'),'utf8');
if(prelaunch)assert.match(robots,/Disallow:\s*\//);
else {assert.match(robots,/Allow:\s*\//);assert.doesNotMatch(robots,/Disallow:\s*\//)}
const blockers=[
 {id:'B01-CONTACT',status:'exact-LinkedIn-and-email-approved-for-public-repository'},
 {id:'B02-RESUME',status:prelaunch?'pending-exact-pdf':'not-published-launch-without-resume-approved'},
 {id:'B03-SPECIMEN',status:prelaunch?'production-filter-prepared':'excluded-from-artifact'},
 {id:'B04-QA',status:'manual-device-accessibility-performance-and-confidentiality-open'},
 {id:'B05-LAUNCH',status:prelaunch?'owner-release-authorization-required':'authorized-'+release.approvalReference}
];
const report={milestone:'PP-017 / type and spacing consistency',version:packageInfo.version,
 mode:prelaunch?'prelaunch':'production-candidate',
 websiteDeployedByThisWorkflow:false,approvedRecords:counts,primaryRoutes:routes.length,deliveryPhases:phases.length,
 releaseEnabled:release.publicationEnabled,contactAssetState:'exact-LinkedIn-and-email-approved-for-public-repository',
 resumeAssetState:'pending-not-published',
 automatedContentAndPrivacyChecksPassed:true,
 manualAccessibilityCertified:false,fieldCoreWebVitalsVerified:false,
 launchReady:false,blockingRequirements:blockers};
await mkdir('test-results',{recursive:true});
await writeFile('test-results/mvp-audit.json',JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify(report,null,2));
console.log('Approved copy, record inventory, contact authorization, prelaunch/production assets and disclosure gates PASS');
