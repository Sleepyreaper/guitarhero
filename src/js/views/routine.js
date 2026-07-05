import { isRoutineStepDone, toggleRoutineStep, routineDoneCount } from '../lib/storage.js';

const STEPS = [
  { id: 'tune', ico: '🎯', min: 1, title: 'Tune up', href: '#/tuner',
    blurb: 'An out-of-tune guitar makes everything sound wrong. Thirty seconds well spent.' },
  { id: 'warmup', ico: '🤸', min: 3, title: 'Warm up your fingers', href: '#/warmup',
    blurb: 'A couple minutes of the 1·2·3·4 drill. Loosens the hand and makes chords easier.' },
  { id: 'changes', ico: '🏋️', min: 3, title: 'Drill a chord change', href: '#/train',
    blurb: 'Sixty seconds on the change trainer. Try to beat yesterday\'s number.' },
  { id: 'song', ico: '🎵', min: 8, title: 'Play a song', href: '#/songs',
    blurb: 'The fun part — play something you can actually play, even slow and clunky.' },
];

export default {
  render(root) {
    const total = STEPS.reduce((n, s) => n + s.min, 0);

    const draw = () => {
      const doneN = routineDoneCount();
      root.innerHTML = `
        <p class="eyebrow">Daily plan · ~${total} minutes</p>
        <h1>Today's practice</h1>
        <p class="lead">Not sure what to practice? Do these four, in order. Small and daily beats long and rare —
        this is the whole routine.</p>

        <div class="progress-track" style="margin:0 0 1.2rem"><div class="progress-fill" style="width:${Math.round((doneN / STEPS.length) * 100)}%"></div></div>

        <div class="stack">
          ${STEPS.map((s) => {
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

        ${doneN === STEPS.length
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
