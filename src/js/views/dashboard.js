import { ALL_LESSONS } from '../data/curriculum.js';
import { SONGS } from '../data/songs.js';
import { TARGET_SONGS, chartSearchUrl } from '../data/targets.js';
import {
  addPracticeSeconds, doneCount, getProfile, isDone, saveProfile, streak, todaySeconds,
} from '../lib/storage.js';
import { calibratedPracticeGate, PracticeMeter } from '../lib/practice.js';
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

export function learnedShapes(chords) {
  // Related chords are not interchangeable skills. D7, G7, Em7, and Cadd9 each
  // require a different physical shape and only unlock after an explicit lesson.
  return new Set(chords);
}

export function rankPlayableSongs(songs, genre) {
  const preferred = genre === 'mixed' ? null : genre;
  return [...songs].sort((a, b) => {
    const score = (song) => {
      if (preferred && song.genres.includes(preferred)) return 0;
      if (!song.genres.every((item) => item === 'kids')) return 1;
      return 2;
    };
    return score(a) - score(b) || (a.level || 0) - (b.level || 0) || a.title.localeCompare(b.title);
  });
}

export function recommendedLesson(profile, completedCount, lessons = ALL_LESSONS) {
  const next = lessons.find((lesson) => !isDone(lesson.id)) || lessons.at(-1);
  if (profile?.experience === 'some' && completedCount === 0) {
    return lessons.find((lesson) => lesson.id === 'l1-0') || next;
  }
  return next;
}

const fmt = (sec) => `${Math.floor(sec / 60)}:${String(Math.floor(sec % 60)).padStart(2, '0')}`;
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const GENRE_LABELS = { church: 'Christian & worship', country: 'Modern country', americana: 'Americana & folk', mixed: 'A little of everything' };
const WEEK = [
  { href: '#/learn/l0-1', doneId: 'l0-1', title: 'Get comfortable', blurb: 'Hold the guitar without fighting it' },
  { href: '#/learn/l0-2', doneId: 'l0-2', title: 'Tune with confidence', blurb: 'Get all six strings ready' },
  { href: '#/learn/l1-0', doneId: 'l1-0', title: 'Beat the buzz', blurb: 'Make one clean fretted note' },
  { href: '#/learn/l1-1', doneId: 'l1-1', title: 'Play Em', blurb: 'Your first full chord' },
  { href: '#/learn/l1-2', doneId: 'l1-2', title: 'Play G', blurb: 'The home of country and folk' },
  { href: '#/learn/l1-3', doneId: 'l1-3', title: 'Make the change', blurb: 'Five clean Em ↔ G switches' },
  { href: '#/learn/l1-4', doneId: 'l1-5', title: 'Strum, then play', blurb: 'Learn steady down-strums, then continue to your first song' },
];
const PILOT_SETLISTS = {
  church: ['How Great Is Our God', '10,000 Reasons (Bless the Lord)', 'Great Are You Lord'],
  country: ['You Look Like You Love Me', "Weren't For The Wind", 'Last Night'],
  americana: ['Something in the Orange', 'Wagon Wheel', 'Take Me Home, Country Roads'],
  mixed: ['How Great Is Our God', 'You Look Like You Love Me', 'Wagon Wheel'],
};

function renderOnboarding(root, owner) {
  const saved = getProfile() || {};
  const checked = (key, value, fallback) => (saved[key] || fallback) === value ? 'checked' : '';
  root.innerHTML = `
    <section class="panel onboarding-panel">
      <p class="eyebrow">Build your first week</p>
      <h1>What do you want guitar to do?</h1>
      <p class="lead">Four quick choices give you a starting path. Nothing here is public, and you can change it later.</p>
      <form id="onboarding-form" class="onboarding-form">
        <fieldset><legend>How do you play?</legend><div class="choice-grid">
          <label><input type="radio" name="hand" value="right" ${checked('hand', 'right', 'right')}> Right-handed</label>
          <label><input type="radio" name="hand" value="left" ${checked('hand', 'left', 'right')}> Left-handed</label>
        </div></fieldset>
        <fieldset><legend>Where are you starting?</legend><div class="choice-grid">
          <label><input type="radio" name="experience" value="new" ${checked('experience', 'new', 'new')}> Never played</label>
          <label><input type="radio" name="experience" value="some" ${checked('experience', 'some', 'new')}> I know a chord or two</label>
        </div></fieldset>
        <fieldset><legend>What sounds like you?</legend><div class="choice-grid">
          ${Object.entries(GENRE_LABELS).map(([value, label]) => `<label><input type="radio" name="genre" value="${value}" ${checked('genre', value, 'mixed')}> ${label}</label>`).join('')}
        </div></fieldset>
        <label class="song-goal"><strong>First song you want to play</strong><input name="song" maxlength="80" value="${esc(saved.song || '')}" placeholder="A favorite song—or leave this blank" /></label>
        <button class="btn btn-primary" type="submit">Make my seven-day path →</button>
      </form>
      <p class="faint">For younger learners: use Campfire with a parent or guardian. Campfire has no public profiles, chat, or shared recordings.</p>
    </section>`;
  root.querySelector('#onboarding-form').addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    saveProfile({ hand: data.get('hand'), experience: data.get('experience'), genre: data.get('genre'), song: String(data.get('song') || '').trim() });
    owner.render(root);
  });
}

