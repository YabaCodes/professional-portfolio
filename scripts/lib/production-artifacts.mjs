import assert from 'node:assert/strict';
import {lstat,readFile,rm,writeFile} from 'node:fs/promises';
import path from 'node:path';

/**
 * Production-only removal of the PP-004B design fixture from Astro's static output.
 * The release manifest is the sole switch. No environment override can enable it.
 * Does NOT change repository source files, deployment settings or approvals.
 */
export async function preparePublishedArtifacts(root, release) {
 assert.equal(typeof release?.publicationEnabled,'boolean','Publication flag must be boolean');
 if(release.publicationEnabled===false)return {mode:'prelaunch',specimenExcluded:false,indexingEnabled:false};
 assert.ok(typeof release.approvalReference==='string'&&release.approvalReference.length>0,'Approved release reference required');
 assert.ok(typeof release.releaseVersion==='string'&&/^\d+\.\d+\.\d+$/.test(release.releaseVersion)
  &&Number(release.releaseVersion.split('.')[0])>=1,'Production version v1.0.0+ required');
 const actual=path.resolve(root);
 const rootStat=await lstat(actual);
 assert.ok(rootStat.isDirectory()&&!rootStat.isSymbolicLink(),'Static output must be a real directory');
 const candidate=path.join(actual,'design-system');
 try {
  const specimen=await lstat(candidate);
  assert.ok(specimen.isDirectory()&&!specimen.isSymbolicLink(),'Design specimen must be a real directory');
  await rm(candidate,{recursive:true,force:false});
 }catch(error){
  if(error?.code!=='ENOENT')throw error;
 }
 const robotsPath=path.join(actual,'robots.txt');
 const robotsStat=await lstat(robotsPath);
 assert.ok(robotsStat.isFile()&&!robotsStat.isSymbolicLink(),'robots.txt must be a real file');
 const old=await readFile(robotsPath,'utf8');
 assert.match(old,/^User-agent:\s*\*/m,'Expected existing robots header');
 await writeFile(robotsPath,'User-agent: *\nAllow: /\n','utf8');
 return {mode:'production',specimenExcluded:true,indexingEnabled:true};
}
