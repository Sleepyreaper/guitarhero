import { CHORDS, CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordCard } from '../components/chordDiagram.js';
import { strum } from '../lib/audio.js';
import { ChordListener } from '../lib/listener.js';
import { chordPitchClasses, evaluateChord, PC_NAMES, pcNames } from '../lib/chroma.js';

const GROUPS = [
  { key: 'first', title: 'Start here — your first two', sub: 'The two easiest shapes. Learn these and you can already change chords.' },
  { key: 'core', title: 'The core open chords', sub: 'These plus the first two cover the vast majority of country, folk & church songs.' },
  { key: 'extra', title: 'Color & worship extras', sub: 'Sevenths and add-9 shapes that give songs their flavor.' },
];

const PRESENT = 0.28; // pitch-class energy (0..1) at/above which we call a note "heard"

export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Reference & practice</p>
      <h1>Chords</h1>

      <section class="panel coach">
        <div class="coach-head">
          <div>
            <p class="eyebrow" style="margin:0">🎤 Chord Coach</p>
            <h2>Strum a chord — I'll tell you if it rings true</h2>
          </div>
          <button id="coach-toggle" class="btn btn-primary">🎤 Start listening</button>
        </div>

        <div class="coach-pick" id="coach-pick">
          ${CHORDS.map((c) => `<button data-chord="${c.name}">${c.name}</button>`).join('')}
        </div>

        <div id="verdict" class="verdict idle">Pick a chord, press <strong>Start listening</strong>, then strum.</div>
        <div class="note-chips" id="note-chips"></div>

        <div class="chroma" id="chroma">
          ${PC_NAMES.map((n, pc) => `
            <div class="chroma-col" data-pc="${pc}">
              <div class="chroma-bar-wrap"><div class="chroma-bar"></div></div>
              <div class="chroma-label">${n}</div>
            </div>`).join('')}
        </div>
        <p class="coach-tip faint">Play in a quiet room and let the chord ring. This listens with your device's mic
        (audio analysis, not MIDI) — a coach, not a judge. The bars show what it hears; gold labels are the notes this chord needs.</p>
        <div id="coach-err" class="faint" style="text-align:center;color:var(--red)"></div>
      </section>

      ${GROUPS.map((g) => `
        <section style="margin-top:1.4rem">
          <h2>${g.title}</h2>
          <p class="muted" style="margin-top:0">${g.sub}</p>
          <div class="grid chords-grid">
            ${CHORDS.filter((c) => c.group === g.key).map((c) => chordCard(c)).join('')}
          </div>
        </section>`).join('')}
    `;

    // ---- Chord Coach wiring ----
    const toggle = root.querySelector('#coach-toggle');
    const verdict = root.querySelector('#verdict');
    const chipsEl = root.querySelector('#note-chips');
    const errEl = root.querySelector('#coach-err');
    const cols = [...root.querySelectorAll('.chroma-col')]; // index === pitch class
    const bars = cols.map((c) => c.querySelector('.chroma-bar'));
    const pickBtns = [...root.querySelectorAll('#coach-pick button')];

    let selected = CHORD_BY_NAME['C'] || CHORDS[0];
    let expectedPCs = [];
    let expectedSet = new Set();
    let okStreak = 0;

    const setSelected = (chord) => {
      selected = chord;
      expectedPCs = chordPitchClasses(chordFrequencies(chord));
      expectedSet = new Set(expectedPCs);
      pickBtns.forEach((b) => b.classList.toggle('sel', b.dataset.chord === chord.name));
      cols.forEach((c, pc) => { c.classList.toggle('expected', expectedSet.has(pc)); c.classList.remove('hit'); });
      chipsEl.innerHTML = expectedPCs.map((pc) => `<span class="note-chip" data-pc="${pc}">${PC_NAMES[pc]}</span>`).join('');
      okStreak = 0;
      if (!this.listener || !this.listener.running) {
        verdict.className = 'verdict idle';
        verdict.innerHTML = `Press <strong>Start listening</strong>, then strum a <strong>${chord.name}</strong>.`;
      }
    };

    pickBtns.forEach((b) => b.addEventListener('click', () => setSelected(CHORD_BY_NAME[b.dataset.chord])));
    setSelected(selected);

    this.listener = new ChordListener((frame) => {
      const { chroma, active } = frame;
      // Update the visualizer.
      for (let pc = 0; pc < 12; pc++) {
        bars[pc].style.height = `${Math.round(chroma[pc] * 100)}%`;
        cols[pc].classList.toggle('hit', expectedSet.has(pc) && chroma[pc] >= PRESENT);
      }
      const chips = [...chipsEl.children];
      chips.forEach((chip) => {
        const pc = +chip.dataset.pc;
        chip.classList.toggle('hit', chroma[pc] >= PRESENT);
      });

      if (!active) {
        okStreak = 0;
        verdict.className = 'verdict idle';
        verdict.textContent = `Strum your ${selected.name}…`;
        return;
      }

      const ev = evaluateChord(chroma, expectedPCs, { presentThresh: PRESENT });
      okStreak = ev.ok ? Math.min(okStreak + 1, 12) : Math.max(okStreak - 2, 0);

      if (okStreak >= 8) {
        verdict.className = 'verdict ok';
        verdict.textContent = `✓ That's a clean ${selected.name}!`;
      } else if (ev.coverage >= 0.66) {
        verdict.className = 'verdict almost';
        if (ev.missing.length) {
          verdict.textContent = `Almost — I can't hear the ${pcNames(ev.missing).join(' & ')}. Press that string a little harder.`;
        } else {
          verdict.textContent = `Close! Something extra is ringing (${PC_NAMES[ev.foreignPC]}). Mute the strings you're not fretting.`;
        }
      } else {
        verdict.className = 'verdict idle';
        verdict.textContent = `Keep strumming ${selected.name}…`;
      }
    });

    toggle.addEventListener('click', async () => {
      if (this.listener.running) {
        this.listener.stop();
        toggle.textContent = '🎤 Start listening';
        toggle.classList.add('btn-primary');
        verdict.className = 'verdict idle';
        verdict.innerHTML = `Stopped. Press <strong>Start listening</strong> to try again.`;
        cols.forEach((c) => c.classList.remove('hit'));
        bars.forEach((b) => (b.style.height = '0%'));
        return;
      }
      try {
        errEl.textContent = '';
        await this.listener.start();
        toggle.textContent = '⏹ Stop';
        toggle.classList.remove('btn-primary');
        verdict.className = 'verdict idle';
        verdict.textContent = `Listening… strum your ${selected.name}.`;
      } catch {
        errEl.textContent = 'Microphone blocked. Allow mic access and use an https:// (or localhost) address.';
      }
    });

    // ---- "hear it" strum synth (existing) ----
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
    if (this.listener) this.listener.stop();
    if (this._root && this._onClick) this._root.removeEventListener('click', this._onClick);
  },
};
