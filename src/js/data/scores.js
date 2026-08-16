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
  'down-in-the-valley': {
    status: 'certified', unit: 'quarter', totalBeats: 72,
    source: {
      label: 'CC0 Public Domain Song Anthology melody, lyrics, and traditional harmony in G, page 81',
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/The_Public_Domain_Song_Anthology_with_Modern_and_Traditional_Harmonization.pdf#page=101',
      dataUrl: 'https://dataverse.lib.virginia.edu/api/access/datafile/3898',
      checked: '2026-08-16',
    },
    melody: line(0, [
      [62, 1, 'Down'], [67, 1, 'in'], [69, 1, 'the'],
      [71, 3, 'val—'], [67, 3, '—ley,'],
      [71, 1, 'val-'], [69, 1, 'ley'], [67, 1, 'so'], [69, 6, 'low—'],
      [62, 1, 'Hang'], [66, 1, 'your'], [69, 1, 'head'],
      [72, 3, 'o-'], [69, 3, '—ver,'],
      [72, 1, 'hear'], [71, 1, 'the'], [69, 1, 'wind'], [71, 6, 'blow—'],
      [62, 1, 'Hear'], [67, 1, 'the'], [69, 1, 'wind'],
      [71, 3, 'blow'], [67, 3, 'dear,'],
      [71, 1, 'hear'], [69, 1, 'the'], [67, 1, 'wind'], [69, 6, 'blow—'],
      [62, 1, 'Hang'], [66, 1, 'your'], [69, 1, 'head'],
      [74, 3, 'o-'], [74, 3, '—ver,'],
      [72, 1, 'hear'], [71, 1, 'the'], [69, 1, 'wind'], [67, 6, 'blow—'],
    ]),
  },
  clementine: {
    status: 'certified', unit: 'quarter', totalBeats: 48,
    source: {
      label: 'CC0 Public Domain Song Anthology verse and chorus, transposed F to G, page 232',
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/The_Public_Domain_Song_Anthology_with_Modern_and_Traditional_Harmonization.pdf#page=252',
      dataUrl: 'https://dataverse.lib.virginia.edu/api/access/datafile/3924',
      checked: '2026-08-16',
    },
    melody: line(-1, [
      [67, .75, 'In'], [67, .25, 'a'],
      [67, 1, 'cav-'], [62, 1, 'ern,'], [71, .75, 'in'], [71, .25, 'a'],
      [71, 1, 'can-'], [67, 1, 'yon,'], [67, .75, 'Ex-'], [71, .25, 'ca-'],
      [74, 1.5, 'va-'], [74, .5, 'ting'], [72, .5, 'for'], [71, .5, 'a'],
      [69, 2, 'mine,'], [69, .75, 'Dwelt'], [71, .25, 'a'],
      [72, 1, 'min-'], [72, 1, 'er,'], [71, .75, 'for-'], [69, .25, 'ty-'],
      [71, 1, 'nin-'], [67, 1, 'er,'], [67, .5, 'And'], [71, .5, 'his'],
      [69, 1.5, 'daugh-'], [62, .5, 'ter'], [66, .5, 'Clem-'], [69, .5, 'en-'],
      [67, 2, 'tine.'], [67, .75, 'Oh,'], [67, .25, 'my'],
      [67, 1, 'dar-'], [62, 1, 'ling,'], [71, .75, 'oh,'], [71, .25, 'my'],
      [71, 1, 'dar-'], [67, 1, 'ling,'], [67, .75, 'Oh,'], [71, .25, 'my'],
      [74, 1.5, 'dar-'], [74, .5, 'ling'], [72, .5, 'Clem-'], [71, .5, 'en-'],
      [69, 2, 'tine:'], [69, .75, 'Thou'], [71, .25, 'art'],
      [72, 1, 'lost'], [72, 1, 'and'], [71, .75, 'gone'], [69, .25, 'for-'],
      [71, 1, 'ev-'], [67, 1, 'er,'], [67, .5, 'Dread-'], [71, .5, 'ful'],
      [69, 1.5, 'sor-'], [62, .5, 'ry,'], [66, .5, 'Clem-'], [69, .5, 'en-'],
      [67, 2, 'tine.'],
    ]),
  },
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
  kumbaya: {
    status: 'certified', unit: 'quarter', totalBeats: 24,
    source: { label: 'Musica Viva lyric-bearing 3/4 ABC melody and harmony, transposed C to G', url: 'https://abcnotation.com/tunePage?a=trillian.mit.edu%2F~jc%2Fmusic%2Fabc%2Fmirror%2Fmusicaviva.com%2Ftunes%2Famerica%2Fkum-ba-yah%2Fkum-ba-yah-1%2F0000', checked: '2026-08-16' },
    melody: line(-1, [
      [67, .5, 'Kum-'], [71, .5, 'ba'],
      [74, .75, 'yah'], [74, .25, 'my'], [74, 1, 'Lord'], [76, .5, 'Kum-'], [76, .5, 'ba'],
      [74, 2, 'yah'], [67, .5, 'Kum-'], [71, .5, 'ba'],
      [74, .75, 'yah'], [74, .25, 'my'], [74, 1, 'Lord'], [72, .5, 'Kum-'], [71, .5, 'ba'],
      [69, 2, 'yah'], [67, .5, 'Kum-'], [71, .5, 'ba'],
      [74, .75, 'yah'], [74, .25, 'my'], [74, 1, 'Lord'], [76, .5, 'Kum-'], [76, .5, 'ba'],
      [74, 2, 'yah'], [72, 1, 'Oh'],
      [71, .5, 'Lord'], [67, .5], [69, .5, 'Kum-'], [69, .5, 'ba'], [67, 1, 'yah'],
      [67, 2],
    ]),
  },
  'will-the-circle': {
    status: 'certified', unit: 'quarter', totalBeats: 32,
    source: { label: 'Timeless Truths public-domain Habershon/Gabriel SATB soprano refrain, transposed A-flat to G', url: 'https://library.timelesstruths.org/library/music/W/Will_the_Circle_Be_Unbroken/Will_the_Circle_Be_Unbroken.pdf', checked: '2026-08-16' },
    melody: line(-1, [
      [67, .5, 'Will'], [null, .25], [69, .25, 'the'],
      [71, 1, 'cir-'], [74, 2, 'cle'], [71, .5, 'be'], [null, .25], [69, .25, 'un-'],
      [67, 1, 'bro-'], [71, 2, 'ken'], [67, .5, 'By'], [null, .25], [66, .25, 'and'],
      [64, 1, 'by—'], [null, .5], [69, .5], [67, 1, 'by'], [64, 1, 'and'],
      [62, 2, 'by?—'], [null, 1], [62, .5, 'In'], [null, .25], [62, .25, 'a'],
      [64, 1, 'bet-'], [67, 2, 'ter'], [67, .5, 'home'], [null, .25], [69, .25, 'a-'],
      [71, 1, 'wait-'], [71, 2, 'ing'], [71, .5, 'In'], [null, .25], [72, .25, 'the'],
      [74, 2, 'sky—'], [null, 1], [71, .5, 'in'], [null, .25], [69, .25, 'the'],
      [67, 2, 'sky—'], [null, 1],
    ]),
  },
  'what-a-friend': {
    status: 'certified', unit: 'quarter', totalBeats: 64,
    source: { label: 'Lyric-bearing CONVERSE ABC melody and harmony, transposed D to G', url: 'https://abcnotation.com/tunePage?a=trillian.mit.edu%2F~jc%2Fmusic%2Fabc%2Fmirror%2Fgulfweb.net%3A34043%2F~rlwalker%2Fabc%2Fwhatafriend%2F0000', checked: '2026-08-16' },
    melody: line(0, [
      [74, 1.5, 'What'], [74, .5, 'a'], [76, .5, 'friend'], [74, .5, 'we'], [71, .5, 'have'], [67, .5, 'in'],
      [67, 2, 'Je-'], [64, 1, 'sus'], [null, 1],
      [62, 1.5, 'All'], [67, .5, 'our'], [71, .5, 'sins'], [67, .5, 'and'], [74, .5, 'griefs'], [71, .5, 'to'],
      [69, 3, 'bear—'], [null, 1],
      [74, 1.5, 'What'], [74, .5, 'a'], [76, .5, 'priv-'], [74, .5, 'i-'], [71, .5, 'lege'], [67, .5, 'to'],
      [67, 2, 'car-'], [64, 1, 'ry'], [null, 1],
      [62, 1.5, 'Ev-'], [67, .5, '’ry'], [71, .5, 'thing'], [69, .5, 'to'], [67, .5, 'God'], [66, .5, 'in'],
      [67, 3, 'prayer—'], [null, 1],
      [69, 1.5, 'Oh'], [67, .5, 'what'], [69, .5, 'peace'], [71, .5, 'we'], [72, .5, 'of-'], [69, .5, 'ten'],
      [71, 2, 'for-'], [74, 1, 'feit'], [null, 1],
      [76, 1.5, 'Oh'], [76, .5, 'what'], [74, .5, 'need-'], [71, .5, 'less'], [72, .5, 'pain'], [71, .5, 'we'],
      [69, 3, 'bear—'], [null, 1],
      [74, 1.5, 'All'], [74, .5, 'be-'], [76, .5, 'cause'], [74, .5, 'we'], [71, .5, 'do'], [67, .5, 'not'],
      [67, 2, 'car-'], [64, 1, 'ry'], [null, 1],
      [62, 1.5, 'Ev-'], [67, .5, '’ry'], [71, .5, 'thing'], [69, .5, 'to'], [67, .5, 'God'], [66, .5, 'in'],
      [67, 3, 'prayer—'], [null, 1],
    ]),
  },
};

export const scoreFor = (songOrId) => SCORES[typeof songOrId === 'string' ? songOrId : songOrId.id] || null;
export const midiFrequency = (midi) => 440 * (2 ** ((midi - 69) / 12));
