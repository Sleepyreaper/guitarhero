// Beginner accompaniment arrangements for every public-domain song in Campfire.
// These are deliberately playable reductions, not transcriptions of one recording.
// Repeated chords are meaningful bars; arrays divide a bar evenly, while { changes } pins chords to exact beats.

export const GROOVES = {
  waltz: {
    label: 'Country waltz: bass, brush, brush',
    count: '1 2 3',
    events: [
      { beat: 0, kind: 'bass', gain: .22 },
      { beat: 1, kind: 'brush', gain: .10 },
      { beat: 2, kind: 'brush', gain: .10 },
    ],
  },
  straight: {
    label: 'Beginner pulse: four relaxed down-strums',
    count: '1 2 3 4',
    events: [0, 1, 2, 3].map((beat) => ({ beat, kind: 'full', gain: beat === 0 ? .19 : .11 })),
  },
  boomChuck: {
    label: 'Country boom-chuck: bass on 1 and 3, chord on 2 and 4',
    count: '1 2 3 4',
    events: [
      { beat: 0, kind: 'bass', gain: .23 }, { beat: 1, kind: 'brush', gain: .12 },
      { beat: 2, kind: 'bass', gain: .18 }, { beat: 3, kind: 'brush', gain: .12 },
    ],
  },
  countryTwo: {
    label: 'Quick country 2/4: bass on 1, short chord on 2',
    count: '1 2',
    events: [
      { beat: 0, kind: 'bass', gain: .21 },
      { beat: 1, kind: 'brush', gain: .11 },
    ],
  },
  nurseryTwo: {
    label: 'Gentle 2/4: two relaxed down-strums',
    count: 'ONE two',
    events: [
      { beat: 0, kind: 'full', gain: .17 },
      { beat: 1, kind: 'brush', gain: .08 },
    ],
  },
  cutTime: {
    label: 'Cut-time bounce: bass on ONE, short chord on TWO',
    count: 'ONE-and TWO-and',
    events: [
      { beat: 0, kind: 'bass', gain: .21 },
      { beat: 1, kind: 'brush', gain: .11 },
    ],
  },
  folk: {
    label: 'Folk down-up: D, D-U, U-D-U',
    count: '1-and-2-and-3-and-4-and',
    events: [
      { beat: 0, kind: 'full', gain: .18 }, { beat: 1, kind: 'full', gain: .12 },
      { beat: 1.5, kind: 'up', gain: .08 }, { beat: 2.5, kind: 'up', gain: .08 },
      { beat: 3, kind: 'full', gain: .12 }, { beat: 3.5, kind: 'up', gain: .08 },
    ],
  },
  steadyDownUp: {
    label: 'Steady 4/4: down, down-up, down, down-up',
    count: '1-and-2-and-3-and-4-and',
    events: [
      { beat: 0, kind: 'full', gain: .18 },
      { beat: 1, kind: 'full', gain: .11 }, { beat: 1.5, kind: 'up', gain: .08 },
      { beat: 2, kind: 'full', gain: .13 },
      { beat: 3, kind: 'full', gain: .11 }, { beat: 3.5, kind: 'up', gain: .08 },
    ],
  },
  actionClap: {
    label: 'Action-song pulse: steady phrases, then open beats for claps',
    count: '1 2 3 4',
    events: [
      { beat: 0, kind: 'full', gain: .18 },
      { beat: 1, kind: 'brush', gain: .10 },
      { beat: 2, kind: 'full', gain: .12 },
      { beat: 3, kind: 'up', gain: .08 },
    ],
    barEvents: [
      null,
      [{ beat: 0, kind: 'full', gain: .18 }, { beat: 1, kind: 'brush', gain: .10 }],
      null,
      [{ beat: 0, kind: 'full', gain: .18 }, { beat: 1, kind: 'brush', gain: .10 }],
      null, null, null,
      [{ beat: 0, kind: 'full', gain: .18 }, { beat: 1, kind: 'brush', gain: .10 }],
    ],
  },
  sparse: {
    label: 'Vocal space: full chord on 1, light brush on 3',
    count: '1 2 3 4',
    events: [{ beat: 0, kind: 'full', gain: .18 }, { beat: 2, kind: 'brush', gain: .08 }],
  },
  lullabyTwo: {
    label: 'Gentle 2/4: warm chord on 1, quiet brush on 2',
    count: '1 2',
    events: [
      { beat: 0, kind: 'full', gain: .16 },
      { beat: 1, kind: 'brush', gain: .06 },
    ],
  },
  compoundTwo: {
    label: '6/8 sway: bass on ONE, light brush on TWO',
    count: 'ONE-and-a TWO-and-a',
    events: [
      { beat: 0, kind: 'bass', gain: .19 },
      { beat: 3, kind: 'brush', gain: .08 },
    ],
  },
  gospel: {
    label: 'Gospel sway: bass, brush, bass, brush',
    count: '1 2 3 4',
    events: [
      { beat: 0, kind: 'bass', gain: .22 }, { beat: 1, kind: 'brush', gain: .10 },
      { beat: 2, kind: 'bass', gain: .17 }, { beat: 3, kind: 'up', gain: .09 },
    ],
  },
  sixEight: {
    label: 'Rolling 6/8: bass-to-treble and back, six even eighth-notes',
    count: 'ONE-and-a TWO-and-a',
    events: [
      { beat: 0, kind: 'pick', string: 0, gain: .18 },
      { beat: 1, kind: 'pick', string: 1, gain: .10 },
      { beat: 2, kind: 'pick', string: 2, gain: .10 },
      { beat: 3, kind: 'pick', fromTop: 1, gain: .16 },
      { beat: 4, kind: 'pick', fromTop: 2, gain: .10 },
      { beat: 5, kind: 'pick', fromTop: 3, gain: .10 },
    ],
  },
  fingerWaltz: {
    label: 'Fingerpicked 3/4: bass, high, middle',
    count: '1 2 3',
    events: [
      { beat: 0, kind: 'bass', gain: .19 },
      { beat: 1, kind: 'pick', fromTop: 1, gain: .10 },
      { beat: 2, kind: 'pick', fromTop: 2, gain: .10 },
    ],
  },
  prayerWaltz: {
    label: 'Gentle prayer waltz: warm chord on 1, light brushes on 2 and 3',
    count: '1 2 3',
    events: [
      { beat: 0, kind: 'full', gain: .16 },
      { beat: 1, kind: 'brush', gain: .06 },
      { beat: 2, kind: 'brush', gain: .05 },
    ],
  },
};

