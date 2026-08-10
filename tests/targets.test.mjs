import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/js/data/targets.js', import.meta.url), 'utf8');
const { TARGET_SONGS } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const byTitle = Object.fromEntries(TARGET_SONGS.map((song) => [song.title, song]));
const pilotTargets = [
  'You Look Like You Love Me', "Weren't For The Wind", 'Last Night',
  '10,000 Reasons (Bless the Lord)', 'Great Are You Lord', 'How Great Is Our God',
];

for (const title of pilotTargets) {
  const song = byTitle[title];
  assert.ok(song, `${title} is missing`);
  assert.match(song.tutorial, /^https:\/\//, `${title} needs a curated lesson`);
  assert.ok(song.bridge?.groove && song.bridge?.firstStep && song.bridge?.lead,
    `${title} needs a complete beginner bridge`);
  assert.equal(song.body, undefined, `${title} must not embed copyrighted lyrics or charts`);
}

assert.deepEqual(byTitle['You Look Like You Love Me'].chords, ['G', 'Am', 'C', 'D']);
assert.deepEqual(byTitle["Weren't For The Wind"].chords, ['Am', 'C', 'G', 'D', 'Em']);
assert.equal(byTitle["Weren't For The Wind"].capo, 'Capo 2');
assert.deepEqual(byTitle['Last Night'].chords, ['Cadd9', 'D', 'Em7']);
assert.equal(byTitle['Great Are You Lord'].capo, 'Capo 2');
assert.ok(TARGET_SONGS.every((song) => !song.chords.includes('F')),
  'beginner targets should use the supported Fmaj7 shape instead of an unavailable F chord');

console.log('target tests passed: requested country and worship songs have verified facts, curated lessons, and copyright-safe bridges');
