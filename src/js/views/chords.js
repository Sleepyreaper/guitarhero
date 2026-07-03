import { CHORDS, CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordCard } from '../components/chordDiagram.js';
import { strum } from '../lib/audio.js';

const GROUPS = [
  { key: 'first', title: 'Start here — your first two', sub: 'The two easiest shapes. Learn these and you can already change chords.' },
  { key: 'core', title: 'The core open chords', sub: 'These plus the first two cover the vast majority of country, folk & church songs.' },
  { key: 'extra', title: 'Color & worship extras', sub: 'Sevenths and add-9 shapes that give songs their flavor.' },
];

export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Reference</p>
      <h1>Chord library</h1>
      <p class="lead">Tap <strong>hear it</strong> on any chord to know what a clean version should sound like.
      Diagrams read low-E on the left; numbers are which finger to use.</p>

      ${GROUPS.map((g) => `
        <section style="margin-top:1.4rem">
          <h2>${g.title}</h2>
          <p class="muted" style="margin-top:0">${g.sub}</p>
          <div class="grid chords-grid">
            ${CHORDS.filter((c) => c.group === g.key).map((c) => chordCard(c)).join('')}
          </div>
        </section>`).join('')}

      <div class="callout" style="margin-top:1.5rem">
        <strong>Capo tip:</strong> a capo lets you keep these easy shapes but raise the key to match a singer.
        Clamp it behind a fret and your <em>G</em> shape becomes a higher chord — the secret behind most worship guitar.
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
  },
  destroy() {
    if (this._root && this._onClick) this._root.removeEventListener('click', this._onClick);
  },
};
