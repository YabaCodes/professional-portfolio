import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const read=path=>readFile(new URL('../'+path,import.meta.url),'utf8');
test('manual-only release workflow includes the same critical content, asset and browser gates as CI',async()=>{
 const [ci,release]=await Promise.all([
  read('.github/workflows/ci.yml'),read('.github/workflows/deploy.yml')
 ]);
 assert.match(release,/workflow_dispatch:/);
 assert.doesNotMatch(release,/^\s+push:/m);
 assert.doesNotMatch(release,/^\s+pull_request:/m);
 assert.match(release,/github\.ref == 'refs\/heads\/main'/);
 assert.match(release,/name: github-pages/);
 assert.match(release,/scripts\/check-release\.mjs/);
 const ordered=[
  'npm ci','npm run check','npm run test:unit','npm run test:design',
  'npm run build','npm run test:build','npm run test:mvp',
  'npm run test:production-prep','npx playwright install --with-deps chromium',
  'npm run test:links','npm run test:responsive','npm run test:performance'
 ];
 let last=-1;
 for(const command of ordered){
  assert.ok(ci.includes('run: '+command),'CI missing '+command);
  const position=release.indexOf('run: '+command);
  assert.ok(position>last,'Release pipeline missing or out of order: '+command);
  last=position;
 }
 assert.ok(release.indexOf('run: node scripts/check-release.mjs')<release.indexOf('run: npm ci'),
  'Owner/asset gate must precede release build');
 assert.match(release,/git diff --exit-code -- package\.json package-lock\.json config\/release\.json config\/public-facing\.json/);
 assert.match(release,/actions\/upload-pages-artifact@/);
 assert.match(release,/actions\/deploy-pages@/);
});
test('release manifest is the owner-approved published state; contact items unchanged',async()=>{
 const [manifest,publicFacing]=await Promise.all([read('config/release.json'),read('config/public-facing.json')]);
 assert.deepEqual(JSON.parse(manifest),{publicationEnabled:true,approvalReference:'PP-010-001',releaseVersion:'1.5.6'});
 assert.deepEqual(JSON.parse(publicFacing),{
  contact:{status:'approved',label:'Connect on LinkedIn',href:'https://www.linkedin.com/in/yabam',approvalReference:'PP-007B-LINKEDIN-001'},
  email:{status:'approved',label:'Connect by Email',href:'mailto:yeabcb@gmail.com',approvalReference:'PP-008-EMAIL-001'},
  resume:{status:'pending',label:null,assetPath:null,approvalReference:null}
 });
});
