import assert from 'node:assert/strict';
import { addMicCheckReading, createMicCheck, formatMicCheck, summarizeMicCheck } from '../src/js/lib/calibration.js';
import { calibrateChromaNoise, subtractChromaFloor } from '../src/js/lib/chroma.js';

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

const roomProfile = [0.04, 0.01, 0.02, 0.01, 0.03, 0.01, 0.01, 0.02, 0.01, 0.03, 0.01, 0.02];
const calibrated = calibrateChromaNoise([
  { chroma: roomProfile, maxDb: -61 },
  { chroma: roomProfile.map((value) => value * 1.05), maxDb: -60 },
  { chroma: roomProfile.map((value) => value * 0.95), maxDb: -59 },
]);
assert.equal(calibrated.gateDb, -50, 'chord gate should sit 10 dB above the median room peak');
const guitarOverRoom = [...roomProfile];
guitarOverRoom[0] += 0.8;
guitarOverRoom[4] += 0.65;
guitarOverRoom[7] += 0.7;
const cleaned = subtractChromaFloor(guitarOverRoom, calibrated.profile, 1.5);
assert.ok(cleaned[0] === 1 && cleaned[4] > 0.7 && cleaned[7] > 0.8,
  'noise subtraction should preserve strong guitar pitch classes');
assert.ok(cleaned[1] === 0 && cleaned[3] === 0, 'steady room-only pitch classes should be removed');

console.log('calibration tests passed: mic report plus adaptive tuner/chord room floors');
