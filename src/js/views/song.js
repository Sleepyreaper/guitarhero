import { SONGS, SONG_BY_ID, GENRES } from '../data/songs.js';
import { GROOVES, arrangementFor, arrangementChordSequence, barChords, barChangeBeats } from '../data/arrangements.js';
import { TARGET_SONGS, chartSearchUrl } from '../data/targets.js';
import { CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordSVG } from '../components/chordDiagram.js';
import { strum, strumAt } from '../lib/audio.js';
import { getAudioContext } from '../lib/audio.js';
import { ChordListener } from '../lib/listener.js';
import { ChordJudge } from '../lib/coach.js';
import { isConfidentMatch } from '../lib/confidence.js';
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
  if (!songs.length) return `<p class="muted">No ${genre} songs in the play-along set yet.</p>`;
  return `<div class="grid song-list">
    ${songs.map((s) => `
      <a class="panel song-card" href="#/songs/${s.id}">
        <div class="tag-row"><span class="pill gold">${s.style}</span><span class="pill">${s.chords.length} chords</span></div>
        <h3 style="margin:.3rem 0 0">${s.title}</h3>
        <div class="faint" style="font-size:.85rem">${s.chords.join(' · ')} · ${s.time}</div>
      </a>`).join('')}
  </div>`;
}

function renderTargets(genre) {
  const items = TARGET_SONGS.filter((t) => genre === 'all' || t.genres.includes(genre));
  if (!items.length) return `<p class="muted">No ${genre} target songs yet.</p>`;
  return `<div class="grid song-list">
    ${items.map((t) => `
      <div class="panel song-card target-card">
        <div class="tag-row">${t.genres.map((g) => `<span class="pill gold">${cap(g)}</span>`).join('')}<span class="pill">${t.capo}</span></div>
        <h3 style="margin:.3rem 0 0">${t.title}</h3>
        <div class="faint" style="font-size:.82rem">${t.artist}</div>
        <div class="target-chords">${t.chords.join(' · ')}</div>
        <div class="muted" style="font-size:.85rem">${t.why}</div>
        ${t.bridge ? `<details class="target-bridge"><summary>Beginner game plan</summary>
          <p><strong>Feel:</strong> ${t.bridge.groove}</p>
          <p><strong>Start here:</strong> ${t.bridge.firstStep}</p>
          <p><strong>Lead role:</strong> ${t.bridge.lead}</p>
        </details>` : ''}
        <div class="btn-row" style="margin-top:.5rem">
          ${t.tutorial ? `<a class="btn btn-primary" href="${t.tutorial}" target="_blank" rel="noopener noreferrer">Curated lesson ↗</a>` : ''}
          <a class="btn btn-ghost" href="${chartSearchUrl(t)}" target="_blank" rel="noopener noreferrer">Find the chart ↗</a>
        </div>
      </div>`).join('')}
  </div>`;
}

