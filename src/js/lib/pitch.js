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

function autoCorrelate(buf, sampleRate) {
  const SIZE = buf.length;
  let rms = 0;
  for (let i = 0; i < SIZE; i++) rms += buf[i] * buf[i];
  rms = Math.sqrt(rms / SIZE);
  if (rms < 0.01) return -1; // too quiet — no confident pitch

  let r1 = 0;
  let r2 = SIZE - 1;
  const thres = 0.2;
  for (let i = 0; i < SIZE / 2; i++) {
    if (Math.abs(buf[i]) < thres) { r1 = i; break; }
  }
  for (let i = 1; i < SIZE / 2; i++) {
    if (Math.abs(buf[SIZE - i]) < thres) { r2 = SIZE - i; break; }
  }

  const trimmed = buf.slice(r1, r2);
  const n = trimmed.length;
  const c = new Array(n).fill(0);
  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n - i; j++) c[i] += trimmed[j] * trimmed[j + i];
  }

  let d = 0;
  while (d < n - 1 && c[d] > c[d + 1]) d++;
  let maxval = -1;
  let maxpos = -1;
  for (let i = d; i < n; i++) {
    if (c[i] > maxval) { maxval = c[i]; maxpos = i; }
  }
  let T0 = maxpos;
  if (T0 <= 0) return -1;

  // Parabolic interpolation for sub-sample accuracy.
  const x1 = c[T0 - 1] || 0;
  const x2 = c[T0];
  const x3 = c[T0 + 1] || 0;
  const a = (x1 + x3 - 2 * x2) / 2;
  const b = (x3 - x1) / 2;
  if (a) T0 -= b / (2 * a);

  return sampleRate / T0;
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
  }

  async start() {
    if (this.running) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AC();
    this.stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, autoGainControl: false, noiseSuppression: false },
    });
    const source = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 2048;
    source.connect(this.analyser);
    this.buf = new Float32Array(this.analyser.fftSize);
    this.running = true;
    this._loop();
  }

  _loop() {
    if (!this.running) return;
    this.analyser.getFloatTimeDomainData(this.buf);
    const freq = autoCorrelate(this.buf, this.audioCtx.sampleRate);
    if (freq > 0 && freq < 2000) {
      this.onReading(freqToNote(freq));
    } else {
      this.onReading(null);
    }
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
