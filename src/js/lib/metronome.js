// Sample-accurate metronome using a Web Audio lookahead scheduler.
import { getAudioContext } from './audio.js';

export class Metronome {
  constructor(onBeat) {
    this.onBeat = onBeat; // (beatIndex, isAccent) => void, fired for UI
    this.bpm = 80;
    this.beatsPerMeasure = 4;
    this.running = false;
    this.currentBeat = 0;
    this.nextNoteTime = 0;
    this.lookahead = 25; // ms timer interval
    this.scheduleAhead = 0.1; // seconds to pre-schedule
    this._timer = null;
    this._uiQueue = [];
  }

  _click(time, isAccent) {
    const ac = getAudioContext();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.frequency.value = isAccent ? 1500 : 900;
    g.gain.setValueAtTime(0.0001, time);
    g.gain.exponentialRampToValueAtTime(isAccent ? 0.5 : 0.32, time + 0.001);
    g.gain.exponentialRampToValueAtTime(0.0001, time + 0.05);
    osc.connect(g).connect(ac.destination);
    osc.start(time);
    osc.stop(time + 0.06);
  }

  _scheduler() {
    const ac = getAudioContext();
    while (this.nextNoteTime < ac.currentTime + this.scheduleAhead) {
      const isAccent = this.currentBeat % this.beatsPerMeasure === 0;
      this._click(this.nextNoteTime, isAccent);
      // Queue UI update to fire at the right moment.
      this._uiQueue.push({ time: this.nextNoteTime, beat: this.currentBeat % this.beatsPerMeasure, isAccent });
      this.nextNoteTime += 60 / this.bpm;
      this.currentBeat++;
    }
    // Fire any UI callbacks whose time has arrived.
    while (this._uiQueue.length && this._uiQueue[0].time <= ac.currentTime) {
      const e = this._uiQueue.shift();
      this.onBeat && this.onBeat(e.beat, e.isAccent);
    }
  }

  start() {
    if (this.running) return;
    const ac = getAudioContext();
    this.running = true;
    this.currentBeat = 0;
    this.nextNoteTime = ac.currentTime + 0.06;
    this._timer = setInterval(() => this._scheduler(), this.lookahead);
  }

  stop() {
    this.running = false;
    clearInterval(this._timer);
    this._timer = null;
    this._uiQueue = [];
  }

  setBpm(v) {
    this.bpm = Math.max(30, Math.min(240, Math.round(v)));
    return this.bpm;
  }
}
