// Beginner accompaniment arrangements for every public-domain song in Campfire.
// These are deliberately playable reductions, not transcriptions of one recording.
// Repeated chords are meaningful bars; arrays divide a bar evenly, while { changes } pins chords to exact beats.

export const GROOVES = {
  waltz: {
    label: 'Country waltz: bass, brush, brush',
    events: [
      { beat: 0, kind: 'bass', gain: .22 },
      { beat: 1, kind: 'brush', gain: .10 },
      { beat: 2, kind: 'brush', gain: .10 },
    ],
  },
  straight: {
    label: 'Beginner pulse: four relaxed down-strums',
    events: [0, 1, 2, 3].map((beat) => ({ beat, kind: 'full', gain: beat === 0 ? .19 : .11 })),
  },
  boomChuck: {
    label: 'Country boom-chuck: bass on 1 and 3, chord on 2 and 4',
    events: [
      { beat: 0, kind: 'bass', gain: .23 }, { beat: 1, kind: 'brush', gain: .12 },
      { beat: 2, kind: 'bass', gain: .18 }, { beat: 3, kind: 'brush', gain: .12 },
    ],
  },
  folk: {
    label: 'Folk down-up: D, D-U, U-D-U',
    events: [
      { beat: 0, kind: 'full', gain: .18 }, { beat: 1, kind: 'full', gain: .12 },
      { beat: 1.5, kind: 'up', gain: .08 }, { beat: 2.5, kind: 'up', gain: .08 },
      { beat: 3, kind: 'full', gain: .12 }, { beat: 3.5, kind: 'up', gain: .08 },
    ],
  },
  actionClap: {
    label: 'Action-song pulse: steady phrases, then open beats for claps',
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
    events: [{ beat: 0, kind: 'full', gain: .18 }, { beat: 2, kind: 'brush', gain: .08 }],
  },
  lullabyTwo: {
    label: 'Gentle 2/4: warm chord on 1, quiet brush on 2',
    events: [
      { beat: 0, kind: 'full', gain: .16 },
      { beat: 1, kind: 'brush', gain: .06 },
    ],
  },
  gospel: {
    label: 'Gospel sway: bass, brush, bass, brush',
    events: [
      { beat: 0, kind: 'bass', gain: .22 }, { beat: 1, kind: 'brush', gain: .10 },
      { beat: 2, kind: 'bass', gain: .17 }, { beat: 3, kind: 'up', gain: .09 },
    ],
  },
  sixEight: {
    label: 'Rolling 6/8: pick through the chord, six even eighth-notes',
    events: [0, 1, 2, 3, 4, 5].map((beat, index) => ({ beat, kind: 'pick', string: index, gain: index === 0 || index === 3 ? .18 : .10 })),
  },
  fingerWaltz: {
    label: 'Fingerpicked 3/4: bass, high, middle',
    events: [
      { beat: 0, kind: 'bass', gain: .19 },
      { beat: 1, kind: 'pick', string: 5, gain: .10 },
      { beat: 2, kind: 'pick', string: 3, gain: .10 },
    ],
  },
};

const a = (bpm, meter, groove, section, bars, dynamics, lead, cues = null, timing = 'practice', verification = null) => ({
  bpm, meter, groove, section, bars, dynamics, lead, timing,
  ...(cues ? { cues } : {}), ...(verification ? { verification } : {}),
});
const at = (...changes) => ({ changes: changes.map(([beat, chord]) => ({ beat, chord })) });

