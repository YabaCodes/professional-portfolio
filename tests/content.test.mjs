import test from 'node:test';
import assert from 'node:assert/strict';
import {validateGraph} from '../src/lib/content/model.ts';
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
