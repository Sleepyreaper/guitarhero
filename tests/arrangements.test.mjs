import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const load = async (path) => {
  const source = await readFile(new URL(`../${path}`, import.meta.url), 'utf8');
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
};
const [{ SONGS }, { ARRANGEMENTS, GROOVES, arrangementChordSequence, barChords, barChangeBeats }] = await Promise.all([
  load('src/js/data/songs.js'), load('src/js/data/arrangements.js'),
]);

assert.equal(Object.keys(ARRANGEMENTS).length, SONGS.length, 'every play-along song needs an arrangement');
for (const song of SONGS) {
  const arrangement = ARRANGEMENTS[song.id];
  assert.ok(arrangement, `${song.title} is missing an arrangement`);
  assert.ok(['practice', 'verified'].includes(arrangement.timing), `${song.title} needs an honest timing status`);
  assert.ok(GROOVES[arrangement.groove], `${song.title} has an unknown groove`);
  assert.ok(GROOVES[arrangement.groove].events.every((event) => event.beat >= 0 && event.beat < arrangement.meter),
    `${song.title} groove events must stay inside its ${arrangement.meter}-beat bar`);
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
      const chordSlots = barChords(bar).length;
      const cue = arrangement.cues[index];
      const cueSlots = Array.isArray(cue) ? cue.length : 1;
      assert.equal(cueSlots, chordSlots, `${song.title} bar ${index + 1} needs one lyric cue per chord change`);
    });
  }
  if (arrangement.timing === 'verified') {
    assert.ok(arrangement.cues?.length, `${song.title} verified timing requires synchronized lyric cues`);
    assert.match(arrangement.verification?.url || '', /^https:\/\//, `${song.title} needs a verification source`);
    assert.ok(arrangement.verification.label.length > 8, `${song.title} needs a useful verification label`);
    assert.match(arrangement.verification.checked, /^\d{4}-\d{2}-\d{2}$/, `${song.title} needs a verification date`);
  } else {
    assert.equal(arrangement.verification, undefined, `${song.title} practice timing must not imply verification`);
  }
  arrangement.bars.forEach((bar, index) => {
    const beats = barChangeBeats(bar, arrangement.meter);
    assert.equal(beats.length, barChords(bar).length, `${song.title} bar ${index + 1} change map mismatch`);
    assert.equal(beats[0], 0, `${song.title} bar ${index + 1} must begin with a chord on beat 1`);
    assert.ok(beats.every((beat, slot) => beat >= 0 && beat < arrangement.meter && (!slot || beat > beats[slot - 1])),
      `${song.title} bar ${index + 1} chord changes must rise within the bar`);
  });
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
assert.deepEqual(ARRANGEMENTS['twinkle-twinkle'].bars, [
  'G', ['C', 'G'], ['C', 'G'], ['D', 'G'], ['G', 'C'], ['G', 'D'],
  ['G', 'C'], ['G', 'D'], 'G', ['C', 'G'], ['C', 'G'], ['D', 'G'],
], 'Twinkle must use the complete 12-bar ABBA short form');
assert.equal(ARRANGEMENTS['twinkle-twinkle'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['if-youre-happy'].bars, ['G', 'D', 'D', 'G', 'C', 'G', 'D', 'G'],
  'If You Are Happy must use its complete eight-bar three-chord form');
assert.equal(ARRANGEMENTS['if-youre-happy'].groove, 'actionClap');
assert.deepEqual(GROOVES.actionClap.barEvents.map((events) => events ? events.map((event) => event.beat) : null),
  [null, [0, 1], null, [0, 1], null, null, null, [0, 1]],
  'action bars 2, 4, and 8 must leave beats 3 and 4 silent for claps');
assert.equal(ARRANGEMENTS['if-youre-happy'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['old-macdonald'].bars[0].changes,
  [{ beat: 0, chord: 'G' }, { beat: 2, chord: 'C' }, { beat: 3, chord: 'G' }],
  'Old MacDonald must change G-C-G on beats 1, 3, and 4 of its opening bar');
assert.deepEqual(ARRANGEMENTS['old-macdonald'].bars.map((bar) => barChords(bar)), [
  ['G', 'C', 'G'], ['D', 'G'], ['G', 'C', 'G'], ['D', 'G'], ['G'], ['G'], ['G', 'C', 'G'], ['D', 'G'],
]);
assert.equal(ARRANGEMENTS['old-macdonald'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['she-ll-be-comin'].bars.map((bar) => barChords(bar)), [
  ['G'], ['G'], ['D7'], ['D7'], ['G'], ['C'], ['G', 'D7'], ['G'],
], 'Coming Round the Mountain must follow its complete eight-bar G-D7-G-C cadence');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['she-ll-be-comin'].bars[6], 4), [0, 3],
  'the final D7 must arrive on when she at beat 4');
assert.equal(ARRANGEMENTS['she-ll-be-comin'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['when-the-saints'].bars, [
  'G', 'G', 'G', 'G', 'G', 'G', 'D7', 'D7',
  'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'G',
], 'When the Saints must use the complete sixteen-bar beginner-jam form');
assert.equal(ARRANGEMENTS['when-the-saints'].cues[10], 'number');
assert.equal(ARRANGEMENTS['when-the-saints'].cues[13], 'marching');
assert.equal(ARRANGEMENTS['when-the-saints'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['oh-susanna'].bars, [
  'G', 'G', 'G', 'D7', 'G', 'G', 'D7', 'G',
  'C', 'C', 'G', 'D7', 'G', 'G', 'D7', 'G',
], 'Oh Susanna must contain its complete 2/4 verse excerpt and chorus');
assert.equal(ARRANGEMENTS['oh-susanna'].meter, 2);
assert.equal(ARRANGEMENTS['oh-susanna'].groove, 'countryTwo');
assert.equal(ARRANGEMENTS['oh-susanna'].timing, 'verified');
const ohSusannaSong = SONGS.find(song => song.id === 'oh-susanna');
assert.equal(ohSusannaSong.time, '2/4');
assert.match(ohSusannaSong.note, /Quick 2\/4/);
assert.doesNotMatch(ohSusannaSong.note, /4\/4/);
assert.deepEqual(ARRANGEMENTS['red-river-valley'].bars.map((bar) => barChords(bar)), [
  ['G'], ['G'], ['D7'], ['D7'], ['G'], ['C'], ['G'], ['D7', 'G'],
  ['G'], ['G'], ['D7'], ['D7'], ['G'], ['C'], ['G'], ['D7', 'G'],
], 'Red River Valley must contain the complete eight-bar verse and repeated chorus form');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['red-river-valley'].bars[7], 4), [0, 2]);
assert.equal(ARRANGEMENTS['red-river-valley'].timing, 'verified');
assert.equal(ARRANGEMENTS['red-river-valley'].cues.length, 16);
assert.deepEqual(ARRANGEMENTS['red-river-valley'].cues[7], ['pathway a', 'while']);
assert.deepEqual(ARRANGEMENTS['red-river-valley'].cues[15], ['loved you so', 'true']);
assert.deepEqual(ARRANGEMENTS['swing-low'].bars.map((bar) => barChords(bar)), [
  ['G'], ['C', 'G'], ['G'], ['D7'], ['G'], ['C', 'G'], ['G'], ['D7', 'G'],
], 'Swing Low must follow its complete eight-bar refrain cadence');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['swing-low'].bars[1], 4), [0, 2]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['swing-low'].bars[7], 4), [0, 2]);
assert.equal(ARRANGEMENTS['swing-low'].timing, 'verified');
assert.equal(ARRANGEMENTS['swing-low'].cues.length, 8);
assert.deepEqual(ARRANGEMENTS['simple-gifts'].bars, [
  'G', 'G', 'D', 'D', 'G', 'G', 'D', 'G',
], 'Simple Gifts first stanza must use its complete eight-bar two-chord form');
assert.deepEqual(SONGS.find((song) => song.id === 'simple-gifts').chords, ['G', 'D']);
assert.equal(ARRANGEMENTS['simple-gifts'].bpm, 100);
assert.equal(ARRANGEMENTS['simple-gifts'].timing, 'verified');
assert.equal(ARRANGEMENTS['simple-gifts'].cues.length, 8);
assert.deepEqual(ARRANGEMENTS['streets-of-laredo'].bars, [
  'G', 'G', 'G', 'D7', 'G', 'G', 'G', 'D7',
  'G', 'G', 'G', 'D7', 'G', 'G', 'D7', 'G',
], 'Streets of Laredo must use its complete sixteen-bar cowboy-waltz verse');
assert.deepEqual(SONGS.find((song) => song.id === 'streets-of-laredo').chords, ['G', 'D7']);
assert.equal(ARRANGEMENTS['streets-of-laredo'].meter, 3);
assert.equal(ARRANGEMENTS['streets-of-laredo'].timing, 'verified');
assert.equal(ARRANGEMENTS['streets-of-laredo'].cues.length, 16);
assert.deepEqual(ARRANGEMENTS['will-the-circle'].bars, [
  'G', 'G', 'G', 'G', 'C', 'C', 'G', 'G',
  'G', 'G', 'G', 'G', 'G', 'D7', 'G', 'G',
], 'Will the Circle must use its complete sixteen-bar bluegrass chorus');
assert.equal(ARRANGEMENTS['will-the-circle'].bpm, 120);
assert.equal(ARRANGEMENTS['will-the-circle'].timing, 'verified');
assert.equal(ARRANGEMENTS['will-the-circle'].cues[3], 'breathe');
assert.equal(ARRANGEMENTS['will-the-circle'].cues[15], 'hold G');
assert.deepEqual(ARRANGEMENTS['what-a-friend'].bars.map((bar) => barChords(bar)), [
  ['G'], ['C'], ['G'], ['D'], ['G'], ['C'], ['G'], ['D7', 'G'],
  ['D'], ['G'], ['C'], ['G', 'D'], ['G'], ['C'], ['G'], ['D7', 'G'],
], 'What a Friend must contain its complete sixteen-bar first verse');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['what-a-friend'].bars[7], 4), [0, 2]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['what-a-friend'].bars[11], 4), [0, 2]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['what-a-friend'].bars[15], 4), [0, 2]);
assert.equal(ARRANGEMENTS['what-a-friend'].timing, 'verified');
assert.equal(ARRANGEMENTS['what-a-friend'].cues.length, 16);
assert.equal(SONGS.find((song) => song.id === 'what-a-friend').body[0].lines.length, 8,
  'What a Friend must display the complete first verse');
