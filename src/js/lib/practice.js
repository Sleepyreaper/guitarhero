export function calibratedPracticeGate(samples, minimum = 0.006) {
  const usable = samples.filter((value) => Number.isFinite(value) && value >= 0).sort((a, b) => a - b);
  if (!usable.length) return minimum;
  const middle = Math.floor(usable.length / 2);
  const median = usable.length % 2 ? usable[middle] : (usable[middle - 1] + usable[middle]) / 2;
  // Three times the room's median level rejects steady fan/HVAC noise while the minimum
  // remains sensitive to a quietly played acoustic guitar.
  return Math.max(minimum, median * 3);
}

// A lightweight mic level meter for learner-reviewed practice tracking. It measures input
// loudness (RMS) each frame — no pitch/chord work — so the timer accrues only while the
// selected microphone hears sound. The UI accurately asks the learner to review the total.
export class PracticeMeter {
  constructor(onLevel) {
    this.onLevel = onLevel;
    this.running = false;
    this.audioCtx = null;
    this.analyser = null;
    this.stream = null;
    this.buf = null;
    this._raf = null;
  }

  async start(deviceId) {
    if (this.running) return;
    const AC = window.AudioContext || window.webkitAudioContext;
    this.audioCtx = new AC();
    const audio = { echoCancellation: false, autoGainControl: false, noiseSuppression: false };
    if (deviceId) audio.deviceId = { exact: deviceId };
    this.stream = await navigator.mediaDevices.getUserMedia({ audio });
    const src = this.audioCtx.createMediaStreamSource(this.stream);
    this.analyser = this.audioCtx.createAnalyser();
    this.analyser.fftSize = 1024;
    src.connect(this.analyser);
    this.buf = new Float32Array(this.analyser.fftSize);
    this.running = true;
    this._loop();
  }

  _loop() {
    if (!this.running) return;
    this.analyser.getFloatTimeDomainData(this.buf);
    let sum = 0;
    for (let i = 0; i < this.buf.length; i++) sum += this.buf[i] * this.buf[i];
    this.onLevel(Math.sqrt(sum / this.buf.length));
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
