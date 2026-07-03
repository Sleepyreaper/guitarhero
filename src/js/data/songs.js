// Play-along songs. EVERYTHING here is public domain (pre-1929 or traditional)
// so it can ship inside the app with zero licensing worry.
// A line is an array of tokens { c: 'G' (chord, optional), t: 'lyric text' }.
// The renderer stacks the chord above the lyric using a monospace grid.

export const SONGS = [
  {
    id: 'down-in-the-valley',
    title: 'Down in the Valley',
    style: 'Folk',
    key: 'G',
    capo: 0,
    time: '3/4 (waltz)',
    difficulty: 'First song',
    chords: ['G', 'D7'],
    note: 'Only TWO chords. This is the one to nail first — a slow 3/4 waltz strum (one down-strum per beat).',
    body: [
      { section: 'Verse', lines: [
        [{ c: 'G', t: 'Down in the ' }, { t: 'valley, the ' }, { c: 'D7', t: 'valley so low' }],
        [{ c: 'D7', t: 'Hang your head ' }, { t: 'over, hear the ' }, { c: 'G', t: 'wind blow' }],
        [{ c: 'G', t: 'Hear the wind ' }, { t: 'blow, dear, ' }, { c: 'D7', t: 'hear the wind blow' }],
        [{ c: 'D7', t: 'Hang your head ' }, { t: 'over, hear the ' }, { c: 'G', t: 'wind blow' }],
      ] },
    ],
  },
  {
    id: 'amazing-grace',
    title: 'Amazing Grace',
    style: 'Church',
    key: 'G',
    capo: 0,
    time: '3/4 (waltz)',
    difficulty: 'Easy',
    chords: ['G', 'G7', 'C', 'Em', 'D7'],
    note: 'The most-known hymn in the world (John Newton, 1779). A gentle 3/4 waltz — perfect for practicing clean G ↔ C ↔ D changes.',
    body: [
      { section: 'Verse 1', lines: [
        [{ c: 'G', t: 'Amazing ' }, { c: 'G7', t: 'grace how ' }, { c: 'C', t: 'sweet the ' }, { c: 'G', t: 'sound' }],
        [{ t: 'That saved a ' }, { c: 'Em', t: 'wretch like ' }, { c: 'D7', t: 'me' }],
        [{ c: 'G', t: 'I ' }, { c: 'G7', t: 'once was ' }, { c: 'C', t: 'lost but ' }, { c: 'G', t: 'now am ' }, { c: 'Em', t: 'found' }],
        [{ t: 'Was ' }, { c: 'G', t: 'blind but ' }, { c: 'D7', t: 'now I ' }, { c: 'G', t: 'see' }],
      ] },
    ],
  },
  {
    id: 'whole-world',
    title: "He's Got the Whole World in His Hands",
    style: 'Church',
    key: 'G',
    capo: 0,
    time: '4/4',
    difficulty: 'Easy',
    chords: ['G', 'C', 'D7'],
    note: 'A traditional spiritual — only G, C, D7. Great for a steady down-up strum and singing along.',
    body: [
      { section: 'Verse', lines: [
        [{ t: "He's got the " }, { c: 'G', t: 'whole world in his ' }, { c: 'D7', t: 'hands' }],
        [{ t: "He's got the whole world in his " }, { c: 'G', t: 'hands' }],
        [{ t: "He's got the " }, { c: 'G', t: 'whole world in his ' }, { c: 'C', t: 'hands' }],
        [{ t: "He's got the whole " }, { c: 'G', t: 'world in his ' }, { c: 'D7', t: 'hands, in his ' }, { c: 'G', t: 'hands' }],
      ] },
    ],
  },
  {
    id: 'oh-susanna',
    title: 'Oh! Susanna',
    style: 'Country / Old-time',
    key: 'G',
    capo: 0,
    time: '4/4',
    difficulty: 'Easy',
    chords: ['G', 'C', 'D7'],
    note: 'Stephen Foster, 1848 — the original American singalong. Bouncy 4/4 with a classic I–IV–V chorus.',
    body: [
      { section: 'Verse', lines: [
        [{ c: 'G', t: 'I come from Alabama with my ' }, { c: 'D7', t: 'banjo on my ' }, { c: 'G', t: 'knee' }],
        [{ t: "I'm " }, { c: 'G', t: 'going to Louisiana, my ' }, { c: 'D7', t: 'true love for to ' }, { c: 'G', t: 'see' }],
      ] },
      { section: 'Chorus', lines: [
        [{ t: 'Oh! ' }, { c: 'C', t: 'Susanna, oh ' }, { c: 'G', t: "don't you cry for " }, { c: 'D7', t: 'me' }],
        [{ t: 'For I ' }, { c: 'G', t: 'come from Ala' }, { c: 'C', t: 'bama with my ' }, { c: 'G', t: 'banjo ' }, { c: 'D7', t: 'on my ' }, { c: 'G', t: 'knee' }],
      ] },
    ],
  },
  {
    id: 'home-on-the-range',
    title: 'Home on the Range',
    style: 'Americana',
    key: 'G',
    capo: 0,
    time: '3/4 (waltz)',
    difficulty: 'Easy',
    chords: ['G', 'C', 'D7'],
    note: 'The unofficial anthem of the American West (1872). A flowing 3/4 waltz that stretches your G–C–D changes across long phrases.',
    body: [
      { section: 'Verse', lines: [
        [{ c: 'G', t: 'Oh give me a ' }, { c: 'C', t: 'home where the ' }, { c: 'G', t: 'buffalo ' }, { c: 'D7', t: 'roam' }],
        [{ t: 'Where the ' }, { c: 'G', t: 'deer and the ' }, { c: 'D7', t: 'antelope ' }, { c: 'G', t: 'play' }],
        [{ c: 'G', t: 'Where seldom is ' }, { c: 'C', t: 'heard a dis' }, { c: 'G', t: 'couraging ' }, { c: 'D7', t: 'word' }],
        [{ t: 'And the ' }, { c: 'G', t: 'skies are not ' }, { c: 'D7', t: 'cloudy all ' }, { c: 'G', t: 'day' }],
      ] },
    ],
  },
  {
    id: 'swing-low',
    title: 'Swing Low, Sweet Chariot',
    style: 'Church / Spiritual',
    key: 'G',
    capo: 0,
    time: '4/4',
    difficulty: 'Easy',
    chords: ['G', 'C', 'D7'],
    note: 'A traditional spiritual with a warm, slow feel — let each chord ring for a full bar.',
    body: [
      { section: 'Refrain', lines: [
        [{ t: 'Swing ' }, { c: 'G', t: 'low, sweet ' }, { c: 'C', t: 'chari' }, { c: 'G', t: 'ot' }],
        [{ t: 'Comin\' for to carry me ' }, { c: 'D7', t: 'home' }],
        [{ t: 'Swing ' }, { c: 'G', t: 'low, sweet ' }, { c: 'C', t: 'chari' }, { c: 'G', t: 'ot' }],
        [{ t: 'Comin\' for to ' }, { c: 'D7', t: 'carry me ' }, { c: 'G', t: 'home' }],
      ] },
    ],
  },
  {
    id: 'simple-gifts',
    title: 'Simple Gifts',
    style: 'Folk / Shaker',
    key: 'G',
    capo: 0,
    time: '4/4',
    difficulty: 'Easy+',
    chords: ['G', 'C', 'D'],
    note: 'Joseph Brackett, 1848 — a bright Shaker tune. Uses D (not D7) for a cleaner, more open resolve.',
    body: [
      { section: 'Verse', lines: [
        [{ t: "'Tis the " }, { c: 'G', t: 'gift to be simple, \'tis the gift to be ' }, { c: 'D', t: 'free' }],
        [{ t: "'Tis the " }, { c: 'G', t: 'gift to come down where we ' }, { c: 'C', t: 'ought to ' }, { c: 'G', t: 'be' }],
        [{ t: 'And ' }, { c: 'G', t: 'when we find ourselves in the place just ' }, { c: 'D', t: 'right' }],
        [{ t: "'Twill " }, { c: 'G', t: 'be in the valley of ' }, { c: 'C', t: 'love and de' }, { c: 'G', t: 'light' }],
      ] },
    ],
  },
];

export const SONG_BY_ID = Object.fromEntries(SONGS.map((s) => [s.id, s]));
