import { SONGS, SONG_BY_ID, GENRES } from '../data/songs.js';
import { CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordSVG } from '../components/chordDiagram.js';
import { strum } from '../lib/audio.js';
import { markPracticedToday } from '../lib/storage.js';
import { ChordListener } from '../lib/listener.js';
import { ChordJudge } from '../lib/coach.js';
import { listAudioInputs, activeDeviceId } from '../lib/devices.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cap = (s) => s[0].toUpperCase() + s.slice(1);

// Turn a token line into aligned chord-over-lyric HTML (monospace padding).
function renderLine(tokens) {
  let top = '';
  let bot = '';
  for (const tk of tokens) {
    const text = tk.t || '';
    const chord = tk.c || '';
    const w = Math.max(text.length, chord ? chord.length + 1 : 0);
    top += chord.padEnd(w);
    bot += text.padEnd(w);
  }
  return `<div class="songline"><div class="chordline">${esc(top.replace(/\s+$/, ' '))}</div><div class="lyricline">${esc(bot.replace(/\s+$/, ''))}</div></div>`;
}

// The chord progression of a song, in order, merging held (consecutive-identical) chords.
function chordSequence(song) {
  const seq = [];
  for (const block of song.body) {
    for (const line of block.lines) {
      for (const tk of line) {
        if (tk.c && seq[seq.length - 1] !== tk.c) seq.push(tk.c);
      }
    }
  }
  return seq;
}

const byLearningOrder = (a, b) => a.level - b.level || a.title.localeCompare(b.title);

function renderCards(genre) {
  const songs = [...SONGS]
    .filter((s) => genre === 'all' || s.genres.includes(genre))
    .sort(byLearningOrder);
  if (!songs.length) return `<p class="muted">No ${genre} songs yet.</p>`;
  return `<div class="grid song-list">
    ${songs.map((s) => `
      <a class="panel song-card" href="#/songs/${s.id}">
        <div class="tag-row"><span class="pill gold">${s.style}</span><span class="pill">${s.chords.length} chords</span></div>
        <h3 style="margin:.3rem 0 0">${s.title}</h3>
        <div class="faint" style="font-size:.85rem">${s.chords.join(' · ')} · ${s.time}</div>
      </a>`).join('')}
  </div>`;
}

function list(root, self) {
  const genre = self._genre || 'all';
  root.innerHTML = `
    <p class="eyebrow">Play-along</p>
    <h1>Songs</h1>
    <p class="lead">Real songs you can play with the beginner chords — all public domain, spanning country,
    folk, americana & church. They're ordered easiest first, so start at the top and work down.</p>

    <div class="chip-row" id="genre-filter">
      <button class="chip-btn ${genre === 'all' ? 'sel' : ''}" data-genre="all">All (${SONGS.length})</button>
      ${GENRES.map((g) => {
        const n = SONGS.filter((s) => s.genres.includes(g)).length;
        return `<button class="chip-btn ${genre === g ? 'sel' : ''}" data-genre="${g}">${cap(g)} (${n})</button>`;
      }).join('')}
    </div>

    <div id="song-cards">${renderCards(genre)}</div>
  `;

  root.querySelector('#genre-filter').addEventListener('click', (e) => {
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    self._genre = btn.dataset.genre;
    list(root, self);
  });
}

function detail(root, id, self) {
  const song = SONG_BY_ID[id];
  if (!song) return list(root, self);
  markPracticedToday();
  cleanup(self);

  root.innerHTML = `
    <a class="back-link" href="#/songs">← All songs</a>
    <div class="tag-row">
      ${song.genres.map((g) => `<span class="pill gold">${cap(g)}</span>`).join('')}
      <span class="pill">${song.difficulty}</span>
    </div>
    <h1 style="margin-top:.4rem">${song.title}</h1>
    <p class="faint" style="margin-top:0">Key of ${song.key} · ${song.time}${song.capo ? ` · Capo ${song.capo}` : ' · No capo'}</p>

    <div class="callout" style="margin:.6rem 0 1.1rem">${song.note}</div>
    ${song.strum ? `<div class="strum-hint">🎵 <strong>Strum:</strong> ${song.strum}</div>` : ''}

    <div class="btn-row" style="margin:1rem 0">
      <button class="btn btn-primary" id="pa-start">🎤 Play along — I'll listen</button>
    </div>

    <section class="panel">
      <h3 style="margin-bottom:.6rem">Chords you'll need</h3>
      <div class="grid chords-grid">
        ${song.chords.map((n) => CHORD_BY_NAME[n] ? `
          <div class="chord-card" data-chord="${n}">
            <div class="chord-name">${n}</div>${chordSVG(CHORD_BY_NAME[n], { w: 104, h: 130 })}
            <button class="btn btn-ghost btn-play" data-chord="${n}">▶ hear it</button>
          </div>` : `<div class="chord-card"><div class="chord-name">${n}</div></div>`).join('')}
      </div>
    </section>

    <section class="panel" style="margin-top:1rem;overflow-x:auto">
      <div class="chart">
        ${song.body.map((block) => `
          <span class="section">${block.section}</span>
          ${block.lines.map(renderLine).join('')}`).join('')}
      </div>
    </section>

    <div class="btn-row" style="margin-top:1.1rem">
      <a class="btn" href="#/metronome">🥁 Metronome</a>
      <a class="btn" href="#/chords">🎸 Chord Coach</a>
    </div>
  `;

  self._onClick = (e) => {
    if (e.target.closest('#pa-start')) { playAlong(root, song, self); return; }
    const btn = e.target.closest('.btn-play');
    if (btn) {
      const chord = CHORD_BY_NAME[btn.dataset.chord];
      if (chord) strum(chordFrequencies(chord));
    }
  };
  root.addEventListener('click', self._onClick);
  self._root = root;
}

