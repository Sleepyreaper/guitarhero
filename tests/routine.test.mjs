import assert from 'node:assert/strict';
import { buildRoutine } from '../src/js/views/routine.js';

const newPlayer = buildRoutine([], 'church');
assert.equal(newPlayer.length, 4);
assert.match(newPlayer[1].title, /Meet your guitar/);
assert.equal(newPlayer[2].href, '#/warmup');
assert.doesNotMatch(newPlayer[3].title, /^Play /,
  'a learner with no chords must not be sent to an unavailable song');

const firstChords = buildRoutine(['l1-1', 'l1-2'], 'mixed');
assert.equal(firstChords[2].href, '#/train', 'Em and G should unlock a real chord-change drill');
assert.notEqual(firstChords[3].href, '#/songs/row-your-boat',
  'the real Row Your Boat arrangement must stay locked until D7 is explicitly learned');

const core = buildRoutine(['l1-1', 'l1-2', 'l2-1'], 'church');
assert.ok(core[3].href.startsWith('#/songs/'));
assert.notEqual(core[3].href, '#/songs/down-in-the-valley',
  'D must not make a D7 song appear in the adaptive routine');

const throughCountry = ['l0-1', 'l0-2', 'l0-3', 'l1-0', 'l1-1', 'l1-2', 'l1-fingers', 'l1-3', 'l1-4', 'l1-5',
  'l2-1', 'l2-2', 'l2-shady', 'l2-3', 'l2-4', 'l3-1', 'l3-2'];
const countryStage = buildRoutine(throughCountry, 'country');
assert.match(countryStage[2].title, /groove/i,
  'the daily mechanics block must become rhythm-specific when the learner reaches the groove stage');
assert.equal(countryStage[2].href, '#/metronome');

console.log('routine tests passed: daily work adapts from first sound to honest unlocked songs');
