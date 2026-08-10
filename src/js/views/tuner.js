import { Tuner, STRINGS, freqToNote, midiToFreq } from '../lib/pitch.js';
import { listAudioInputs, activeDeviceId } from '../lib/devices.js';

export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Standard tuning · E A D G B E</p>
      <h1>Tuner</h1>
      <p class="lead">Play one string at a time. Turn the peg until the note turns
      <span style="color:var(--green)">green</span> and the needle sits in the middle.</p>

      <div class="callout tuner-setup">
        <strong>USB mic setup:</strong> place the mic 12–18 inches from the guitar, aimed near the 12th fret—not directly into the soundhole. Select a string below, pluck it once, then let it ring.
      </div>

      <section class="panel" style="text-align:center">
        <div class="btn-row" style="justify-content:center;margin-bottom:.6rem">
          <button id="toggle" class="btn btn-primary">🎤 Start tuning</button>
        </div>

        <div id="mic-row" class="mic-row" hidden>
          <label class="mic-label">Mic
            <select id="mic-select"></select>
          </label>
          <div class="level-wrap" title="input level">
            <span class="level-tag">level</span>
            <div class="level-meter"><div id="level-fill" class="level-fill"></div></div>
          </div>
        </div>
        <div id="no-signal" class="no-signal" hidden>No signal — is the right mic picked above, unmuted, and gain up?</div>
        <div id="signal-help" class="tuner-signal">Start the tuner, then pluck the selected string once.</div>

        <div id="note" class="tuner-note">–</div>
        <div id="freq" class="tuner-freq">play a string…</div>
        <div class="needle-wrap">
          <div class="needle-scale"></div>
          <div id="needle" class="needle" style="left:50%"></div>
        </div>
        <div id="cents" class="faint" style="font-family:var(--mono)">&nbsp;</div>
        <div id="debug" class="faint" style="font-family:var(--mono);font-size:.72rem;min-height:1em;opacity:.8"></div>
        <div id="err" class="faint" style="margin-top:.6rem;color:var(--red)"></div>

        <div class="string-row">
          ${STRINGS.map((s, i) => `<button class="string-btn ${i === 0 ? 'target' : ''}" data-idx="${i}" title="${s.label}" aria-label="Tune ${s.label}" aria-pressed="${i === 0}">${s.name}</button>`).join('')}
          <button class="string-btn auto-string" data-auto title="Automatic note detection" aria-label="Automatic note detection" aria-pressed="false">Auto</button>
        </div>
        <p id="target-help" class="faint" style="margin:.8rem 0 0;font-size:.8rem">Selected: Low E (6th). Thick low-E on the left → thin high-E on the right.</p>
      </section>
    `;

    const noteEl = root.querySelector('#note');
    const freqEl = root.querySelector('#freq');
    const centsEl = root.querySelector('#cents');
    const needle = root.querySelector('#needle');
    const toggle = root.querySelector('#toggle');
    const errEl = root.querySelector('#err');
    const micRow = root.querySelector('#mic-row');
    const micSelect = root.querySelector('#mic-select');
    const levelFill = root.querySelector('#level-fill');
    const noSignal = root.querySelector('#no-signal');
    const debugEl = root.querySelector('#debug');
    const signalHelp = root.querySelector('#signal-help');
    const targetHelp = root.querySelector('#target-help');
    const strEls = [...root.querySelectorAll('.string-btn')];

    let lastSeen = 0;
    let lastSignal = 0;

    const paintTarget = (hit = false) => {
      strEls.forEach((e) => {
        const selected = e.hasAttribute('data-auto') ? !this.tuner.target : Number(e.dataset.idx) === STRINGS.indexOf(this.tuner.target);
        e.classList.toggle('target', selected && !hit);
        e.classList.toggle('hit', selected && hit);
        e.setAttribute('aria-pressed', String(selected));
      });
    };

    this.tuner = new Tuner((reading) => {
      const { level, note, raw } = reading;

      // Always-on input-level meter (proves audio is arriving even with no clear pitch).
      levelFill.style.width = `${Math.min(100, Math.round(level * 500))}%`;
      levelFill.classList.toggle('live', level > 0.01);
      if (level > 0.01) lastSignal = performance.now();
      noSignal.hidden = !(this.tuner.running && performance.now() - lastSignal > 2500);
      if (!this.tuner.running) signalHelp.textContent = 'Start the tuner, then pluck the selected string once.';
      else if (performance.now() - lastSignal > 2500) signalHelp.textContent = 'No guitar signal yet. Check the selected mic, mute switch, and input gain.';
      else if (level < 0.008) signalHelp.textContent = 'Signal is quiet. Move the mic closer or raise its gain slightly.';
      else if (level > 0.18) signalHelp.textContent = 'Signal is very loud. Move the mic back or lower its gain to prevent clipping.';
      else if (!raw || raw.clarity < this.tuner.minClarity) signalHelp.textContent = 'I hear the guitar, but the pitch is unclear. Pluck once near the soundhole and let it ring.';
      else signalHelp.textContent = 'Good signal. Hold the note and make a small tuning-peg adjustment.';

      // Live calibration readout: what the detector hears *before* the confidence gate.
      if (this.tuner.running) {
        debugEl.textContent = raw
          ? `heard ${freqToNote(raw.freq).note}  ${raw.freq.toFixed(1)} Hz  ·  clarity ${raw.clarity.toFixed(2)}`
          : 'heard: (nothing clear yet)';
      } else {
        debugEl.textContent = '';
      }

      const now = performance.now();
      if (!note) {
        if (now - lastSeen > 400) {
          noteEl.textContent = '–';
          noteEl.className = 'tuner-note';
          freqEl.textContent = this.tuner.running ? 'listening…' : 'stopped';
          centsEl.innerHTML = '&nbsp;';
          needle.style.left = '50%';
          needle.classList.remove('intune');
          paintTarget(false);
        }
        return;
      }
      lastSeen = now;
      const target = this.tuner.target;
      const targetFreq = target ? midiToFreq(target.midi) : null;
      const cents = target ? Math.round(1200 * Math.log2(note.freq / targetFreq)) : note.cents;
      const inTune = Math.abs(cents) <= 5;
      noteEl.textContent = target ? target.name : note.name;
      noteEl.className = 'tuner-note ' + (inTune ? 'intune' : cents < 0 ? 'flat' : 'sharp');
      freqEl.textContent = target ? `${note.freq.toFixed(1)} Hz · target ${targetFreq.toFixed(1)} Hz` : `${note.freq.toFixed(1)} Hz · ${note.note}`;
      centsEl.textContent = inTune
        ? 'in tune ✓'
        : `${cents > 0 ? '+' : ''}${cents} cents ${cents < 0 ? '(tune up ↑)' : '(tune down ↓)'}`;

      const pos = Math.max(0, Math.min(100, 50 + cents));
      needle.style.left = pos + '%';
      needle.classList.toggle('intune', inTune);

      paintTarget(inTune);
    });

    // Populate the mic picker once we have permission (labels are hidden before that).
    const populateMics = async () => {
      const inputs = await listAudioInputs();
      if (!inputs.length) return;
      micSelect.innerHTML = inputs.map((d) => `<option value="${d.deviceId}">${d.label}</option>`).join('');
      micSelect.value = activeDeviceId(this.tuner.stream);
      micRow.hidden = false;
    };

    micSelect.addEventListener('change', async () => {
      if (!this.tuner.running) return;
      this.tuner.stop();
      try {
        await this.tuner.start(micSelect.value);
      } catch {
        errEl.textContent = "Couldn't switch to that mic.";
      }
    });

    strEls.forEach((button) => button.addEventListener('click', () => {
      const target = button.hasAttribute('data-auto') ? null : STRINGS[Number(button.dataset.idx)];
      this.tuner.setTarget(target);
      targetHelp.textContent = target
        ? `Selected: ${target.label}. Pluck only that string and let it ring.`
        : 'Automatic mode: Campfire will guess the nearest note. Guided string selection is more reliable for beginners.';
      noteEl.textContent = '–';
      freqEl.textContent = this.tuner.running ? 'listening…' : 'play a string…';
      centsEl.innerHTML = '&nbsp;';
      needle.style.left = '50%';
      needle.classList.remove('intune');
      paintTarget(false);
    }));

    toggle.addEventListener('click', async () => {
      if (this.tuner.running) {
        this.tuner.stop();
        toggle.textContent = '🎤 Start tuning';
        toggle.classList.add('btn-primary');
        freqEl.textContent = 'stopped';
        levelFill.style.width = '0%';
        noSignal.hidden = true;
        paintTarget(false);
        return;
      }
      try {
        errEl.textContent = '';
        await this.tuner.start(micSelect.value || undefined);
        toggle.textContent = '⏹ Stop';
        toggle.classList.remove('btn-primary');
        lastSignal = performance.now();
        await populateMics();
      } catch (err) {
        errEl.textContent = 'Microphone blocked. Allow mic access (and use an https:// or localhost address).';
      }
    });
  },
  destroy() {
    if (this.tuner) this.tuner.stop();
  },
};
