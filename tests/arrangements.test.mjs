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
  assert.equal(song.strum, undefined,
    `${song.title} must use its arrangement groove as the single rhythm source of truth`);
  const arrangement = ARRANGEMENTS[song.id];
  assert.ok(arrangement, `${song.title} is missing an arrangement`);
  assert.ok(['practice', 'verified'].includes(arrangement.timing), `${song.title} needs an honest timing status`);
  assert.ok(GROOVES[arrangement.groove], `${song.title} has an unknown groove`);
  assert.ok(GROOVES[arrangement.groove].count, `${song.title} groove needs an explicit spoken count`);
  assert.ok(GROOVES[arrangement.groove].events.every((event) => event.beat >= 0 && event.beat < arrangement.meter),
    `${song.title} groove events must stay inside its ${arrangement.meter}-beat bar`);
  assert.ok(arrangement.bpm >= 50 && arrangement.bpm <= 130, `${song.title} tempo is unreasonable`);
  assert.ok(arrangement.bars.length >= 4, `${song.title} needs a meaningful harmonic loop`);
  assert.ok(arrangement.dynamics.length > 30, `${song.title} needs accompaniment coaching`);
  assert.ok(arrangement.lead.length > 30, `${song.title} needs lead coaching`);
  for (const chord of arrangementChordSequence(song)) {
    assert.ok(song.chords.includes(chord), `${song.title} arrangement uses undeclared chord ${chord}`);
  }
  const chartTokens = song.body.flatMap((section) => section.lines.flat());
  assert.ok(chartTokens.some((token) => token.t?.trim()), `${song.title} needs a readable lyric chart`);
  for (const token of chartTokens) {
    if (!token.c) continue;
    assert.ok(song.chords.includes(token.c), `${song.title} lyric chart uses undeclared chord ${token.c}`);
    assert.ok(arrangementChordSequence(song).includes(token.c),
      `${song.title} lyric chart chord ${token.c} must also occur in its timed arrangement`);
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
  if (song.time.startsWith('2/2')) assert.equal(arrangement.meter, 2, `${song.title} cut-time pulse mismatch`);
  if (song.time.startsWith('4/4')) assert.equal(arrangement.meter, 4, `${song.title} meter mismatch`);
  if (song.time.startsWith('6/8')) assert.equal(arrangement.meter, 6, `${song.title} meter mismatch`);
}

assert.ok(new Set(Object.values(ARRANGEMENTS).map((item) => item.groove)).size >= 7,
  'the songbook must not collapse into one generic strum');
const shadyGrove = SONGS.find((song) => song.id === 'shady-grove');
assert.equal(shadyGrove.time, '2/4');
assert.deepEqual(shadyGrove.chords, ['Em', 'D', 'G']);
assert.equal(ARRANGEMENTS['shady-grove'].groove, 'countryTwo');
assert.deepEqual(ARRANGEMENTS['shady-grove'].bars,
  ['Em', 'D', 'Em', 'Em', 'G', 'D', 'Em', 'Em'],
  'Shady Grove must interpret the sixteen Hindman chord slots as eight two-beat measures');
assert.deepEqual(ARRANGEMENTS['shady-grove'].cues, [
  'Shady Grove', 'my little love', 'Shady Grove I', 'know—',
  'Shady Grove', 'my little love', 'Bound for the Shady', 'Grove—',
]);
assert.match(shadyGrove.body[0].lines[1][0].t, /I know/,
  'Shady Grove chorus must use the Hindman lyric variant instead of mixing versions');
