import test from 'node:test';
import assert from 'node:assert/strict';
import {mkdtemp,mkdir,writeFile,readFile,access,rm} from 'node:fs/promises';
import path from 'node:path';
import os from 'node:os';
import {preparePublishedArtifacts} from '../scripts/lib/production-artifacts.mjs';
const disabled={publicationEnabled:false,approvalReference:null,releaseVersion:null};
const sample={publicationEnabled:true,approvalReference:'PP-007B-001',releaseVersion:'1.0.0'};
const fixture=async()=>{const root=await mkdtemp(path.join(os.tmpdir(),'portfolio-static-'));await mkdir(path.join(root,'design-system'));await writeFile(path.join(root,'design-system/index.html'),'Synthetic internal specimen');await writeFile(path.join(root,'robots.txt'),'User-agent: *\nDisallow: /\n');return root};
test('prelaunch static output remains noindexed and specimen available only for internal QA',async()=>{
 const root=await fixture();try {
  assert.deepEqual(await preparePublishedArtifacts(root,disabled),{mode:'prelaunch',specimenExcluded:false,indexingEnabled:false});
  assert.match(await readFile(path.join(root,'robots.txt'),'utf8'),/Disallow:\s*\//);
  assert.match(await readFile(path.join(root,'design-system/index.html'),'utf8'),/Synthetic/);
 }finally{await rm(root,{recursive:true,force:true})}
});
test('production build prunes development specimen and permits indexing only for approved release manifest',async()=>{
 const root=await fixture();try{
  assert.deepEqual(await preparePublishedArtifacts(root,sample),{mode:'production',specimenExcluded:true,indexingEnabled:true});
  await assert.rejects(access(path.join(root,'design-system/index.html')),{code:'ENOENT'});
  assert.equal(await readFile(path.join(root,'robots.txt'),'utf8'),'User-agent: *\nAllow: /\n');
 }finally{await rm(root,{recursive:true,force:true})}
});
test('production transformation rejects absent approval, invalid version and invalid flag',async()=>{
 for(const config of [
  {publicationEnabled:true,approvalReference:null,releaseVersion:'1.0.0'},
  {publicationEnabled:true,approvalReference:'PP-007B-001',releaseVersion:'0.13.0'},
  {publicationEnabled:'true',approvalReference:'PP-007B-001',releaseVersion:'1.0.0'}
 ]){const root=await fixture();try{
  await assert.rejects(preparePublishedArtifacts(root,config));
  assert.match(await readFile(path.join(root,'robots.txt'),'utf8'),/Disallow:\s*\//);
  assert.match(await readFile(path.join(root,'design-system/index.html'),'utf8'),/Synthetic/);
 }finally{await rm(root,{recursive:true,force:true})}}
});
