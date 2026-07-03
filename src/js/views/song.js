import { SONGS, SONG_BY_ID } from '../data/songs.js';
import { CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordSVG } from '../components/chordDiagram.js';
import { strum } from '../lib/audio.js';
import { markPracticedToday } from '../lib/storage.js';

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

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

function list(root) {
  root.innerHTML = `
    <p class="eyebrow">Play-along</p>
    <h1>Songs</h1>
    <p class="lead">Real songs you can play with the beginner chords — all public domain, spanning country,
    folk, americana & church. Start at the top; each one down the list adds a little more.</p>
    <div class="grid song-list" style="margin-top:1rem">
      ${SONGS.map((s) => `
        <a class="panel song-card" href="#/songs/${s.id}">
          <div class="tag-row"><span class="pill gold">${s.style}</span><span class="pill">${s.difficulty}</span></div>
          <h3 style="margin:.3rem 0 0">${s.title}</h3>
          <div class="faint" style="font-size:.85rem">${s.chords.join(' · ')} · ${s.time}</div>
        </a>`).join('')}
    </div>
  `;
}

function detail(root, id) {
  const song = SONG_BY_ID[id];
  if (!song) return list(root);
  markPracticedToday();

  root.innerHTML = `
    <a class="back-link" href="#/songs">← All songs</a>
    <div class="tag-row"><span class="pill gold">${song.style}</span><span class="pill">${song.difficulty}</span></div>
    <h1 style="margin-top:.4rem">${song.title}</h1>
    <p class="faint" style="margin-top:0">Key of ${song.key} · ${song.time}${song.capo ? ` · Capo ${song.capo}` : ' · No capo'}</p>

    <div class="callout" style="margin:.6rem 0 1.1rem">${song.note}</div>

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
      <a class="btn" href="#/metronome">🥁 Practice with the metronome</a>
      <a class="btn" href="#/chords">🎸 Chord library</a>
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
  render(root, param) {
    if (param) detail.call(this, root, param);
    else list(root);
  },
  destroy() {
    if (this._root && this._onClick) this._root.removeEventListener('click', this._onClick);
  },
};