assert.equal(ARRANGEMENTS['shady-grove'].verification.url, 'https://hindmanathome.org/pick-and-bow/');
assert.equal(ARRANGEMENTS['shady-grove'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['row-your-boat'].cues, [
  'Row, row', 'row your boat', 'Gently down the', 'stream',
  'Merrily, merrily', 'merrily, merrily', 'Life is but a', 'dream',
]);
assert.equal(SONGS.find((song) => song.id === 'row-your-boat').time, '6/8');
assert.deepEqual(SONGS.find((song) => song.id === 'row-your-boat').chords, ['G', 'D7']);
assert.deepEqual(ARRANGEMENTS['row-your-boat'].bars, ['G', 'G', 'G', 'G', 'G', 'G', 'D7', 'G']);
assert.equal(ARRANGEMENTS['row-your-boat'].meter, 6);
assert.equal(ARRANGEMENTS['row-your-boat'].groove, 'compoundTwo');
assert.deepEqual(GROOVES.compoundTwo.events.map(({ beat }) => beat), [0, 3],
  'Row Your Boat must emphasize the two dotted-quarter pulses of 6/8');
assert.equal(ARRANGEMENTS['row-your-boat'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['down-in-the-valley'].bars,
  [
    'G', 'G', 'G', 'G', 'D7', 'D7', 'D7', 'D7', 'D7', 'D7', 'G', 'G',
    'G', 'G', 'G', 'G', 'D7', 'D7', 'D7', 'D7', 'D7', 'D7', 'G', 'G',
  ],
  'Down in the Valley must preserve the anthology’s spacious twenty-four-bar traditional harmony');
assert.deepEqual(ARRANGEMENTS['down-in-the-valley'].cues.slice(0, 12), [
  'Down in the', 'val—', '—ley,', 'val-ley so', 'low—', '(hold low)',
  'Hang your head', 'o—', '—ver,', 'hear the wind', 'blow—', '(hold blow)',
]);
assert.equal(ARRANGEMENTS['down-in-the-valley'].cues.length, 24);
assert.match(ARRANGEMENTS['down-in-the-valley'].reduction, /extends G under the opening three-beat/,
  'the added opening G bar must be disclosed rather than implied to be printed harmony');
assert.match(SONGS.find((song) => song.id === 'down-in-the-valley').body[0].lines[0][1].t, /^low$/,
  'the readable chart must change to D7 exactly on the first low');
assert.equal(ARRANGEMENTS['down-in-the-valley'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['whole-world'].bars,
  ['G', 'G', 'D', 'D', 'G', 'G', 'D', 'G'],
  'Whole World must use the sourced two-chord beginner verse form');
assert.equal(ARRANGEMENTS['whole-world'].timing, 'verified');
assert.equal(ARRANGEMENTS['whole-world'].groove, 'straight',
  'Whole World must begin with recognizable quarter-note accompaniment before adding syncopation');
assert.equal(ARRANGEMENTS['whole-world'].bpm, 120);
assert.deepEqual(SONGS.find((song) => song.id === 'whole-world').chords, ['G', 'D']);
assert.match(SONGS.find((song) => song.id === 'whole-world').body[0].lines[1][0].t, /whole wide world/,
  'Whole World line two must match the common whole-wide-world chorus variation');
assert.deepEqual(ARRANGEMENTS['whole-world'].pickup, { beat: 2.5, text: "He's got the… (pickup)" },
  'Whole World must cue its vocal pickup before the first guitar downbeat');
assert.equal(ARRANGEMENTS['whole-world'].vocalCues.filter((cue) => cue.text.includes('pickup')).length, 3,
  'each repeated line after the first must cue its pickup before the next downbeat');
assert.equal(ARRANGEMENTS.clementine.bpm, 90);
assert.deepEqual(ARRANGEMENTS.clementine.bars,
  [
    'G', 'G', 'G', 'D7', 'D7', 'G', 'D7', 'G',
    'G', 'G', 'G', 'D7', 'D7', 'D7', 'D7', 'G',
  ],
  'Clementine must preserve the complete anthology verse and chorus in its disclosed two-chord reduction');
assert.deepEqual(ARRANGEMENTS.clementine.pickup, { beat: 2, text: 'In a… (pickup)' });
assert.equal(ARRANGEMENTS.clementine.cues.length, 16);
assert.deepEqual(ARRANGEMENTS.clementine.cues.slice(11), [
  'tine; Thou art', 'lost and gone for-', 'ev-er, Dread-ful', 'sor-ry, Clem-en-', 'tine—; then pickup: In a',
]);
assert.match(ARRANGEMENTS.clementine.reduction, /B7\/D-sharp → Em → A7 turnaround/,
  'Clementine must name the source cadence omitted from its two-chord first version');
assert.deepEqual(SONGS.find((song) => song.id === 'clementine').body[1].lines[2].map(({ c }) => c), ['D7'],
  'the chart must not reintroduce the old unsourced G change on forever');
assert.equal(ARRANGEMENTS.clementine.timing, 'verified');
assert.equal(ARRANGEMENTS['hush-little-baby'].meter, 2);
assert.equal(ARRANGEMENTS['hush-little-baby'].groove, 'lullabyTwo');
assert.equal(ARRANGEMENTS['hush-little-baby'].timing, 'verified');
assert.equal(ARRANGEMENTS['hush-little-baby'].cues.length, 16);
assert.deepEqual(ARRANGEMENTS['hush-little-baby'].bars, [
  'G', 'G', 'D7', 'D7', 'D7', 'D7', 'G', 'G',
  'G', 'G', 'D7', 'D7', 'D7', 'D7', 'G', 'G',
], 'Hush Little Baby must preserve all sixteen measures of the selected score');
assert.match(SONGS.find((song) => song.id === 'hush-little-baby').body[0].lines[1][0].t, /Mama/,
  'Hush Little Baby must use one consistent lyric variant');
assert.equal(SONGS.find((song) => song.id === 'kumbaya').time, '3/4 (waltz)');
assert.deepEqual(SONGS.find((song) => song.id === 'kumbaya').chords, ['G', 'C', 'D', 'D7']);
assert.deepEqual(ARRANGEMENTS.kumbaya.bars.map((bar) => barChords(bar)), [
  ['G', 'C'], ['G'], ['G', 'C'], ['D', 'G'],
  ['G', 'C'], ['G', 'C'], ['G', 'D7', 'G'], ['G'],
], 'Kumbaya must follow the source-locked eight-bar 3/4 harmony');
assert.deepEqual(ARRANGEMENTS.kumbaya.bars.map((bar) => barChangeBeats(bar, 3)), [
  [0, 2], [0], [0, 2], [0, 2], [0, 2], [0, 2], [0, 1, 2], [0],
], 'Kumbaya chord changes must land on the source beats');
assert.equal(ARRANGEMENTS.kumbaya.meter, 3);
assert.equal(ARRANGEMENTS.kumbaya.groove, 'prayerWaltz');
assert.deepEqual(ARRANGEMENTS.kumbaya.pickup, { beat: 2, text: 'Kum-ba… (pickup)' });
assert.equal(ARRANGEMENTS.kumbaya.timing, 'verified');
assert.equal(SONGS.find((song) => song.id === 'twinkle-twinkle').time, '2/4');
assert.deepEqual(SONGS.find((song) => song.id === 'twinkle-twinkle').chords, ['G', 'C', 'D7']);
assert.equal(ARRANGEMENTS['twinkle-twinkle'].meter, 2);
assert.equal(ARRANGEMENTS['twinkle-twinkle'].groove, 'nurseryTwo');
assert.deepEqual(ARRANGEMENTS['twinkle-twinkle'].bars, [
  'G', 'G', 'C', 'G', 'D7', 'G', 'D7', 'G',
  'G', 'D7', 'G', 'D7', 'G', 'D7', 'G', 'D7',
  'G', 'G', 'C', 'G', 'D7', 'G', 'D7', 'G',
], 'Twinkle must preserve all twenty-four 2/4 bars of the anthology verse');
assert.match(ARRANGEMENTS['twinkle-twinkle'].reduction, /G-major and G7 colors into one beginner shape/,
  'Twinkle must disclose its source-harmony simplification');
assert.equal(ARRANGEMENTS['twinkle-twinkle'].timing, 'verified');
assert.deepEqual(GROOVES.actionClap.barEvents.map((events) => events ? events.map((event) => event.beat) : null),
  [null, [0, 1], null, [0, 1], null, null, null, [0, 1]],
  'action bars 2, 4, and 8 must leave beats 3 and 4 silent for claps');
assert.equal(SONGS.find((song) => song.id === 'old-macdonald').time, '2/2 (cut time)');
assert.deepEqual(SONGS.find((song) => song.id === 'old-macdonald').chords, ['G', 'C', 'D7']);
assert.equal(ARRANGEMENTS['old-macdonald'].meter, 2);
assert.equal(ARRANGEMENTS['old-macdonald'].groove, 'cutTime');
assert.equal(ARRANGEMENTS['old-macdonald'].tempoUnit, 'half-note');
assert.deepEqual(ARRANGEMENTS['old-macdonald'].bars.map((bar) => barChords(bar)), [
  ['G'], ['C', 'G'], ['G', 'D7'], ['G'],
  ['G'], ['C', 'G'], ['G', 'D7'], ['G'],
  ['G', 'C', 'G'], ['C', 'G'], ['G', 'C'], ['G', 'C'],
  ['G'], ['C', 'G'], ['G', 'D7'], ['G'],
], 'Old MacDonald must preserve the anthology cut-time harmony bar by bar');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['old-macdonald'].bars[8], 2), [0, 1, 1.5]);
assert.match(SONGS.find((song) => song.id === 'old-macdonald').body[0].lines[1][3].t, /duck/,
  'Old MacDonald must use the selected source duck verse rather than mixing animals');
assert.equal(ARRANGEMENTS['old-macdonald'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['she-ll-be-comin'].bars.map((bar) => barChords(bar)), [
  ['G'], ['G'], ['G'], ['G'], ['G'], ['G'], ['D7'], ['D7'],
  ['G'], ['G'], ['C'], ['C'], ['G'], ['G', 'D7'], ['G'], ['G'],
], 'Coming Round the Mountain must preserve the complete sixteen-bar 2/4 source form');
assert.equal(SONGS.find((song) => song.id === 'she-ll-be-comin').time, '2/4');
assert.equal(ARRANGEMENTS['she-ll-be-comin'].meter, 2);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['she-ll-be-comin'].bars[13], 2), [0, 1],
  'the final D7 must arrive on when she at beat 2 of the source measure');