function list(root, self) {
  const genre = self._genre || 'all';
  const countFor = (g) => SONGS.filter((s) => s.genres.includes(g)).length + TARGET_SONGS.filter((t) => t.genres.includes(g)).length;
  root.innerHTML = `
    <p class="eyebrow">Songs</p>
    <h1>Songs</h1>
    <p class="lead">Two kinds: a play-along songbook you can strum along with in the app, and real
    on-the-radio songs to aim for. Filter by the style you love.</p>

    <div class="chip-row" id="genre-filter">
      <button class="chip-btn ${genre === 'all' ? 'sel' : ''}" data-genre="all">All (${SONGS.length + TARGET_SONGS.length})</button>
      ${GENRES.map((g) => `<button class="chip-btn ${genre === g ? 'sel' : ''}" data-genre="${g}">${cap(g)} (${countFor(g)})</button>`).join('')}
    </div>

    <h2 style="margin-top:.5rem">🪕 Play-along songbook</h2>
    <p class="muted" style="margin-top:0">All public domain — full chords &amp; words, and the app can listen along. Ordered easiest first.</p>
    <div id="song-cards">${renderCards(genre)}</div>

    <h2 style="margin-top:2rem">🎯 Real songs to aim for</h2>
    <p class="muted" style="margin-top:0">On-the-radio songs you can already play with these chords. They're
    copyrighted, so we can't print the words here — here are the chords &amp; capo; tap to find a full chart.</p>
    <div id="target-cards">${renderTargets(genre)}</div>
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
  cleanup(self);
  const arrangement = arrangementFor(song);
  const groove = arrangement && GROOVES[arrangement.groove];
  const verifiedTiming = arrangement?.timing === 'verified';

  root.innerHTML = `
    <a class="back-link" href="#/songs">← All songs</a>
    <div class="tag-row">
      ${song.genres.map((g) => `<span class="pill gold">${cap(g)}</span>`).join('')}
      <span class="pill">${song.difficulty}</span>
    </div>
    <h1 style="margin-top:.4rem">${song.title}</h1>
    <p class="faint" style="margin-top:0">Key of ${song.key} · ${song.time}${song.capo ? ` · Capo ${song.capo}` : ' · No capo'}</p>

    <div class="callout" style="margin:.6rem 0 1.1rem">${song.note}</div>
    ${arrangement ? `<section class="panel arrangement-guide" style="margin-top:1rem">
      <p class="eyebrow">${verifiedTiming ? 'Verified singable arrangement' : 'Beginner accompaniment practice'}</p>
      <div class="grid arrangement-roles">
        <div><h3>Accompany the singer</h3><p><strong>${groove.label}</strong> at about ${arrangement.bpm} BPM.</p><p class="muted">${arrangement.dynamics}</p></div>
        <div><h3>Play lead without crowding</h3><p class="muted">${arrangement.lead}</p></div>
      </div>
      <p class="faint" style="margin-bottom:.35rem"><strong>${arrangement.section}:</strong></p>
      <div class="arrangement-bars">${arrangement.bars.map((bar, index) => `<span><small>${index + 1}</small>${barChords(bar).join(' / ')}</span>`).join('')}</div>
      ${verifiedTiming
        ? `<p class="faint"><strong>Timing checked:</strong> the chord changes are aligned to the displayed lyric cues. <strong>Source:</strong> <a href="${arrangement.verification.url}" target="_blank" rel="noopener noreferrer">${arrangement.verification.label}</a>. <strong>Checked:</strong> ${arrangement.verification.checked}.</p>`
        : '<p class="faint"><strong>Practice reduction:</strong> this teaches the song\'s chord vocabulary and feel, but it is not yet a lyric-synchronized transcription.</p>'}
      <div class="callout"><strong>Important:</strong> accompaniment supplies harmony, pulse, and feel—the voice carries the recognizable melody. A lead intro or fill supplies melody only in the spaces.</div>
    </section>` : ''}

    <div class="btn-row" style="margin:1rem 0">
      <button class="btn btn-primary" id="pa-start">🎤 Rehearse chord order — I'll listen</button>
      <button class="btn" id="sa-start">${verifiedTiming ? '🔊 Sing with timed backing' : '🔊 Practice with simplified backing'}</button>
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
    if (e.target.closest('#sa-start')) { singAlong(root, song, self); return; }
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
  const arrangement = arrangementFor(song);
  const seq = arrangementChordSequence(song).length ? arrangementChordSequence(song) : chordSequence(song);
  let idx = 0;
  let okStreak = 0;
  let armed = true;
  const SIM_OK = 0.86;
  const judge = new ChordJudge();

  root.innerHTML = `
    <button class="back-link" id="pa-exit" style="background:none;border:none;cursor:pointer">← Back to song</button>
    <h1 style="margin:.2rem 0">${song.title}</h1>
    <p class="faint" style="margin-top:0">Chord rehearsal follows the ${arrangement?.section || 'chart'} in order, including held bars. Play, briefly mute, then play the next cue. For timed backing, use <strong>Sing along</strong>.</p>

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
    armed = false;
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
    if (!active) armed = true;

    const best = judge.best();
    const confident = isConfidentMatch(best, SIM_OK);
    hearEl.textContent = active && best.name
      ? `${confident ? `I hear: ${best.name}` : 'Chord heard · exact shape uncertain'} · ${Math.round(best.sim * 100)}%`
      : '';

    const onTarget = armed && active && best.name === seq[idx] && confident;
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

// ---- Sing-along: the app PLAYS the chords in time so someone can sing to it ----
function singAlong(root, song, self) {
  cleanup(self);
  const arrangement = arrangementFor(song);
  const bars = arrangement.bars;
  const beatsPerBar = arrangement.meter;
  const groove = GROOVES[arrangement.groove];
  const lyricCues = arrangement.cues || [];
  let bpm = arrangement.bpm;
  let playing = false;
  let barIndex = 0;
  let nextBarTime = 0;
  let countIn = true;
  let timer = null;
  const uiQueue = [];

  root.innerHTML = `
    <button class="back-link" id="sa-exit" style="background:none;border:none;cursor:pointer">← Back to song</button>
    <h1 style="margin:.2rem 0">${song.title}</h1>
    <p class="faint" style="margin-top:0">${arrangement.timing === 'verified'
      ? `Verified lyric-aligned backing: ${arrangement.section}. You get one count-in bar, then the written form loops.`
      : `Simplified accompaniment practice: ${arrangement.section}. It teaches chord changes and feel, but does not claim exact lyric timing.`}</p>

    <section class="panel" style="text-align:center">
      <div class="pa-progress" id="sa-progress"></div>
      <div class="pa-current">
        <div class="pa-name" id="sa-name">–</div>
        <div id="sa-diagram"></div>
      </div>
      ${lyricCues.length ? `<div class="sing-cue-wrap">
        <p class="eyebrow">Sing this now</p>
        <div id="sa-cue" class="sing-cue">Get ready...</div>
      </div>` : ''}
      <div class="bpm-display" style="font-size:2rem;margin-top:.6rem"><span id="sa-bpm">${bpm}</span> <small>BPM</small></div>
      <input id="sa-slider" type="range" min="50" max="130" value="${bpm}" style="max-width:280px" />
      <div class="btn-row" style="justify-content:center;margin-top:.6rem">
        <button class="btn btn-primary" id="sa-toggle" style="min-width:120px">▶ Play</button>
        <button class="btn" id="sa-restart">↻ Restart</button>
      </div>
      <p class="faint" style="margin:.7rem 0 0;font-size:.8rem"><strong>${groove.label}.</strong> ${arrangement.dynamics}</p>
    </section>
  `;

  const progressEl = root.querySelector('#sa-progress');
  const nameEl = root.querySelector('#sa-name');
  const diagramEl = root.querySelector('#sa-diagram');
  const bpmEl = root.querySelector('#sa-bpm');
  const slider = root.querySelector('#sa-slider');
  const toggle = root.querySelector('#sa-toggle');
  const cueEl = root.querySelector('#sa-cue');

  const drawUI = (activeIdx, activeChord, cue = null) => {
    progressEl.innerHTML = bars
      .map((bar, i) => `<span class="pa-chip ${i === activeIdx ? 'current' : ''}">${barChords(bar).join(' / ')}</span>`)
      .join('');
    const chordName = activeChord || barChords(bars[activeIdx] || [])[0];
    const chord = CHORD_BY_NAME[chordName];
    nameEl.textContent = chordName || '–';
    diagramEl.innerHTML = chord ? chordSVG(chord, { w: 132, h: 164 }) : '';
    if (cueEl && cue) cueEl.textContent = cue;
  };

  const scheduleStroke = (event, chordName, atTime) => {
    const chord = CHORD_BY_NAME[chordName];
    if (!chord) return;
    const freqs = chordFrequencies(chord);
    let notes = freqs;
    let spread = .024;
    if (event.kind === 'bass') { notes = freqs.slice(0, 1); spread = 0; }
    if (event.kind === 'brush') notes = freqs.slice(-4);
    if (event.kind === 'up') notes = freqs.slice(-4).reverse();
    if (event.kind === 'pick') { notes = [freqs[event.string % freqs.length]]; spread = 0; }
    strumAt(notes, atTime, event.gain, spread);
  };

  const unitSeconds = () => (60 / bpm) / (beatsPerBar === 6 ? 3 : 1);

  const chordAtBeat = (bar, beat) => {
    const chords = barChords(bar);
    const changeBeats = barChangeBeats(bar, beatsPerBar);
    let index = 0;
    changeBeats.forEach((changeBeat, candidate) => { if (changeBeat <= beat) index = candidate; });
    return chords[index];
  };

  const scheduler = () => {
    const ac = getAudioContext();
    while (nextBarTime < ac.currentTime + 0.15) {
      const seconds = unitSeconds();
      if (countIn) {
        const countBeats = beatsPerBar === 6 ? [0, 3] : Array.from({ length: beatsPerBar }, (_, i) => i);
        countBeats.forEach((beat) => strumAt([880], nextBarTime + beat * seconds, beat === 0 ? .07 : .04, 0));
        uiQueue.push({ time: nextBarTime, count: true });
        countIn = false;
      } else {
        const idx = barIndex % bars.length;
        const bar = bars[idx];
        const barEvents = groove.barEvents?.[idx % groove.barEvents.length] || groove.events;
        barEvents.forEach((event) => {
          const chordName = chordAtBeat(bar, event.beat);
          scheduleStroke(event, chordName, nextBarTime + event.beat * seconds);
        });
        const changeBeats = barChangeBeats(bar, beatsPerBar);
        barChords(bar).forEach((chordName, slot) => {
          const barCue = lyricCues[idx];
          const cueParts = Array.isArray(barCue) ? barCue : [barCue];
          const cue = cueParts[Math.min(slot, cueParts.length - 1)] || null;
          uiQueue.push({ time: nextBarTime + changeBeats[slot] * seconds, idx, chordName, cue });
        });
        barIndex++;
      }
      nextBarTime += beatsPerBar * seconds;
    }
    while (uiQueue.length && uiQueue[0].time <= ac.currentTime) {
      const item = uiQueue.shift();
      if (item.count) {
        nameEl.textContent = 'Count in…';
        diagramEl.innerHTML = '';
        if (cueEl) cueEl.textContent = 'Get ready...';
      } else drawUI(item.idx, item.chordName, item.cue);
    }
  };

  const start = () => {
    const ac = getAudioContext();
    playing = true;
    nextBarTime = ac.currentTime + 0.12;
    timer = setInterval(scheduler, 25);
    self._accompanist = () => { playing = false; clearInterval(timer); timer = null; };
    toggle.textContent = '⏸ Pause';
    toggle.classList.remove('btn-primary');
  };
  const stop = () => {
    playing = false;
    if (timer) clearInterval(timer);
    timer = null;
    self._accompanist = null;
    toggle.textContent = '▶ Play';
    toggle.classList.add('btn-primary');
  };

  toggle.addEventListener('click', () => (playing ? stop() : start()));
  root.querySelector('#sa-restart').addEventListener('click', () => { barIndex = 0; countIn = true; uiQueue.length = 0; drawUI(0); });
  root.querySelector('#sa-exit').addEventListener('click', () => { stop(); detail(root, song.id, self); });
  slider.addEventListener('input', () => { bpm = +slider.value; bpmEl.textContent = bpm; });

  drawUI(0);
}

function cleanup(self) {
  if (self._player) { self._player.stop(); self._player = null; }
  if (self._accompanist) { self._accompanist(); self._accompanist = null; }
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
