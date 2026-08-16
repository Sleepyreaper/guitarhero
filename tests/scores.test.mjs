import assert from 'node:assert/strict';
import { SCORES, midiFrequency } from '../src/js/data/scores.js';
import { ARRANGEMENTS } from '../src/js/data/arrangements.js';

const certified = [
  'down-in-the-valley', 'clementine',
  'row-your-boat', 'whole-world', 'amazing-grace', 'shady-grove', 'kumbaya',
  'will-the-circle', 'what-a-friend',
];
assert.deepEqual(Object.keys(SCORES), certified, 'the first score-driven release must stay intentionally auditable');

for (const id of certified) {
  const score = SCORES[id];
  const arrangement = ARRANGEMENTS[id];
  assert.equal(score.status, 'certified', `${id} must not enter Hear mode without certification`);
  assert.ok(score.source?.url && score.source?.checked, `${id} needs dated melody evidence`);
  assert.ok(score.melody.length >= 20, `${id} needs a literal melody, not a phrase placeholder`);
  assert.ok(score.melody.some((event) => event.lyric), `${id} needs score-timed lyric cues`);
  assert.ok(score.melody.every((event, index, events) => index === 0 || event.beat >= events[index - 1].beat),
    `${id} melody events must be chronological`);
  assert.ok(score.melody.every((event) => event.duration > 0), `${id} notes and rests need positive durations`);
  assert.ok(score.melody.filter((event) => event.midi != null).every((event) => event.midi >= 48 && event.midi <= 84),
    `${id} guide melody must remain in a comfortable audible register`);
  const last = score.melody.at(-1);
  assert.equal(score.totalBeats, arrangement.bars.length * arrangement.meter,
    `${id} score and harmony must declare the same complete form length`);
  assert.ok(last.beat + last.duration <= arrangement.bars.length * arrangement.meter,
    `${id} melody must fit the same clock as its harmony form`);
}

assert.equal(SCORES['down-in-the-valley'].totalBeats, 72);
assert.equal(SCORES['down-in-the-valley'].melody[0].beat, 0);
assert.equal(SCORES['down-in-the-valley'].melody.at(-1).beat + SCORES['down-in-the-valley'].melody.at(-1).duration, 72,
  'Down in the Valley must preserve all twenty-four anthology measures through the tied final blow');
assert.equal(SCORES['down-in-the-valley'].source.dataUrl,
  'https://dataverse.lib.virginia.edu/api/access/datafile/3898',
  'Down in the Valley must retain the exact machine-readable CC0 source');
assert.deepEqual(SCORES['down-in-the-valley'].melody.filter((event) => event.lyric).map((event) => event.lyric), [
  'Down', 'in', 'the', 'val—', '—ley,', 'val-', 'ley', 'so', 'low—',
  'Hang', 'your', 'head', 'o-', '—ver,', 'hear', 'the', 'wind', 'blow—',
  'Hear', 'the', 'wind', 'blow', 'dear,', 'hear', 'the', 'wind', 'blow—',
  'Hang', 'your', 'head', 'o-', '—ver,', 'hear', 'the', 'wind', 'blow—',
], 'Down in the Valley must keep every anthology syllable and repeated phrase in order');
assert.deepEqual(SCORES['down-in-the-valley'].melody.map(({ midi, duration }) => [midi, duration]), [
  [62, 1], [67, 1], [69, 1], [71, 3], [67, 3], [71, 1], [69, 1], [67, 1], [69, 6],
  [62, 1], [66, 1], [69, 1], [72, 3], [69, 3], [72, 1], [71, 1], [69, 1], [71, 6],
  [62, 1], [67, 1], [69, 1], [71, 3], [67, 3], [71, 1], [69, 1], [67, 1], [69, 6],
  [62, 1], [66, 1], [69, 1], [74, 3], [74, 3], [72, 1], [71, 1], [69, 1], [67, 6],
], 'Down in the Valley pitches and tied durations must match the CC0 MusicXML transcription');
assert.deepEqual(SCORES['down-in-the-valley'].melody.slice(0, 3).map(({ midi }) => midi), [62, 67, 69],
  'the disclosed opening G extension must support the source D-G-A opening melody');

assert.equal(SCORES.clementine.totalBeats, 48);
assert.equal(SCORES.clementine.melody[0].beat, -1,
  'Clementine must sing In a on beat 3 of the count-in');
assert.equal(SCORES.clementine.melody.at(-1).beat + SCORES.clementine.melody.at(-1).duration, 47,
  'Clementine must leave the final beat for the next loop pickup');
assert.equal(SCORES.clementine.source.dataUrl,
  'https://dataverse.lib.virginia.edu/api/access/datafile/3924',
  'Clementine must retain the exact machine-readable CC0 source');
