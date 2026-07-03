// Mic listener that streams a chromagram (pitch-class profile) each animation frame.
// Uses frequency-domain FFT data (unlike the Tuner, which uses time-domain autocorrelation)
// because chords are polyphonic — several notes ringing at once.
import { computeChroma } from './chroma.js';

export class ChordListener {
  constructor(onFrame, opts = {}) {
    this.onFrame = onFrame;
    this.fftSize = opts.fftSize || 16384; // high resolution for low guitar notes
    this.fMin = opts.fMin || 70;
    this.fMax = opts.fMax || 1600;
    this.running = false;
    this.audioCtx = null;
    this.analyser = null;
    this.stream = null;
    this.freqDb = null;
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
    this.analyser.fftSize = this.fftSize;
    this.analyser.smoothingTimeConstant = 0.6;
    src.connect(this.analyser);
    this.freqDb = new Float32Array(this.analyser.frequencyBinCount);
    this.running = true;
    this._loop();
  }

  _loop() {
    if (!this.running) return;
    this.analyser.getFloatFrequencyData(this.freqDb);
    const result = computeChroma(this.freqDb, this.audioCtx.sampleRate, this.fftSize, {
      fMin: this.fMin,
      fMax: this.fMax,
    });
    this.onFrame(result);
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
