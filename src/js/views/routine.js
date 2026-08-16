import { ALL_LESSONS, STAGE_BY_LESSON } from '../data/curriculum.js';
import { SONGS } from '../data/songs.js';
import { getProfile, isDone, isRoutineStepDone, toggleRoutineStep } from '../lib/storage.js';

const BASE_STEPS = [
  { id: 'tune', ico: '🎯', min: 1, title: 'Tune up', href: '#/tuner',
    blurb: 'An out-of-tune guitar makes everything sound wrong. Thirty seconds well spent.' },
];

export function buildRoutine(doneIds = [], genre = 'mixed') {
  const done = new Set(doneIds);
  const next = ALL_LESSONS.find((lesson) => !done.has(lesson.id)) || ALL_LESSONS.at(-1);
  const stage = STAGE_BY_LESSON[next.id];
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

  const mechanicByStage = {
    w1: { ico: '🤸', title: 'Build relaxed finger control', href: '#/warmup',
      blurb: 'Use the slow 1·2·3·4 drill. Stop for pain; minimum pressure and accurate placement win.' },
    w2: { ico: '🏋️', title: 'Drill Em ↔ G', href: '#/train',
      blurb: 'Count only clean changes. Keep fingers close and move the shape without rushing.' },
    w3: { ico: '🏋️', title: 'Drill today’s G–C–D pair', href: '#/train',
      blurb: 'Select the two shapes giving you the most trouble and count clean changes only.' },
    w4: { ico: '🧭', title: 'Rehearse one lyric-timed change', href: '#/songs',
      blurb: 'Loop the hardest line before attempting the whole verse.' },
    w5: { ico: '🥁', title: 'Separate the groove from the chords', href: '#/metronome',
      blurb: 'Mute the strings and make today’s rhythm steady before adding chord changes.' },
    w6: { ico: '🎼', title: 'Read and land one short fill', href: '#/learn/l4-tab',
      blurb: 'Play B0–B3–e3 evenly, then return to G on beat 1.' },
    w7: { ico: '🔢', title: 'Call the numbers aloud', href: '#/learn/l5-2',
      blurb: 'Play G–C–D–G while saying 1–4–5–1; then try 1–5–6m–4.' },
    w8: { ico: '🖐️', title: 'Steady the alternating thumb', href: '#/learn/l6-2',
      blurb: 'Thumb alone first. Add one upper note only when the bass stays even.' },
    w9: { ico: '🎤', title: 'Practice a clean count-in and ending', href: '#/learn/l7-4',
      blurb: 'Count the correct meter, play four bars, and finish together on the home chord.' },
  };
  const chosenMechanic = learned.has('Em') && learned.has('G') && stage?.id === 'w1'
    ? mechanicByStage.w2
    : mechanicByStage[stage?.id] || mechanicByStage.w1;
  const mechanics = { id: 'mechanics', min: 3, ...chosenMechanic };

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
        <p class="eyebrow">${stage?.label || 'Daily plan'} · ~${total} minutes</p>
        <h1>Today's practice</h1>
        <p class="lead">Do these four in order: tune, learn, isolate the mechanical problem, then make music.
        Repeat this stage until its checkpoint is dependable; the calendar never pushes you forward.</p>

        <div class="progress-track" style="margin:0 0 1.2rem"><div class="progress-fill" style="width:${Math.round((doneN / steps.length) * 100)}%"></div></div>

        <div class="stack">
          ${steps.map((s) => {
            const done = isRoutineStepDone(s.id);
            return `
              <div class="panel routine-step ${done ? 'done' : ''}">
                <button class="lesson-check ${done ? 'done' : ''}" data-step="${s.id}"
                  aria-label="Mark ${s.title} ${done ? 'not done' : 'done'}">${done ? '✓' : ''}</button>
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
