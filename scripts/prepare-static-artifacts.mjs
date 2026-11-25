import {readFile} from 'node:fs/promises';
import {preparePublishedArtifacts} from './lib/production-artifacts.mjs';
const release=JSON.parse(await readFile('config/release.json','utf8'));
const result=await preparePublishedArtifacts('dist',release);
console.log('Static artifact preparation: '+JSON.stringify(result));
