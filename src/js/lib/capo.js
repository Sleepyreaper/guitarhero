const NOTES = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'F#', 'G', 'Ab', 'A', 'Bb', 'B'];
const NOTE_INDEX = {
  C: 0, 'B#': 0, 'C#': 1, Db: 1, D: 2, 'D#': 3, Eb: 3, E: 4, Fb: 4,
  'E#': 5, F: 5, 'F#': 6, Gb: 6, G: 7, 'G#': 8, Ab: 8, A: 9,
  'A#': 10, Bb: 10, B: 11, Cb: 11,
};

export function transposeKey(key, semitones = 0) {
  const match = /^([A-G](?:#|b)?)(.*)$/.exec(key || '');
  if (!match || NOTE_INDEX[match[1]] == null) return key;
  const index = (NOTE_INDEX[match[1]] + Number(semitones) + 120) % 12;
  return `${NOTES[index]}${match[2]}`;
}

export function transposeFrequencies(frequencies, semitones = 0) {
  const ratio = Math.pow(2, Number(semitones) / 12);
  return frequencies.map((frequency) => frequency * ratio);
}

export function rotatePitchVector(vector, semitones = 0) {
  const shifted = new Array(12).fill(0);
  const amount = (Number(semitones) + 120) % 12;
  vector.forEach((value, index) => { shifted[(index + amount) % 12] = value; });
  return shifted;
}
