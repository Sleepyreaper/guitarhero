import { ALL_LESSONS } from '../data/curriculum.js';
import { SONGS } from '../data/songs.js';
import { TARGET_SONGS } from '../data/targets.js';
import { doneCount, isDone, streak, todaySeconds, addPracticeSeconds } from '../lib/storage.js';
import { PracticeMeter } from '../lib/practice.js';
import { listAudioInputs, activeDeviceId } from '../lib/devices.js';

const TOOLS = [
  { href: '#/learn', ico: '📚', h: 'Learn', p: 'A step-by-step path from zero to real songs.' },
  { href: '#/songs', ico: '🎵', h: 'Songs', p: 'Play-along charts + real songs to aim for.' },
  { href: '#/chords', ico: '🎸', h: 'Chords', p: 'The beginner shapes with diagrams you can hear.' },
  { href: '#/train', ico: '🏋️', h: 'Change trainer', p: 'Drill chord changes — how many in 60 seconds?' },
  { href: '#/warmup', ico: '🤸', h: 'Finger warm-ups', p: 'The 1·2·3·4 drill for finger strength.' },
  { href: '#/strum', ico: '🎶', h: 'Strum trainer', p: 'See and hear strum patterns, then copy them.' },
  { href: '#/tuner', ico: '🎯', h: 'Tuner', p: 'Get in tune with your mic before you play.' },
  { href: '#/metronome', ico: '🥁', h: 'Metronome', p: 'Build rock-solid timing from day one.' },
];

const EQUIV = { D: ['D7'], G: ['G7'], Em: ['Em7'], C: ['Cadd9'] };
function expandLearned(set) {
  const out = new Set(set);
  for (const c of set) (EQUIV[c] || []).forEach((e) => out.add(e));
  return out;
}

const PLAY_GATE = 0.02; // RMS above this = you're actually making sound
const fmt = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;

export default {
  render(root) {
    const total = ALL_LESSONS.length;
    const done = doneCount();
    const pct = Math.round((done / total) * 100);
    const next = ALL_LESSONS.find((l) => !isDone(l.id)) || ALL_LESSONS[total - 1];

    const learnedBase = [...new Set(ALL_LESSONS.filter((l) => l.chords && isDone(l.id)).flatMap((l) => l.chords))];
    const learned = expandLearned(new Set(learnedBase));
    const canPlay = SONGS.filter((so) => so.chords.every((c) => learned.has(c)));
    const canPlayTargets = TARGET_SONGS.filter((t) => t.chords.every((c) => learned.has(c)));
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
        <p class="lead">A from-zero coach for 6-string acoustic — the fast, song-first way. Small, honest,
        daily reps beat cramming.</p>
        <div class="btn-row" style="justify-content:center">
          <a class="btn btn-primary" href="#/learn/${next.id}">${done ? 'Continue learning' : 'Start lesson 1'} →</a>
          <a class="btn" href="#/tuner">🎯 Tune up first</a>
        </div>
      </section>

      <section class="panel" style="margin-bottom:1.1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
          <div>
            <p class="eyebrow" style="margin:0">🎸 Practice</p>
            <h2 style="margin:.1rem 0">Played today: <span id="pt-time">${fmt(todaySeconds())}</span></h2>
            <p class="faint" style="margin:0">Honest tracking — the clock only moves while it hears you actually playing.</p>
          </div>
          <div class="stat"><div class="n" id="pt-streak">${streak()}</div><div class="l">day streak</div></div>
        </div>
        <div id="pt-mic" class="mic-row" hidden><label class="mic-label">Mic <select id="pt-mic-select"></select></label></div>
        <div class="level-wrap" style="justify-content:center;margin:.7rem 0 .3rem"><span class="level-tag">you</span><div class="level-meter"><div id="pt-level" class="level-fill"></div></div></div>
        <div class="btn-row" style="justify-content:center;margin-top:.6rem">
          <button class="btn btn-primary" id="pt-toggle">🎤 Start practice session</button>
          <a class="btn" href="#/routine">📋 Today's plan</a>
        </div>
        <div id="pt-err" class="faint" style="text-align:center;color:var(--red);margin-top:.4rem"></div>
      </section>

      <section class="panel" style="margin-bottom:1.1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
          <div>
            <p class="eyebrow" style="margin:0">Your progress</p>
            <h2 style="margin:.1rem 0">${done ? `Next up: ${next.title}` : 'Ready when you are'}</h2>
          </div>
          <div class="stat"><div class="n">${done}/${total}</div><div class="l">lessons</div></div>
        </div>
        <div class="progress-track" style="margin-top:1rem"><div class="progress-fill" style="width:${pct}%"></div></div>
      </section>

      <section class="panel" style="margin-bottom:1.1rem">
        <p class="eyebrow" style="margin:0">🎸 Songs you can play now</p>
        ${unlockHtml}
      </section>

      <div class="callout" style="margin-bottom:1.1rem">
        <strong>Buzzing strings?</strong> That's placement, not talent — fret right behind the fret wire with your
        fingertip. The <a href="#/learn/l1-0">first lesson</a> walks you through beating the buzz.
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

    // ---- Honest practice session ----
    const toggle = root.querySelector('#pt-toggle');
    const timeEl = root.querySelector('#pt-time');
    const streakEl = root.querySelector('#pt-streak');
    const levelFill = root.querySelector('#pt-level');
    const micRow = root.querySelector('#pt-mic');
    const micSelect = root.querySelector('#pt-mic-select');
    const errEl = root.querySelector('#pt-err');

    let heardThisSecond = false;

    this.meter = new PracticeMeter((level) => {
      levelFill.style.width = `${Math.min(100, Math.round(level * 400))}%`;
      const playing = level > PLAY_GATE;
      levelFill.classList.toggle('live', playing);
      if (playing) heardThisSecond = true;
    });

    const populateMics = async () => {
      const inputs = await listAudioInputs();
      if (!inputs.length) return;
      micSelect.innerHTML = inputs.map((d) => `<option value="${d.deviceId}">${d.label}</option>`).join('');
      micSelect.value = activeDeviceId(this.meter.stream);
      micRow.hidden = false;
    };

    micSelect.addEventListener('change', async () => {
      if (!this.meter.running) return;
      this.meter.stop();
      try { await this.meter.start(micSelect.value); } catch { errEl.textContent = "Couldn't switch mic."; }
    });

    toggle.addEventListener('click', async () => {
      if (this.meter.running) {
        this.meter.stop();
        clearInterval(this._tick);
        this._tick = null;
        toggle.textContent = '🎤 Start practice session';
        toggle.classList.add('btn-primary');
        levelFill.style.width = '0%';
        return;
      }
      try {
        errEl.textContent = '';
        await this.meter.start(micSelect.value || undefined);
        toggle.textContent = '⏹ Stop practicing';
        toggle.classList.remove('btn-primary');
        await populateMics();
        // Count one second of practice for each second we actually heard playing.
        this._tick = setInterval(() => {
          if (heardThisSecond) {
            addPracticeSeconds(1);
            timeEl.textContent = fmt(todaySeconds());
            streakEl.textContent = streak();
            heardThisSecond = false;
          }
        }, 1000);
      } catch {
        errEl.textContent = 'Mic blocked — allow mic access on an https:// (or localhost) address.';
      }
    });
  },
  destroy() {
    if (this.meter) this.meter.stop();
    if (this._tick) { clearInterval(this._tick); this._tick = null; }
  },
};
