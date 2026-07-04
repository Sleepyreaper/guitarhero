// Shared chord-listening brain used by both the Chord Coach and song play-along, so they
// behave identically. It turns a stream of raw chroma frames into a smoothed "best guess"
// chord + confidence, using relative template matching (robust to room/mic differences).
import { CHORDS, chordFrequencies } from '../data/chords.js';
import { chordPitchClasses, cleanChroma, matchChroma } from './chroma.js';

// One pitch-class template per chord in the library, built from its actual voiced notes.
export const TEMPLATES = CHORDS.map((c) => {
  const pcs = chordPitchClasses(chordFrequencies(c));
  const vec = new Array(12).fill(0);
  pcs.forEach((pc) => (vec[pc] = 1));
  return { name: c.name, vec, pcs };
});

export function rankChords(chroma) {
  return matchChroma(cleanChroma(chroma), TEMPLATES);
}

// Feeds on chroma frames, keeps a short exponential average so a single strum settles,
// and reports the current best-matching chord with a 0..1 confidence.
export class ChordJudge {
  constructor(alpha = 0.35) {
    this.alpha = alpha;
    this.ema = new Array(12).fill(0);
    this.active = false;
  }

  push(chroma, active) {
    this.active = active;
    if (!active) {
      for (let i = 0; i < 12; i++) this.ema[i] *= 0.9; // let it fade between strums
      return;
    }
    for (let i = 0; i < 12; i++) this.ema[i] = this.alpha * chroma[i] + (1 - this.alpha) * this.ema[i];
  }

  // { name, sim, margin } — margin is how far ahead of the runner-up (confidence in the pick).
  best() {
    const ranked = rankChords(this.ema);
    const top = ranked[0] || { name: null, sim: 0 };
    const second = ranked[1] || { sim: 0 };
    return { name: top.name, sim: top.sim, margin: top.sim - second.sim, ranked };
  }

  reset() {
    this.ema = new Array(12).fill(0);
  }
}
