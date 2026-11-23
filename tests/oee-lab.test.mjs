import test from 'node:test';
import assert from 'node:assert/strict';
import {calculateOee} from '../src/lib/engineering/oee.ts';
import {analyzeOee,syntheticScenarios,formatPercent,formatMinutes} from '../src/lib/engineering/oee-lab.ts';
const close=(actual,expected,tol=1e-9)=>assert.ok(Math.abs(actual-expected)<=tol,actual+' is not approximately '+expected);
const input=(patch={})=>({...syntheticScenarios[0].input,...patch});
test('independent synthetic reference scenario preserves all model factors and planned-time losses',()=>{
 const a=analyzeOee(syntheticScenarios[0].input);
 close(a.result.availability,.9);close(a.result.performance,380/432);close(a.result.quality,744/760);
 close(a.result.oee,.775);
 for(const [key,value] of Object.entries({availability:48,performance:52,quality:8,effective:372}))
  close(a.lossMinutes[key],value);
 assert.equal(a.dominant,'Performance loss');
 assert.equal(formatPercent(a.result.oee),'77.50%');
 assert.equal(formatMinutes(a.lossMinutes.quality),'8.00 min');
});
test('scenario endpoints, dominant categories and undefined factors',()=>{
 const expected={
 availability:['Availability loss',180,20,3,277],
 quality:['Quality loss',30,10,110,330],
 'no-output':['Availability loss',480,0,0,0],
 ideal:['No losses',0,0,0,480],
 };
 for(const scenario of syntheticScenarios){
  const a=analyzeOee(scenario.input);
  close(Object.values(a.lossMinutes).reduce((x,y)=>x+y,0),scenario.input.plannedMinutes);
  if(scenario.id in expected){
   const [dominant,...time]=expected[scenario.id];assert.equal(a.dominant,dominant);
   for(const [i,key] of ['availability','performance','quality','effective'].entries())close(a.lossMinutes[key],time[i]);
  }
 }
 const no=analyzeOee(syntheticScenarios.find(s=>s.id==='no-output').input);
 assert.equal(no.result.performance,null);assert.equal(no.result.quality,null);
 assert.equal(formatPercent(null),'Not defined');
 assert.equal(no.result.oee,0);
 const running=analyzeOee(input({totalUnits:0,goodUnits:0}));
 assert.equal(running.result.performance,0);assert.equal(running.result.quality,null);
 assert.equal(running.result.oee,0);
});
test('ideal cycle time contradictions, counts and nonfinite values are rejected',()=>{
 for(const patch of [
  {plannedMinutes:0},{operatingMinutes:481},{idealMinutesPerUnit:0},
  {operatingMinutes:0},{idealMinutesPerUnit:2},{goodUnits:800},
  {totalUnits:1.2},{goodUnits:1.5},{totalUnits:-1},{goodUnits:-1},
  {plannedMinutes:NaN},{operatingMinutes:Infinity},{idealMinutesPerUnit:Infinity},
  {totalUnits:Number.MAX_SAFE_INTEGER+1},{goodUnits:Number.MAX_SAFE_INTEGER+1},
  {idealMinutesPerUnit:1e308},
 ]) assert.throws(()=>calculateOee(input(patch)),RangeError,JSON.stringify(patch));
});
test('numerically tolerated roundoff cannot yield impossible OEE or non-conserved losses',()=>{
 const a=calculateOee({plannedMinutes:1,operatingMinutes:0.3,idealMinutesPerUnit:0.1,totalUnits:3,goodUnits:3});
 close(a.availability,.3);close(a.performance,1);close(a.quality,1);close(a.oee,.3);
 close(Object.values(a.losses).reduce((x,y)=>x+y,0),1);
 for(const v of Object.values(a.losses))assert.ok(v>=0&&v<=1);
});
test('all valid synthetic combinations conserve planned time and factor product',()=>{
 for(const plannedMinutes of [1,60,480,1440])
  for(const opFactor of [0,0.25,0.75,1])
   for(const totalUnits of [0,10,100]){
    const operatingMinutes=plannedMinutes*opFactor;
    if(operatingMinutes===0&&totalUnits!==0)continue;
    const idealMinutesPerUnit=totalUnits===0?0.5:operatingMinutes/(totalUnits*1.25);
    if(idealMinutesPerUnit===0)continue;
    for(const goodUnits of [0,Math.floor(totalUnits/2),totalUnits]){
     const r=calculateOee({plannedMinutes,operatingMinutes,idealMinutesPerUnit,totalUnits,goodUnits});
     close(Object.values(r.losses).reduce((a,b)=>a+b,0),1,1e-10);
     assert.ok(Object.values(r.losses).every(x=>x>=-1e-12&&x<=1+1e-12));
     if(r.performance!==null&&r.quality!==null)close(r.oee,r.availability*r.performance*r.quality,1e-10);
    }
   }
});
test('tied dominant loss contributions do not imply root causes',()=>{
 const a=analyzeOee({plannedMinutes:480,operatingMinutes:300,idealMinutesPerUnit:.5,totalUnits:240,goodUnits:240});
 assert.equal(a.dominant,'Availability loss / Performance loss');
 assert.match(a.interpretation,/not an underlying root cause/i);
});