assert.deepEqual(SCORES.clementine.melody.filter((event) => event.lyric).map((event) => event.lyric), [
  'In', 'a', 'cav-', 'ern,', 'in', 'a', 'can-', 'yon,', 'Ex-', 'ca-', 'va-', 'ting', 'for', 'a',
  'mine,', 'Dwelt', 'a', 'min-', 'er,', 'for-', 'ty-', 'nin-', 'er,', 'And', 'his', 'daugh-', 'ter', 'Clem-', 'en-', 'tine.',
  'Oh,', 'my', 'dar-', 'ling,', 'oh,', 'my', 'dar-', 'ling,', 'Oh,', 'my', 'dar-', 'ling', 'Clem-', 'en-', 'tine:',
  'Thou', 'art', 'lost', 'and', 'gone', 'for-', 'ev-', 'er,', 'Dread-', 'ful', 'sor-', 'ry,', 'Clem-', 'en-', 'tine.',
], 'Clementine must keep the complete anthology verse and chorus on the literal melody');
assert.deepEqual(SCORES.clementine.melody.map(({ midi, duration }) => [midi, duration]), [
  [67, .75], [67, .25],
  [67, 1], [62, 1], [71, .75], [71, .25],
  [71, 1], [67, 1], [67, .75], [71, .25],
  [74, 1.5], [74, .5], [72, .5], [71, .5],
  [69, 2], [69, .75], [71, .25],
  [72, 1], [72, 1], [71, .75], [69, .25],
  [71, 1], [67, 1], [67, .5], [71, .5],
  [69, 1.5], [62, .5], [66, .5], [69, .5],
  [67, 2], [67, .75], [67, .25],
  [67, 1], [62, 1], [71, .75], [71, .25],
  [71, 1], [67, 1], [67, .75], [71, .25],
  [74, 1.5], [74, .5], [72, .5], [71, .5],
  [69, 2], [69, .75], [71, .25],
  [72, 1], [72, 1], [71, .75], [69, .25],
  [71, 1], [67, 1], [67, .5], [71, .5],
  [69, 1.5], [62, .5], [66, .5], [69, .5],
  [67, 2],
], 'Clementine pitches, pickup subdivisions, and syllable durations must match the transposed CC0 MusicXML');

assert.equal(SCORES['row-your-boat'].unit, 'eighth');
assert.equal(SCORES['row-your-boat'].totalBeats, 48);
assert.equal(SCORES['whole-world'].melody[0].beat, -1.5, 'Whole World must sing before beat 1');
const wholeWorldLyrics = new Map(SCORES['whole-world'].melody
  .filter((event) => event.lyric).map((event) => [event.beat, event.lyric]));
assert.deepEqual([0, 2, 2.5, 4.5, 5, 5.5].map((beat) => wholeWorldLyrics.get(beat)),
  ['who—ole', 'wor—', '—old', 'in', 'His', 'hands'],
  'Whole World line one must stretch whole/world, then sing in His hands note by note');
assert.deepEqual([8, 10, 10.5, 12.5, 13, 13.5].map((beat) => wholeWorldLyrics.get(beat)),
  ['whole', 'wide', 'wor—old', 'in', 'His', 'hands'],
  'Whole World line two must use the common whole-wide-world variation');
assert.deepEqual([24, 25, 26, 26.5, 28].map((beat) => wholeWorldLyrics.get(beat)),
  ['whole', 'world', 'in', 'His', 'hands'],
  'Whole World must use its straighter final cadence');
assert.ok(SCORES['whole-world'].melody.at(-1).sustain > SCORES['whole-world'].melody.at(-1).duration,
  'Whole World must let the final hands breathe before the loop pickup');
assert.equal(SCORES['amazing-grace'].melody[0].beat, -1, 'Amazing Grace must retain its one-beat pickup');
const amazingGraceLyricAt = (beat) => SCORES['amazing-grace'].melody
  .find((event) => event.lyric && Math.abs(event.beat - beat) < 1e-9)?.lyric;
assert.ok(SCORES['amazing-grace'].lyricSource?.url,
  'Amazing Grace needs lyric-bearing evidence in addition to its melody source');
assert.ok(SCORES['amazing-grace'].melody.filter((event) => event.lyric)
  .every((event) => !/\s/.test(event.lyric.trim())),
  'Amazing Grace must not collapse several lyric words onto one melody note');
assert.deepEqual([23, 24, 26, 26.5, 27, 29, 30, 32].map(amazingGraceLyricAt),
  ['I', 'once', 'was', 'lost', 'but', 'now', 'am', 'found'],
  'Amazing Grace must begin I once after the held me and keep lost/but/now/am/found aligned');
assert.deepEqual([33, 35, 36, 38, 39, 41].map(amazingGraceLyricAt),
  ['was', 'blind', 'but', 'now—', 'I', 'see—'],
  'Amazing Grace must align the final was blind but now I see cadence note by note');
