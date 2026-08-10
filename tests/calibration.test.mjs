import assert from 'node:assert/strict';
import { addMicCheckReading, createMicCheck, formatMicCheck, summarizeMicCheck } from '../src/js/lib/calibration.js';

const strings = [{ label: 'Low E (6th)', midi: 40 }];
const [row] = createMicCheck(strings);
for (let i = 0; i < 25; i++) addMicCheckReading(row, { level: 0.02, raw: { freq: 82.41, clarity: 0.8 } }, 82.41);
const summary = summarizeMicCheck(row);
assert.equal(summary.signalPct, 100);
assert.equal(summary.clearPct, 100);
assert.equal(summary.lockPct, 100);
assert.equal(summary.sampled, true);
assert.match(formatMicCheck([row], 'Elgato Wave', 48000), /Low E.*target lock 100%/);

const [quiet] = createMicCheck(strings);
for (let i = 0; i < 25; i++) addMicCheckReading(quiet, { level: 0.001, raw: null }, 82.41);
assert.deepEqual(summarizeMicCheck(quiet), {
  label: 'Low E (6th)', signalPct: 0, clearPct: 0, lockPct: 0,
  medianFreq: null, medianClarity: null, sampled: false,
});

console.log('calibration tests passed');
