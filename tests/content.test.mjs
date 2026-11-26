import test from 'node:test';
import assert from 'node:assert/strict';
import {validateGraph,validPartialDate} from '../src/lib/content/model.ts';
const make=(id,slug,patch={})=>({id,slug,title:'Synthetic test fixture',summary:'No real claims',pillar:'Engineering & Technology',evidenceType:'professional-experience',publicationStatus:'approved',published:'2026-01-01',references:[],relatedIds:[],...patch});
const role={kind:'career',data:make('CAR-999','fixture')};
test('empty catalog permitted before launch',()=>validateGraph([]));
test('valid cross-collection relation',()=>validateGraph([role,{kind:'career',data:make('CAR-998','fixture-two',{relatedIds:['CAR-999']})}]));
test('graph rejects duplicate IDs, missing/self relations, unapproved records and evidence mismatch',()=>{
 for(const data of [
  [role,role],
  [{...role,data:make('CAR-999','fixture',{relatedIds:['CAR-123']})}],
  [{...role,data:make('CAR-999','fixture',{relatedIds:['CAR-999']})}],
  [{...role,data:make('CAR-999','fixture',{publicationStatus:'draft'})}],
  [{kind:'publications',data:make('PUB-999','fixture')}],
  [{kind:'publications',data:make('PUB-999','fixture',{evidenceType:'published-research'})}],
  [{kind:'career',data:make('CS-999','fixture')}],
  [{...role,data:make('CAR-999','fixture',{revised:'2025-01-01'})}],
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
test('published public records keep their own public references',()=>{
 const pub={kind:'publications',data:make('PUB-999','source-paper',{evidenceType:'published-research',references:[{label:'Synthetic DOI',url:'https://doi.org/10.0000/example'}]})};
 const patent={kind:'patents',data:make('PAT-999','source-grant',{evidenceType:'public-invention',references:[{label:'Synthetic grant',url:'https://example.com/grant'}]})};
 validateGraph([pub,patent]);
 assert.throws(()=>validateGraph([{...pub,data:{...pub.data,references:[]}},patent]),/Public reference required/);
 assert.throws(()=>validateGraph([pub,{...patent,data:{...patent.data,references:[]}}]),/Public reference required/);
});