assert.deepEqual(ARRANGEMENTS['she-ll-be-comin'].pickup, { beat: 1, text: "She'll be… (pickup)" });
assert.deepEqual(SONGS.find((song) => song.id === 'she-ll-be-comin').body[0].lines[1].map(({ c }) => c), ['G', 'D7'],
  'the readable chart must stay on G until the second line’s final comes');
assert.equal(ARRANGEMENTS['she-ll-be-comin'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['when-the-saints'].bars, [
  'G', 'G', 'G', 'G', 'G', 'G', 'D7', 'D7',
  'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'G',
], 'When the Saints must use the complete sixteen-bar beginner-jam form');
assert.deepEqual(ARRANGEMENTS['when-the-saints'].pickup, { beat: 1, text: 'Oh, when the… (pickup)' });
assert.equal(ARRANGEMENTS['when-the-saints'].cues[10], 'num-ber—');
assert.equal(ARRANGEMENTS['when-the-saints'].cues[13], 'march-ing');
assert.match(ARRANGEMENTS['when-the-saints'].reduction, /minor-iv bar/,
  'When the Saints must disclose the anthology colors omitted from its three-shape reduction');
assert.equal(ARRANGEMENTS['when-the-saints'].timing, 'verified');
assert.deepEqual(ARRANGEMENTS['oh-susanna'].bars.map((bar) => barChords(bar)), [
  ['G'], ['G'], ['G'], ['D7'], ['G'], ['G'], ['G', 'D7'], ['G'],
  ['C'], ['C'], ['G'], ['D7'], ['G'], ['G'], ['G', 'D7'], ['G'],
], 'Oh Susanna must preserve all sixteen source bars and its beat-2 dominant changes');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['oh-susanna'].bars[6], 2), [0, 1]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['oh-susanna'].bars[14], 2), [0, 1]);
assert.deepEqual(ARRANGEMENTS['oh-susanna'].pickup, { beat: 1.5, text: 'Oh, I… (half-beat pickup)' });
assert.equal(ARRANGEMENTS['oh-susanna'].meter, 2);
assert.equal(ARRANGEMENTS['oh-susanna'].groove, 'countryTwo');
assert.equal(ARRANGEMENTS['oh-susanna'].timing, 'verified');
const ohSusannaSong = SONGS.find(song => song.id === 'oh-susanna');
assert.equal(ohSusannaSong.time, '2/4');
assert.match(ohSusannaSong.note, /source bars/i);
assert.doesNotMatch(ohSusannaSong.note, /4\/4/);
assert.deepEqual(ARRANGEMENTS['red-river-valley'].bars.map((bar) => barChords(bar)), [
  ['G'], ['G'], ['G'], ['G'], ['G'], ['G'], ['D7'], ['D7'],
  ['G'], ['G'], ['C'], ['C'], ['D7'], ['D7'], ['G'], ['G'],
], 'Red River Valley must preserve the selected source stanza without inventing a chorus');
assert.deepEqual(ARRANGEMENTS['red-river-valley'].pickup, { beat: 2, text: 'From this… (two-beat pickup)' });
assert.equal(ARRANGEMENTS['red-river-valley'].timing, 'verified');
assert.equal(ARRANGEMENTS['red-river-valley'].cues.length, 16);
assert.equal(SONGS.find((song) => song.id === 'red-river-valley').body.length, 1);
assert.match(ARRANGEMENTS['red-river-valley'].reduction, /not mislabeled as a chorus/);
assert.deepEqual(ARRANGEMENTS['swing-low'].bars.map((bar) => barChords(bar)), [
  ['G'], ['C', 'G'], ['G'], ['D7'], ['G'], ['C', 'G'], ['G', 'D7'], ['G'],
  ['G'], ['C', 'D7'], ['Em', 'G'], ['D7'], ['G', 'Em'], ['C', 'D7'], ['G', 'D7'], ['G'],
  ['G'], ['C', 'G'], ['G'], ['D7'], ['G'], ['C', 'G'], ['G', 'D7'], ['G'],
], 'Swing Low must literal-expand the source chorus, verse, and D.C. al Fine return');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['swing-low'].bars[1], 4), [0, 2]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['swing-low'].bars[9], 4), [0, 1]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['swing-low'].bars[22], 4), [0, 2]);
assert.equal(ARRANGEMENTS['swing-low'].timing, 'verified');
assert.equal(ARRANGEMENTS['swing-low'].cues.length, 24);
assert.deepEqual(SONGS.find((song) => song.id === 'swing-low').chords, ['G', 'C', 'D7', 'Em']);
assert.deepEqual(ARRANGEMENTS['simple-gifts'].bars.map((bar) => barChords(bar)), [
  ['G'], ['G'], ['D'], ['D'], ['G'], ['G'], ['D'], ['G'],
  ['G'], ['G'], ['G'], ['C', 'D'], ['G'], ['G'], ['D'], ['C', 'G'],
], 'Simple Gifts must preserve the complete sixteen-bar source stanza');
assert.deepEqual(SONGS.find((song) => song.id === 'simple-gifts').chords, ['G', 'C', 'D']);
assert.equal(ARRANGEMENTS['simple-gifts'].bpm, 100);
assert.equal(ARRANGEMENTS['simple-gifts'].timing, 'verified');
assert.equal(ARRANGEMENTS['simple-gifts'].cues.length, 16);
assert.deepEqual(ARRANGEMENTS['simple-gifts'].pickup, { beat: 3, text: "'Tis the… (pickup)" });
assert.deepEqual(barChangeBeats(ARRANGEMENTS['simple-gifts'].bars[11], 4), [0, 2]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['simple-gifts'].bars[15], 4), [0, 2]);
assert.deepEqual(ARRANGEMENTS['streets-of-laredo'].bars, [
  'G', 'C', 'G', 'D7', 'Em', 'D', 'G', 'D7',
  'G', 'C', 'G', 'D', 'Em', 'Am', 'D7', 'G',
  'G', 'G', 'C', 'C', 'G', 'Em', 'Am', 'D7',
  'G', 'G7', 'C', 'C', 'G', 'G', 'D7', 'G',
], 'Streets of Laredo must preserve the complete CC0 verse and chorus');
assert.deepEqual(SONGS.find((song) => song.id === 'streets-of-laredo').chords,
  ['G', 'C', 'D7', 'Em', 'D', 'Am', 'G7']);
