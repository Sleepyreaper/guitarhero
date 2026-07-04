// Real-time pitch detection using time-domain autocorrelation.
// Adapted from the well-known ACF2+ algorithm (Chris Wilson, MIT-licensed).

const NOTE_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Open strings for standard tuning, with MIDI numbers.
export const STRINGS = [
  { name: 'E', label: 'Low E (6th)', midi: 40 },
  { name: 'A', label: 'A (5th)', midi: 45 },
  { name: 'D', label: 'D (4th)', midi: 50 },
  { name: 'G', label: 'G (3rd)', midi: 55 },
  { name: 'B', label: 'B (2nd)', midi: 59 },
  { name: 'E', label: 'High E (1st)', midi: 64 },
];

// Pitch detection via the McLeod Normalized Square Difference Function (NSDF),
// restricted to the guitar's fundamental range. The range restriction + a large
// analysis window (set in Tuner.start) are what make the LOW strings work: an 82 Hz
// low-E wave is ~535 samples long, so a short buffer simply can't see enough of it.
export function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;

  // Loudness gate — low strings are quieter, so keep this modest.
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.004) return null;

  const fMin = 65;  // just below low E (82.4 Hz)
  const fMax = 520; // above high E (329.6 Hz), with headroom
  const maxLag = Math.min(Math.floor(sampleRate / fMin), SIZE - 1);
  const minLag = Math.max(2, Math.floor(sampleRate / fMax));

  // NSDF over the candidate lags: nsdf[lag] ∈ [-1, 1], 1 = perfectly periodic.
  const nsdf = new Float32Array(maxLag + 1);
  let gmax = 0;
  for (let lag = minLag; lag <= maxLag; lag++) {
    let acf = 0;
    let denom = 0;
    for (let i = 0, n = SIZE - lag; i < n; i++) {
      acf += buf[i] * buf[i + lag];
      denom += buf[i] * buf[i] + buf[i + lag] * buf[i + lag];
    }
    const v = denom > 0 ? (2 * acf) / denom : 0;
    nsdf[lag] = v;
    if (v > gmax) gmax = v;
  }
  if (gmax < 0.3) return null; // nothing convincingly periodic

  // Pick the FIRST key maximum that clears 90% of the global peak. Choosing the
  // longest-period strong peak locks onto the fundamental, not an octave harmonic.
  const threshold = gmax * 0.9;
  let chosen = -1;
  for (let lag = minLag + 1; lag < maxLag; lag++) {
    if (nsdf[lag] > nsdf[lag - 1] && nsdf[lag] >= nsdf[lag + 1] && nsdf[lag] >= threshold) {
      chosen = lag;
      break;
    }
  }
  if (chosen < 0) return null;

  // Parabolic interpolation around the peak for sub-sample (sub-cent) accuracy.
  const x1 = nsdf[chosen - 1];
  const x2 = nsdf[chosen];
  const x3 = nsdf[chosen + 1];
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  let period = chosen;
  if (a) period -= b / (2 * a);

  return { freq: sampleRate / period, clarity: x2 };
}

export function freqToNote(freq) {
  const midi = 69 + 12 * Math.log2(freq / 440);
  const noteNum = Math.round(midi);
  const noteFreq = 440 * Math.pow(2, (noteNum - 69) / 12);
  const cents = Math.round(1200 * Math.log2(freq / noteFreq));
  const name = NOTE_NAMES[((noteNum % 12) + 12) % 12];
  const octave = Math.floor(noteNum / 12) - 1;
  // Nearest guitar string (by MIDI distance).
  let nearest = STRINGS[0];
  let best = Infinity;
  for (const s of STRINGS) {
    const d = Math.abs(s.midi - midi);
    if (d < best) { best = d; nearest = s; }
  }
  return { freq, midi, noteNum, cents, name, octave, note: `${name}${octave}`, nearestString: nearest };
}

export class Tuner {
  constructor(onReading) {
    this.onReading = onReading;
    this.running = false;
    this.audioCtx = null;
    this.analyser = null;
    this.stream = null;
    this.buf = null;
    this._raf = null;
    // Smoothing: recent valid pitches, median-filtered with octave-jump correction.
    this.history = [];
    this.lastDetect = 0;
    this.minClarity = 0.6; // confidence gate; too high = never locks, too low = jittery
    this.holdMs = 500; // keep showing the last note this long after signal drops
  }

  _median() {
    if (!this.history.length) return null;
    const s = [...this.history].sort((a, b) => a - b);
    return s[s.length >> 1];
  }

  _pushFreq(f) {
    // Snap obvious octave errors onto the octave the string is already sitting in.
    const m = this._median();
    if (m) {
      if (Math.abs(f / 2 - m) < m * 0.03) f /= 2;
      else if (Math.abs(f * 2 - m) < m * 0.03) f *= 2;
    }
    this.history.push(f);
    if (this.history.length > 12) this.history.shift();
    this.lastDetect = performance.now();
  }

  _stableFreq() {
    if (performance.now() - this.lastDetect > this.holdMs) { this.history = []; return null; }
    return this.history.length >= 4 ? this._median() : null;
  }

  async start(deviceId) {
    if (this.running) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AC();
    const audio = { echoCancellation: false, autoGainControl: false, noiseSuppression: false };
    if (deviceId) audio.deviceId = { exact: deviceId };
    this.stream = await navigator.mediaDevices.getUserMedia({ audio });
    const source = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    // 4096 samples (~93 ms) so a full low-E period (~535 samples) fits several times over.
    this.analyser.fftSize = 4096;
    source.connect(this.analyser);
    this.buf = new Float32Array(this.analyser.fftSize);
    this.history = [];
    this.lastDetect = 0;
    this.running = true;
    this._loop();
  }

  _loop() {
    if (!this.running) return;
    this.analyser.getFloatTimeDomainData(this.buf);
    // Raw input level (RMS) — reported every frame so a meter can show that audio is
    // arriving even when no confident pitch is found. Key for diagnosing dead mics.
    let sum = 0;
    for (let i = 0; i < this.buf.length; i++) sum += this.buf[i] * this.buf[i];
    const level = Math.sqrt(sum / this.buf.length);

    // Only feed the smoother clear, confident detections; noise/decay is dropped.
    const res = autoCorrelate(this.buf, this.audioCtx.sampleRate);
    const raw = res && res.freq > 40 && res.freq < 2000 ? res : null;
    if (raw && raw.clarity >= this.minClarity && raw.freq > 60 && raw.freq < 1200) {
      this._pushFreq(raw.freq);
    }
    const stable = this._stableFreq();
    const note = stable ? freqToNote(stable) : null;
    // `raw` is passed through un-gated so the UI can show what's being heard (for calibration).
    this.onReading({ level, note, raw: raw ? { freq: raw.freq, clarity: raw.clarity } : null });
    this._raf = requestAnimationFrame(() => this._loop());
  }

  stop() {
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
    if (this.stream) this.stream.getTracks().forEach((t) => t.stop());
    if (this.audioCtx) this.audioCtx.close();
    this.stream = null;
    this.audioCtx = null;
    this.analyser = null;
  }
}