// ---- Play-along: listens and advances through the song's chord progression ----
function playAlong(root, song, self) {
  cleanup(self);
  const seq = chordSequence(song);
  let idx = 0;
  let okStreak = 0;
  const SIM_OK = 0.86;
  const judge = new ChordJudge();

  root.innerHTML = `
    <button class="back-link" id="pa-exit" style="background:none;border:none;cursor:pointer">← Back to song</button>
    <h1 style="margin:.2rem 0">${song.title}</h1>
    <p class="faint" style="margin-top:0">Play along — I'll advance when I hear each chord. Can't hear it? Tap <strong>Skip</strong>.</p>

    <div id="pa-mic" class="mic-row" hidden>
      <label class="mic-label">Mic <select id="pa-mic-select"></select></label>
    </div>

    <section class="panel" style="text-align:center">
      <div class="pa-progress" id="pa-progress"></div>
      <div class="pa-current">
        <div class="pa-name" id="pa-name">–</div>
        <div id="pa-diagram"></div>
      </div>
      <div class="level-meter" style="margin:.8rem auto 0;max-width:240px"><div id="pa-conf" class="level-fill"></div></div>
      <div id="pa-hear" class="hear-line"></div>
      <div class="btn-row" style="justify-content:center;margin-top:.6rem">
        <button class="btn" id="pa-prev">◀ Back</button>
        <button class="btn" id="pa-skip">Skip ▶</button>
        <button class="btn" id="pa-restart">↻ Restart</button>
      </div>
      <div id="pa-err" class="faint" style="color:var(--red);margin-top:.5rem"></div>
    </section>
  `;

  const progressEl = root.querySelector('#pa-progress');
  const nameEl = root.querySelector('#pa-name');
  const diagramEl = root.querySelector('#pa-diagram');
  const confFill = root.querySelector('#pa-conf');
  const hearEl = root.querySelector('#pa-hear');
  const errEl = root.querySelector('#pa-err');
  const micRow = root.querySelector('#pa-mic');
  const micSelect = root.querySelector('#pa-mic-select');

  const done = () => idx >= seq.length;

  const drawUI = () => {
    progressEl.innerHTML = seq
      .map((c, i) => `<span class="pa-chip ${i < idx ? 'done' : i === idx ? 'current' : ''}">${c}</span>`)
      .join('');
    if (done()) {
      nameEl.textContent = '🎉';
      diagramEl.innerHTML = '<p class="muted" style="margin:.5rem 0">You played the whole progression!</p>';
      confFill.style.width = '0%';
      hearEl.textContent = '';
    } else {
      const chord = CHORD_BY_NAME[seq[idx]];
      nameEl.textContent = seq[idx];
      diagramEl.innerHTML = chord ? chordSVG(chord, { w: 132, h: 164 }) : '';
    }
  };

  const advance = () => {
    idx++;
    okStreak = 0;
    judge.reset();
    drawUI();
    if (done() && self._player) self._player.stop();
  };

  root.querySelector('#pa-skip').addEventListener('click', () => { if (!done()) advance(); });
  root.querySelector('#pa-prev').addEventListener('click', () => { if (idx > 0) { idx--; okStreak = 0; judge.reset(); drawUI(); } });
  root.querySelector('#pa-restart').addEventListener('click', () => { idx = 0; okStreak = 0; judge.reset(); drawUI(); if (!self._player.running) startMic(); });
  root.querySelector('#pa-exit').addEventListener('click', () => detail(root, song.id, self));

  drawUI();

  self._player = new ChordListener((frame) => {
    const { chroma, active } = frame;
    judge.push(chroma, active);
    if (done()) { hearEl.textContent = ''; return; }

    const best = judge.best();
    hearEl.textContent = active && best.name ? `I hear: ${best.name} · ${Math.round(best.sim * 100)}%` : '';

    const onTarget = active && best.name === seq[idx] && best.sim >= SIM_OK;
    okStreak = onTarget ? okStreak + 1 : Math.max(0, okStreak - 1);
    confFill.style.width = `${Math.min(100, okStreak * 25)}%`;
    confFill.classList.toggle('live', okStreak > 0);
    if (okStreak >= 4) advance();
  });

  const populateMics = async () => {
    const inputs = await listAudioInputs();
    if (!inputs.length) return;
    micSelect.innerHTML = inputs.map((d) => `<option value="${d.deviceId}">${d.label}</option>`).join('');
    micSelect.value = activeDeviceId(self._player.stream);
    micRow.hidden = false;
  };
  micSelect.addEventListener('change', async () => {
    if (!self._player.running) return;
    self._player.stop();
    try { await self._player.start(micSelect.value); } catch { errEl.textContent = "Couldn't switch mic."; }
  });

  const startMic = async () => {
    try {
      errEl.textContent = '';
      await self._player.start(micSelect.value || undefined);
      await populateMics();
    } catch {
      errEl.textContent = 'Mic blocked — you can still use Skip/Back to step through. (Allow mic on an https:// address.)';
    }
  };
  startMic();
}

function cleanup(self) {
  if (self._player) { self._player.stop(); self._player = null; }
  if (self._onClick && self._root) { self._root.removeEventListener('click', self._onClick); self._onClick = null; }
}

export default {
  _genre: 'all',
  render(root, param) {
    if (param) detail(root, param, this);
    else list(root, this);
  },
  destroy() {
    cleanup(this);
  },
};