function weekHtml(profile) {
  const firstOpen = WEEK.findIndex((day) => !isDone(day.doneId));
  const quickStart = profile.experience === 'some' && firstOpen === 0;
  const current = quickStart ? 2 : firstOpen < 0 ? WEEK.length - 1 : firstOpen;
  return `
    <section class="panel first-week">
      <div class="week-head"><div><p class="eyebrow">Your seven-day start</p><h2>${GENRE_LABELS[profile.genre] || GENRE_LABELS.mixed}${profile.song ? ` · aiming for “${esc(profile.song)}”` : ''}</h2></div><button class="btn btn-ghost" id="edit-profile" type="button">Change goals</button></div>
      <div class="week-grid">${WEEK.map((day, index) => {
        const done = isDone(day.doneId);
        return `<a class="week-day ${done ? 'done' : ''} ${index === current ? 'current' : ''}" href="${day.href}"><span>Day ${index + 1}</span><strong>${done ? '✓ ' : ''}${day.title}</strong><small>${day.blurb}</small></a>`;
      }).join('')}</div>
      ${quickStart ? '<div class="callout"><strong>Quick start:</strong> Begin at Day 3 and prove one clean fretted note. Days 1–2 stay here whenever you want a setup or tuning review.</div>' : ''}
      <p class="faint">Move faster if you are ready: skill lessons include a “Prove it” check so quick learners can skip ahead honestly.</p>
    </section>`;
}

function setlistHtml(profile, learned) {
  const preferred = PILOT_SETLISTS[profile.genre] || PILOT_SETLISTS.mixed;
  let songs = preferred.map((title) => TARGET_SONGS.find((song) => song.title === title)).filter(Boolean);
  const requested = profile.song
    ? TARGET_SONGS.find((song) => song.title.toLowerCase() === profile.song.toLowerCase())
    : null;
  if (requested) songs = [requested, ...songs.filter((song) => song !== requested)].slice(0, 3);

  const custom = profile.song && !requested ? {
    title: profile.song, artist: 'Your request', chords: [], capo: 'Chart needed',
    why: 'Keep this as the destination while Campfire builds the core skills underneath it.',
  } : null;
  if (custom) songs = [custom, ...songs].slice(0, 3);

  return `
    <section class="panel personal-setlist" style="margin-bottom:1.1rem">
      <p class="eyebrow">Your first setlist</p>
      <h2>These are what the fundamentals are building toward</h2>
      <div class="grid cards-3">${songs.map((song) => {
        const missing = song.chords.filter((chord) => !learned.has(chord));
        const ready = song.chords.length > 0 && missing.length === 0;
        return `<article class="setlist-card">
          <div class="tag-row"><span class="pill ${ready ? 'green' : 'gold'}">${ready ? 'Ready to try' : missing.length ? `${missing.length} chord${missing.length === 1 ? '' : 's'} away` : 'Personal goal'}</span><span class="pill">${song.capo}</span></div>
          <h3>${esc(song.title)}</h3><p class="faint">${esc(song.artist)}</p>
          ${song.chords.length ? `<div class="target-chords">${song.chords.join(' · ')}</div>` : ''}
          <p class="muted">${song.why}</p>
          ${song.bridge ? `<p class="faint"><strong>Start here:</strong> ${song.bridge.firstStep}</p>` : ''}
          <div class="btn-row">
            <a class="btn btn-ghost" href="${chartSearchUrl(song)}" target="_blank" rel="noopener noreferrer">Find the chart ↗</a>
            ${song.tutorial ? `<a class="btn btn-ghost" href="${song.tutorial}" target="_blank" rel="noopener noreferrer">Watch tutorial ↗</a>` : ''}
          </div>
        </article>`;
      }).join('')}</div>
      <p class="faint">Modern songs link out because Campfire does not republish copyrighted lyrics or charts.</p>
    </section>`;
}

