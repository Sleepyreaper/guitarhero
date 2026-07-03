// Chromagram-based chord analysis.
// Turns an FFT magnitude spectrum into a 12-bin "pitch-class profile" (how much energy
// is at each of C, C#, D, ... B regardless of octave), then scores how well that matches
// a target chord's actual notes.
//
// This is HEURISTIC — it's audio analysis, not MIDI. It works best with a clean, sustained
// strum in a quiet room. Treat it as a coach, not a judge. Thresholds are deliberately
// exposed so we can calibrate against a real guitar.

const A4 = 440;
export const PC_NAMES = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];

// Frequency -> pitch class 0..11 (C=0), or -1 if invalid.
export function freqToPitchClass(f) {
  if (f <= 0) return -1;
  const midi = Math.round(12 * Math.log2(f / A4) + 69);
  return ((midi % 12) + 12) % 12;
}

export function pcNames(pcs) {
  return pcs.map((pc) => PC_NAMES[pc]);
}

// Build a normalized 12-bin chroma vector from float frequency data (dB per bin).
// Returns { chroma:[12], maxDb, active }. `active` gates out near-silence so the UI
// doesn't chase noise between strums.
export function computeChroma(freqDb, sampleRate, fftSize, opts = {}) {
  const { fMin = 70, fMax = 1600, gateDb = -72 } = opts;
  const chroma = new Array(12).fill(0);
  const binHz = sampleRate / fftSize;
  const startBin = Math.max(1, Math.floor(fMin / binHz));
  const endBin = Math.min(freqDb.length - 1, Math.ceil(fMax / binHz));

  let maxDb = -Infinity;
  for (let i = startBin; i <= endBin; i++) {
    const db = freqDb[i];
    if (db > maxDb) maxDb = db;
    if (db < -90) continue;
    const mag = Math.pow(10, db / 20); // dB -> linear magnitude
    const pc = freqToPitchClass(i * binHz);
    if (pc >= 0) chroma[pc] += mag;
  }

  const max = Math.max(...chroma);
  if (max > 0) for (let i = 0; i < 12; i++) chroma[i] /= max;
  return { chroma, maxDb, active: maxDb > gateDb };
}

// Unique pitch classes present in a chord's voicing, given its sounding frequencies.
export function chordPitchClasses(freqs) {
  const set = new Set();
  for (const f of freqs) {
    const pc = freqToPitchClass(f);
    if (pc >= 0) set.add(pc);
  }
  return [...set].sort((a, b) => a - b);
}

// Score chroma against a target chord's expected pitch classes.
// Returns { present, missing, foreign, foreignPC, coverage, ok }.
export function evaluateChord(chroma, expectedPCs, opts = {}) {
  const { presentThresh = 0.28, foreignThresh = 0.30 } = opts;
  const expected = new Set(expectedPCs);

  const present = [];
  const missing = [];
  for (const pc of expectedPCs) {
    if (chroma[pc] >= presentThresh) present.push(pc);
    else missing.push(pc);
  }

  // Strongest pitch class that ISN'T part of the chord (a wrong / ringing string).
  let foreign = 0;
  let foreignPC = -1;
  for (let pc = 0; pc < 12; pc++) {
    if (!expected.has(pc) && chroma[pc] > foreign) { foreign = chroma[pc]; foreignPC = pc; }
  }

  const coverage = expectedPCs.length ? present.length / expectedPCs.length : 0;
  const ok = coverage >= 0.99 && foreign < foreignThresh;
  return { present, missing, foreign, foreignPC, coverage, ok };
}

// Open-ended guess: which template chord best matches the chroma (cosine similarity).
export function bestMatch(chroma, templates) {
  const norm = Math.sqrt(chroma.reduce((a, b) => a + b * b, 0)) || 1;
  let best = null;
  let bestSim = -1;
  for (const t of templates) {
    let dot = 0;
    let tn = 0;
    for (let pc = 0; pc < 12; pc++) {
      dot += chroma[pc] * t.vec[pc];
      tn += t.vec[pc] * t.vec[pc];
    }
    const sim = dot / (norm * (Math.sqrt(tn) || 1));
    if (sim > bestSim) { bestSim = sim; best = t; }
  }
  return { chord: best, similarity: bestSim };
}
