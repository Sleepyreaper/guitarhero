import { Tuner, STRINGS } from '../lib/pitch.js';

export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Standard tuning · E A D G B E</p>
      <h1>Tuner</h1>
      <p class="lead">Play one string at a time. Turn the peg until the note turns
      <span style="color:var(--green)">green</span> and the needle sits in the middle.</p>

      <section class="panel" style="text-align:center">
        <div id="note" class="tuner-note">–</div>
        <div id="freq" class="tuner-freq">play a string…</div>
        <div class="needle-wrap">
          <div class="needle-scale"></div>
          <div id="needle" class="needle" style="left:50%"></div>
        </div>
        <div id="cents" class="faint" style="font-family:var(--mono)">&nbsp;</div>
        <div class="btn-row" style="justify-content:center;margin-top:1rem">
          <button id="toggle" class="btn btn-primary">🎤 Start tuning</button>
        </div>
        <div id="err" class="faint" style="margin-top:.6rem;color:var(--red)"></div>

        <div class="string-row">
          ${STRINGS.map((s, i) => `<div class="string-btn" data-idx="${i}" title="${s.label}">${s.name}</div>`).join('')}
        </div>
        <p class="faint" style="margin:.8rem 0 0;font-size:.8rem">Thick low-E on the left → thin high-E on the right.</p>
      </section>
    `;

    const noteEl = root.querySelector('#note');
    const freqEl = root.querySelector('#freq');
    const centsEl = root.querySelector('#cents');
    const needle = root.querySelector('#needle');
    const toggle = root.querySelector('#toggle');
    const errEl = root.querySelector('#err');
    const strEls = [...root.querySelectorAll('.string-btn')];

    let lastSeen = 0;

    const clearStrings = () => strEls.forEach((e) => e.classList.remove('target', 'hit'));

    this.tuner = new Tuner((reading) => {
      const now = performance.now();
      if (!reading) {
        if (now - lastSeen > 400) {
          noteEl.textContent = '–';
          noteEl.className = 'tuner-note';
          freqEl.textContent = 'listening…';
          centsEl.innerHTML = '&nbsp;';
          needle.style.left = '50%';
          needle.classList.remove('intune');
          clearStrings();
        }
        return;
      }
      lastSeen = now;
      const inTune = Math.abs(reading.cents) <= 5;
      noteEl.textContent = reading.name;
      noteEl.className = 'tuner-note ' + (inTune ? 'intune' : reading.cents < 0 ? 'flat' : 'sharp');
      freqEl.textContent = `${reading.freq.toFixed(1)} Hz · ${reading.note}`;
      centsEl.textContent = inTune ? 'in tune ✓' : `${reading.cents > 0 ? '+' : ''}${reading.cents} cents ${reading.cents < 0 ? '(tune up ↑)' : '(tune down ↓)'}`;

      // Needle: map ±50 cents to 0–100%.
      const pos = Math.max(0, Math.min(100, 50 + reading.cents));
      needle.style.left = pos + '%';
      needle.classList.toggle('intune', inTune);

      // Highlight the nearest string.
      clearStrings();
      const idx = STRINGS.indexOf(reading.nearestString);
      if (idx >= 0) strEls[idx].classList.add(inTune ? 'hit' : 'target');
    });

    toggle.addEventListener('click', async () => {
      if (this.tuner.running) {
        this.tuner.stop();
        toggle.textContent = '🎤 Start tuning';
        toggle.classList.add('btn-primary');
        freqEl.textContent = 'stopped';
        clearStrings();
        return;
      }
      try {
        errEl.textContent = '';
        await this.tuner.start();
        toggle.textContent = '⏹ Stop';
        toggle.classList.remove('btn-primary');
      } catch (err) {
        errEl.textContent = 'Microphone blocked. Allow mic access (and use http://localhost, not a file:// page).';
      }
    });
  },
  destroy() {
    if (this.tuner) this.tuner.stop();
  },
};