assert.equal(ARRANGEMENTS['streets-of-laredo'].meter, 3);
assert.equal(ARRANGEMENTS['streets-of-laredo'].timing, 'verified');
assert.equal(ARRANGEMENTS['streets-of-laredo'].cues.length, 32);
assert.deepEqual(ARRANGEMENTS['streets-of-laredo'].pickup, { beat: 2, text: 'As… (one-beat pickup)' });
assert.equal(SONGS.find((song) => song.id === 'streets-of-laredo').body.length, 2);
assert.deepEqual(ARRANGEMENTS['will-the-circle'].bars, [
  'G', 'G', 'C', 'G', 'C', 'G', 'G', 'G',
], 'Will the Circle must use the complete eight-bar Habershon/Gabriel refrain reduction');
assert.deepEqual(SONGS.find((song) => song.id === 'will-the-circle').chords, ['G', 'C'],
  'the 1907 hymn edition must not silently retain Carter-style dominant harmony');
assert.equal(ARRANGEMENTS['will-the-circle'].bpm, 92);
assert.deepEqual(ARRANGEMENTS['will-the-circle'].pickup, { beat: 3, text: 'Will the… (pickup)' });
assert.match(ARRANGEMENTS['will-the-circle'].reduction, /No later Carter-family lyric or tune/);
assert.equal(ARRANGEMENTS['will-the-circle'].timing, 'verified');
assert.equal(ARRANGEMENTS['will-the-circle'].cues.length, 8);
assert.deepEqual(ARRANGEMENTS['what-a-friend'].bars.map((bar) => barChords(bar)), [
  ['G', 'G7'], ['C'], ['G'], ['D'], ['G', 'G7'], ['C'], ['G', 'D7'], ['G', 'C', 'G'],
  ['D'], ['G'], ['C', 'G'], ['D'], ['G', 'G7'], ['C'], ['G', 'D7'], ['G', 'C', 'G'],
], 'What a Friend must preserve the complete CONVERSE form and open-shape chord-change beats');
assert.deepEqual(SONGS.find((song) => song.id === 'what-a-friend').chords, ['G', 'G7', 'C', 'D', 'D7']);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['what-a-friend'].bars[0], 4), [0, 2]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['what-a-friend'].bars[7], 4), [0, 1, 2]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['what-a-friend'].bars[10], 4), [0, 2]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['what-a-friend'].bars[15], 4), [0, 1, 2]);
assert.match(ARRANGEMENTS['what-a-friend'].reduction, /C-sharp diminished passing chord/);
assert.equal(ARRANGEMENTS['what-a-friend'].timing, 'verified');
assert.equal(ARRANGEMENTS['what-a-friend'].cues.length, 16);
assert.equal(SONGS.find((song) => song.id === 'what-a-friend').body[0].lines.length, 8,
  'What a Friend must display the complete first verse');
