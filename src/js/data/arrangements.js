// Beginner accompaniment arrangements for every public-domain song in Campfire.
// These are deliberately playable reductions, not transcriptions of one recording.
// Repeated chords are meaningful bars; arrays mean evenly split chords within one bar.

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
  sparse: {
    label: 'Vocal space: full chord on 1, light brush on 3',
    events: [{ beat: 0, kind: 'full', gain: .18 }, { beat: 2, kind: 'brush', gain: .08 }],
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

const a = (bpm, meter, groove, section, bars, dynamics, lead, cues = null, timing = 'practice') => ({
  bpm, meter, groove, section, bars, dynamics, lead, timing, ...(cues ? { cues } : {}),
});

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
    ], 'verified'),
  clementine: a(104, 3, 'waltz', 'Verse / chorus harmonic loop',
    ['G', 'G', 'G', 'D7', 'D7', 'D7', 'D7', 'G'],
    'Give it a light bounce, with a stronger first beat and short brushes on 2 and 3.',
    'The title melody begins on repeated notes. Find it on the B string and play only that short answer between phrases.'),
  'shady-grove': a(92, 4, 'boomChuck', 'Chorus',
    ['Em', 'D', 'Em', 'Em', 'Em', 'D', 'D', 'Em'],
    'Keep the low pulse dry and even. Old-time drive comes from rhythm, not a busy strum.',
    'Use the open high-e and 2nd-fret high-e as a tiny Em/D fill after “little love”; leave the vocal line alone.',
    [
      'Shady Grove, my', 'little love',
      'Shady Grove, my', 'darling',
      'Shady Grove, my', 'little love',
      "I'm bound to go", 'away',
    ], 'verified'),
  'row-your-boat': a(92, 4, 'sparse', 'One-chord verse',
    ['G', 'G', 'G', 'G'],
    'Stay quiet enough to hear both parts if you sing it as a round.',
    'Pick the familiar melody one note at a time on the top two strings; when voices enter as a round, return to simple G backing.',
    [
      'Row, row, row your boat',
      'Gently down the stream',
      'Merrily, merrily, merrily, merrily',
      'Life is but a dream',
    ], 'verified'),
  'hush-little-baby': a(70, 4, 'sparse', 'Lullaby verse loop',
    ['G', 'G', 'D', 'D', 'D', 'D', 'G', 'G'],
    'Let chords ring and make every change quieter than you think.',
    'A lead part should be a soft two- or three-note echo after each line, never continuous picking under the singer.'),
  'twinkle-twinkle': a(88, 4, 'straight', 'Verse harmonic loop',
    ['G', 'G', 'C', 'G', 'D', 'G', 'D', 'G'],
    'Use plain quarter-note downs first; the melody supplies the interest.',
    'Learn the melody before fills: begin on open G, repeat it, then move upward. Play melody alone or chords under a singer—not both at first.'),
  'if-youre-happy': a(112, 4, 'folk', 'Action verse loop',
    ['G', 'G', 'D', 'D', 'D', 'D', 'G', 'G', 'C', 'G', 'D', 'G'],
    'Stop strumming for the two claps; that silence is part of the arrangement.',
    'Use a short G-major walk-up only in the space before the final line; the claps are the main hook.'),
  'old-macdonald': a(108, 4, 'boomChuck', 'Verse loop',
    ['G', 'G', 'D', 'G', 'G', 'G', 'D', 'G', 'C', 'G', 'D', 'G'],
    'Keep boom-chuck steady and leave the animal noises uncluttered.',
    'Echo the E-I-E-I-O melody on the top strings after the singer; that recognizable answer is enough lead.'),
  kumbaya: a(68, 4, 'sparse', 'Verse loop',
    ['G', ['C', 'G'], 'G', ['C', 'D'], 'G', ['C', 'G'], ['C', 'G'], ['D', 'G']],
    'One full chord can last a whole phrase. Follow the breath, not your urge to fill space.',
    'Pick a quiet descending G-major answer after “kumbaya”; avoid playing over the held word “Lord.”',
    [
      'Kumbaya my', ['Lord, kumba', 'ya'],
      'Kumbaya my', ['Lord, kumba', 'ya'],
      'Kumbaya my', ['Lord, kumba', 'ya'],
      ['Oh', 'Lord, kumba'], ['ya', '(let it ring)'],
    ], 'verified'),
  'whole-world': a(96, 4, 'gospel', 'Verse loop',
    ['G', 'G', 'D7', 'D7', 'G', 'G', 'D7', 'G'],
    'Lean slightly into beats 2 and 4 for a congregational gospel sway.',
    'Answer “in His hands” with a tiny G-major lick, then get out of the way before the next line.',
    [
      "He's got the whole world", 'in His hands',
      "He's got the whole world", 'in His hands',
      "He's got the whole world", 'in His hands',
      "He's got the whole world", 'in His hands',
    ], 'verified'),
  'she-ll-be-comin': a(116, 4, 'boomChuck', 'Verse loop',
    ['G', 'G', 'G', 'D7', 'D7', 'G', 'C', 'G', ['D7', 'G']],
    'Short bass notes and crisp off-beat chords create the train-like country drive.',
    'A two-note walk from D7 back to G is the useful beginner lead move; place it only at the turnaround.'),
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
  return Array.isArray(bar) ? bar : [bar];
}

export function arrangementChordSequence(song) {
  const arrangement = arrangementFor(song);
  return arrangement ? arrangement.bars.flatMap(barChords) : [];
}