const a = (bpm, meter, groove, section, bars, dynamics, lead, cues = null, timing = 'practice', verification = null, guide = null) => ({
  bpm, meter, groove, section, bars, dynamics, lead, timing,
  ...(cues ? { cues } : {}), ...(verification ? { verification } : {}), ...(guide || {}),
});
const at = (...changes) => ({ changes: changes.map(([beat, chord]) => ({ beat, chord })) });

export const ARRANGEMENTS = {
  'down-in-the-valley': a(72, 3, 'waltz', 'Complete CC0 anthology stanza · twenty-four 3/4 bars',
    [
      'G', 'G', 'G', 'G', 'D7', 'D7', 'D7', 'D7', 'D7', 'D7', 'G', 'G',
      'G', 'G', 'G', 'G', 'D7', 'D7', 'D7', 'D7', 'D7', 'D7', 'G', 'G',
    ],
    'Use bass-brush-brush and trust the space. Change to D7 on the first “low,” back to G on the first line-ending “blow,” then repeat that same D7-to-G journey.',
    'Play the printed melody alone as an introduction. During singing, do not fill the two-bar held “low” and “blow” notes; those long tones teach you to keep time without chasing words.',
    [
      'Down in the', 'val—', '—ley,', 'val-ley so', 'low—', '(hold low)',
      'Hang your head', 'o—', '—ver,', 'hear the wind', 'blow—', '(hold blow)',
      'Hear the wind', 'blow', 'dear,', 'hear the wind', 'blow—', '(hold blow)',
      'Hang your head', 'o—', '—ver,', 'hear the wind', 'blow—', '(hold blow)',
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology, Down in the Valley page 81',
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/The_Public_Domain_Song_Anthology_with_Modern_and_Traditional_Harmonization.pdf#page=101',
      checked: '2026-08-16',
    }, {
      reduction: 'Campfire retains the anthology’s traditional G and D7 harmony and omits its italic jazz-color suggestions. The printed first G symbol arrives on “val”; Campfire extends G under the opening three-beat “Down in the” bar so a beginner has a stable count from the first beat.',
    }),
  clementine: a(90, 3, 'waltz', 'Complete CC0 verse and chorus · sixteen 3/4 bars plus pickup',
    [
      'G', 'G', 'G', 'D7', 'D7', 'G', 'D7', 'G',
      'G', 'G', 'G', 'D7', 'D7', 'D7', 'D7', 'G',
    ],
    'Sing “In a” on beat 3 of the count-in, then land “cav-” on beat 1. Keep beat 1 buoyant and make brushes 2 and 3 short enough to hear every lyric pickup.',
    'Use the complete printed melody for an intro. Under the singer, leave the title phrase alone and save any two-note G-major answer for the final held “-tine.”',
    [
      'cav-ern, in a', 'can-yon, Ex-ca-', 'va-ting for a', 'mine; Dwelt a',
      'min-er, for-ty-', 'nin-er, And his', 'daugh-ter Clem-en-', 'tine; Oh, my',
      'dar-ling, oh, my', 'dar-ling, Oh, my', 'dar-ling Clem-en-', 'tine; Thou art',
      'lost and gone for-', 'ev-er, Dread-ful', 'sor-ry, Clem-en-', 'tine—; then pickup: In a',
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology, Oh, My Darling Clementine page 232',
      url: 'https://upload.wikimedia.org/wikipedia/commons/c/cc/The_Public_Domain_Song_Anthology_with_Modern_and_Traditional_Harmonization.pdf#page=252',
      checked: '2026-08-16',
    }, {
      pickup: { beat: 2, text: 'In a… (pickup)' },
      reduction: 'Campfire transposes the anthology’s F/C7 foundation to open G/D7. Its italic jazz reharmonization and the traditional B7/D-sharp → Em → A7 turnaround are omitted; D7 continues through “lost and gone forever, dreadful sorry” before resolving to G on the final “-tine.”',
    }),
  'shady-grove': a(100, 2, 'countryTwo', 'Complete Hindman E-minor chorus · eight 2/4 bars',
    ['Em', 'D', 'Em', 'Em', 'G', 'D', 'Em', 'Em'],
    'Count a quick “ONE two.” Play a low bass note on ONE and a short chord on two; each displayed Hindman chord pair is one complete 2/4 measure.',
    'The Hindman fiddle tab is the lead reference. First learn its opening answer separately; keep accompaniment to bass-chord while anyone sings.',
    [
      'Shady Grove', 'my little love',
      'Shady Grove I', 'know—',
      'Shady Grove', 'my little love',
      'Bound for the Shady', 'Grove—',
    ], 'verified', { label: 'Hindman Settlement School E-minor chord chart and matching fiddle tab', url: 'https://hindmanathome.org/pick-and-bow/', checked: '2026-08-16' }),
  'row-your-boat': a(76, 6, 'compoundTwo', 'Complete eight-bar verse',
    ['G', 'G', 'G', 'G', 'G', 'G', 'D7', 'G'],
    'Feel two large pulses per bar—not six separate down-strums. Stay quiet enough to hear both parts if you sing it as a round.',
    'Pick the familiar melody one note at a time on the top two strings; when voices enter as a round, return to simple G backing.',
    [
      'Row, row', 'row your boat',
      'Gently down the', 'stream',
      'Merrily, merrily', 'merrily, merrily',
      'Life is but a', 'dream',
    ], 'verified', { label: 'Singing Bell G-major guitar score in 6/8', url: 'https://www.singing-bell.com/wp-content/uploads/2022/01/Row-Row-Row-your-Boat-Guitar-Chords-Sheet-Music_Singing-Bell.pdf', checked: '2026-08-15' }),
  'hush-little-baby': a(70, 2, 'lullabyTwo', 'Complete selected verse · sixteen 2/4 bars',
    [
      'G', 'G', 'D7', 'D7', 'D7', 'D7', 'G', 'G',
      'G', 'G', 'D7', 'D7', 'D7', 'D7', 'G', 'G',
    ],
    'Count a quiet “ONE two.” Let each chord ring; the melody moves faster than the guitar, so do not chase every syllable with your strumming hand.',
    'Play the complete printed melody once as an introduction. Under singing, leave the held “word,” “sing,” and “ring” notes empty instead of filling the space.',
    [
      'Hush, lit-tle', 'ba-by, don’t', 'say a', 'word—',
      'Ma-ma’s gon-na', 'buy you a', 'mock-ing', 'bird; And',
      'if that', 'mock-ing', 'bird don’t', 'sing—',
      'Ma-ma’s gon-na', 'buy you a', 'dia-mond', 'ring—',
    ], 'verified', {
      label: 'Singing Bell lyric-bearing 2/4 guitar score in C, transposed to G',
      url: 'https://www.singing-bell.com/wp-content/uploads/2022/01/Hush-Little-Baby-Guitar-Chords-Sheet-Music_Singing-Bell.pdf',
      checked: '2026-08-16',
    }, {
      reduction: 'Campfire transposes the score from C/G7 to open G/D7 without changing its melody, sixteen-bar form, or chord boundaries. The selected score’s “Mama” and “don’t sing” wording is used throughout rather than mixing common variants.',
    }),
  'twinkle-twinkle': a(92, 2, 'nurseryTwo', 'Complete CC0 anthology verse · twenty-four 2/4 bars',
    [
      'G', 'G', 'C', 'G', 'D7', 'G', 'D7', 'G',
      'G', 'D7', 'G', 'D7', 'G', 'D7', 'G', 'D7',
      'G', 'G', 'C', 'G', 'D7', 'G', 'D7', 'G',
    ],
    'Count a calm “ONE two.” Give ONE a little more weight, keep two quiet, and let each two-syllable word occupy a complete measure.',
    'Play the complete printed melody by itself first. Under a singer, use only the two soft down-strums; the octave leaps already provide the recognizable lead shape.',
    [
      'Twink-le,', 'twink-le,', 'lit-tle', 'star—',
      'How I', 'won-der', 'what you', 'are—',
      'Up a-', 'bove the', 'world so', 'high—',
      'Like a', 'dia-mond', 'in the', 'sky—',
      'Twink-le,', 'twink-le,', 'lit-tle', 'star—',
      'How I', 'won-der', 'what you', 'are—',
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology, Twinkle, Twinkle, Little Star',
      url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4690',
      checked: '2026-08-16',
    }, {
      reduction: 'Campfire transposes the anthology from C to G and uses open D7 for every dominant-function bar, combining the printed G-major and G7 colors into one beginner shape. Its italic jazz-color suggestions are omitted; melody, 2/4 meter, form, and every retained chord boundary remain on the source clock.',
    }),
  'old-macdonald': a(84, 2, 'cutTime', 'Complete CC0 duck verse · sixteen cut-time bars',
    [
      'G', at([0, 'C'], [1, 'G']), at([0, 'G'], [1, 'D7']), 'G',
      'G', at([0, 'C'], [1, 'G']), at([0, 'G'], [1, 'D7']), 'G',
      at([0, 'G'], [1, 'C'], [1.5, 'G']), at([0, 'C'], [1, 'G']),
      at([0, 'G'], [1, 'C']), at([0, 'G'], [1, 'C']),
      'G', at([0, 'C'], [1, 'G']), at([0, 'G'], [1, 'D7']), 'G',
    ],
    'Feel two large half-note pulses: “ONE-and TWO-and.” The sung quarter notes fall on ONE, and, TWO, and; keep the bass-and-chord accompaniment beneath them.',
    'Echo only the four-note E-I-E-I figure after a verse. During the quacks, stay with the cut-time pulse instead of matching every syllable with a strum.',
    [
      'Ol’ Mac-Don-ald', ['had a', 'farm—'], ['E-I', 'E-I'], 'O—; And',
      'on this farm he', ['had a', 'duck—'], ['E-I', 'E-I'], 'O—; With a',
      ['quack-quack', 'here', 'and a'], ['quack-quack', 'there; rest'],
      ['Here a quack', 'there a quack'], ['ev’rywhere a', 'quack-quack'],
      'Ol’ Mac-Don-ald', ['had a', 'farm—'], ['E-I', 'E-I'], 'O—',
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology, Old MacDonald Had a Farm',
      url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4598',
      checked: '2026-08-16',
    }, {
      tempoUnit: 'half-note',
      reduction: 'Campfire follows the anthology’s printed G/C/G/D7 harmony, cut-time form, duck verse, rests, and mid-measure changes. Only the italic jazz-color suggestions are omitted.',
    }),
  kumbaya: a(60, 3, 'prayerWaltz', 'Complete source-locked eight-bar verse',
    [
      at([0, 'G'], [2, 'C']), 'G',
      at([0, 'G'], [2, 'C']), at([0, 'D'], [2, 'G']),
      at([0, 'G'], [2, 'C']), at([0, 'G'], [2, 'C']),
      at([0, 'G'], [1, 'D7'], [2, 'G']), 'G',
    ],
    'Count “ONE two three.” Let beat 1 carry the phrase and make beats 2 and 3 very light; the sung “Kum-ba” pickup arrives before the first downbeat.',
    'Pick a quiet descending G-major answer only after the final “yah.” Do not add notes under the held “Lord.”',
    [
      ['(pickup: Kum-ba) yah my Lord', 'Kum-ba'], 'yah; (pickup: Kum-ba)',
      ['yah my Lord', 'Kum-ba'], ['yah', '(pickup: Kum-ba)'],
      ['yah my Lord', 'Kum-ba'], ['yah (hold)', 'Oh (pickup)'],
      ['Lord', 'Kum-ba', 'yah'], 'let G ring',
    ], 'verified', { label: 'Musica Viva lyric-bearing 3/4 ABC melody and harmony, transposed C to G', url: 'https://abcnotation.com/tunePage?a=trillian.mit.edu%2F~jc%2Fmusic%2Fabc%2Fmirror%2Fmusicaviva.com%2Ftunes%2Famerica%2Fkum-ba-yah%2Fkum-ba-yah-1%2F0000', checked: '2026-08-16' }, {
      pickup: { beat: 2, text: 'Kum-ba… (pickup)' },
    }),
  'whole-world': a(120, 4, 'straight', 'Verse loop with vocal pickups',
    ['G', 'G', 'D', 'D', 'G', 'G', 'D', 'G'],
    'Use four relaxed quarter-note downs. The voice begins “He’s got the” before beat 1; do not chase its syllables with extra strums.',
    'Answer “in His hands” with a tiny G-major lick, then get out of the way before the next line.',
    [
      'who—ole wor—old', "in His hands; then: He's got the…",
      'whole wide wor—old', "in His hands; then: He's got the…",
      'who—ole wor—old', "in His hands; then: He's got the…",
      'whole world in His', 'hands — let the final G ring',
    ], 'verified', { label: 'Wikibooks public-domain D / A score in 4/4, transposed to G / D', url: 'https://de.wikibooks.org/wiki/Gitarre%3A_Liedbeispiel_1b', checked: '2026-08-16' }, {
      pickup: { beat: 2.5, text: "He's got the… (pickup)" },
      vocalCues: [
        { bar: 0, beat: 0, text: 'who—ole wor—old' },
        { bar: 1, beat: 2.5, text: "He's got the… (pickup)" },
        { bar: 2, beat: 0, text: 'whole wide wor—old' },
        { bar: 3, beat: 2.5, text: "He's got the… (pickup)" },
        { bar: 4, beat: 0, text: 'who—ole wor—old' },
        { bar: 5, beat: 2.5, text: "He's got the… (pickup)" },
        { bar: 6, beat: 0, text: 'whole world in His hands' },
      ],
    }),
  'she-ll-be-comin': a(104, 2, 'countryTwo', 'Complete CC0 anthology verse · sixteen 2/4 bars plus pickup',
    [
      'G', 'G', 'G', 'G', 'G', 'G', 'D7', 'D7',
      'G', 'G', 'C', 'C', 'G', at([0, 'G'], [1, 'D7']), 'G', 'G',
    ],
    'Count a quick “ONE two.” Sing “She’ll be” on beat 2 of the count-in, then land “com-” on ONE. Keep every phrase-ending rest so the next pickup has room.',
    'Use the opening two-note pickup and first four melody notes as an intro. Save the D7-to-G walk for the final “when she comes” cadence.',
    [
      "com-in' 'round the", 'moun-tain when she', 'comes; rest', "rest; She'll be",
      "com-in' 'round the", 'moun-tain when she', 'comes; rest', "rest; She'll be",
      "com-in' 'round the", "moun-tain; she'll be", "com-in' 'round the", "moun-tain; she'll be",
      "com-in' 'round the", ['moun-tain', 'when she'], 'comes; rest', "rest; pickup: She'll be",
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology, She’ll Be Comin’ ’Round the Mountain',
      url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4636',
      checked: '2026-08-16',
    }, {
      pickup: { beat: 1, text: "She'll be… (pickup)" },
      reduction: 'Campfire keeps the anthology’s G, C, and D7 cadence and every source bar boundary. The printed G7 is reduced to G, C-sharp diminished is held as C, and the Am7-to-D7 setup becomes G-to-D7 so this first version stays on three open shapes; the italic jazz reharmonization is omitted.',
    }),
  'when-the-saints': a(104, 4, 'gospel', 'Complete CC0 anthology verse · sixteen 4/4 bars plus three-beat pickup',
    ['G', 'G', 'G', 'G', 'G', 'G', 'D7', 'D7', 'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'G'],
    'Sing “Oh, when the” on beats 2, 3, and 4 of the count-in, then land “saints” on beat 1. Keep a buoyant backbeat and count through every five-beat tied word.',
    'Play the complete transposed melody once as an intro. Under the voice, answer only after the final “in”; do not fill the long tied notes.',
    [
      'saints—', '—go march-ing', 'in—', '—Oh, when the',
      'saints go', 'march-ing', 'in—', '—Oh, Lord, I',
      'want to', 'be in that', 'num-ber—', '—When the',
      'saints go', 'march-ing', 'in—', '(rest); pickup: Oh, when the',
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology, When the Saints Go Marching In',
      url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4707',
      checked: '2026-08-16',
    }, {
      pickup: { beat: 1, text: 'Oh, when the… (pickup)' },
      reduction: 'Campfire transposes the anthology from F to G. Its G7-to-C secondary-dominant color, minor-iv bar, Em7 passing color, and A7 setup are reduced to the familiar open G/C/D7 beginner form, while every lyric onset, held note, source bar, and retained cadence stays aligned.',
    }),
  'oh-susanna': a(112, 2, 'countryTwo', 'Complete source verse and chorus · sixteen 2/4 bars',
    [
      'G', 'G', 'G', 'D7', 'G', 'G', at([0, 'G'], [1, 'D7']), 'G',
      'C', 'C', 'G', 'D7', 'G', 'G', at([0, 'G'], [1, 'D7']), 'G',
    ],
    'Count ONE-two and keep the bass on ONE, the short brush on two. The half-beat vocal pickup leads into each eight-bar section.',
    'Use the complete melody as the intro. Under the singer, save a short G-to-D7 bass walk for the phrase ending; never cover the words.',
    [
      'come from A-la-', 'ba-ma with a', 'ban-jo on my', 'knee—; I am',
      "goin' to Lou'-", 'si-a-na, my', ['true love', 'for to'], 'see— (rest)',
      'Oh, Su-', 'san-na—', "Don't you cry for", 'me—; For I',
      'come from A-la-', 'ba-ma with a', ['ban-jo', 'on my'], 'knee— (rest)',
    ], 'verified', {
      label: 'Singing Bell lyric-bearing 2/4 guitar score in A, transposed to G and cross-checked against the Nordberg/Musica Viva ABC melody',
      url: 'https://www.singing-bell.com/wp-content/uploads/2022/03/Oh-Susanna-Guitar-Chords-Sheet-Music_Singing-Bell.pdf',
      checked: '2026-08-16',
    }, {
      pickup: { beat: 1.5, text: 'Oh, I… (half-beat pickup)' },
      reduction: 'Campfire follows one lyric-bearing 2/4 edition, transposed A to G. The G-to-D7 moves in bars 7 and 15 occur on beat 2 exactly; no alternate lyric or later four-beat arrangement is mixed in.',
    }),
  'red-river-valley': a(84, 4, 'boomChuck', 'Complete source first stanza · sixteen 4/4 bars',
    [
      'G', 'G', 'G', 'G', 'G', 'G', 'D7', 'D7',
      'G', 'G', 'C', 'C', 'D7', 'D7', 'G', 'G',
    ],
    'Relax behind the beat; long vocal phrases need an unhurried country pulse.',
    'Use single-note fills at the ends of lines, aiming for chord tones. Silence during the lyric is the professional choice.',
    ['val-ley they', 'say you are', 'go-ing—', '(rest); We will',
      'miss your bright', 'eyes and sweet', 'smile—', '(rest); For they',
      'say you are', 'tak-ing the', 'sun-shine—', 'shine—; That has',
      'bright-ened our', 'path-ways a', 'while—', '(rest)'],
    'verified', { label: 'CC0 Public Domain Song Anthology first stanza, transposed D to G', url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4619', checked: '2026-08-16' }, {
      pickup: { beat: 2, text: 'From this… (two-beat pickup)' },
      reduction: 'Campfire preserves the source melody and sixteen-bar stanza while reducing G7 to G and C-sharp diminished to C. The separate Come and sit stanza is not mislabeled as a chorus.',
    }),
  'swing-low': a(72, 4, 'gospel', 'Complete source form · chorus, verse, chorus · twenty-four 4/4 bars',
    [
      'G', at([0, 'C'], [2, 'G']), 'G', 'D7', 'G', at([0, 'C'], [2, 'G']), at([0, 'G'], [2, 'D7']), 'G',
      'G', at([0, 'C'], [1, 'D7']), at([0, 'Em'], [2, 'G']), 'D7', at([0, 'G'], [2, 'Em']), at([0, 'C'], [2, 'D7']), at([0, 'G'], [2, 'D7']), 'G',
      'G', at([0, 'C'], [2, 'G']), 'G', 'D7', 'G', at([0, 'C'], [2, 'G']), at([0, 'G'], [2, 'D7']), 'G',
    ],
    'Let the first beat breathe and make the backbeat brushes warm rather than loud.',
    'Echo the descending shape of “Swing low” after the phrase; do not double every sung note.',
    [
      'Swing low, sweet', ['char-i-', 'ot,'], 'coming for to', 'carry me home—',
      'Swing— low, sweet', ['char-i-', 'ot,'], ['Coming for to', 'carry me'], 'home; pickup: I',
      'looked o-ver Jordan,', ['What', 'did I see,'], ['Coming for', 'to'], 'carry me home?; A',
      ['band of', 'angels'], ['coming', 'after me,'], ['Coming for', 'to'], 'carry me home.',
      'Swing low, sweet', ['char-i-', 'ot,'], 'coming for to', 'carry me home—',
      'Swing— low, sweet', ['char-i-', 'ot,'], ['Coming for to', 'carry me'], 'home— (rest)',
    ],
    'verified', { label: 'CC0 Public Domain Song Anthology chorus, verse, and D.C. al Fine chorus return, transposed A-flat to G', url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4664', checked: '2026-08-16' }, {
      reduction: 'Campfire literal-expands the printed D.C. al Fine into chorus, verse, chorus. Secondary-dominant and diminished colors are reduced to open G, C, D7, and Em while the source chord boundaries, melody, lyrics, and form remain intact.',
    }),
  'simple-gifts': a(100, 4, 'folk', 'Complete source stanza · sixteen 4/4 bars',
    ['G', 'G', 'D', 'D', 'G', 'G', 'D', 'G', 'G', 'G', 'G', at([0, 'C'], [2, 'D']), 'G', 'G', 'D', at([0, 'C'], [2, 'G'])],
    'Keep the wrist loose and the up-strums light so the dance pulse stays buoyant.',
    'The melody is the identity of this tune. Play its opening phrase as an intro, then return to the folk strum under vocals.',
    ["'Tis the gift to be simple, 'tis a", 'gift to be free, ’tis a', 'gift to come down to',
      'where we ought to be; and', 'when we find ourselves in a', "place just right, 'twill",
      'be in the valley of', 'love and delight',
      'When true sim-', 'plicity is gained, to', 'bow and to bend we', ["shan't be", 'ashamed; To'],
      'turn and to turn will', 'be our delight, till by', 'turning, turning, we', ["come 'round", 'right']],
    'verified', { label: 'CC0 Public Domain Song Anthology complete Brackett stanza, transposed F to G', url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4644', checked: '2026-08-16' }, {
      pickup: { beat: 3, text: "'Tis the… (pickup)" },
      reduction: 'Campfire preserves the complete sixteen-bar melody and source G, C, and D harmony after transposition. It does not stop after the first half of the stanza.',
    }),
  'streets-of-laredo': a(66, 3, 'waltz', 'Complete CC0 verse and chorus · thirty-two 3/4 bars',
    [
      'G', 'C', 'G', 'D7', 'Em', 'D', 'G', 'D7',
      'G', 'C', 'G', 'D', 'Em', 'Am', 'D7', 'G',
      'G', 'G', 'C', 'C', 'G', 'Em', 'Am', 'D7',
      'G', 'G7', 'C', 'C', 'G', 'G', 'D7', 'G',
    ],
    'Keep beat 1 low and dependable, then brush 2 and 3 lightly. The harmony moves once per measure, but the singer’s long vowels should remain unhurried.',
    'Play the printed melody for one four-bar phrase as an introduction. During the story, answer only after “Laredo,” “day,” “clay,” “lowly,” and “wrong.”',
    [
      'I walked', 'out in the', 'streets of Lar-', 'e-do; then pickup: As',
      'I walked', 'out in Lar-', 'e-do one', 'day; then pickup: I',
      'spied a young', 'cow-boy all', 'wrapped in white', 'lin-en; then pickup: All',
      'wrapped in white', 'lin-en and', 'cold as the', 'clay; then pickup: Then',
      'beat the drum', 'slow-ly', 'play the fife', 'low-ly',
      'Play the dead', 'march as you', 'car-ry me a-', 'long; pickup: Take me',
      'to the green', 'val-ley', 'lay the sod', 'o’er me',
      'I’m a young', 'cow-boy, and I', 'know I’ve done', 'wrong; then pickup: As',
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology complete Streets of Laredo verse and chorus, transposed D to G',
      url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4659',
      checked: '2026-08-16',
    }, {
      pickup: { beat: 2, text: 'As… (one-beat pickup)' },
      reduction: 'Campfire preserves the anthology’s complete verse/chorus form and transposes its traditional harmony to open G, C, D, D7, Em, Am, and G7. The printed Am7 color is played as Am; italic modern reharmonization is omitted, but every retained chord boundary stays on the source bar.',
    }),
  'will-the-circle': a(92, 4, 'gospel', 'Complete eight-bar 1907 refrain',
    ['G', 'G', 'C', 'G', 'C', 'G', 'G', 'G'],
    'Keep a warm four-beat gospel pulse. The voice enters with “Will the” during beat 4 of the count-in, then “circle” lands on beat 1.',
    'Use the written hymn melody as a short solo introduction. Under singing, keep the open-chord reduction steady and leave its phrase-end rests alone.',
    [
      'cir-cle be un-', 'bro-ken; By and', 'by—, by and', 'by?; then pickup: In a',
      'bet-ter home a-', 'wait-ing; In the', 'sky—, in the', 'sky— (rest, then loop pickup)',
    ], 'verified', { label: 'Timeless Truths public-domain Habershon/Gabriel SATB score, refrain transposed A-flat to G', url: 'https://library.timelesstruths.org/library/music/W/Will_the_Circle_Be_Unbroken/Will_the_Circle_Be_Unbroken.pdf', checked: '2026-08-16' }, {
      pickup: { beat: 3, text: 'Will the… (pickup)' },
      reduction: 'Campfire preserves the edition’s soprano melody and phrase clock while reducing its four-part harmony to open G and C. No later Carter-family lyric or tune is mixed into this score.',
    }),
  'what-a-friend': a(80, 4, 'sparse', 'Complete sixteen-bar first verse',
    [
      at([0, 'G'], [2, 'G7']), 'C', 'G', 'D',
      at([0, 'G'], [2, 'G7']), 'C', at([0, 'G'], [2, 'D7']), at([0, 'G'], [1, 'C'], [2, 'G']),
      'D', 'G', at([0, 'C'], [2, 'G']), 'D',
      at([0, 'G'], [2, 'G7']), 'C', at([0, 'G'], [2, 'D7']), at([0, 'G'], [1, 'C'], [2, 'G']),
    ],
    'Use one quiet chord on beats 1 and 3. Let each long “Jesus,” “bear,” “carry,” and “prayer” finish before preparing the next change.',
    'Play the complete CONVERSE melody as an intro or between verses. While anyone sings, answer only in the one-beat rests after the held phrase endings.',
    [
      ['What a', 'friend we have in'], 'Jesus (hold)', 'All our sins and griefs to', 'bear (hold)',
      ['What a', 'privilege to'], 'carry (hold)', ['Ev’ry', 'thing to God in'], ['prayer', '(held prayer)', '(let G ring)'],
      'Oh what peace we often', 'forfeit (hold)', ['Oh what needless', 'pain we'], 'bear (hold)',
      ['All be-', 'cause we do not'], 'carry (hold)', ['Ev’ry', 'thing to God in'], ['prayer', '(held prayer)', '(let G ring)'],
    ], 'verified', { label: 'Lyric-bearing CONVERSE ABC melody and harmony, transposed D to G', url: 'https://abcnotation.com/tunePage?a=trillian.mit.edu%2F~jc%2Fmusic%2Fabc%2Fmirror%2Fgulfweb.net%3A34043%2F~rlwalker%2Fabc%2Fwhatafriend%2F0000', checked: '2026-08-16' }, {
      reduction: 'The source’s A-major secondary-dominant color and C-sharp diminished passing chord are omitted for an open-shape first version. Every melody onset, phrase rest, and remaining chord-change beat stays on the source clock.',
    }),
  'home-on-the-range': a(76, 3, 'waltz', 'Complete CC0 verse and chorus · thirty-two 3/4 bars',
    [
      'G', 'G', 'C', 'C', 'G', 'A7', 'D7', 'D7',
      'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'D7',
      'G', 'D7', 'G', 'G', 'G', 'A7', 'D7', 'D7',
      'G', 'G', 'C', 'C', 'G', 'D7', 'G', 'G',
    ],
    'Make beat 1 dependable and let the tied “play,” “day,” “home,” and “range” notes float across barlines without adding extra strums.',
    'The complete chorus melody makes the clearest introduction. Under a singer, return to bass-brush-brush and leave the two-bar held endings alone.',
    [
      'Oh, give me a', 'home where the', 'buf-fa-lo', 'roam; And the',
      'deer and the', 'an-te-lope', 'play—', '—; then pickup: Where',
      'sel-dom is', 'heard a dis-', 'cour-ag-ing', 'word; And the',
      'skies are not', 'clou-dy all', 'day—', '—',
      'Home—', 'home on the', 'range—', '—; pickup: Where the',
      'deer and the', 'an-te-lope', 'play—', '—; then pickup: And',
      'sel-dom is', 'heard a dis-', 'cour-ag-ing', 'word; And the',
      'skies are not', 'clou-dy all', 'day—', '—; then pickup: Oh',
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology complete Home on the Range verse and chorus in G',
      url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4492',
      checked: '2026-08-16',
    }, {
      pickup: { beat: 2, text: 'Oh… (one-beat pickup)' },
      reduction: 'Campfire keeps the source’s traditional harmonic functions in four open shapes: printed G7 is folded into G, Cm into C, and D/D7sus into D7. A7 remains as the country-colored approach to D7; every melody event and retained change stays on the source clock.',
    }),
  'amazing-grace': a(76, 3, 'waltz', 'Complete first verse',
    ['G', 'G7', 'C', 'G', 'G', 'G', 'D', 'D', 'G', 'G7', 'C', 'G', 'G', at([0, 'G'], [2, 'D7']), 'G', 'G'],
    'Let the singer lead phrase length while you protect the underlying 1-2-3 pulse.',
    'Play the opening melody as an intro. During the verse, answer only after “sound,” “me,” “found,” and “see.”',
    ['Amazing', 'grace, how', 'sweet the', 'sound', 'That saved a', 'wretch like', 'me', 'breathe',
      'I once was', 'lost, but', 'now am', 'found', 'Was blind, but', ['now', 'I'], 'see', 'hold G'],
    'verified', { label: 'TraditionalSongs G-major 3/4 guitar score', url: 'https://www.traditionalsongs.org/amazing-grace.html', checked: '2026-08-10' }),
  'scarborough-fair': a(90, 3, 'fingerWaltz', 'Complete CC0 verse · eighteen 3/4 bars',
    [
      'Am', 'Am', 'G', 'Am', 'C', 'Am', at([0, 'C'], [1, 'D']), 'Am',
      'Am', 'Am', 'C', at([0, 'C'], [2, 'Am']), 'G', 'Am', at([0, 'G'], [2, 'Am']),
      at([0, 'G'], [1, 'Am'], [2, 'G']), 'Am', 'Am',
    ],
    'Keep beat 1 low and separate from the two upper notes. The modal chord changes in bars 7, 12, 15, and 16 are part of the tune, so practice those bars alone before looping the verse.',
    'Play the complete vocal melody by itself. Under singing, the finger-waltz is already the lead texture; let the two-bar final “mine” ring instead of adding a turnaround lick.',
    [
      'Are you', 'going to', 'Scar-bor-ough', 'Fair—',
      'rest; Par-sley', 'sage, rose-', ['mar-', 'y and'], 'thyme—',
      'hold thyme; Re-', 'mem-ber', 'me to', ['one who', 'lives'],
      'there—', 'she once', ['was', 'a'], ['true', 'love', 'of'],
      'mine—', 'hold mine; loop',
    ], 'verified', {
      label: 'CC0 Public Domain Song Anthology complete Scarborough Fair verse, transposed D minor to A minor',
      url: 'https://dataverse.lib.virginia.edu/api/access/datafile/4631',
      checked: '2026-08-16',
    }, {
      reduction: 'Campfire transposes the source Dm/C/F/G colors to open Am/G/C/D. The single transposed Bm passing beat in bar 12 is omitted by holding C until the move to Am on beat 3; all other source chord changes, rests, ties, and the full eighteen-bar form remain literal.',
    }),
};

export function arrangementFor(song) {
  return ARRANGEMENTS[song.id];
}

export function barChords(bar) {
  if (bar?.changes) return bar.changes.map(({ chord }) => chord);
  return Array.isArray(bar) ? bar : [bar];
}

export function barChangeBeats(bar, meter) {
  if (bar?.changes) return bar.changes.map(({ beat }) => beat);
  return barChords(bar).map((_, index, chords) => index * (meter / chords.length));
}

export function arrangementChordSequence(song) {
  const arrangement = arrangementFor(song);
  return arrangement ? arrangement.bars.flatMap(barChords) : [];
}
