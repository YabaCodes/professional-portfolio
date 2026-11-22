import { mkdir, readFile, writeFile } from 'node:fs/promises';
const packages = [
  ['@fontsource-variable/manrope', 'manrope'],
  ['@fontsource-variable/inter', 'inter'],
  ['@fontsource/ibm-plex-mono', 'ibm-plex-mono'],
];
await mkdir('dist/licenses', { recursive: true });
for (const [pkg, name] of packages) {
  const root = new URL('../node_modules/' + pkg + '/', import.meta.url);
  let text;
  for (const file of ['LICENSE', 'LICENSE.txt', 'OFL.txt']) {
    try { text = await readFile(new URL(file, root), 'utf8'); break; }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
  }
  if (!text || !/SIL OPEN FONT LICENSE/i.test(text)) throw new Error('Missing OFL notice: ' + pkg);
  await writeFile('dist/licenses/' + name + '.txt', text);
}
