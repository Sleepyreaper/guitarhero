// Public-domain melody timelines. `beat` uses the arrangement's scheduler unit:
// quarter-notes in 3/4 and 4/4, eighth-notes in 6/8. Negative beats are vocal pickups.
// These literal events—not guessed lyric spacing—drive reference playback and lyric highlighting.

const line = (start, notes) => {
  let beat = start;
  return notes.map(([midi, duration, lyric = '', sustain = null]) => {
    const event = { beat, duration, midi, lyric, ...(sustain ? { sustain } : {}) };
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
    lyricSource: { label: 'Common ABAC chorus with “whole wide world” on line two', url: 'https://www.musicyoucanread.com/SONGS/03-HESGO.html', checked: '2026-08-15' },
    melody: line(-1.5, [
      [74, .5, "He's"], [74, .5, 'got'], [71, .5, 'the'],
      [74, 2, 'who—ole'], [71, .5, 'wor—'], [67, 1.5, '—old'],
      [null, .5], [74, .5, 'in'], [76, .5, 'His'], [74, 1, 'hands'],
      [74, .5, "He's"], [74, .5, 'got'], [71, .5, 'the'],
      [72, 2, 'whole'], [69, .5, 'wide'], [66, 1.5, 'wor—old'],
      [null, .5], [74, .5, 'in'], [76, .5, 'His'], [74, 1, 'hands'],
      [74, .5, "He's"], [74, .5, 'got'], [71, .5, 'the'],
      [74, 2, 'who—ole'], [71, .5, 'wor—'], [67, 1.5, '—old'],
      [null, .5], [74, .5, 'in'], [76, .5, 'His'], [74, 1, 'hands'],
      [74, .5, "He's"], [74, .5, 'got'], [71, .5, 'the'],
      [74, 1, 'whole'], [74, 1, 'world'], [72, .5, 'in'], [69, 1.5, 'His'], [67, 2, 'hands', 2.4],
    ]),
  },
  'amazing-grace': {
    status: 'certified', unit: 'quarter', totalBeats: 48,
    source: { label: 'NEW BRITAIN ABC melody in G', url: 'https://abcnotation.com/tunePage?a=pghardy.net%2Ftunebooks%2Fpgh_sets_tunebook%2F0138', checked: '2026-08-16' },
    lyricSource: { label: 'Lyric-bearing NEW BRITAIN ABC phrasing', url: 'https://abcnotation.com/tunePage?a=www.godsongs.net%2F2011%2F09%2Famazing-grace.html%2F0001', checked: '2026-08-15' },
    melody: line(-1, [
      [62, 1, 'A—'],
      [67, 2, 'ma—'], [71, .5, 'zing'], [67, .5, 'grace'], [71, 2, 'how'], [69, 1, 'sweet'],
      [67, 2, 'the'], [64, 1, 'sound'], [62, 2, 'that'], [62, 1, 'saved'],
      [67, 2, 'a'], [71, .5, 'wretch'], [67, .5, 'like'], [71, 2, 'me—'], [69, .5], [71, .5],
      [74, 3], [74, 1], [null, 1], [71, 1, 'I'],
      [74, 2, 'once'], [71, .5, 'was'], [67, .5, 'lost'], [71, 2, 'but'], [69, 1, 'now'],
      [67, 2, 'am'], [64, 1, 'found'], [62, 2, 'was'], [62, 1, 'blind'],
      [67, 2, 'but'], [71, 1 / 3, 'now—'], [69, 1 / 3], [67, 1 / 3],
      [71, 2, 'I'], [69, 1, 'see—'], [67, 3], [67, 2],
    ]),
  },
  'shady-grove': {
    status: 'certified', unit: 'quarter', totalBeats: 16,
    source: { label: 'Traditional lyric-bearing 2/4 ABC melody, transposed to Em', url: 'https://www.flutetree.org/songbook/minor/ShadyGrove.html', checked: '2026-08-16' },
    lyricSource: { label: 'WSU Kodály lyric-bearing traditional Shady Grove score', url: 'https://www.wichita.edu/academics/fine_arts/music/kodaly/documents/Target_Song_Collection_2017.pdf', checked: '2026-08-16' },
    melody: line(0, [
      [64, .5, 'Sha-'], [64, .5, 'dy'], [64, 1, 'Grove'],
      [66, .5, 'my'], [64, .25, 'lit-'], [64, .25, 'tle'], [62, 1, 'love'],
      [64, .5, 'Sha-'], [64, .5, 'dy'], [66, .5, 'Grove'], [69, .5, 'I'],
      [71, 2, 'know—'],
      [62, .5, 'Sha-'], [62, .5, 'dy'], [71, 1, 'Grove'],
      [69, .5, 'my'], [66, .25, 'lit-'], [64, .25, 'tle'], [62, 1, 'love'],
      [64, .5, 'Bound'], [66, .25, 'for'], [66, .25, 'the'], [69, .5, 'Sha-'], [66, .5, 'dy'],
      [64, 2, 'Grove—'],
    ]),
  },
};

export const scoreFor = (songOrId) => SCORES[typeof songOrId === 'string' ? songOrId : songOrId.id] || null;
export const midiFrequency = (midi) => 440 * (2 ** ((midi - 69) / 12));
