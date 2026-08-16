import assert from 'node:assert/strict';
import { SONGS } from '../src/js/data/songs.js';
import { TARGET_SONGS } from '../src/js/data/targets.js';
import { SCORES } from '../src/js/data/scores.js';
import { SONG_REVIEWS, guidedTarget, songQuality } from '../src/js/data/quality.js';

assert.equal(SONGS.length, 23, 'catalog changes must be intentional and update the quality baseline');
assert.equal(Object.keys(SCORES).length, 3, 'score-complete count must be reviewed when it changes');
assert.equal(TARGET_SONGS.length, 27, 'modern target changes must be intentional and update the quality baseline');
assert.equal(Object.keys(SONG_REVIEWS).length, Object.keys(SCORES).length,
  'every score-complete song needs explicit playback, expert, and student review records');
assert.equal(SONGS.filter((song) => songQuality(song).pilotReady).length, 3,
  'pilot-ready baseline changes must be deliberate and follow a recorded playback-recognition pass');
assert.equal(SONGS.filter((song) => songQuality(song).studentApproved).length, 0,
  'student-approved baseline changes must follow an observed learner session');

for (const id of Object.keys(SCORES)) {
  assert.ok(SONGS.some((song) => song.id === id), `${id} score must belong to a song`);
  assert.ok(SONG_REVIEWS[id], `${id} score needs a human review entry`);
  assert.match(SONG_REVIEWS[id].playback, /^(pending|in-progress|pass)$/,
    `${id} needs a valid playback-recognition state`);
  assert.match(SONG_REVIEWS[id].expert, /^(pending|pass)$/,
    `${id} needs a separate expert-guitar state`);
  assert.match(SONG_REVIEWS[id].student, /^(pending|pass)$/,
    `${id} needs a valid student state`);
  assert.ok(SONG_REVIEWS[id].note, `${id} review must name the next concrete check`);
  if (SONG_REVIEWS[id].playback === 'pass') {
    assert.ok(SONG_REVIEWS[id].playbackAt && SONG_REVIEWS[id].playbackReviewer,
      `${id} playback pass needs a date and accountable reviewer`);
  }
  if (SONG_REVIEWS[id].expert === 'pass') {
    assert.ok(SONG_REVIEWS[id].expertReviewedAt && SONG_REVIEWS[id].expertReviewer,
      `${id} expert pass needs a date and accountable guitar reviewer`);
  }
  if (SONG_REVIEWS[id].student === 'pass') {
    assert.ok(SONG_REVIEWS[id].studentTestedAt && SONG_REVIEWS[id].studentTest,
      `${id} student pass needs a dated, behavior-based session note`);
  }
  assert.equal(songQuality(id).pilotReady, SONG_REVIEWS[id].playback === 'pass',
    `${id} cannot become pilot ready without a playback-recognition pass`);
  assert.equal(songQuality(id).expertReviewed, SONG_REVIEWS[id].expert === 'pass',
    `${id} must not imply an expert guitar review`);
  assert.equal(songQuality(id).studentApproved,
    SONG_REVIEWS[id].playback === 'pass' && SONG_REVIEWS[id].student === 'pass',
    `${id} cannot become student approved before both human gates pass`);
}

assert.equal(TARGET_SONGS.filter(guidedTarget).length, 8,
  'curated modern bridge changes must be intentional and update the quality baseline');
assert.ok(TARGET_SONGS.filter((target) => !guidedTarget(target)).length > 0,
  'uncurated targets must remain visibly separate from completed lesson bridges');

console.log('quality tests passed: source, playback, expert, and student gates remain distinct');