assert.deepEqual(ARRANGEMENTS['amazing-grace'].bars.map((bar) => barChords(bar)), [
  ['G'], ['G7'], ['C'], ['G'], ['G'], ['G'], ['D'], ['D'],
  ['G'], ['G7'], ['C'], ['G'], ['G'], ['G', 'D7'], ['G'], ['G'],
], 'Amazing Grace must contain the complete sixteen-bar NEW BRITAIN form');
assert.deepEqual(SONGS.find((song) => song.id === 'amazing-grace').chords, ['G', 'G7', 'C', 'D', 'D7'],
  'Amazing Grace must not add an unsourced Em substitution to the verified beginner chart');
assert.deepEqual(barChangeBeats(ARRANGEMENTS['amazing-grace'].bars[13], 3), [0, 2]);
assert.equal(ARRANGEMENTS['amazing-grace'].timing, 'verified');
assert.equal(ARRANGEMENTS['amazing-grace'].cues.length, 16);
assert.deepEqual(ARRANGEMENTS['home-on-the-range'].bars, [
  'G', 'G', 'C', 'C', 'G', 'A7', 'D7', 'D7',
  'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'D7',
  'G', 'D7', 'G', 'G', 'G', 'A7', 'D7', 'D7',
  'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'G',
], 'Home on the Range must contain its complete CC0 verse and chorus');
assert.deepEqual(SONGS.find((song) => song.id === 'home-on-the-range').chords, ['G', 'C', 'A7', 'D7']);
assert.equal(ARRANGEMENTS['home-on-the-range'].timing, 'verified');
assert.equal(ARRANGEMENTS['home-on-the-range'].cues.length, 32);
assert.deepEqual(ARRANGEMENTS['home-on-the-range'].pickup, { beat: 2, text: 'Oh… (one-beat pickup)' });
assert.equal(SONGS.find((song) => song.id === 'home-on-the-range').body.length, 2);
assert.deepEqual(GROOVES.sixEight.events.map(({ string, fromTop }) => string ?? -fromTop), [0, 1, 2, -1, -2, -3],
  'the 6/8 arpeggio must travel bass-to-treble and back');
