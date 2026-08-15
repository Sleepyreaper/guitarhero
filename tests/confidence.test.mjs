import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/js/lib/confidence.js', import.meta.url), 'utf8');
const { isConfidentMatch, isGuidedMatch } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

assert.equal(isConfidentMatch({ name: 'G', sim: 0.93, margin: 0.08 }), true, 'clear winner should pass');
assert.equal(isConfidentMatch({ name: 'G', sim: 0.82, margin: 0.12 }), false, 'weak resemblance should fail');
assert.equal(isConfidentMatch({ name: 'G', sim: 0.93, margin: 0.01 }), false, 'ambiguous winner should fail');
assert.equal(isConfidentMatch({ name: null, sim: 1, margin: 1 }), false, 'missing chord should fail');
assert.equal(isConfidentMatch({ name: 'Em', sim: 0.81, margin: 0.04 }, 0.8), true, 'tool-specific similarity threshold should work');
assert.equal(isGuidedMatch({ name: 'G', sim: 0.80 }, { coverage: 1 }), true,
  'a measured guided G should pass without needing to beat richer templates');
assert.equal(isGuidedMatch({ name: 'D', sim: 0.74 }, { coverage: 1 }), true,
  'the measured acoustic D should pass when all three chord tones are present');
assert.equal(isGuidedMatch({ name: 'C', sim: 0.79 }, { coverage: 2 / 3 }), false,
  'a guided chord must still contain all of its target pitch classes');
assert.equal(isGuidedMatch({ name: 'C', sim: 0.67 }, { coverage: 1 }), false,
  'shared notes from a different clean triad must not pass');
assert.equal(isGuidedMatch({ name: 'D', sim: 0.67 }, { coverage: 2 / 3 }, 0.72, 'D'), true,
  'the measured winning acoustic D should survive one temporarily weak chord tone');
assert.equal(isGuidedMatch({ name: 'D', sim: 0.67 }, { coverage: 2 / 3 }, 0.72, 'Em'), false,
  'partial coverage must not pass when another chord wins the open-ended ranking');
assert.equal(isGuidedMatch({ name: 'D', sim: 0.55 }, { coverage: 1 }, 0.72, 'D'), false,
  'a weak resemblance must fail even when its name happens to rank first');

console.log('confidence tests passed: open-ended and guided chord policies');
