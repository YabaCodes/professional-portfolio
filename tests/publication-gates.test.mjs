import test from 'node:test';
import assert from 'node:assert/strict';
import {resolveContact,resolveResume} from '../src/lib/publication-gates.ts';
const pendingContact={status:'pending',label:null,href:null,approvalReference:null};
const pendingResume={status:'pending',label:null,assetPath:null,approvalReference:null};
test('contact and résumé never publish before item-level approval',()=>{
 assert.equal(resolveContact(pendingContact),null);
 assert.equal(resolveResume(pendingResume),null);
 for(const patch of [{href:'https://example.invalid'},{label:'Synthetic'},{approvalReference:'fixture'}]){
  assert.throws(()=>resolveContact({...pendingContact,...patch}),/Pending contact/);
 }
 for(const patch of [{assetPath:'/professional-portfolio/resume.pdf'},{label:'Synthetic'},{approvalReference:'fixture'}]){
  assert.throws(()=>resolveResume({...pendingResume,...patch}),/Pending résumé/);
 }
});
test('approval schema fails closed on missing approval, dangerous URLs and non-PDF assets',()=>{
 const approved={status:'approved',label:'Synthetic contact',approvalReference:'TEST-ONLY'};
 for(const href of ['javascript:alert(1)','http://example.invalid','https://example.invalid','https://www.linkedin.com/feed/','mailto:invalid']) 
  assert.throws(()=>resolveContact({...approved,href}),/approved professional email or profile/);
 assert.throws(()=>resolveContact({...approved,href:'mailto:fixture@example.invalid',approvalReference:''}),/exact item-level approval/);
 assert.deepEqual(resolveContact({...approved,href:'mailto:fixture@example.invalid'}),{label:'Synthetic contact',href:'mailto:fixture@example.invalid'});
 for(const assetPath of ['/public-resume.pdf','/professional-portfolio/resume.docx','/professional-portfolio/../private.pdf','javascript:alert(1)'])
  assert.throws(()=>resolveResume({...approved,assetPath}),/approved PDF/);
 assert.throws(()=>resolveResume({...approved,assetPath:'/professional-portfolio/synthetic.pdf',approvalReference:''}),/asset-level approval/);
 assert.deepEqual(resolveResume({...approved,assetPath:'/professional-portfolio/synthetic.pdf'}),{label:'Synthetic contact',assetPath:'/professional-portfolio/synthetic.pdf'});
});