assert.deepEqual(ARRANGEMENTS['scarborough-fair'].bars.map((bar) => barChords(bar)), [
  ['Am'], ['Am'], ['G'], ['Am'], ['C'], ['Am'], ['C', 'D'], ['Am'],
  ['Am'], ['Am'], ['C'], ['C', 'Am'], ['G'], ['Am'], ['G', 'Am'],
  ['G', 'Am', 'G'], ['Am'], ['Am'],
], 'Scarborough Fair must preserve the complete eighteen-bar CC0 verse and modal changes');
assert.deepEqual(SONGS.find((song) => song.id === 'scarborough-fair').chords, ['Am', 'G', 'C', 'D']);
assert.equal(ARRANGEMENTS['scarborough-fair'].timing, 'verified');
assert.equal(ARRANGEMENTS['scarborough-fair'].cues.length, 18);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['scarborough-fair'].bars[6], 3), [0, 1]);
assert.deepEqual(barChangeBeats(ARRANGEMENTS['scarborough-fair'].bars[15], 3), [0, 1, 2]);
assert.deepEqual(GROOVES.fingerWaltz.events.map(({ kind, fromTop }) => kind === 'bass' ? 'bass' : fromTop),
  ['bass', 1, 2], 'the finger-waltz pattern must adapt its high notes to every chord shape');
assert.equal(Object.values(ARRANGEMENTS).filter((item) => item.timing === 'verified').length, 21,
  'only independently checked arrangements may claim lyric-synchronized timing');
assert.ok(Object.values(ARRANGEMENTS).some((item) => item.bars.some((bar) => barChords(bar).length > 1)),
  'arrangements must retain at least one explicit mid-bar chord change');
assert.ok(Object.values(GROOVES).every((groove) => groove.count),
  'every generated accompaniment groove must expose the count a learner should say aloud');

console.log('arrangement tests passed: every song has meter, tempo, form, distinct groove, dynamics, and lead coaching');
