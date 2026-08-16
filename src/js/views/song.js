import { SONGS, SONG_BY_ID, GENRES } from '../data/songs.js';
import { GROOVES, arrangementFor, arrangementChordSequence, barChords, barChangeBeats } from '../data/arrangements.js';
import { TARGET_SONGS, chartSearchUrl } from '../data/targets.js';
import { CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordSVG } from '../components/chordDiagram.js';
import { melodyAt, strum, strumAt } from '../lib/audio.js';
import { getAudioContext } from '../lib/audio.js';
import { ChordListener } from '../lib/listener.js';
import { ChordJudge } from '../lib/coach.js';
import { chordPitchClasses, evaluateChord } from '../lib/chroma.js';
import { isConfidentMatch, isGuidedMatch } from '../lib/confidence.js';
import { listAudioInputs, activeDeviceId } from '../lib/devices.js';
import { transposeFrequencies, transposeKey } from '../lib/capo.js';
import { isFavorite, toggleFavorite } from '../lib/storage.js';
import { midiFrequency, scoreFor } from '../data/scores.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cap = (s) => s[0].toUpperCase() + s.slice(1);

function rhythmGrid(meter, groove) {
  const subdivisions = groove.events.some((event) => event.beat % 1) ? 2 : 1;
  const labels = meter === 6
    ? ['ONE', '&', 'a', 'TWO', '&', 'a']
    : Array.from({ length: meter * subdivisions }, (_, i) => i % subdivisions
      ? '&'
      : String(Math.floor(i / subdivisions) + 1));
  return labels.map((label, index) => {
    const beat = index / subdivisions;
    const event = groove.events.find((candidate) => candidate.beat === beat);
    return { beat, label, event };
  });
}

const strokeArrow = (event) => event?.kind === 'up' ? '↑' : event ? '↓' : '·';

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
    .filter((s) => genre === 'favorites' ? isFavorite(`song:${s.id}`) : genre === 'all' || s.genres.includes(genre))
    .sort(byLearningOrder);
  if (!songs.length) return `<p class="muted">No ${genre} songs in the play-along set yet.</p>`;
  return `<div class="grid song-list">
    ${songs.map((s) => `
      <article class="panel song-card">
        <button class="favorite-btn ${isFavorite(`song:${s.id}`) ? 'liked' : ''}" data-favorite="song:${s.id}" aria-label="${isFavorite(`song:${s.id}`) ? 'Remove from' : 'Add to'} favorites">${isFavorite(`song:${s.id}`) ? '♥' : '♡'}</button>
        <a href="#/songs/${s.id}">
        <div class="tag-row"><span class="pill gold">${s.style}</span><span class="pill">${s.chords.length} chords</span></div>
        <h3 style="margin:.3rem 0 0">${s.title}</h3>
        <div class="faint" style="font-size:.85rem">${s.chords.join(' · ')} · ${s.time}</div>
        </a>
      </article>`).join('')}
  </div>`;
}

