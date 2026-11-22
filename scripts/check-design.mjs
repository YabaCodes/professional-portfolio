import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
const css = await readFile(new URL('../src/styles/global.css', import.meta.url), 'utf8');
const tokens = Object.fromEntries([...css.matchAll(/--color-([\w-]+):\s*(#[0-9a-fA-F]{6});/g)].map(([, key, value]) => [key, value]));
const expected = {navy:'#101E2A',ivory:'#F6F5F0',graphite:'#23313A',teal:'#347D73','deep-teal':'#286B62',jade:'#83BAB3',structural:'#CDD2CC',slate:'#52636A'};
assert.deepEqual(tokens, expected);
function luminance(hex) {
  const rgb = hex.slice(1).match(/../g).map(c => parseInt(c, 16) / 255).map(c => c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4);
  return .2126 * rgb[0] + .7152 * rgb[1] + .0722 * rgb[2];
}
for (const [fg, bg] of [['graphite','ivory'],['slate','ivory'],['deep-teal','ivory'],['ivory','navy'],['jade','navy'],['structural','navy']]) {
  const values = [luminance(tokens[fg]), luminance(tokens[bg])].sort((a,b) => b-a);
  const ratio = (values[0]+.05)/(values[1]+.05);
  assert.ok(ratio >= 4.5, `${fg}/${bg}: ${ratio.toFixed(2)}`);
  console.log(`${fg}/${bg}: ${ratio.toFixed(2)}:1 PASS`);
}
console.log('Approved palette and normal-text contrast checks passed.');
