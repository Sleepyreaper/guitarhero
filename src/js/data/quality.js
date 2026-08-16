import { scoreFor } from './scores.js';

// Human review is deliberately separate from structural score certification. A source-aligned
// timeline can pass every automated test and still phrase poorly through Campfire's synth.
// `listening: pass` means an adult musician has heard the deployed Hear mode end to end.
// `student: pass` means a pilot learner could recognize, follow, and finish the song.
export const SONG_REVIEWS = Object.freeze({
  'row-your-boat': {
    listening: 'pass', listenedAt: '2026-08-15', listener: 'Project owner', student: 'pending',
    note: 'Owner passed the complete melody, 6/8 two-pulse, and loop review; supervised student session is next.',
  },
  'whole-world': {
    listening: 'pass', listenedAt: '2026-08-15', listener: 'Project owner', student: 'pending',
    note: 'Owner passed the complete two-loop ABAC phrasing review; supervised student session is next.',
  },
  'amazing-grace': {
    listening: 'pass', listenedAt: '2026-08-15', listener: 'Project owner', student: 'pending',
    note: 'Owner passed the complete lyric, cadence, and loop review; supervised student session is next.',
  },
});

export function songQuality(songOrId) {
  const id = typeof songOrId === 'string' ? songOrId : songOrId.id;
  const score = scoreFor(id);
  const review = SONG_REVIEWS[id] || { listening: 'pending', student: 'pending' };
  const scoreComplete = score?.status === 'certified';
  const pilotReady = scoreComplete && review.listening === 'pass';
  const studentApproved = pilotReady && review.student === 'pass';

  if (studentApproved) return { stage: 'student-approved', label: 'Student approved', tone: 'green', scoreComplete, pilotReady, studentApproved, ...review };
  if (pilotReady) return { stage: 'pilot-ready', label: 'Pilot ready', tone: 'green', scoreComplete, pilotReady, studentApproved, ...review };
  if (scoreComplete) return { stage: 'score-review', label: review.listening === 'in-progress' ? 'Listening QA active' : 'Listening QA pending', tone: 'gold', scoreComplete, pilotReady, studentApproved, ...review };
  return { stage: 'accompaniment', label: 'Accompaniment only', tone: '', scoreComplete, pilotReady, studentApproved, ...review };
}

export const guidedTarget = (target) => Boolean(target.tutorial && target.bridge);