export default {
  render(root) {
    const profile = getProfile();
    if (!profile) { renderOnboarding(root, this); return; }
    const total = ALL_LESSONS.length;
    const done = doneCount();
    const pct = Math.round((done / total) * 100);
    const next = ALL_LESSONS.find((l) => !isDone(l.id)) || ALL_LESSONS[total - 1];
    const recommended = recommendedLesson(profile, done);

    const learnedBase = [...new Set(ALL_LESSONS.filter((l) => l.chords && isDone(l.id)).flatMap((l) => l.chords))];
    const learned = learnedShapes(learnedBase);
    const canPlay = rankPlayableSongs(SONGS.filter((so) => so.chords.every((c) => learned.has(c))), profile.genre);
    const canPlayTargets = rankPlayableSongs(TARGET_SONGS.filter((t) => t.chords.every((c) => learned.has(c))), profile.genre);
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
      const dashboardSongs = canPlay.slice(0, 6);
      const moreSongs = canPlay.length - dashboardSongs.length;
      unlockHtml = `
        <div class="tag-row" style="margin-top:.55rem">
          ${dashboardSongs.map((so) => `<a class="pill green" style="text-decoration:none" href="#/songs/${so.id}">${so.title}</a>`).join('')}
        </div>
        ${moreSongs > 0 ? `<p class="muted" style="margin:.6rem 0 0">+ ${moreSongs} more unlocked in the <a href="#/songs">full songbook</a>.</p>` : ''}
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
          <a class="btn btn-primary" href="#/learn/${recommended.id}">${done ? 'Continue learning' : profile.experience === 'some' ? 'Start quick skill check' : 'Start lesson 1'} →</a>
          <a class="btn" href="#/tuner">🎯 Tune up first</a>
        </div>
      </section>

      ${weekHtml(profile)}

      ${setlistHtml(profile, learned)}

      <section class="panel" style="margin-bottom:1.1rem">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:1rem">
          <div>
            <p class="eyebrow" style="margin:0">🎸 Practice</p>
            <h2 style="margin:.1rem 0">Played today: <span id="pt-time">${fmt(todaySeconds())}</span></h2>
            <p class="faint" style="margin:0">Mic-assisted tracking: after a quiet room check, the clock moves only when the selected mic hears sound above that room level. Review the total honestly.</p>
          </div>
          <div class="stat"><div class="n" id="pt-streak">${streak()}</div><div class="l">day streak</div></div>
        </div>
        <div id="pt-mic" class="mic-row" hidden><label class="mic-label">Mic <select id="pt-mic-select"></select></label></div>
        <div class="level-wrap" style="justify-content:center;margin:.7rem 0 .3rem"><span class="level-tag">you</span><div class="level-meter"><div id="pt-level" class="level-fill"></div></div></div>
        <p id="pt-status" class="faint" style="text-align:center;margin:.25rem 0" aria-live="polite">Start a session, then stay quiet for the two-second room check.</p>
        <div class="btn-row" style="justify-content:center;margin-top:.6rem">
          <button class="btn btn-primary" id="pt-toggle">🎤 Start practice session</button>
          <a class="btn" href="#/routine">📋 Today's plan</a>
          <a class="btn btn-ghost" href="#/report">Pilot report</a>
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

    root.querySelector('#edit-profile')?.addEventListener('click', () => {
      this.meter?.stop();
      if (this._tick) { clearInterval(this._tick); this._tick = null; }
      renderOnboarding(root, this);
    });

    // ---- Honest practice session ----
    const toggle = root.querySelector('#pt-toggle');
    const timeEl = root.querySelector('#pt-time');
    const streakEl = root.querySelector('#pt-streak');
    const levelFill = root.querySelector('#pt-level');
    const micRow = root.querySelector('#pt-mic');
    const micSelect = root.querySelector('#pt-mic-select');
    const errEl = root.querySelector('#pt-err');
    const statusEl = root.querySelector('#pt-status');

    let heardThisSecond = false;
    let roomSamples = [];
    let calibratingUntil = 0;
    let playGate = 0.006;

    const beginRoomCheck = () => {
      roomSamples = [];
      calibratingUntil = performance.now() + 2000;
      playGate = Infinity;
      heardThisSecond = false;
      statusEl.textContent = 'Room check: stay quiet for two seconds...';
    };

    this.meter = new PracticeMeter((level) => {
      levelFill.style.width = `${Math.min(100, Math.round(level * 400))}%`;
      if (performance.now() < calibratingUntil) {
        roomSamples.push(level);
        levelFill.classList.remove('live');
        return;
      }
      if (playGate === Infinity) {
        playGate = calibratedPracticeGate(roomSamples);
        statusEl.textContent = 'Tracking sound now. Play normally, then review the total honestly.';
      }
      const playing = level > playGate;
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
      try { await this.meter.start(micSelect.value); beginRoomCheck(); } catch { errEl.textContent = "Couldn't switch mic."; }
    });

    toggle.addEventListener('click', async () => {
      if (this.meter.running) {
        this.meter.stop();
        clearInterval(this._tick);
        this._tick = null;
        toggle.textContent = '🎤 Start practice session';
        toggle.classList.add('btn-primary');
        levelFill.style.width = '0%';
        statusEl.textContent = 'Stopped. The saved total remains on this device or your account.';
        return;
      }
      try {
        errEl.textContent = '';
        await this.meter.start(micSelect.value || undefined);
        beginRoomCheck();
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
