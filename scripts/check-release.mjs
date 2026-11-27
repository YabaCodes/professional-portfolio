import {readFile,access} from 'node:fs/promises';
import {join} from 'node:path';
import {requireRelease} from './lib/release-gate.mjs';
import {resolveContact,resolveResume} from '../src/lib/publication-gates.ts';
const readJson=async p=>JSON.parse(await readFile(p,'utf8'));
const release=await readJson('config/release.json');
requireRelease(release,(await readJson('package.json')).version,{
 ref:process.env.GITHUB_REF,sha:process.env.GITHUB_SHA,
 requestedSha:process.env.REQUESTED_SHA,confirmation:process.env.RELEASE_CONFIRMATION
});
const facing=await readJson('config/public-facing.json');
const contact=resolveContact(facing.contact);
const email=resolveContact(facing.email);
const resume=resolveResume(facing.resume);
if(!contact||!email)throw new Error('Exact public contact and email authorizations are required before launch');
// Résumé is optional since PP-010-001 (owner launched without one); if configured, its exact PDF must exist.
if(resume){
 const rel=resume.assetPath.slice('/professional-portfolio/'.length);
 if(!rel||resume.assetPath!=='/professional-portfolio/'+rel)throw new Error('Invalid approved résumé asset path');
 await access(join('public',rel));
}
console.log('Release preconditions passed. Manual owner/employer authorization and protected environment review remain necessary.');
