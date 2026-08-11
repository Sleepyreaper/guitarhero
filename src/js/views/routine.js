import { ALL_LESSONS } from '../data/curriculum.js';
import { SONGS } from '../data/songs.js';
import { getProfile, isDone, isRoutineStepDone, toggleRoutineStep } from '../lib/storage.js';

const BASE_STEPS = [
  { id: 'tune', ico: '🎯', min: 1, title: 'Tune up', href: '#/tuner',
    blurb: 'An out-of-tune guitar makes everything sound wrong. Thirty seconds well spent.' },
];

export function buildRoutine(doneIds = [], genre = 'mixed') {
  const done = new Set(doneIds);
  const next = ALL_LESSONS.find((lesson) => !done.has(lesson.id)) || ALL_LESSONS.at(-1);
  const learned = new Set(ALL_LESSONS
    .filter((lesson) => done.has(lesson.id))
    .flatMap((lesson) => lesson.chords || []));
  const playable = SONGS
    .filter((song) => song.chords.every((chord) => learned.has(chord)))
    .sort((a, b) => {
      const preferred = genre !== 'mixed' && a.genres.includes(genre) ? -1 : 0;
      const preferredB = genre !== 'mixed' && b.genres.includes(genre) ? -1 : 0;
      const kids = a.genres.every((item) => item === 'kids') ? 1 : 0;
      const kidsB = b.genres.every((item) => item === 'kids') ? 1 : 0;
      const starter = a.id === 'row-your-boat' ? -1 : 0;
      const starterB = b.id === 'row-your-boat' ? -1 : 0;
      return preferred - preferredB || kids - kidsB || starter - starterB
        || a.level - b.level || a.title.localeCompare(b.title);
    });

  const mechanics = done.has('l1-1') && done.has('l1-2')
    ? { id: 'mechanics', ico: '🏋️', min: 3, title: 'Drill Em ↔ G', href: '#/train',
      blurb: 'You know both shapes now. Count only clean changes and try to beat your own number.' }
    : { id: 'mechanics', ico: '🤸', min: 3, title: 'Build finger control', href: '#/warmup',
      blurb: 'Use the slow 1·2·3·4 drill. Stop if the hand hurts; relaxed accuracy is the goal.' };

  const music = playable[0]
    ? { id: 'music', ico: '🎵', min: 8, title: `Play ${playable[0].title}`, href: `#/songs/${playable[0].id}`,
      blurb: `Every required shape is already in your hands. Play it slowly and keep the pulse moving.` }
    : { id: 'music', ico: '🎸', min: 5, title: 'Make today’s sound', href: `#/learn/${next.id}`,
      blurb: 'No song is unlocked yet. Finish with the sound from today’s lesson instead of guessing at unfamiliar chords.' };

  return [
    ...BASE_STEPS,
    { id: 'lesson', ico: '📚', min: next.min, title: `Continue: ${next.title}`, href: `#/learn/${next.id}`,
      blurb: next.objective },
    mechanics,
    music,
  ];
}

export default {
  render(root) {
    const doneIds = ALL_LESSONS.filter((lesson) => isDone(lesson.id)).map((lesson) => lesson.id);
    const steps = buildRoutine(doneIds, getProfile()?.genre || 'mixed');
    const total = steps.reduce((n, s) => n + s.min, 0);

    const draw = () => {
      const doneN = steps.filter((step) => isRoutineStepDone(step.id)).length;
      root.innerHTML = `
        <p class="eyebrow">Daily plan · ~${total} minutes</p>
        <h1>Today's practice</h1>
        <p class="lead">Not sure what to practice? Do these four, in order. Small and daily beats long and rare —
        this is the whole routine.</p>

        <div class="progress-track" style="margin:0 0 1.2rem"><div class="progress-fill" style="width:${Math.round((doneN / STEPS.length) * 100)}%"></div></div>

        <div class="stack">
          ${steps.map((s) => {
            const done = isRoutineStepDone(s.id);
            return `
              <div class="panel routine-step ${done ? 'done' : ''}">
                <button class="lesson-check ${done ? 'done' : ''}" data-step="${s.id}" aria-label="toggle done">${done ? '✓' : ''}</button>
                <div style="flex:1">
                  <div style="display:flex;align-items:baseline;gap:.5rem;flex-wrap:wrap">
                    <span style="font-size:1.2rem">${s.ico}</span>
                    <strong>${s.title}</strong>
                    <span class="pill">${s.min} min</span>
                  </div>
                  <p class="muted" style="margin:.25rem 0 0">${s.blurb}</p>
                </div>
                <a class="btn" href="${s.href}">Go →</a>
              </div>`;
          }).join('')}
        </div>

        ${doneN === steps.length
          ? `<div class="callout" style="margin-top:1.2rem;border-color:var(--green)">🎉 That's a full practice session. Nicely done — see you tomorrow.</div>`
          : `<p class="faint" style="margin-top:1rem">Tick each one off as you go. It resets tomorrow.</p>`}
      `;

      root.querySelectorAll('.lesson-check[data-step]').forEach((btn) => {
        btn.addEventListener('click', () => { toggleRoutineStep(btn.dataset.step); draw(); });
      });
    };

    draw();
  },
  destroy() {},
};
