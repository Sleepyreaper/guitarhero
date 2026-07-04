import { ALL_LESSONS } from '../data/curriculum.js';
import { SONGS } from '../data/songs.js';
import { TARGET_SONGS } from '../data/targets.js';
import { getState, doneCount, isDone } from '../lib/storage.js';

const TOOLS = [
  { href: '#/learn', ico: '📚', h: 'Learn', p: 'A step-by-step path from zero to real songs.' },
  { href: '#/songs', ico: '🎵', h: 'Songs', p: 'Play-along charts + real songs to aim for.' },
  { href: '#/chords', ico: '🎸', h: 'Chords', p: 'The beginner shapes with diagrams you can hear.' },
  { href: '#/tuner', ico: '🎯', h: 'Tuner', p: 'Get in tune with your mic before you play.' },
  { href: '#/metronome', ico: '🥁', h: 'Metronome', p: 'Build rock-solid timing from day one.' },
];

// Once you can play a chord, its easy cousins come almost for free.
const EQUIV = { D: ['D7'], G: ['G7'], Em: ['Em7'], C: ['Cadd9'] };
function expandLearned(set) {
  const out = new Set(set);
  for (const c of set) (EQUIV[c] || []).forEach((e) => out.add(e));
  return out;
}

export default {
  render(root) {
    const s = getState();
    const total = ALL_LESSONS.length;
    const done = doneCount();
    const pct = Math.round((done / total) * 100);
    const next = ALL_LESSONS.find((l) => !isDone(l.id)) || ALL_LESSONS[total - 1];

    // Chords you've learned (from completed chord lessons) → songs you can now play.
    const learnedBase = [...new Set(ALL_LESSONS.filter((l) => l.chords && isDone(l.id)).flatMap((l) => l.chords))];
    const learned = expandLearned(new Set(learnedBase));
    const canPlay = SONGS.filter((so) => so.chords.every((c) => learned.has(c)));
    const canPlayTargets = TARGET_SONGS.filter((t) => t.chords.every((c) => learned.has(c)));
    // Suggest the next lesson that teaches a chord you don't already know.
    const nextChordLesson = ALL_LESSONS.find((l) => l.chords && !isDone(l.id) && l.chords.some((c) => !learned.has(c)));
    const newChords = nextChordLesson ? nextChordLesson.chords.filter((c) => !learned.has(c)) : [];
    const nextHint = newChords.length
      ? `Learn <strong>${newChords.join(' & ')}</strong> next to unlock more songs.`
      : `You've learned every chord — go play!`;

    let unlockHtml;
    if (learnedBase.length === 0) {
      unlockHtml = `<p class="muted" style="margin:.3rem 0 0">Finish your first chord lesson and songs start unlocking right here. ${nextHint}</p>`;
    } else if (canPlay.length === 0) {
      unlockHtml = `<p class="muted" style="margin:.3rem 0 0">You know <strong>${learnedBase.join(', ')}</strong>. ${nextHint}</p>`;
    } else {
      unlockHtml = `
        <div class="tag-row" style="margin-top:.55rem">
          ${canPlay.map((so) => `<a class="pill green" style="text-decoration:none" href="#/songs/${so.id}">${so.title}</a>`).join('')}
        </div>
        ${canPlayTargets.length ? `<p class="muted" style="margin:.6rem 0 0">+ ${canPlayTargets.length} radio song${canPlayTargets.length > 1 ? 's' : ''} you can aim for — see <a href="#/songs">Songs</a>.</p>` : ''}
        <p class="faint" style="margin:.5rem 0 0">${nextHint}</p>`;
    }

    root.innerHTML = `
      <section class="hero">
        <p class="eyebrow">Country · Folk · Americana · Church</p>
        <h1>Pick it up. Play a real song today.</h1>
        <p class="lead">A from-zero coach for 6-string acoustic. Learn the handful of chords that unlock
        thousands of songs — the fast, song-first way.</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn btn-primary" href="#/learn/${next.id}">${done ? 'Continue learning' : 'Start lesson 1'} →</a>
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

      <section class="panel" style="margin-bottom:1.1rem">
        <p class="eyebrow" style="margin:0">🎸 Songs you can play now</p>
        ${unlockHtml}
      </section>

      <div class="callout" style="margin-bottom:1.1rem">
        <strong>The 2-chord promise:</strong> Unit 1 already gets you playing <em>Shady Grove</em> with just
        <em>Em</em> and <em>G</em>. Sore fingertips are normal and temporary — short, daily practice beats long painful sessions.
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
