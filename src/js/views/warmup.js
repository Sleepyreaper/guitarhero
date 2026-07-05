import { Metronome } from '../lib/metronome.js';

const STRINGS = ['E', 'A', 'D', 'G', 'B', 'e']; // low E (left) .. high e
const STRING_LABEL = ['Low E', 'A', 'D', 'G', 'B', 'High e'];

// Build a note sequence: for each string, play the given fret order (finger = fret).
function build(fretOrder) {
  const up = [];
  for (let s = 0; s < 6; s++) for (const f of fretOrder) up.push({ s, f });
  const down = [];
  for (let s = 5; s >= 0; s--) for (const f of [...fretOrder].reverse()) down.push({ s, f });
  return [...up, ...down];
}

const EXERCISES = {
  '1-2-3-4': build([1, 2, 3, 4]),
  '1-3-2-4': build([1, 3, 2, 4]),
};

export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Warm-up · finger gym</p>
      <h1>Finger warm-ups</h1>
      <p class="lead">Two minutes of this before you play makes chords dramatically easier. It builds
      finger independence and strength — the exact hand skill that makes fretting click. One note per beat.</p>

      <section class="panel" style="text-align:center">
        <div class="btn-row" style="justify-content:center;align-items:center;gap:1rem;flex-wrap:wrap">
          <label class="mic-label">Exercise
            <select id="ex" style="margin-left:.4rem;background:var(--panel-2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:.3rem .5rem">
              <option value="1-2-3-4">1·2·3·4 (up &amp; down)</option>
              <option value="1-3-2-4">1·3·2·4 (finger jumps)</option>
            </select>
          </label>
        </div>

        <div class="warmup-cue" id="cue">Finger 1 · Low E · fret 1</div>

        <div class="fretboard" id="fb">
          <div class="fb-strings">${STRINGS.map((n) => `<span>${n}</span>`).join('')}</div>
          ${[1, 2, 3, 4].map((f) => `<div class="fb-row">${[0, 1, 2, 3, 4, 5].map((s) => `<div class="fb-cell" data-s="${s}" data-f="${f}"></div>`).join('')}</div>`).join('')}
        </div>

        <div class="bpm-display" style="font-size:2rem;margin-top:.8rem"><span id="bpm">60</span> <small>BPM</small></div>
        <input id="slider" type="range" min="40" max="120" value="60" style="max-width:280px" />
        <div class="btn-row" style="justify-content:center;margin-top:.6rem">
          <button id="toggle" class="btn btn-primary" style="min-width:120px">▶ Start</button>
        </div>
        <p class="faint" style="margin:.8rem 0 0;font-size:.8rem">Keep fingers low and close to the strings, one finger per fret. Aim for even, clean notes — not speed.</p>
      </section>
    `;

    const cue = root.querySelector('#cue');
    const bpmEl = root.querySelector('#bpm');
    const slider = root.querySelector('#slider');
    const toggle = root.querySelector('#toggle');
    const exSel = root.querySelector('#ex');
    const cells = [...root.querySelectorAll('.fb-cell')];

    let steps = EXERCISES['1-2-3-4'];
    let idx = -1;

    const showStep = (step) => {
      cells.forEach((c) => { c.classList.remove('active'); c.textContent = ''; });
      const cell = root.querySelector(`.fb-cell[data-s="${step.s}"][data-f="${step.f}"]`);
      if (cell) { cell.classList.add('active'); cell.textContent = step.f; }
      cue.textContent = `Finger ${step.f} · ${STRING_LABEL[step.s]} · fret ${step.f}`;
    };

    this.metro = new Metronome(() => {
      idx = (idx + 1) % steps.length;
      showStep(steps[idx]);
    });
    this.metro.beatsPerMeasure = 4;

    exSel.addEventListener('change', () => { steps = EXERCISES[exSel.value]; idx = -1; });
    slider.addEventListener('input', () => { bpmEl.textContent = this.metro.setBpm(+slider.value); });
    this.metro.setBpm(60);

    toggle.addEventListener('click', () => {
      if (this.metro.running) {
        this.metro.stop();
        toggle.textContent = '▶ Start';
        toggle.classList.add('btn-primary');
      } else {
        idx = -1;
        this.metro.start();
        toggle.textContent = '⏹ Stop';
        toggle.classList.remove('btn-primary');
      }
    });

    showStep(steps[0]);
  },
  destroy() {
    if (this.metro) this.metro.stop();
  },
};