function renderTargets(genre) {
  const items = TARGET_SONGS.filter((t) => genre === 'favorites'
    ? isFavorite(`target:${t.title}:${t.artist}`)
    : genre === 'all' || t.genres.includes(genre));
  if (!items.length) return `<p class="muted">No ${genre} target songs yet.</p>`;
  return `<div class="grid song-list">
    ${items.map((t) => `
      <div class="panel song-card target-card">
        <button class="favorite-btn ${isFavorite(`target:${t.title}:${t.artist}`) ? 'liked' : ''}" data-favorite="target:${t.title}:${t.artist}" aria-label="${isFavorite(`target:${t.title}:${t.artist}`) ? 'Remove from' : 'Add to'} favorites">${isFavorite(`target:${t.title}:${t.artist}`) ? '♥' : '♡'}</button>
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
  cleanup(self);
  const genre = self._genre || 'all';
  const countFor = (g) => SONGS.filter((s) => s.genres.includes(g)).length + TARGET_SONGS.filter((t) => t.genres.includes(g)).length;
  root.innerHTML = `
    <p class="eyebrow">Songs</p>
    <h1>Songs</h1>
    <p class="lead">Two kinds: a play-along songbook you can strum along with in the app, and real
    on-the-radio songs to aim for. Filter by the style you love.</p>

    <div class="chip-row" id="genre-filter">
      <button class="chip-btn ${genre === 'all' ? 'sel' : ''}" data-genre="all">All (${SONGS.length + TARGET_SONGS.length})</button>
      <button class="chip-btn ${genre === 'favorites' ? 'sel' : ''}" data-genre="favorites">♥ My songbook</button>
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

  self._listClick = (e) => {
    const favorite = e.target.closest('[data-favorite]');
    if (favorite) {
      e.preventDefault();
      toggleFavorite(favorite.dataset.favorite);
      list(root, self);
      return;
    }
    const btn = e.target.closest('.chip-btn');
    if (!btn) return;
    self._genre = btn.dataset.genre;
    list(root, self);
  };
  root.addEventListener('click', self._listClick);
  self._root = root;
}

function detail(root, id, self) {
  const song = SONG_BY_ID[id];
  if (!song) return list(root, self);
  cleanup(self);
  const arrangement = arrangementFor(song);
  const groove = arrangement && GROOVES[arrangement.groove];
  const tempoText = arrangement?.meter === 6
    ? `${arrangement.bpm} dotted-quarter BPM`
    : `${arrangement?.bpm} BPM`;
  const verifiedTiming = arrangement?.timing === 'verified';
  const score = scoreFor(song);
  const musicallyCertified = score?.status === 'certified';
  const capo = self._capoBySong?.[song.id] ?? song.capo ?? 0;

  root.innerHTML = `
    <a class="back-link" href="#/songs">← All songs</a>
    <div class="tag-row">
      ${song.genres.map((g) => `<span class="pill gold">${cap(g)}</span>`).join('')}
      <span class="pill">${song.difficulty}</span>
    </div>
    <h1 style="margin-top:.4rem">${song.title}</h1>
    <button class="btn favorite-detail ${isFavorite(`song:${song.id}`) ? 'liked' : ''}" id="song-favorite">${isFavorite(`song:${song.id}`) ? '♥ In my songbook' : '♡ Add to my songbook'}</button>
    <p class="faint" style="margin-top:0">Written in ${song.key} shapes · ${song.time}</p>

    <div class="callout" style="margin:.6rem 0 1.1rem">${song.note}</div>
    <section class="panel capo-finder" aria-labelledby="capo-title">
      <div><p class="eyebrow">Match the singer</p><h3 id="capo-title">Capo key finder</h3></div>
      <label>Capo fret
        <select id="capo-fret">${Array.from({ length: 8 }, (_, fret) => `<option value="${fret}" ${fret === capo ? 'selected' : ''}>${fret === 0 ? 'None' : fret}</option>`).join('')}</select>
      </label>
      <p id="capo-result"><strong>Play ${song.key} shapes</strong> · sounds in <strong>${transposeKey(song.key, capo)}</strong></p>
      <p class="faint">Move one fret at a time until the first line feels comfortable to sing. The diagrams and chord names stay the same; Campfire's listening and backing follow your capo choice.</p>
    </section>
    ${arrangement ? `<section class="panel arrangement-guide" style="margin-top:1rem">
      <p class="eyebrow">${musicallyCertified ? 'Scored melody + source-checked accompaniment' : verifiedTiming ? 'Harmony/form checked · melody audit pending' : 'Beginner accompaniment practice'}</p>
      <div class="grid arrangement-roles">
        <div><h3>Accompany the singer</h3><p><strong>${groove.label}</strong> at about ${tempoText}.</p>
          <p><strong>Count:</strong> ${groove.count}</p><p class="muted">${arrangement.dynamics}</p></div>
        <div><h3>Play lead without crowding</h3><p class="muted">${arrangement.lead}</p></div>
      </div>
      <p class="faint" style="margin-bottom:.35rem"><strong>${arrangement.section}:</strong></p>
      <div class="arrangement-bars">${arrangement.bars.map((bar, index) => `<span><small>${index + 1}</small>${barChords(bar).join(' / ')}</span>`).join('')}</div>
      ${verifiedTiming
        ? `<p class="faint"><strong>Form checked:</strong> the bar order and chord changes are aligned to the displayed lyric cues. <strong>Source:</strong> <a href="${arrangement.verification.url}" target="_blank" rel="noopener noreferrer">${arrangement.verification.label}</a>. <strong>Checked:</strong> ${arrangement.verification.checked}.</p>`
        : '<p class="faint"><strong>Practice reduction:</strong> this teaches the song\'s chord vocabulary and feel, but it is not yet a lyric-synchronized transcription.</p>'}
      <div class="callout"><strong>${musicallyCertified ? 'Musical reference:' : 'About the groove:'}</strong> ${musicallyCertified
        ? `Hear mode plays the public-domain melody from <a href="${score.source.url}" target="_blank" rel="noopener noreferrer">${score.source.label}</a> on the same clock as chords, lyrics, and guitar strokes.`
        : 'This page has checked harmony and form, but no note-by-note melody yet. Treat its generated guitar as accompaniment practice—not a reference recording of the song.'}</div>
    </section>` : ''}

    <div class="btn-row" style="margin:1rem 0">
      <button class="btn btn-primary" id="pa-start">🎤 Rehearse chord order — I'll listen</button>
      <button class="btn" id="sa-start">${score ? '🎼 Open song studio' : '🔊 Practice accompaniment'}</button>
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
    if (e.target.closest('#song-favorite')) { toggleFavorite(`song:${song.id}`); detail(root, song.id, self); return; }
    if (e.target.closest('#pa-start')) { playAlong(root, song, self); return; }
    if (e.target.closest('#sa-start')) { singAlong(root, song, self); return; }
    const btn = e.target.closest('.btn-play');
    if (btn) {
      const chord = CHORD_BY_NAME[btn.dataset.chord];
      if (chord) strum(transposeFrequencies(chordFrequencies(chord), capo));
    }
  };
  self._onChange = (e) => {
    if (e.target.id !== 'capo-fret') return;
    self._capoBySong ||= {};
    self._capoBySong[song.id] = Number(e.target.value);
    detail(root, song.id, self);
  };
  root.addEventListener('click', self._onClick);
  root.addEventListener('change', self._onChange);
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
  const OPEN_SIM_OK = 0.86;
  const GUIDED_SIM_OK = 0.72;
  const GUIDED_PRESENT = 0.22;
  const capo = self._capoBySong?.[song.id] ?? song.capo ?? 0;
  const judge = new ChordJudge(0.35, capo);

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
    const { chroma, active, calibrating } = frame;
    if (calibrating) {
      judge.reset();
      hearEl.textContent = 'Room check: stay quiet for one second…';
      confFill.style.width = '0%';
      return;
    }
    judge.push(chroma, active);
    if (done()) { hearEl.textContent = ''; return; }
    if (!active) armed = true;

    const best = judge.best();
    const confident = isConfidentMatch(best, OPEN_SIM_OK);
    const targetName = seq[idx];
    const target = best.ranked.find((item) => item.name === targetName);
    const chord = CHORD_BY_NAME[targetName];
    const expected = chord
      ? chordPitchClasses(transposeFrequencies(chordFrequencies(chord), capo))
      : [];
    const evaluation = evaluateChord(judge.profile(), expected, { presentThresh: GUIDED_PRESENT });
    const guided = isGuidedMatch(target, evaluation, GUIDED_SIM_OK, best.name);
    hearEl.textContent = active && best.name
      ? `${confident ? `I hear: ${best.name}` : 'Chord heard · exact shape uncertain'} · ${Math.round(best.sim * 100)}%`
      : '';

    const onTarget = armed && active && guided;
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
  const score = scoreFor(song);
  const capo = self._capoBySong?.[song.id] ?? song.capo ?? 0;
  const bars = arrangement.bars;
  const beatsPerBar = arrangement.meter;
  const groove = GROOVES[arrangement.groove];
  const grid = rhythmGrid(beatsPerBar, groove);
  const lyricCues = arrangement.cues || [];
  const vocalCues = arrangement.vocalCues || [];
  let bpm = arrangement.bpm;
  let playing = false;
  let studioMode = score ? 'reference' : 'backing';
  let barIndex = 0;
  let nextBarTime = 0;
  let countIn = true;
  let timer = null;
  const uiQueue = [];

  root.innerHTML = `
    <button class="back-link" id="sa-exit" style="background:none;border:none;cursor:pointer">← Back to song</button>
    <h1 style="margin:.2rem 0">${song.title}</h1>
    <p class="faint" style="margin-top:0">${score
      ? `Score-driven studio: melody, lyric syllables, harmony, and guitar share one clock. You get one count-in bar, then the written form loops.`
      : arrangement.timing === 'verified'
      ? `Harmony/form practice: ${arrangement.section}. This song does not yet have a note-by-note reference melody.`
      : `Simplified accompaniment practice: ${arrangement.section}. It teaches chord changes and feel, but does not claim exact lyric timing.`}</p>

    <section class="panel" style="text-align:center">
      <div class="pa-progress" id="sa-progress"></div>
      <div class="pa-current">
        <div class="pa-name" id="sa-name">–</div>
        <div id="sa-diagram"></div>
      </div>
      ${lyricCues.length ? `<div class="sing-cue-wrap">
        <p class="eyebrow">Lyric / chord-change cue</p>
        <div id="sa-cue" class="sing-cue">Get ready...</div>
      </div>` : ''}
      <div class="guided-rhythm" aria-label="Live strumming grid">
        <p class="eyebrow">Your hand right now</p>
        <div id="sa-rhythm-grid" class="rhythm-guide-grid">${grid.map((slot) => `<span class="rhythm-guide-slot ${slot.event ? 'hit' : 'air'}" data-beat="${slot.beat}"><b>${strokeArrow(slot.event)}</b><small>${slot.label}</small></span>`).join('')}</div>
        <p id="sa-action" class="strum-now">Count in first—then follow the orange square.</p>
        <p class="faint">The hand follows the count; the lyric floats across it. Change chord on the displayed lyric cue—do not add one strum for every word.</p>
      </div>
      ${score ? `<div class="studio-modes" id="studio-modes">
        <button class="chip-btn sel" data-mode="reference">Hear song</button>
        <button class="chip-btn" data-mode="play">Play with Campfire</button>
        <button class="chip-btn" data-mode="perform">Perform</button>
      </div>
      <p id="studio-mode-help" class="faint">Melody plus guitar accompaniment: first listen for what makes the song recognizable.</p>` : ''}
      <div class="bpm-display" style="font-size:2rem;margin-top:.6rem"><span id="sa-bpm">${bpm}</span> <small>BPM</small></div>
      <input id="sa-slider" type="range" min="50" max="130" value="${bpm}" style="max-width:280px" />
      <div class="btn-row" style="justify-content:center;margin-top:.6rem">
        <button class="btn btn-primary" id="sa-toggle" style="min-width:120px">▶ Play</button>
        <button class="btn" id="sa-restart">↻ Restart</button>
      </div>
      <p class="faint" style="margin:.7rem 0 0;font-size:.8rem"><strong>${groove.label} · count ${groove.count}.</strong> ${arrangement.dynamics}</p>
    </section>
  `;

  const progressEl = root.querySelector('#sa-progress');
  const nameEl = root.querySelector('#sa-name');
  const diagramEl = root.querySelector('#sa-diagram');
  const bpmEl = root.querySelector('#sa-bpm');
  const slider = root.querySelector('#sa-slider');
  const toggle = root.querySelector('#sa-toggle');
  const cueEl = root.querySelector('#sa-cue');
  const rhythmSlots = [...root.querySelectorAll('.rhythm-guide-slot')];
  const actionEl = root.querySelector('#sa-action');
  const modeHelp = root.querySelector('#studio-mode-help');

  const drawStroke = (beat, event, cue) => {
    rhythmSlots.forEach((slot) => slot.classList.toggle('current', Number(slot.dataset.beat) === beat));
    actionEl.textContent = event !== 'air'
      ? `${event.kind === 'up' ? 'UP' : event.kind === 'bass' ? 'BASS' : event.kind === 'brush' ? 'BRUSH' : 'DOWN'} now · ${cue || 'hold the lyric phrase'}`
      : `Air strum · keep moving · ${cue || 'hold the lyric phrase'}`;
  };

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
    const freqs = transposeFrequencies(chordFrequencies(chord), capo);
    let notes = freqs;
    let spread = .024;
    if (event.kind === 'bass') { notes = freqs.slice(0, 1); spread = 0; }
    if (event.kind === 'brush') notes = freqs.slice(-4);
    if (event.kind === 'up') notes = freqs.slice(-4).reverse();
    if (event.kind === 'pick') {
      const index = event.fromTop ? freqs.length - event.fromTop : event.string % freqs.length;
      notes = [freqs[Math.max(0, index)]];
      spread = 0;
    }
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
        if (arrangement.pickup) uiQueue.push({
          time: nextBarTime + arrangement.pickup.beat * seconds,
          vocal: arrangement.pickup.text,
        });
        if (score) {
          const verseStart = nextBarTime + beatsPerBar * seconds;
          score.melody.filter((event) => event.beat < 0).forEach((event) => {
            if (event.midi != null && studioMode !== 'perform') melodyAt(
              midiFrequency(event.midi), verseStart + event.beat * seconds, (event.sustain || event.duration) * seconds,
            );
            if (event.lyric) uiQueue.push({ time: verseStart + event.beat * seconds, vocal: event.lyric });
          });
        }
        countIn = false;
      } else {
        const idx = barIndex % bars.length;
        const bar = bars[idx];
        const barEvents = groove.barEvents?.[idx % groove.barEvents.length] || groove.events;
        barEvents.forEach((event) => {
          const chordName = chordAtBeat(bar, event.beat);
          if (studioMode === 'reference' || studioMode === 'backing') {
            const gainScale = score && studioMode === 'reference' ? .45 : 1;
            scheduleStroke({ ...event, gain: event.gain * gainScale }, chordName, nextBarTime + event.beat * seconds);
          }
        });
        if (score) {
          const barStart = idx * beatsPerBar;
          score.melody.filter((event) => event.beat >= barStart && event.beat < barStart + beatsPerBar)
            .forEach((event) => {
              const atTime = nextBarTime + (event.beat - barStart) * seconds;
              if (event.midi != null && studioMode !== 'perform') {
                melodyAt(midiFrequency(event.midi), atTime, (event.sustain || event.duration) * seconds);
              }
              if (event.lyric) uiQueue.push({ time: atTime, vocal: event.lyric });
            });
          if (idx === bars.length - 1) {
            const nextVerse = nextBarTime + beatsPerBar * seconds;
            score.melody.filter((event) => event.beat < 0).forEach((event) => {
              const atTime = nextVerse + event.beat * seconds;
              if (event.midi != null && studioMode !== 'perform') {
                melodyAt(midiFrequency(event.midi), atTime, (event.sustain || event.duration) * seconds);
              }
              if (event.lyric) uiQueue.push({ time: atTime, vocal: event.lyric });
            });
          }
        }
        grid.forEach((slot) => {
          const event = barEvents.find((candidate) => candidate.beat === slot.beat);
          const barCue = lyricCues[idx];
          const cueParts = Array.isArray(barCue) ? barCue : [barCue];
          const changeBeats = barChangeBeats(bar, beatsPerBar);
          let cueSlot = 0;
          changeBeats.forEach((changeBeat, candidate) => { if (changeBeat <= slot.beat) cueSlot = candidate; });
          uiQueue.push({ time: nextBarTime + slot.beat * seconds, stroke: event || 'air', beat: slot.beat,
            cue: cueParts[Math.min(cueSlot, cueParts.length - 1)] || null });
        });
        const changeBeats = barChangeBeats(bar, beatsPerBar);
        barChords(bar).forEach((chordName, slot) => {
          const barCue = lyricCues[idx];
          const cueParts = Array.isArray(barCue) ? barCue : [barCue];
          const cue = cueParts[Math.min(slot, cueParts.length - 1)] || null;
          uiQueue.push({ time: nextBarTime + changeBeats[slot] * seconds, idx, chordName, cue });
        });
        vocalCues.filter((item) => item.bar === idx).forEach((item) => {
          uiQueue.push({ time: nextBarTime + item.beat * seconds, vocal: item.text });
        });
        barIndex++;
      }
      uiQueue.sort((a, b) => a.time - b.time);
      nextBarTime += beatsPerBar * seconds;
    }
    while (uiQueue.length && uiQueue[0].time <= ac.currentTime) {
      const item = uiQueue.shift();
      if (item.count) {
        nameEl.textContent = 'Count in…';
        diagramEl.innerHTML = '';
        if (cueEl) cueEl.textContent = 'Get ready...';
      } else if (item.vocal) { if (cueEl) cueEl.textContent = item.vocal; }
      else if (item.stroke) drawStroke(item.beat, item.stroke, item.cue);
      else drawUI(item.idx, item.chordName, item.cue);
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
  root.querySelector('#studio-modes')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-mode]');
    if (!button) return;
    stop();
    studioMode = button.dataset.mode;
    root.querySelectorAll('#studio-modes [data-mode]').forEach((item) => item.classList.toggle('sel', item === button));
    modeHelp.textContent = studioMode === 'reference'
      ? 'Melody plus guitar accompaniment: first listen for what makes the song recognizable.'
      : studioMode === 'play'
        ? 'Melody only: Campfire carries the tune while you supply every guitar stroke.'
        : 'No melody or guitar after the count-in: use only the clock and visual cues.';
    barIndex = 0; countIn = true; uiQueue.length = 0; drawUI(0);
  });

  drawUI(0);
}

function cleanup(self) {
  if (self._player) { self._player.stop(); self._player = null; }
  if (self._accompanist) { self._accompanist(); self._accompanist = null; }
  if (self._onClick && self._root) { self._root.removeEventListener('click', self._onClick); self._onClick = null; }
  if (self._onChange && self._root) { self._root.removeEventListener('change', self._onChange); self._onChange = null; }
  if (self._listClick && self._root) { self._root.removeEventListener('click', self._listClick); self._listClick = null; }
}

export default {
  _genre: 'all',
  _capoBySong: {},
  render(root, param) {
    if (param) detail(root, param, this);
    else list(root, this);
  },
  destroy() {
    cleanup(this);
  },
};
