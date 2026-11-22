import { readFile } from 'node:fs/promises';
import { requireRelease } from './lib/release-gate.mjs';
const readJson = async p => JSON.parse(await readFile(p,'utf8'));
requireRelease(await readJson('config/release.json'),(await readJson('package.json')).version,{
 ref:process.env.GITHUB_REF,sha:process.env.GITHUB_SHA,requestedSha:process.env.REQUESTED_SHA,confirmation:process.env.RELEASE_CONFIRMATION
});
console.log('Release gate passed. Separate owner and content authorization remains required.');