assert.deepEqual(ARRANGEMENTS['amazing-grace'].bars.map((bar) => barChords(bar)), [
  ['G'], ['G7'], ['C'], ['G'], ['G'], ['G'], ['D'], ['D'],
  ['G'], ['G7'], ['C'], ['G'], ['Em'], ['G', 'D7'], ['G'], ['G'],
], 'Amazing Grace must contain the complete sixteen-bar NEW BRITAIN form');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['amazing-grace'].bars[13], 3), [0, 2]);
assert.equal(ARRANGEMENTS['amazing-grace'].timing, 'verified');
assert.equal(ARRANGEMENTS['amazing-grace'].cues.length, 16);
assert.deepEqual(ARRANGEMENTS['home-on-the-range'].bars, [
  'G', 'G', 'C', 'C', 'G', 'A7', 'D7', 'D7',
  'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'G',
], 'Home on the Range must contain its complete sixteen-bar first verse');
assert.deepEqual(SONGS.find((song) => song.id === 'home-on-the-range').chords, ['G', 'C', 'A7', 'D7']);
assert.equal(ARRANGEMENTS['home-on-the-range'].timing, 'verified');
assert.equal(ARRANGEMENTS['home-on-the-range'].cues.length, 16);
assert.equal(Object.values(ARRANGEMENTS).filter((item) => item.timing === 'verified').length, 21,
  'only independently checked arrangements may claim lyric-synchronized timing');
assert.equal(ARRANGEMENTS['house-of-the-rising-sun'].groove, 'sixEight');
assert.ok(Object.values(ARRANGEMENTS).some((item) => item.bars.some(Array.isArray)),
  'arrangements must support mid-bar chord changes');

console.log('arrangement tests passed: every song has meter, tempo, form, distinct groove, dynamics, and lead coaching');
