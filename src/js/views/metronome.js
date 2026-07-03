import { Metronome } from '../lib/metronome.js';

export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Timing tool</p>
      <h1>Metronome</h1>
      <p class="lead">Great rhythm is what separates a beginner from someone who sounds good.
      Start slow — <strong>60–70 BPM</strong> — and only speed up once it feels easy.</p>

      <section class="panel" style="text-align:center">
        <div class="bpm-display"><span id="bpm">80</span><br><small>BPM</small></div>
        <div id="dots" class="beat-dots"></div>

        <input id="slider" type="range" min="30" max="200" value="80" />
        <div class="btn-row" style="justify-content:center;margin-top:1rem">
          <button class="btn" id="minus">– 5</button>
          <button class="btn btn-primary" id="toggle" style="min-width:120px">▶ Start</button>
          <button class="btn" id="plus">+ 5</button>
        </div>

        <div class="btn-row" style="justify-content:center;margin-top:1rem;align-items:center">
          <label class="muted" style="font-size:.9rem">Beats per bar
            <select id="beats" style="margin-left:.4rem;background:var(--panel-2);color:var(--text);border:1px solid var(--line);border-radius:8px;padding:.3rem .5rem">
              <option>2</option><option>3</option><option selected>4</option><option>6</option>
            </select>
          </label>
          <button class="btn btn-ghost" id="tap">👆 Tap tempo</button>
        </div>
        <p class="faint" style="margin-top:.9rem;font-size:.8rem">Tip: for the all-purpose strum (D–DU–UDU), set 4/4 around 60 BPM.</p>
      </section>
    `;

    const bpmEl = root.querySelector('#bpm');
    const slider = root.querySelector('#slider');
    const toggle = root.querySelector('#toggle');
    const dotsEl = root.querySelector('#dots');
    const beatsSel = root.querySelector('#beats');

    this.metro = new Metronome((beat) => {
      const dots = [...dotsEl.children];
      dots.forEach((d, i) => d.classList.toggle('on', i === beat));
    });

    const buildDots = () => {
      dotsEl.innerHTML = '';
      for (let i = 0; i < this.metro.beatsPerMeasure; i++) {
        const d = document.createElement('div');
        d.className = 'beat-dot' + (i === 0 ? ' accent' : '');
        dotsEl.appendChild(d);
      }
    };
    buildDots();

    const setBpm = (v) => {
      const b = this.metro.setBpm(v);
      bpmEl.textContent = b;
      slider.value = b;
    };

    slider.addEventListener('input', () => setBpm(+slider.value));
    root.querySelector('#plus').addEventListener('click', () => setBpm(this.metro.bpm + 5));
    root.querySelector('#minus').addEventListener('click', () => setBpm(this.metro.bpm - 5));
    beatsSel.addEventListener('change', () => { this.metro.beatsPerMeasure = +beatsSel.value; buildDots(); });

    toggle.addEventListener('click', () => {
      if (this.metro.running) {
        this.metro.stop();
        toggle.textContent = '▶ Start';
        toggle.classList.add('btn-primary');
        [...dotsEl.children].forEach((d) => d.classList.remove('on'));
      } else {
        this.metro.start();
        toggle.textContent = '⏹ Stop';
        toggle.classList.remove('btn-primary');
      }
    });

    // Tap tempo.
    let taps = [];
    root.querySelector('#tap').addEventListener('click', () => {
      const now = performance.now();
      taps = taps.filter((t) => now - t < 2000);
      taps.push(now);
      if (taps.length >= 2) {
        const gaps = [];
        for (let i = 1; i < taps.length; i++) gaps.push(taps[i] - taps[i - 1]);
        const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
        setBpm(60000 / avg);
      }
    });
  },
  destroy() {
    if (this.metro) this.metro.stop();
  },
};
