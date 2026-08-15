import assert from 'node:assert/strict';
import {
  addChordCheckReading, createChordCheck, formatChordCheck, summarizeChordCheck,
} from '../src/js/lib/chordCalibration.js';

const [em] = createChordCheck(['Em']);
for (let i = 0; i < 40; i++) {
  addChordCheckReading(em, { name: i < 36 ? 'Em' : 'G', sim: 0.91, margin: 0.045 },
    { active: true, maxDb: -31, noiseGateDb: -52 }, i < 38, i < 36, 0.89);
}
const summary = summarizeChordCheck(em);
assert.equal(summary.sampled, true);
assert.equal(summary.heard, 'Em');
assert.equal(summary.clearPct, 95);
assert.equal(summary.targetPct, 90);
assert.equal(summary.medianSimilarity, 0.91);
assert.equal(summary.medianMargin, 0.045);
assert.equal(summary.medianTargetSimilarity, 0.89);

addChordCheckReading(em, { name: 'C', sim: 1, margin: 1 }, { active: false }, true, true);
assert.equal(em.samples.length, 40, 'silence must not count as chord evidence');

const report = formatChordCheck([em], 'Elgato Wave:3', 96000);
assert.match(report, /derived measurements only; no audio/);
assert.match(report, /Em: heard Em \| clear 95% \| target lock 90%/);
assert.match(report, /sample rate: 96000 Hz/i);

console.log('chord calibration tests passed: sampling, confidence, target lock, and privacy-safe report');
