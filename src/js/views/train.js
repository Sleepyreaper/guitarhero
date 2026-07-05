import { CHORDS, CHORD_BY_NAME, chordFrequencies } from '../data/chords.js';
import { chordSVG } from '../components/chordDiagram.js';
import { ChordListener } from '../lib/listener.js';
import { ChordJudge } from '../lib/coach.js';
import { listAudioInputs, activeDeviceId } from '../lib/devices.js';
import { pairKey, getBestChanges, recordChanges, addPracticeSeconds } from '../lib/storage.js';

const DURATION = 60;
const SIM_OK = 0.8;   // confidence to accept a chord
const CONFIRM = 2;    // frames a new chord must hold before it counts as a change

export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Practice tool</p>
      <h1>Chord-change trainer</h1>
      <p class="lead">The #1 beginner skill: clean, fast chord changes. Pick two chords, then switch
      back and forth for 60 seconds. I'll count every clean change — beat your best each day.</p>

      <section class="panel" style="text-align:center">
        <div class="train-pick">
          <div>
            <select id="chA" class="train-select"></select>
            <div id="diaA"></div>
          </div>
          <div class="train-swap">↔</div>
          <div>
            <select id="chB" class="train-select"></select>
            <div id="diaB"></div>
          </div>
        </div>

        <div class="train-scoreboard">
          <div class="stat"><div class="n" id="count">0</div><div class="l">changes</div></div>
          <div class="stat"><div class="n" id="timer">${DURATION}</div><div class="l">seconds left</div></div>
          <div class="stat"><div class="n" id="best">0</div><div class="l">your best</div></div>
        </div>

        <div id="hear" class="hear-line"></div>

        <div class="btn-row" style="justify-content:center;margin-top:.4rem">
          <button id="start" class="btn btn-primary" style="min-width:150px">▶ Start 60s</button>
        </div>
        <button id="tap" class="btn tap-btn" disabled>TAP on each change<br><small>(if you're not using the mic)</small></button>

        <div id="mic-row" class="mic-row" hidden style="justify-content:center;margin-top:.6rem">
          <label class="mic-label">Mic <select id="mic-select"></select></label>
        </div>
        <div id="result" class="verdict idle" style="margin-top:1rem"></div>
        <div id="err" class="faint" style="color:var(--red);margin-top:.4rem"></div>
        <p class="faint" style="margin:.8rem 0 0;font-size:.8rem">Tip: move ALL your fingers together as one shape, and keep your strumming hand going. Speed comes from clean, not rushed.</p>
      </section>
    `;

    const chA = root.querySelector('#chA');
    const chB = root.querySelector('#chB');
    const diaA = root.querySelector('#diaA');
    const diaB = root.querySelector('#diaB');
    const countEl = root.querySelector('#count');
    const timerEl = root.querySelector('#timer');
    const bestEl = root.querySelector('#best');
    const hearEl = root.querySelector('#hear');
    const startBtn = root.querySelector('#start');
    const tapBtn = root.querySelector('#tap');
    const resultEl = root.querySelector('#result');
    const errEl = root.querySelector('#err');
    const micRow = root.querySelector('#mic-row');
    const micSelect = root.querySelector('#mic-select');

    const opts = CHORDS.map((c) => `<option value="${c.name}">${c.name}</option>`).join('');
    chA.innerHTML = opts; chB.innerHTML = opts;
    chA.value = 'Em'; chB.value = 'G';

    let running = false;
    let count = 0;
    let timeLeft = DURATION;
    let current = null;      // which target chord we're currently on
    let candidate = null;
    let candFrames = 0;
    let heardThisSecond = false;
    const judge = new ChordJudge();

    const refresh = () => {
      diaA.innerHTML = CHORD_BY_NAME[chA.value] ? chordSVG(CHORD_BY_NAME[chA.value], { w: 96, h: 120 }) : '';
      diaB.innerHTML = CHORD_BY_NAME[chB.value] ? chordSVG(CHORD_BY_NAME[chB.value], { w: 96, h: 120 }) : '';
      bestEl.textContent = getBestChanges(pairKey(chA.value, chB.value));
      countEl.textContent = '0';
      timerEl.textContent = DURATION;
    };
    chA.addEventListener('change', refresh);
    chB.addEventListener('change', refresh);
    refresh();

    const bump = () => { count++; countEl.textContent = count; heardThisSecond = true; };
    tapBtn.addEventListener('click', () => { if (running) bump(); });

    this.listener = new ChordListener((frame) => {
      const { chroma, active } = frame;
      judge.push(chroma, active);
      if (!running) return;
      if (active) heardThisSecond = true;
      const best = judge.best();
      const targets = [chA.value, chB.value];
      hearEl.textContent = active && best.name ? `I hear: ${best.name} · ${Math.round(best.sim * 100)}%` : '';
      if (!best.name || best.sim < SIM_OK || !targets.includes(best.name)) return;

      // Confirm a stable new chord, then count it as a change.
      if (best.name === current) { candidate = null; candFrames = 0; return; }
      if (best.name === candidate) candFrames++; else { candidate = best.name; candFrames = 1; }
      if (candFrames >= CONFIRM) {
        if (current !== null) bump(); // moving from one chord to the other = one change
        current = best.name;
        candidate = null;
        candFrames = 0;
      }
    });

    const finish = () => {
      running = false;
      clearInterval(this._tick);
      this._tick = null;
      this.listener.stop();
      tapBtn.disabled = true;
      startBtn.textContent = '▶ Start 60s';
      startBtn.disabled = false;
      hearEl.textContent = '';
      const { best, isRecord } = recordChanges(pairKey(chA.value, chB.value), count);
      bestEl.textContent = best;
      resultEl.className = 'verdict ok';
      resultEl.innerHTML = isRecord
        ? `🎉 New best: ${count} clean changes! That's real progress.`
        : `${count} changes. Your best is ${best} — go again and beat it.`;
    };

    const populateMics = async () => {
      const inputs = await listAudioInputs();
      if (!inputs.length) return;
      micSelect.innerHTML = inputs.map((d) => `<option value="${d.deviceId}">${d.label}</option>`).join('');
      micSelect.value = activeDeviceId(this.listener.stream);
      micRow.hidden = false;
    };
    micSelect.addEventListener('change', async () => {
      if (!this.listener.running) return;
      this.listener.stop();
      try { await this.listener.start(micSelect.value); } catch { errEl.textContent = "Couldn't switch mic."; }
    });

    startBtn.addEventListener('click', async () => {
      if (running) return;
      if (chA.value === chB.value) { errEl.textContent = 'Pick two different chords.'; return; }
      errEl.textContent = '';
      resultEl.className = 'verdict idle';
      resultEl.textContent = '';
      count = 0; timeLeft = DURATION; current = null; candidate = null; candFrames = 0;
      countEl.textContent = '0'; timerEl.textContent = DURATION;
      running = true;
      tapBtn.disabled = false;
      startBtn.disabled = true;
      startBtn.textContent = '● Recording…';
      try {
        await this.listener.start(micSelect.value || undefined);
        await populateMics();
      } catch {
        errEl.textContent = 'Mic off — no problem, tap the button on each change.';
      }
      this._tick = setInterval(() => {
        timeLeft--;
        timerEl.textContent = timeLeft;
        if (heardThisSecond) { addPracticeSeconds(1); heardThisSecond = false; }
        if (timeLeft <= 0) finish();
      }, 1000);
    });
  },
  destroy() {
    if (this.listener) this.listener.stop();
    if (this._tick) { clearInterval(this._tick); this._tick = null; }
  },
};