export const ARRANGEMENTS = {
  'down-in-the-valley': a(72, 3, 'waltz', 'Verse',
    ['G', 'D7', 'D7', 'G', 'G', 'D7', 'D7', 'G'],
    'Keep beat 1 firm and beats 2–3 soft; never rush the singer at the end of a line.',
    'Between sung lines, answer with three notes from the G major scale; stop as soon as the next lyric begins.',
    [
      'Down in the valley, the', 'valley so low',
      'Hang your head over, hear the', 'wind blow',
      'Hear the wind blow, dear', 'hear the wind blow',
      'Hang your head over, hear the', 'wind blow',
    ], 'verified', { label: 'Songdrops G / D7 chart', url: 'https://www.songdrops.com/classic-childrens-songs-lyrics-guitar-chords/down-in-the-valley-guitar-chords-and-lyrics-to-the-old-classic-children%E2%80%99s-song.html', checked: '2026-08-10' }),
  clementine: a(90, 3, 'waltz', 'Verse / chorus',
    ['G', 'G', 'G', 'D7', 'D7', 'G', 'D7', 'G'],
    'Give it a light bounce, with a stronger first beat and short brushes on 2 and 3.',
    'The title melody begins on repeated notes. Find it on the B string and play only that short answer between phrases.',
    [
      'In a cavern, in a', 'canyon',
      'Excavating for a', 'mine',
      'Dwelt a miner, forty-', 'niner',
      'And his daughter, Clemen', 'tine',
    ], 'verified', { label: 'TraditionalSongs G / D7 chart', url: 'https://traditionalsongs.org/oh-my-darling-clementine.html', checked: '2026-08-10' }),
  'shady-grove': a(92, 4, 'boomChuck', 'Chorus',
    ['Em', 'D', 'Em', 'Em', 'Em', 'D', 'D', 'Em'],
    'Keep the low pulse dry and even. Old-time drive comes from rhythm, not a busy strum.',
    'Use the open high-e and 2nd-fret high-e as a tiny Em/D fill after “little love”; leave the vocal line alone.',
    [
      'Shady Grove, my', 'little love',
      'Shady Grove, my', 'darling',
      'Shady Grove, my', 'little love',
      "I'm bound to go", 'away',
    ], 'verified', { label: 'Heartwood traditional modal chart', url: 'https://www.heartwoodguitar.com/chords/garcia-jerry-and-david-grisman-shady-grove/', checked: '2026-08-10' }),
  'row-your-boat': a(92, 4, 'sparse', 'One-chord verse',
    ['G', 'G', 'G', 'G'],
    'Stay quiet enough to hear both parts if you sing it as a round.',
    'Pick the familiar melody one note at a time on the top two strings; when voices enter as a round, return to simple G backing.',
    [
      'Row, row, row your boat',
      'Gently down the stream',
      'Merrily, merrily, merrily, merrily',
      'Life is but a dream',
    ], 'verified', { label: 'Public-domain 1917 sheet music', url: 'https://commons.wikimedia.org/wiki/File%3A28_Row_Row_Row_Your_Boat.png', checked: '2026-08-10' }),
  'hush-little-baby': a(70, 2, 'lullabyTwo', 'Verse',
    ['G', 'D7', 'D7', 'G', 'G', 'D7', 'D7', 'G'],
    'Let chords ring and make every change quieter than you think.',
    'A lead part should be a soft two- or three-note echo after each line, never continuous picking under the singer.',
    [
      "Hush, little baby, don't", 'say a word',
      "Papa's gonna buy you a", 'mockingbird',
      "And if that mockingbird won't", 'sing',
      "Papa's gonna buy you a", 'diamond ring',
    ], 'verified', { label: 'Singing Bell G / D7 guitar sheet', url: 'https://www.singing-bell.com/wp-content/uploads/2022/01/Hush-Little-Baby-Guitar-Chords-Sheet-Music_Singing-Bell.pdf', checked: '2026-08-10' }),
  'twinkle-twinkle': a(92, 4, 'straight', 'Complete short verse (ABBA)',
    ['G', ['C', 'G'], ['C', 'G'], ['D', 'G'], ['G', 'C'], ['G', 'D'], ['G', 'C'], ['G', 'D'], 'G', ['C', 'G'], ['C', 'G'], ['D', 'G']],
    'Use plain quarter-note downs first; the melody supplies the interest.',
    'Learn the melody before fills: begin on open G, repeat it, then move upward. Play melody alone or chords under a singer—not both at first.',
    [
      'Twinkle, twinkle,', ['little', 'star'],
      ['How I', 'wonder'], ['what you', 'are'],
      ['Up', 'above the'], ['world so', 'high'],
      ['Like a', 'diamond'], ['in the', 'sky'],
      'Twinkle, twinkle,', ['little', 'star'],
      ['How I', 'wonder'], ['what you', 'are'],
    ], 'verified', { label: 'TraditionalSongs G-major short-version chart', url: 'https://www.traditionalsongs.org/twinkle-twinkle-little-star.html', checked: '2026-08-10' }),
  'if-youre-happy': a(104, 4, 'actionClap', 'Complete eight-bar action verse',
    ['G', 'D', 'D', 'G', 'C', 'G', 'D', 'G'],
    'Keep four steady beats through sung phrases. In each clap bar, strum beats 1 and 2, then lift your picking hand away for beats 3 and 4.',
    'Do not add a fill over the claps. If someone else sings, your best lead contribution is the rhythmic stop.',
    [
      "If you're happy and you know it, clap your",
      "hands (clap clap) If you're",
      'happy and you know it, clap your',
      "hands (clap clap) If you're",
      'happy and you know it, then your',
      "face will surely show it; if you're",
      'happy and you know it, clap your',
      'hands (clap clap)',
    ], 'verified', { label: 'Make Music Easy three-chord action-song score', url: 'https://www.makemusiceasy.com/wp-content/uploads/2019/05/If-Youre-Happy-and-You-Know-It-Easy-Chords.pdf', checked: '2026-08-10' }),
  'old-macdonald': a(108, 4, 'boomChuck', 'Complete eight-bar animal verse',
    [
      at([0, 'G'], [2, 'C'], [3, 'G']), at([0, 'D'], [2, 'G']),
      at([0, 'G'], [2, 'C'], [3, 'G']), at([0, 'D'], [2, 'G']),
      'G', 'G',
      at([0, 'G'], [2, 'C'], [3, 'G']), at([0, 'D'], [2, 'G']),
    ],
    'Keep boom-chuck steady and leave the animal noises uncluttered.',
    'Echo the E-I-E-I-O melody on the top strings after the singer; that recognizable answer is enough lead.',
    [
      ['Old MacDonald', 'had a', 'farm'], ['E-I-E-I-', 'O; and'],
      ['on his farm he', 'had a', 'cow'], ['E-I-E-I-', 'O; with a'],
      'moo-moo here and a moo-moo there',
      'Here a moo, there a moo, everywhere a moo-moo',
      ['Old MacDonald', 'had a', 'farm'], ['E-I-E-I-', 'O'],
    ], 'verified', { label: 'Singing Bell G-major guitar score', url: 'https://www.singing-bell.com/wp-content/uploads/2021/12/Old-MacDonald-Had-a-Farm-Guitar-Chords-Sheet-Music_Singing-Bell.pdf', checked: '2026-08-10' }),
  kumbaya: a(68, 4, 'sparse', 'Verse loop',
    ['G', ['C', 'G'], 'G', ['C', 'D'], 'G', ['C', 'G'], ['C', 'G'], ['D', 'G']],
    'One full chord can last a whole phrase. Follow the breath, not your urge to fill space.',
    'Pick a quiet descending G-major answer after “kumbaya”; avoid playing over the held word “Lord.”',
    [
      'Kumbaya my', ['Lord, kumba', 'ya'],
      'Kumbaya my', ['Lord, kumba', 'ya'],
      'Kumbaya my', ['Lord, kumba', 'ya'],
      ['Oh', 'Lord, kumba'], ['ya', '(let it ring)'],
    ], 'verified', { label: 'RiffSpot traditional chord-and-lyric chart', url: 'https://riffspot.com/music/chords-and-lyrics/kumbaya/120/', checked: '2026-08-10' }),
  'whole-world': a(96, 4, 'gospel', 'Verse loop',
    ['G', 'G', 'D7', 'D7', 'G', 'G', 'D7', 'G'],
    'Lean slightly into beats 2 and 4 for a congregational gospel sway.',
    'Answer “in His hands” with a tiny G-major lick, then get out of the way before the next line.',
    [
      "He's got the whole world", 'in His hands',
      "He's got the whole world", 'in His hands',
      "He's got the whole world", 'in His hands',
      "He's got the whole world", 'in His hands',
    ], 'verified', { label: 'Primeau two-chord beginner chart', url: 'https://www.primeauguitar.com/hes-got-the-whole-world-in-his-hands-guitar-chord-chart/', checked: '2026-08-10' }),
  'she-ll-be-comin': a(116, 4, 'boomChuck', 'Complete eight-bar verse',
    ['G', 'G', 'D7', 'D7', 'G', 'C', at([0, 'G'], [3, 'D7']), 'G'],
    'Short bass notes and crisp off-beat chords create the train-like country drive.',
    'A two-note walk from D7 back to G is the useful beginner lead move; place it only at the turnaround.',
    [
      "She'll be comin' 'round the",
      "mountain when she comes; she'll be",
      "comin' 'round the",
      "mountain when she comes; she'll be",
      "comin' 'round the mountain; she'll be",
      "comin' 'round the mountain; she'll be",
      ["comin' 'round the mountain", 'when she'],
      'comes',
    ], 'verified', { label: 'Singing Bell three-chord guitar score, transposed D to G', url: 'https://www.singing-bell.com/wp-content/uploads/2022/03/Shell-Be-Coming-Round-the-Mountain-Guitar-Chords-Sheet-Music_Singing-Bell.pdf', checked: '2026-08-10' }),
  'when-the-saints': a(120, 4, 'gospel', 'Verse loop',
    ['G', 'G', 'G', 'D7', 'D7', 'G', 'C', 'G', ['D7', 'G']],
    'Keep a buoyant backbeat and build volume only on the last line.',
    'The opening melody is the hook. Play it once as an intro, then switch to chord backing when singing starts.'),
  'oh-susanna': a(112, 4, 'boomChuck', 'Verse / chorus loop',
    ['G', 'G', 'D7', 'G', 'G', 'G', 'D7', 'G', 'C', 'G', 'D7', 'G'],
    'Use an alternating-bass feel and keep chord brushes short and bouncy.',
    'Play the first “Oh! Susanna” melody as a two-bar intro, then use a G-to-D7 bass walk only between vocal lines.'),
  'red-river-valley': a(84, 4, 'boomChuck', 'Verse loop',
    ['G', 'C', 'G', 'G', 'G', 'D7', 'D7', 'D7', 'G', 'C', 'G', ['D7', 'G']],
    'Relax behind the beat; long vocal phrases need an unhurried country pulse.',
    'Use single-note fills at the ends of lines, aiming for chord tones. Silence during the lyric is the professional choice.'),
  'swing-low': a(72, 4, 'gospel', 'Refrain loop',
    ['G', 'C', 'G', 'G', 'G', 'D7', 'D7', 'D7', 'G', 'C', 'G', ['D7', 'G']],
    'Let the first beat breathe and make the backbeat brushes warm rather than loud.',
    'Echo the descending shape of “Swing low” after the phrase; do not double every sung note.'),
  'simple-gifts': a(108, 4, 'folk', 'Verse loop',
    ['G', 'G', 'D', 'D', 'G', 'C', 'G', 'G', 'G', 'D', 'G', ['C', 'G']],
    'Keep the wrist loose and the up-strums light so the dance pulse stays buoyant.',
    'The melody is the identity of this tune. Play its opening phrase as an intro, then return to the folk strum under vocals.'),
  'streets-of-laredo': a(66, 3, 'waltz', 'Verse loop',
    ['G', 'C', 'G', 'G', 'G', 'D7', 'D7', 'D7', 'G', 'C', 'G', ['D7', 'G']],
    'Keep beat 1 low and heavy, then brush 2 and 3 almost like an exhale.',
    'Use a slow descending response after each line. The story matters more than displaying technique.'),
  'will-the-circle': a(104, 4, 'gospel', 'Chorus loop',
    ['G', 'G', 'C', 'G', 'G', 'G', 'D7', 'D7', 'G', 'G', 'C', 'G', ['D7', 'G']],
    'Build the chorus with firm bass notes and communal backbeat brushes.',
    'A G-major walk-up into C and a D7-to-G turnaround are the two classic fills; use one, not both, each time.'),
  'what-a-friend': a(80, 4, 'sparse', 'Verse phrase loop',
    ['G', 'C', 'G', 'G', 'G', 'D', 'D7', 'D7', 'G', 'C', 'G', ['D7', 'G']],
    'Support the hymn melody with long chords and restrained motion.',
    'Play the hymn melody as a solo intro or between verses. Under singing, use only short chord-tone answers at breaths.'),
  'home-on-the-range': a(76, 3, 'waltz', 'Verse loop',
    ['G', 'C', 'G', 'D7', 'G', 'D7', 'G', 'G', 'G', 'C', 'G', 'D7', 'G', 'D7', 'G', 'G'],
    'Make beat 1 dependable and allow the singer to stretch phrase endings without losing the three-count.',
    'The title phrase makes a natural intro. Play it once, then return to bass-brush-brush accompaniment.'),
  'amazing-grace': a(68, 3, 'waltz', 'Verse loop',
    ['G', 'G7', 'C', 'G', 'G', 'Em', 'D7', 'D7', 'G', 'G7', 'C', 'G', 'Em', 'G', ['D7', 'G']],
    'Let the singer lead phrase length while you protect the underlying 1-2-3 pulse.',
    'Play the opening melody as an intro. During the verse, answer only after “sound,” “me,” “found,” and “see.”'),
  'house-of-the-rising-sun': a(78, 6, 'sixEight', 'Classic arpeggio loop',
    ['Am', 'C', 'D', 'Fmaj7', 'Am', 'C', 'E', 'E', 'Am', 'C', 'D', 'Fmaj7', 'Am', 'E', 'Am', 'E'],
    'Keep all six eighth-notes even and let each chord ring into the next; the arpeggio is the signature backing part.',
    'The arpeggio already acts like a lead hook. Do not add fills under the vocal until that picking pattern is automatic.'),
  'scarborough-fair': a(72, 3, 'fingerWaltz', 'Modal verse loop',
    ['Em', 'D', 'Em', 'Em', 'Em', 'G', 'D', 'Em', 'Em', 'Am', 'Em', 'Em', 'Em', 'D', 'Em', 'Em'],
    'Keep the bass separate from the upper notes and avoid a bright pop-style strum.',
    'Use the vocal melody as the lead. Between lines, let open Em notes ring instead of adding a blues lick.'),
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
