import { CHORDS, CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordSVG } from '../components/chordDiagram.js';
import { getAudioContext, strumAt } from '../lib/audio.js';

// 8 slots = eighth notes across a 4/4 bar. 'D' down, 'U' up, '' = air strum (miss).
const BEAT_LABELS = ['1', '&', '2', '&', '3', '&', '4', '&'];
const PATTERNS = {
  'All downstrokes': ['D', '', 'D', '', 'D', '', 'D', ''],
  'Down-up (eighths)': ['D', 'U', 'D', 'U', 'D', 'U', 'D', 'U'],
  'All-purpose: D · DU · UDU': ['D', '', 'D', 'U', '', 'U', 'D', 'U'],
  'Folk: D · DU · D · DU': ['D', '', 'D', 'U', 'D', '', 'D', 'U'],
};

export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Practice tool · strumming hand</p>
      <h1>Strum trainer</h1>
      <p class="lead">The strumming hand is half of sounding good. Watch and hear a pattern, then copy it.
      Keep your hand swinging down-up like a pendulum the whole time — even on the “air” strums.</p>

      <section class="panel" style="text-align:center">
        <div class="btn-row" style="justify-content:center;align-items:center;gap:1rem;flex-wrap:wrap">
          <label class="mic-label">Pattern
            <select id="pat" style="margin-left:.4rem;background:var(--panel-2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:.3rem .5rem">
              ${Object.keys(PATTERNS).map((k) => `<option value="${k}">${k}</option>`).join('')}
            </select>
          </label>
          <label class="mic-label">Chord
            <select id="chord" style="margin-left:.4rem;background:var(--panel-2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:.3rem .5rem">
              ${CHORDS.map((c) => `<option value="${c.name}">${c.name}</option>`).join('')}
            </select>
          </label>
        </div>

        <div class="strum-row" id="strum-row"></div>
        <div id="dia" style="margin:.4rem 0"></div>

        <div class="bpm-display" style="font-size:2rem;margin-top:.4rem"><span id="bpm">70</span> <small>BPM</small></div>
        <input id="slider" type="range" min="40" max="120" value="70" style="max-width:280px" />
        <div class="btn-row" style="justify-content:center;margin-top:.6rem">
          <button id="toggle" class="btn btn-primary" style="min-width:120px">▶ Play</button>
        </div>
        <p class="faint" style="margin:.8rem 0 0;font-size:.8rem">↓ = down, ↑ = up, · = keep the hand moving but don't hit the strings. Start slow.</p>
      </section>
    `;

    const patSel = root.querySelector('#pat');
    const chordSel = root.querySelector('#chord');
    const rowEl = root.querySelector('#strum-row');
    const diaEl = root.querySelector('#dia');
    const bpmEl = root.querySelector('#bpm');
    const slider = root.querySelector('#slider');
    const toggle = root.querySelector('#toggle');

    chordSel.value = 'G';
    let bpm = 70;
    let pattern = PATTERNS[patSel.value];
    let playing = false;
    let slot = 0;
    let nextTime = 0;
    let timer = null;
    const uiQueue = [];

    const drawRow = (active = -1) => {
      rowEl.innerHTML = pattern.map((p, i) => `
        <div class="strum-slot ${i === active ? 'on' : ''} ${p ? '' : 'air'}">
          <div class="strum-arrow">${p === 'D' ? '↓' : p === 'U' ? '↑' : '·'}</div>
          <div class="strum-beat">${BEAT_LABELS[i]}</div>
        </div>`).join('');
    };
    const drawChord = () => {
      const c = CHORD_BY_NAME[chordSel.value];
      diaEl.innerHTML = c ? chordSVG(c, { w: 104, h: 130 }) : '';
    };

    const scheduler = () => {
      const ac = getAudioContext();
      const eighth = 60 / bpm / 2;
      while (nextTime < ac.currentTime + 0.15) {
        const hit = pattern[slot];
        if (hit) {
          const c = CHORD_BY_NAME[chordSel.value];
          if (c) {
            const freqs = chordFrequencies(c);
            const accent = slot % 2 === 0;
            if (hit === 'D') strumAt(freqs, nextTime, accent ? 0.2 : 0.14);
            else strumAt([...freqs].reverse(), nextTime, 0.09, 0.02); // up-strum: lighter, high→low
          }
        }
        uiQueue.push({ time: nextTime, slot });
        slot = (slot + 1) % 8;
        nextTime += eighth;
      }
      while (uiQueue.length && uiQueue[0].time <= ac.currentTime) drawRow(uiQueue.shift().slot);
    };

    const start = () => {
      const ac = getAudioContext();
      playing = true;
      slot = 0;
      nextTime = ac.currentTime + 0.12;
      timer = setInterval(scheduler, 25);
      toggle.textContent = '⏸ Stop';
      toggle.classList.remove('btn-primary');
    };
    const stop = () => {
      playing = false;
      if (timer) clearInterval(timer);
      timer = null;
      uiQueue.length = 0;
      toggle.textContent = '▶ Play';
      toggle.classList.add('btn-primary');
      drawRow(-1);
    };
    this._stop = stop;

    patSel.addEventListener('change', () => { pattern = PATTERNS[patSel.value]; drawRow(-1); });
    chordSel.addEventListener('change', drawChord);
    slider.addEventListener('input', () => { bpm = +slider.value; bpmEl.textContent = bpm; });
    toggle.addEventListener('click', () => (playing ? stop() : start()));

    drawRow(-1);
    drawChord();
  },
  destroy() {
    if (this._stop) this._stop();
  },
};
