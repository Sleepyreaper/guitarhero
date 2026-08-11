import assert from 'node:assert/strict';
import { calibratedPracticeGate } from '../src/js/lib/practice.js';

assert.equal(calibratedPracticeGate([]), 0.006);
assert.equal(calibratedPracticeGate([0.001, 0.002, 0.003]), 0.006);
assert.equal(calibratedPracticeGate([0.004, 0.004, 0.005]), 0.012);
assert.equal(calibratedPracticeGate([NaN, -1, 0.002]), 0.006);

console.log('practice gate tests passed: quiet rooms, noisy rooms, minimum sensitivity');
