import { scoreFor } from './scores.js';

// Source/transcription certification and human experience checks answer different questions.
// `playback: pass` means a listener familiar with the song recognized and followed the deployed
// playback; it never claims guitar expertise or replaces the documented score audit.
// `expert: pass` is reserved for an experienced guitar teacher/player reviewing the arrangement.
// `student: pass` means a pilot learner could understand, follow, and finish the song.
export const SONG_REVIEWS = Object.freeze({
  'row-your-boat': {
    playback: 'pass', playbackAt: '2026-08-15', playbackReviewer: 'Project owner',
    expert: 'pending', student: 'pending',
    note: 'Owner recognized and followed the complete melody and 6/8 loop. Expert guitar review and a supervised student session remain.',
  },
  'whole-world': {
    playback: 'pass', playbackAt: '2026-08-15', playbackReviewer: 'Project owner',
    expert: 'pending', student: 'pending',
    note: 'Owner recognized and followed the complete two-loop ABAC phrasing. Expert guitar review and a supervised student session remain.',
  },
  'amazing-grace': {
    playback: 'pass', playbackAt: '2026-08-15', playbackReviewer: 'Project owner',
    expert: 'pending', student: 'pending',
    note: 'Owner recognized and followed the complete lyric, cadence, and loop. Expert guitar review and a supervised student session remain.',
  },
});

export function songQuality(songOrId) {
  const id = typeof songOrId === 'string' ? songOrId : songOrId.id;
  const score = scoreFor(id);
  const review = SONG_REVIEWS[id] || { playback: 'pending', expert: 'pending', student: 'pending' };
  const scoreComplete = score?.status === 'certified';
  const playbackPassed = review.playback === 'pass';
  const expertReviewed = review.expert === 'pass';
  const pilotReady = scoreComplete && playbackPassed;
  const studentApproved = pilotReady && review.student === 'pass';

  const facts = { scoreComplete, playbackPassed, expertReviewed, pilotReady, studentApproved, ...review };
  if (studentApproved) return { stage: 'student-approved', label: 'Student approved', tone: 'green', ...facts };
  if (pilotReady) return { stage: 'pilot-ready', label: 'Pilot ready', tone: 'green', ...facts };
  if (scoreComplete) return { stage: 'score-review', label: review.playback === 'in-progress' ? 'Playback QA active' : 'Playback QA pending', tone: 'gold', ...facts };
  return { stage: 'accompaniment', label: 'Accompaniment only', tone: '', ...facts };
}

export const guidedTarget = (target) => Boolean(target.tutorial && target.bridge);
