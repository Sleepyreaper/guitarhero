import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/js/lib/storage.js', import.meta.url), 'utf8');
const { mergeStates } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const local = {
  done: { localLesson: 20, sharedLesson: 10 },
  practiceSeconds: { monday: 90 },
  bestChanges: { 'Em-G': 8 },
  skillProofs: { 'clean-em': 10 },
  feedback: { localLesson: { rating: 'clear' } },
  profile: { genre: 'church', hand: 'left' },
  routine: { monday: { warmup: true } },
};
const remote = {
  done: { remoteLesson: 30, sharedLesson: 50 },
  practiceSeconds: { monday: 60, sunday: 120 },
  bestChanges: { 'Em-G': 5, 'G-C': 4 },
  skillProofs: { 'clean-g': 15 },
  feedback: { remoteLesson: { rating: 'stuck' } },
  profile: { genre: 'country', hand: 'right' },
  routine: { monday: { tune: true } },
};

const merged = mergeStates(local, remote);
assert.deepEqual(merged.done, { remoteLesson: 30, sharedLesson: 50, localLesson: 20 });
assert.deepEqual(merged.practiceSeconds, { monday: 90, sunday: 120 });
assert.deepEqual(merged.bestChanges, { 'Em-G': 8, 'G-C': 4 });
assert.deepEqual(merged.skillProofs, { 'clean-g': 15, 'clean-em': 10 });
assert.deepEqual(merged.routine.monday, { tune: true, warmup: true });
assert.deepEqual(merged.profile, local.profile, 'guest preferences should follow the learner into an account');
assert.equal(merged.feedback.localLesson.rating, 'clear');
assert.equal(merged.feedback.remoteLesson.rating, 'stuck');

console.log('storage tests passed: guest and account progress merge without losing best results');
