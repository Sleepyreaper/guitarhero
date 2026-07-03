import { ALL_LESSONS, LESSON_BY_ID } from '../data/curriculum.js';
import { getState, doneCount, isDone } from '../lib/storage.js';

const TOOLS = [
  { href: '#/learn', ico: '📚', h: 'Learn', p: 'A step-by-step path from zero to real songs.' },
  { href: '#/songs', ico: '🎵', h: 'Songs', p: 'Play-along charts for public-domain classics.' },
  { href: '#/chords', ico: '🎸', h: 'Chords', p: 'The beginner shapes with diagrams you can hear.' },
  { href: '#/tuner', ico: '🎯', h: 'Tuner', p: 'Get in tune with your mic before you play.' },
  { href: '#/metronome', ico: '🥁', h: 'Metronome', p: 'Build rock-solid timing from day one.' },
];

export default {
  render(root) {
    const s = getState();
    const total = ALL_LESSONS.length;
    const done = doneCount();
    const pct = Math.round((done / total) * 100);
    const next = ALL_LESSONS.find((l) => !isDone(l.id)) || ALL_LESSONS[total - 1];
    const nextUnitDone = done > 0;

    root.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Country · Folk · Americana · Church</p>
        <h1>Pick it up. Play a real song today.</h1>
        <p class="lead">A from-zero coach for 6-string acoustic. Learn the handful of chords that unlock
        thousands of songs — the fast, song-first way.</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn btn-primary" href="#/learn/${next.id}">${nextUnitDone ? 'Continue learning' : 'Start lesson 1'} →</a>
          <a class="btn" href="#/tuner">🎯 Tune up first</a>
        </div>
      </section>

      <section class="panel" style="margin-bottom:1.1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
          <div>
            <p class="eyebrow" style="margin:0">Your progress</p>
            <h2 style="margin:.1rem 0">${done ? `Next up: ${next.title}` : 'Ready when you are'}</h2>
          </div>
          <div class="stat-row">
            <div class="stat"><div class="n">${done}/${total}</div><div class="l">lessons</div></div>
            <div class="stat"><div class="n">${s.streak}</div><div class="l">day streak</div></div>
            <div class="stat"><div class="n">${pct}%</div><div class="l">complete</div></div>
          </div>
        </div>
        <div class="progress-track" style="margin-top:1rem"><div class="progress-fill" style="width:${pct}%"></div></div>
      </section>

      <div class="callout" style="margin-bottom:1.1rem">
        <strong>The 20-minute promise:</strong> Unit 1 → 2 gets you playing <em>Down in the Valley</em> with just
        two chords. Learning songs early is the single best way to stay motivated and improve fast.
      </div>

      <div class="grid cards-3">
        ${TOOLS.map((t) => `
          <a class="panel tool-card" href="${t.href}">
            <span class="ico">${t.ico}</span>
            <h3>${t.h}</h3>
            <p>${t.p}</p>
          </a>`).join('')}
      </div>
    `;
  },
  destroy() {},
};
