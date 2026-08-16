// Public-domain melody timelines. `beat` uses the arrangement's scheduler unit:
// quarter-notes in 3/4 and 4/4, eighth-notes in 6/8. Negative beats are vocal pickups.
// These literal events—not guessed lyric spacing—drive reference playback and lyric highlighting.

const line = (start, notes) => {
  let beat = start;
  return notes.map(([midi, duration, lyric = '']) => {
    const event = { beat, duration, midi, lyric };
    beat += duration;
    return event;
  });
};

export const SCORES = {
  'row-your-boat': {
    status: 'certified', unit: 'eighth', totalBeats: 48,
    source: { label: 'Traditional 6/8 melody in LilyPond notation', url: 'https://en.wikipedia.org/wiki/Row,_Row,_Row_Your_Boat', checked: '2026-08-16' },
    melody: line(0, [
      [67, 3, 'Row'], [67, 3, 'row'], [67, 2, 'row'], [69, 1, 'your'], [71, 3, 'boat'],
      [71, 2, 'gent-'], [69, 1, 'ly'], [71, 2, 'down'], [72, 1, 'the'], [74, 6, 'stream'],
      [67, 1, 'mer-'], [67, 1, 'ri-'], [67, 1, 'ly'], [74, 1, 'mer-'], [74, 1, 'ri-'], [74, 1, 'ly'],
      [71, 1, 'mer-'], [71, 1, 'ri-'], [71, 1, 'ly'], [67, 1, 'mer-'], [67, 1, 'ri-'], [67, 1, 'ly'],
      [79, 2, 'life'], [77, 1, 'is'], [76, 2, 'but'], [74, 1, 'a'], [72, 6, 'dream'],
    ]),
  },
  'whole-world': {
    status: 'certified', unit: 'quarter', totalBeats: 32,
    source: { label: 'Public-domain 4/4 melody, transposed D to G', url: 'https://de.wikibooks.org/wiki/Gitarre%3A_Liedbeispiel_1b', checked: '2026-08-16' },
    melody: line(-1.5, [
      [74, .5, "He's"], [74, .5, 'got'], [71, .5, 'the'],
      [74, 2, 'whole'], [71, .5, 'world'], [67, 1.5, 'in His hands'],
      [null, .5], [74, .5, "He's"], [76, .5, 'got'], [74, 1, 'the whole'], [74, .5, 'world'], [74, .5, 'in His'], [71, .5, 'hands'],
      [72, 2, "He's got the whole"], [69, .5, 'world'], [66, 1.5, 'in His hands'],
      [null, .5], [74, .5, "He's"], [76, .5, 'got'], [74, 1, 'the whole'], [74, .5, 'world'], [74, .5, 'in His'], [71, .5, 'hands'],
      [74, 2, "He's got the whole"], [71, .5, 'world'], [67, 1.5, 'in His hands'],
      [null, .5], [74, .5, "He's"], [76, .5, 'got'], [74, 1, 'the whole'], [74, .5, 'world'], [74, .5, 'in His'], [71, .5, 'hands'],
      [74, 1, "He's got"], [74, 1, 'the whole'], [72, .5, 'world'], [69, 1.5, 'in His hands'], [67, 2, 'hands'],
    ]),
  },
  'amazing-grace': {
    status: 'certified', unit: 'quarter', totalBeats: 48,
    source: { label: 'NEW BRITAIN ABC melody in G', url: 'https://abcnotation.com/tunePage?a=pghardy.net%2Ftunebooks%2Fpgh_sets_tunebook%2F0138', checked: '2026-08-16' },
    melody: line(-1, [
      [62, 1, 'A-'],
      [67, 2, 'mazing grace'], [71, .5], [67, .5], [71, 2, 'how sweet'], [69, 1],
      [67, 2, 'the sound'], [64, 1], [62, 2, 'that saved'], [62, 1],
      [67, 2, 'a wretch like'], [71, .5], [67, .5], [71, 2, 'me'], [69, .5], [71, .5, 'I'],
      [74, 3, 'once'], [74, 1, 'was'], [null, 1], [71, 1, 'lost'],
      [74, 2, 'but now am'], [71, .5], [67, .5], [71, 2, 'found'], [69, 1],
      [67, 2, 'was blind'], [64, 1], [62, 2, 'but now'], [62, 1],
      [67, 2, 'I see'], [71, 1 / 3], [69, 1 / 3], [67, 1 / 3],
      [71, 2], [69, 1], [67, 3], [67, 2],
    ]),
  },
};

export const scoreFor = (songOrId) => SCORES[typeof songOrId === 'string' ? songOrId : songOrId.id] || null;
export const midiFrequency = (midi) => 440 * (2 ** ((midi - 69) / 12));
