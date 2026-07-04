import { SONGS, SONG_BY_ID, GENRES } from '../data/songs.js';
import { CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordSVG } from '../components/chordDiagram.js';
import { strum } from '../lib/audio.js';
import { markPracticedToday } from '../lib/storage.js';

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

    <section class="panel" style="margin-top:1rem">
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
      <a class="btn" href="#/metronome">🥁 Practice with the metronome</a>
      <a class="btn" href="#/chords">🎸 Chord Coach</a>
    </div>
  `;

  this._onClick = (e) => {
    const btn = e.target.closest('.btn-play');
    if (!btn) return;
    const chord = CHORD_BY_NAME[btn.dataset.chord];
    if (chord) strum(chordFrequencies(chord));
  };
  root.addEventListener('click', this._onClick);
  this._root = root;
}

export default {
  _genre: 'all',
  render(root, param) {
    if (param) detail.call(this, root, param, this);
    else list(root, this);
  },
  destroy() {
    if (this._root && this._onClick) this._root.removeEventListener('click', this._onClick);
  },
};
