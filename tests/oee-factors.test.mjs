import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateFactorOee} from '../src/lib/engineering/oee-factors.ts';
test('approved hypothetical baseline',()=>{
 const r=calculateFactorOee({availability:90,performance:95,quality:98});
 assert.equal(r.oee,83.79);assert.deepEqual(r.losses,[10,4.5,1.71,83.79]);
 assert.equal(r.largestLoss,'Availability loss');
});
test('boundary cases, ties, and conservation',()=>{
 for(const a of [0,10,50,100])for(const p of [0,10,50,100])for(const q of [0,10,50,100]){
  const r=calculateFactorOee({availability:a,performance:p,quality:q});
  assert.ok(r.losses.every(v=>v>=0&&v<=100));
  assert.ok(Math.abs(r.losses.reduce((x,y)=>x+y,0)-100)<1e-9);
 }
 assert.equal(calculateFactorOee({availability:100,performance:100,quality:100}).largestLoss,'No losses');
 assert.equal(calculateFactorOee({availability:50,performance:0,quality:100}).largestLoss,'Availability loss / Performance loss');
});
test('invalid percentage inputs rejected',()=>{
 for(const v of [-1,101,NaN,Infinity])assert.throws(()=>calculateFactorOee({availability:v,performance:95,quality:98}),RangeError);
});
