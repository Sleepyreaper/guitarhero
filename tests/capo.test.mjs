import assert from 'node:assert/strict';
import { rotatePitchVector, transposeFrequencies, transposeKey } from '../src/js/lib/capo.js';
import { rankChords, TEMPLATES } from '../src/js/lib/coach.js';

assert.equal(transposeKey('G', 0), 'G');
assert.equal(transposeKey('G', 2), 'A');
assert.equal(transposeKey('G', 3), 'Bb');
assert.equal(transposeKey('Am', 4), 'Dbm');
assert.equal(transposeKey('Bb', -2), 'Ab');

const raised = transposeFrequencies([82.41, 110], 2);
assert.ok(Math.abs(raised[0] / 82.41 - Math.pow(2, 2 / 12)) < 1e-10);

const gTemplate = TEMPLATES.find((template) => template.name === 'G').vec;
const capoTwoG = rotatePitchVector(gTemplate, 2).map((value) => value * 100);
assert.equal(rankChords(capoTwoG, 2)[0].name, 'G', 'capo-aware listener should report the played shape name');
assert.notEqual(rankChords(capoTwoG, 0)[0].name, 'G', 'uncapoed templates should not mislabel shifted audio as G');

console.log('capo tests passed: key labels, backing pitch, and capo-aware chord listening');
