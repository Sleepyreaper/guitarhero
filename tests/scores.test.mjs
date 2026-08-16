import assert from 'node:assert/strict';
import { SCORES, midiFrequency } from '../src/js/data/scores.js';
import { ARRANGEMENTS } from '../src/js/data/arrangements.js';

const certified = ['row-your-boat', 'whole-world', 'amazing-grace', 'shady-grove', 'kumbaya'];
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
  assert.ok(last.beat + last.duration <= arrangement.bars.length * arrangement.meter,
    `${id} melody must fit the same clock as its harmony form`);
}

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
assert.equal(Math.round(midiFrequency(69)), 440);

console.log('score tests passed: certified melodies, pickups, lyrics, and harmony share one bounded clock');
