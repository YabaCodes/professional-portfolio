import test from 'node:test';
import assert from 'node:assert/strict';
import {validateGraph,validPartialDate} from '../src/lib/content/model.ts';
const make=(id,slug,patch={})=>({id,slug,title:'Synthetic test fixture',summary:'No real claims',pillar:'Engineering & Technology',evidenceType:'independent-demonstration',publicationStatus:'approved',published:'2026-01-01',references:[],relatedIds:[],...patch});
const demo={kind:'demonstrations',data:make('EL-999','fixture')};
test('empty catalog permitted before launch',()=>validateGraph([]));
test('valid cross-collection relation',()=>validateGraph([demo,{kind:'competencies',data:make('COMP-999','fixture',{relatedIds:['EL-999']})}]));
test('graph rejects duplicate IDs, missing/self relations, unapproved records, reserved slug and evidence mismatch',()=>{
 for(const data of [
  [demo,demo],
  [{...demo,data:make('EL-999','fixture',{relatedIds:['EL-123']})}],
  [{...demo,data:make('EL-999','fixture',{relatedIds:['EL-999']})}],
  [{...demo,data:make('EL-999','fixture',{publicationStatus:'draft'})}],
  [{kind:'insights',data:make('INS-999','lab')}],
  [{kind:'publications',data:make('PUB-999','fixture')}],
  [{kind:'publications',data:make('PUB-999','fixture',{evidenceType:'published-research'})}],
  [{kind:'competencies',data:make('COMP-999','fixture')}],
  [{...demo,data:make('EL-999','fixture',{revised:'2025-01-01'})}],
 ]) assert.throws(()=>validateGraph(data));
});

test('calendar precision without fabricated days',()=>{
 for(const d of ['2021','2026-10','2024-02-29'])assert.equal(validPartialDate(d),true);
 for(const d of ['2026-13','2025-02-29','2026-00','2026-2','2026-04-31',''])assert.equal(validPartialDate(d),false);
});
test('owner-confirmed credentials are narrowly permitted without public proof',()=>{
 const cred={kind:'credentials',data:make('CRED-999','fixture',{evidenceType:'public-credential',verificationBasis:'owner-confirmed'})};
 validateGraph([cred]);
 assert.throws(()=>validateGraph([{...cred,data:{...cred.data,verificationBasis:'public-reference'}}]),/Public reference/);
 assert.throws(()=>validateGraph([{kind:'publications',data:make('PUB-999','fixture',{evidenceType:'published-research',verificationBasis:'owner-confirmed'})}]),/Public reference/);
});
