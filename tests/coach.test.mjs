import assert from 'node:assert/strict';
import { ChordJudge } from '../src/js/lib/coach.js';

const judge = new ChordJudge(0.5);
const first = new Array(12).fill(0);
first[7] = 1;
judge.push(first, true);
assert.equal(judge.profile()[7], 0.5, 'the first active frame should enter the smoothed chord profile');

const second = new Array(12).fill(0);
second[7] = 0.8;
second[11] = 0.4;
judge.push(second, true);
assert.equal(judge.profile()[7], 0.65);
assert.equal(judge.profile()[11], 0.2);

const exposed = judge.profile();
exposed[7] = 0;
assert.equal(judge.profile()[7], 0.65, 'callers must not be able to mutate the listener smoothing state');

judge.reset();
assert.ok(judge.profile().every((value) => value === 0), 'a chord change must clear stale note coverage');

console.log('coach tests passed: guided note coverage uses stable, resettable chord smoothing');
