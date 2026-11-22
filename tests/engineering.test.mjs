import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateOee} from '../src/lib/engineering/oee.ts';
const sample={plannedMinutes:100,operatingMinutes:90,idealMinutesPerUnit:.9,totalUnits:95,goodUnits:93};
const close=(a,b)=>assert.ok(Math.abs(a-b)<1e-9,`${a} ≠ ${b}`);
test('nominal model and sequential loss conservation',()=>{
 const r=calculateOee(sample);close(r.availability,.9);close(r.performance,.95);close(r.quality,93/95);close(r.oee,.837);
 close(r.oee,r.availability*r.performance*r.quality);close(Object.values(r.losses).reduce((a,b)=>a+b,0),1);
});
test('zero production has defined OEE and undefined quality',()=>{
 const r=calculateOee({...sample,totalUnits:0,goodUnits:0});assert.equal(r.oee,0);assert.equal(r.quality,null);assert.equal(r.performance,0);
});
test('zero operating time has undefined performance and quality',()=>{
 const r=calculateOee({...sample,operatingMinutes:0,totalUnits:0,goodUnits:0});assert.equal(r.performance,null);assert.equal(r.quality,null);assert.equal(r.oee,0);assert.equal(r.losses.availability,1);
});
test('perfect process',()=>assert.equal(calculateOee({plannedMinutes:60,operatingMinutes:60,idealMinutesPerUnit:1,totalUnits:60,goodUnits:60}).oee,1));
test('invalid engineering inputs are rejected',()=>{
 for(const patch of [{plannedMinutes:0},{operatingMinutes:101},{idealMinutesPerUnit:0},{idealMinutesPerUnit:2},{goodUnits:96},{goodUnits:-1},{totalUnits:1.5},{operatingMinutes:0},{idealMinutesPerUnit:NaN},{plannedMinutes:Infinity}]) assert.throws(()=>calculateOee({...sample,...patch}),RangeError);
});
