import test from 'node:test';
import assert from 'node:assert/strict';
import {assessReadiness} from '../src/lib/engineering/readiness.ts';
const scenario=(ratings,flags)=>ratings.map((maturity,i)=>({label:'Criterion '+(i+1),maturity,mandatory:flags[i]??false}));
test('approved baseline and mandatory blockers',()=>{
 const r=assessReadiness(scenario([3,3,2,1,2,1],[false,false,false,true,false,true]));
 assert.deepEqual(r,{accepted:2,counts:[0,2,2,2],blockers:['Criterion 4','Criterion 6'],status:'Gate blocked'});
});
test('mandatory condition cannot be averaged away; accepted is review only',()=>{
 assert.equal(assessReadiness(scenario([3,3,3,3,3,2],[false,false,false,false,false,true])).status,'Gate blocked');
 assert.equal(assessReadiness(scenario([3,3,3,3,3,2],[])).status,'Review required');
 assert.equal(assessReadiness(scenario([3,3,3,3,3,3],[true,true,true,true,true,true])).status,'Ready for review');
 assert.equal(assessReadiness(scenario([0,0,0,0,0,0],[])).status,'Review required');
});
test('maturity distribution conserves total across all 4096 combinations',()=>{
 for(let i=0;i<4096;i++){const ratings=Array.from({length:6},(_,j)=>(i>>(2*j))&3);const r=assessReadiness(scenario(ratings,[true,false,true,false,false,true]));assert.equal(r.counts.reduce((a,b)=>a+b,0),6);assert.equal(r.accepted,ratings.filter(x=>x===3).length);assert.equal(r.blockers.length,[0,2,5].filter(j=>ratings[j]!==3).length);}
});
test('invalid criteria rejected',()=>{
 for(const bad of [-1,4,1.5,NaN,Infinity])assert.throws(()=>assessReadiness(scenario([bad,3,3,3,3,3],[])),RangeError);
 assert.throws(()=>assessReadiness([]),RangeError);
 const items=scenario([3,3,3,3,3,3],[]);items[0].label=items[1].label;assert.throws(()=>assessReadiness(items),RangeError);
});
