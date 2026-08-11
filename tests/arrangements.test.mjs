import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const load = async (path) => {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
};
const [{ SONGS }, { ARRANGEMENTS, GROOVES, arrangementChordSequence }] = await Promise.all([
  load('src/js/data/songs.js'), load('src/js/data/arrangements.js'),
]);

assert.equal(Object.keys(ARRANGEMENTS).length, SONGS.length, 'every play-along song needs an arrangement');
for (const song of SONGS) {
  const arrangement = ARRANGEMENTS[song.id];
  assert.ok(arrangement, `${song.title} is missing an arrangement`);
  assert.ok(['practice', 'verified'].includes(arrangement.timing), `${song.title} needs an honest timing status`);
  assert.ok(GROOVES[arrangement.groove], `${song.title} has an unknown groove`);
  assert.ok(arrangement.bpm >= 50 && arrangement.bpm <= 130, `${song.title} tempo is unreasonable`);
  assert.ok(arrangement.bars.length >= 4, `${song.title} needs a meaningful harmonic loop`);
  assert.ok(arrangement.dynamics.length > 30, `${song.title} needs accompaniment coaching`);
  assert.ok(arrangement.lead.length > 30, `${song.title} needs lead coaching`);
  for (const chord of arrangementChordSequence(song)) {
    assert.ok(song.chords.includes(chord), `${song.title} arrangement uses undeclared chord ${chord}`);
  }
  if (arrangement.cues) {
    assert.equal(arrangement.timing, 'verified', `${song.title} lyric cues require verified timing`);
    assert.equal(arrangement.cues.length, arrangement.bars.length, `${song.title} lyric cues must match its bars`);
    arrangement.bars.forEach((bar, index) => {
      const chordSlots = Array.isArray(bar) ? bar.length : 1;
      const cue = arrangement.cues[index];
      const cueSlots = Array.isArray(cue) ? cue.length : 1;
      assert.equal(cueSlots, chordSlots, `${song.title} bar ${index + 1} needs one lyric cue per chord change`);
    });
  }
  if (arrangement.timing === 'verified') {
    assert.ok(arrangement.cues?.length, `${song.title} verified timing requires synchronized lyric cues`);
  }
  if (song.time.startsWith('3/4')) assert.equal(arrangement.meter, 3, `${song.title} meter mismatch`);
  if (song.time.startsWith('2/4')) assert.equal(arrangement.meter, 2, `${song.title} meter mismatch`);
  if (song.time.startsWith('4/4')) assert.equal(arrangement.meter, 4, `${song.title} meter mismatch`);
  if (song.time.startsWith('6/8')) assert.equal(arrangement.meter, 6, `${song.title} meter mismatch`);
}

assert.ok(new Set(Object.values(ARRANGEMENTS).map((item) => item.groove)).size >= 7,
  'the songbook must not collapse into one generic strum');
assert.equal(ARRANGEMENTS['shady-grove'].groove, 'boomChuck');
assert.deepEqual(ARRANGEMENTS['shady-grove'].bars, ['Em', 'D', 'Em', 'Em', 'Em', 'D', 'D', 'Em'],
  'Shady Grove must use the traditional minor-home / lowered-seven chorus form');
assert.equal(ARRANGEMENTS['shady-grove'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['row-your-boat'].cues, [
  'Row, row, row your boat',
  'Gently down the stream',
  'Merrily, merrily, merrily, merrily',
  'Life is but a dream',
]);
assert.equal(ARRANGEMENTS['row-your-boat'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['down-in-the-valley'].bars,
  ['G', 'D7', 'D7', 'G', 'G', 'D7', 'D7', 'G'],
  'Down in the Valley must change with each sung half-line, not group dominant bars together');
assert.deepEqual(ARRANGEMENTS['down-in-the-valley'].cues.slice(0, 4),
  ['Down in the valley, the', 'valley so low', 'Hang your head over, hear the', 'wind blow']);
assert.equal(ARRANGEMENTS['down-in-the-valley'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['whole-world'].bars,
  ['G', 'G', 'D7', 'D7', 'G', 'G', 'D7', 'G'],
  'Whole World must use the sourced two-chord beginner verse form');
assert.equal(ARRANGEMENTS['whole-world'].timing, 'verified');
assert.equal(ARRANGEMENTS.clementine.bpm, 90);
assert.deepEqual(ARRANGEMENTS.clementine.bars,
  ['G', 'G', 'G', 'D7', 'D7', 'G', 'D7', 'G'],
  'Clementine must return to G for forty-niner before its final D7-G phrase');
assert.equal(ARRANGEMENTS.clementine.timing, 'verified');
assert.deepEqual(ARRANGEMENTS['hush-little-baby'].bars,
  ['G', 'D7', 'D7', 'G', 'G', 'D7', 'D7', 'G']);
assert.equal(ARRANGEMENTS['hush-little-baby'].meter, 2);
assert.equal(ARRANGEMENTS['hush-little-baby'].groove, 'lullabyTwo');
assert.equal(ARRANGEMENTS['hush-little-baby'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS.kumbaya.bars, [
  'G', ['C', 'G'], 'G', ['C', 'D'], 'G', ['C', 'G'], ['C', 'G'], ['D', 'G'],
], 'Kumbaya must follow the lyric-aligned G-C-G / G-C-D form');
assert.deepEqual(ARRANGEMENTS.kumbaya.cues[0], 'Kumbaya my');
assert.deepEqual(ARRANGEMENTS.kumbaya.cues[1], ['Lord, kumba', 'ya']);
assert.equal(ARRANGEMENTS.kumbaya.timing, 'verified');
assert.equal(Object.values(ARRANGEMENTS).filter((item) => item.timing === 'verified').length, 7,
  'only independently checked arrangements may claim lyric-synchronized timing');
assert.equal(ARRANGEMENTS['house-of-the-rising-sun'].groove, 'sixEight');
assert.ok(Object.values(ARRANGEMENTS).some((item) => item.bars.some(Array.isArray)),
  'arrangements must support mid-bar chord changes');

console.log('arrangement tests passed: every song has meter, tempo, form, distinct groove, dynamics, and lead coaching');
