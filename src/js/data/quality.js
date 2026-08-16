import { scoreFor } from './scores.js';

// Human review is deliberately separate from structural score certification. A source-aligned
// timeline can pass every automated test and still phrase poorly through Campfire's synth.
// `listening: pass` means an adult musician has heard the deployed Hear mode end to end.
// `student: pass` means a pilot learner could recognize, follow, and finish the song.
export const SONG_REVIEWS = Object.freeze({
  'row-your-boat': {
    listening: 'pending', student: 'pending',
    note: 'Run a full round-aware listening pass and verify the 6/8 two-pulse feel.',
  },
  'whole-world': {
    listening: 'in-progress', student: 'pending',
    note: 'Owner phrasing review is active; confirm all four lines after the ABAC lyric rebuild.',
  },
  'amazing-grace': {
    listening: 'pending', student: 'pending',
    note: 'Audit syllable-to-note phrasing and every G7/D7 change before pilot use.',
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