assert.equal(SCORES['shady-grove'].totalBeats, 16,
  'Shady Grove must fit eight 2/4 measures rather than doubling the Hindman chord slots');
assert.equal(SCORES['shady-grove'].melody.at(-1).beat + SCORES['shady-grove'].melody.at(-1).duration, 16);
assert.deepEqual(SCORES['shady-grove'].melody.filter((event) => event.lyric).map((event) => event.lyric), [
  'Sha-', 'dy', 'Grove', 'my', 'lit-', 'tle', 'love',
  'Sha-', 'dy', 'Grove', 'I', 'know—',
  'Sha-', 'dy', 'Grove', 'my', 'lit-', 'tle', 'love',
  'Bound', 'for', 'the', 'Sha-', 'dy', 'Grove—',
], 'Shady Grove must keep the WSU/Hindman chorus syllables on the literal traditional melody');
assert.equal(SCORES.kumbaya.totalBeats, 24, 'Kumbaya must share its eight-bar 3/4 harmony clock');
assert.equal(SCORES.kumbaya.melody[0].beat, -1, 'Kumbaya must preserve its two-eighth-note vocal pickup');
assert.equal(SCORES.kumbaya.melody.at(-1).beat + SCORES.kumbaya.melody.at(-1).duration, 23,
  'Kumbaya final bar must leave one beat for the anacrusis when the form loops');
assert.deepEqual(SCORES.kumbaya.melody.filter((event) => event.lyric).map((event) => event.lyric), [
  'Kum-', 'ba', 'yah', 'my', 'Lord', 'Kum-', 'ba', 'yah',
  'Kum-', 'ba', 'yah', 'my', 'Lord', 'Kum-', 'ba', 'yah',
  'Kum-', 'ba', 'yah', 'my', 'Lord', 'Kum-', 'ba', 'yah',
  'Oh', 'Lord', 'Kum-', 'ba', 'yah',
], 'Kumbaya must keep all four lyric phrases on the literal Musica Viva melody');
assert.equal(SCORES['will-the-circle'].totalBeats, 32);
assert.equal(SCORES['will-the-circle'].melody[0].beat, -1,
  'the Habershon/Gabriel refrain must preserve its one-beat Will-the pickup');
assert.equal(SCORES['will-the-circle'].melody.at(-1).beat + SCORES['will-the-circle'].melody.at(-1).duration, 31,
  'the source final rest must lead directly into the next loop pickup');
const circleLyrics = SCORES['will-the-circle'].melody.filter((event) => event.lyric).map((event) => event.lyric);
assert.deepEqual(circleLyrics, [
  'Will', 'the', 'cir-', 'cle', 'be', 'un-', 'bro-', 'ken',
  'By', 'and', 'by—', 'by', 'and', 'by?—', 'In', 'a',
  'bet-', 'ter', 'home', 'a-', 'wait-', 'ing', 'In', 'the', 'sky—', 'in', 'the', 'sky—',
], 'Will the Circle must use the complete public-domain hymn refrain wording');
assert.ok(!circleLyrics.some((lyric) => /Lord|There/.test(lyric)),
  'the 1907 score must not mix in later Carter-family chorus words');
assert.equal(SCORES['what-a-friend'].totalBeats, 64);
assert.equal(SCORES['what-a-friend'].melody[0].beat, 0);
assert.equal(SCORES['what-a-friend'].melody.at(-1).beat + SCORES['what-a-friend'].melody.at(-1).duration, 64,
  'What a Friend must preserve every held cadence and phrase rest in sixteen bars');
assert.deepEqual(SCORES['what-a-friend'].melody.filter((event) => event.lyric).map((event) => event.lyric), [
  'What', 'a', 'friend', 'we', 'have', 'in', 'Je-', 'sus',
  'All', 'our', 'sins', 'and', 'griefs', 'to', 'bear—',
  'What', 'a', 'priv-', 'i-', 'lege', 'to', 'car-', 'ry',
  'Ev-', '’ry', 'thing', 'to', 'God', 'in', 'prayer—',
  'Oh', 'what', 'peace', 'we', 'of-', 'ten', 'for-', 'feit',
  'Oh', 'what', 'need-', 'less', 'pain', 'we', 'bear—',
  'All', 'be-', 'cause', 'we', 'do', 'not', 'car-', 'ry',
  'Ev-', '’ry', 'thing', 'to', 'God', 'in', 'prayer—',
], 'What a Friend must keep every first-verse syllable on the literal CONVERSE melody');
assert.equal(Math.round(midiFrequency(69)), 440);

console.log('score tests passed: certified melodies, pickups, lyrics, and harmony share one bounded clock');
