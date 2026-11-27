import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const tokens = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6});/g)].map(([, key, value]) => [key, value]));
const expected = {white:'#FFFFFF',mist:'#EEF2F5',ink:'#15191E',body:'#2B323A',steel:'#55606B',outline:'#7D8995',line:'#E3E8EC',cobalt:'#2342B0','cobalt-deep':'#16297A','cobalt-tint':'#E8ECFB'};
assert.deepEqual(tokens, expected);
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
// Normal text needs 4.5:1; the outline token marks button and menu edges and needs 3:1 (WCAG 1.4.11).
const pairs = [['ink','white',4.5],['body','white',4.5],['steel','white',4.5],['ink','mist',4.5],['body','mist',4.5],['steel','mist',4.5],
  ['cobalt','white',4.5],['white','cobalt',4.5],['white','cobalt-deep',4.5],['cobalt','cobalt-tint',4.5],['ink','cobalt-tint',4.5],['cobalt','mist',4.5],['outline','white',3]];
for (const [fg, bg, min] of pairs) {
  const values = [luminance(tokens[fg]), luminance(tokens[bg])].sort((a,b) => b-a);
  const ratio = (values[0]+.05)/(values[1]+.05);
  assert.ok(ratio >= min, `${fg}/${bg}: ${ratio.toFixed(2)}`);
  console.log(`${fg}/${bg}: ${ratio.toFixed(2)}:1 PASS`);
}
console.log('Approved Cleanroom palette and contrast checks passed.');
