import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {requireRelease} from '../scripts/lib/release-gate.mjs';
const sha='a'.repeat(40),env={ref:'refs/heads/main',sha,requestedSha:sha,confirmation:'PUBLISH APPROVED PORTFOLIO'};
const approved={publicationEnabled:true,approvalReference:'PP-007',releaseVersion:'1.0.0'};
test('current repository release gate fails closed',async()=>{
 const state=JSON.parse(await readFile(new URL('../config/release.json',import.meta.url),'utf8'));
 const pkg=JSON.parse(await readFile(new URL('../package.json',import.meta.url),'utf8'));
 assert.equal(state.publicationEnabled,false);
 assert.throws(()=>requireRelease(state,pkg.version,env),/disabled/);
});
test('valid synthetic approved release passes',()=>requireRelease(approved,'1.0.0',env));
test('reject missing authorization, incorrect version, branch, commit or confirmation',()=>{
 for(const [c,v,e] of [
  [{...approved,publicationEnabled:false},'1.0.0',env],
  [{...approved,approvalReference:null},'1.0.0',env],
  [approved,'0.5.0',env],
  [approved,'1.0.1',env],
  [approved,'1.0.0',{...env,ref:'refs/heads/feature'}],
  [approved,'1.0.0',{...env,requestedSha:'b'.repeat(40)}],
  [approved,'1.0.0',{...env,confirmation:'yes'}],
 ]) assert.throws(()=>requireRelease(c,v,e));
});
