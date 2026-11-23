import test from 'node:test';
import assert from 'node:assert/strict';
import {validateGraph,validPartialDate,supportingCompetencies} from '../src/lib/content/model.ts';
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


test('competencies inherit matching evidence classification, without duplicating source references',()=>{
 const research={kind:'case-studies',data:make('CS-999','research',{evidenceType:'published-research',references:[{label:'Synthetic reference',url:'https://example.com/research'}]})};
 const comp={kind:'competencies',data:make('COMP-999','research-skill',{evidenceType:'published-research',relatedIds:['CS-999']})};
 validateGraph([research,comp]);
 assert.deepEqual(supportingCompetencies([research,comp],'CS-999').map(e=>e.data.id),['COMP-999']);
 assert.throws(()=>validateGraph([research,{...comp,data:{...comp.data,evidenceType:'professional-experience'}}]),/classification lacks matching support/);
 assert.throws(()=>validateGraph([{...research,data:{...research.data,references:[]}},comp]),/Public reference required/);
 const nested={kind:'competencies',data:make('COMP-998','nested',{evidenceType:'published-research',relatedIds:['COMP-999']})};
 assert.throws(()=>validateGraph([research,comp,nested]),/direct supporting evidence/);
});

test('published public records support relationships without inventing additional sources',()=>{
 const pub={kind:'publications',data:make('PUB-999','source-paper',{evidenceType:'published-research',references:[{label:'Synthetic DOI',url:'https://doi.org/10.0000/example'}]})};
 const patent={kind:'patents',data:make('PAT-999','source-grant',{evidenceType:'public-invention',references:[{label:'Synthetic grant',url:'https://example.com/grant'}]})};
 const caseStudy={kind:'case-studies',data:make('CS-998','source-case',{evidenceType:'published-research',references:pub.data.references,relatedIds:['PUB-999']})};
 const skill={kind:'competencies',data:make('COMP-997','source-skill',{evidenceType:'published-research',relatedIds:['CS-998','PUB-999','PAT-999']})};
 validateGraph([pub,patent,caseStudy,skill]);
 assert.deepEqual(supportingCompetencies([pub,patent,caseStudy,skill],'PUB-999').map(e=>e.data.id),['COMP-997']);
 assert.deepEqual(supportingCompetencies([pub,patent,caseStudy,skill],'PAT-999').map(e=>e.data.id),['COMP-997']);
 assert.throws(()=>validateGraph([{...pub,data:{...pub.data,references:[]}},patent,caseStudy,skill]),/Public reference required/);
});
