// Chord shapes for the beginner "big 8" open chords + a few worship/folk extras.
// frets: array of 6, low-E (6th string) -> high-e (1st string).
//   -1 = muted (x), 0 = open, n = fret number
// fingers: same order. 0 = open/none, 1..4 = fingering
// baseFret: lowest fret drawn (1 for open chords)
// group: used to order the learning path

export const OPEN_STRING_HZ = [82.41, 110.0, 146.83, 196.0, 246.94, 329.63]; // E2 A2 D3 G3 B3 E4

export const CHORDS = [
  { name: 'Em', label: 'E minor', frets: [0, 2, 2, 0, 0, 0], fingers: [0, 2, 3, 0, 0, 0], baseFret: 1, group: 'first', tip: 'Two fingers — the easiest full chord. A great first shape.' },
  { name: 'G',  label: 'G major', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1, group: 'first', tip: 'The home base of country & folk. Big, ringing sound.' },
  { name: 'C',  label: 'C major', frets: [-1, 3, 2, 0, 1, 0], fingers: [0, 3, 2, 0, 1, 0], baseFret: 1, group: 'core', tip: 'Don\'t strum the low E — start from the A string.' },
  { name: 'D',  label: 'D major', frets: [-1, -1, 0, 2, 3, 2], fingers: [0, 0, 0, 1, 3, 2], baseFret: 1, group: 'core', tip: 'Only strum the top four strings. Make a little triangle.' },
  { name: 'Am', label: 'A minor', frets: [-1, 0, 2, 2, 1, 0], fingers: [0, 0, 2, 3, 1, 0], baseFret: 1, group: 'core', tip: 'Same shape as E major, moved up a string. Melancholy folk sound.' },
  { name: 'A',  label: 'A major', frets: [-1, 0, 2, 2, 2, 0], fingers: [0, 0, 1, 2, 3, 0], baseFret: 1, group: 'core', tip: 'Three fingers cramped in one fret — squeeze them together.' },
  { name: 'E',  label: 'E major', frets: [0, 2, 2, 1, 0, 0], fingers: [0, 2, 3, 1, 0, 0], baseFret: 1, group: 'core', tip: 'Strum all six strings. Full and bright.' },
  { name: 'D7', label: 'D dom 7', frets: [-1, -1, 0, 2, 1, 2], fingers: [0, 0, 0, 2, 1, 3], baseFret: 1, group: 'extra', tip: 'The classic bluesy/gospel resolve back to G.' },
  { name: 'G7', label: 'G dom 7', frets: [3, 2, 0, 0, 0, 1], fingers: [3, 2, 0, 0, 0, 1], baseFret: 1, group: 'extra', tip: 'Adds a little grit — common in country turnarounds.' },
  { name: 'Cadd9', label: 'C add 9', frets: [-1, 3, 2, 0, 3, 3], fingers: [0, 2, 1, 0, 3, 4], baseFret: 1, group: 'extra', tip: 'A modern worship staple — pairs beautifully with G.' },
  { name: 'Dsus4', label: 'D sus 4', frets: [-1, -1, 0, 2, 3, 3], fingers: [0, 0, 0, 1, 2, 3], baseFret: 1, group: 'extra', tip: 'Add and release the pinky over a D for that ringing folk lift.' },
  { name: 'Em7', label: 'E min 7', frets: [0, 2, 2, 0, 3, 0], fingers: [0, 1, 2, 0, 3, 0], baseFret: 1, group: 'extra', tip: 'Even easier than Em with a fuller, dreamier tone.' },
  { name: 'Fmaj7', label: 'F major 7', frets: [-1, -1, 3, 2, 1, 0], fingers: [0, 0, 3, 2, 1, 0], baseFret: 1, group: 'extra', tip: 'The beginner-friendly F — no barre. A great stand-in until your full F is ready.' },
];

export const CHORD_BY_NAME = Object.fromEntries(CHORDS.map((c) => [c.name, c]));

// Compute the sounding frequencies of a chord (for the "hear it" strum synth).
export function chordFrequencies(chord) {
  const out = [];
  chord.frets.forEach((fret, i) => {
    if (fret < 0) return; // muted
    out.push(OPEN_STRING_HZ[i] * Math.pow(2, fret / 12));
  });
  return out;
}
