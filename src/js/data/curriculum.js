// The learning path: song-first, minimal theory, skills stacked in the research-backed order
// (understand the instrument -> first chords -> a strum -> a real song). Each unit ends on
// a PLAYABLE public-domain song so progress is always audible.

export const CURRICULUM = [
  {
    id: 'u0',
    title: 'Before you strum',
    blurb: 'Ten minutes of setup that saves weeks of frustration.',
    lessons: [
      { id: 'l0-1', title: 'Meet your guitar', min: 6,
        objective: 'Know the parts and sit so your hands are free to move.',
        steps: [
          'Name the parts: headstock, tuners, nut, neck, frets, soundhole, bridge.',
          'Sit up straight, guitar on your right leg, neck angled slightly up.',
          'Left-hand thumb rests on the BACK of the neck, fingers curled over the top.',
          'Strum near the soundhole with the fleshy side of your thumb or a light pick.',
        ] },
      { id: 'l0-2', title: 'Tune up', min: 5, tool: '#/tuner',
        objective: 'Get all six strings to E A D G B E. An out-of-tune guitar makes everything sound wrong.',
        steps: [
          'Open the Tuner and allow microphone access.',
          'Play one string at a time, from the thick low E to the thin high E.',
          'Turn the tuning peg until the needle sits in the green center.',
          'Re-check — tuning one string can nudge the others.',
        ] },
      { id: 'l0-3', title: 'Read a chord box', min: 4, tool: '#/chords',
        objective: 'Decode the little grids so any chord chart makes sense.',
        steps: [
          'Vertical lines = strings (low E on the left). Horizontal lines = frets.',
          'Dots = where to press. Numbers = which finger (1 index … 4 pinky).',
          'O above a string = play it open. X = don’t play that string.',
          'Open the Chords page and match a couple of boxes to your fretboard.',
        ] },
    ],
  },
  {
    id: 'u1',
    title: 'Your first two chords',
    blurb: 'By the end of this unit you can change between two real chords in time.',
    lessons: [
      { id: 'l1-1', title: 'The Em chord', min: 8, chords: ['Em'],
        objective: 'Fret a clean-ringing Em — your easiest first shape.',
        steps: [
          'Place fingers 2 and 3 on the 2nd fret of the A and D strings.',
          'Strum all six strings slowly. Every note should ring clearly.',
          'Any buzz? Press just behind the fret and curl your fingertips.',
        ] },
      { id: 'l1-2', title: 'The G chord', min: 10, chords: ['G'],
        objective: 'Fret a full, ringing G — the home base of country & folk.',
        steps: [
          'Finger 2 on 3rd fret low-E, finger 1 on 2nd fret A, finger 3 on 3rd fret high-e.',
          'Strum all six. Check each string sounds; adjust finger angle for buzzes.',
          'Practice lifting off and re-forming the whole shape at once.',
        ] },
      { id: 'l1-3', title: 'One-minute changes: Em ↔ G', min: 8, chords: ['Em', 'G'], tool: '#/metronome',
        objective: 'Switch cleanly between two chords — the #1 skill that unlocks songs.',
        goal: 'Count how many clean Em↔G changes you make in 60 seconds. Beat it tomorrow.',
        steps: [
          'Form Em, strum once. Form G, strum once. Repeat slowly.',
          'Move ALL fingers together, not one at a time.',
          'Set the Metronome to 50 BPM and change chord every 4 clicks.',
        ] },
      { id: 'l1-4', title: 'Your first strum', min: 8, tool: '#/metronome',
        objective: 'Keep steady time with simple down-strums.',
        steps: [
          'Hold G. Strum DOWN on every metronome click at 70 BPM.',
          'Keep your strumming hand moving like a metronome even between hits.',
          'Once steady, change to Em every 4 beats without stopping the hand.',
        ] },
    ],
  },
  {
    id: 'u2',
    title: 'Play your first song',
    blurb: 'Add C and D and you can play hundreds of songs. Starting today.',
    lessons: [
      { id: 'l2-1', title: 'Add C and D', min: 12, chords: ['C', 'D'],
        objective: 'Learn the last two chords of the beginner core.',
        steps: [
          'C: finger 3 / 2 / 1 on the A, D, and B strings. Don’t strum the low E.',
          'D: fingers on G, B, and high-e — strum only the top four strings.',
          'Play each cleanly, then practice G→C and G→D changes.',
        ] },
      { id: 'l2-2', title: 'The G–C–D family (1–4–5)', min: 6,
        objective: 'Understand why these three chords belong together.',
        steps: [
          'In the key of G, the 1–4–5 chords are G, C, and D.',
          'Thousands of country/folk/church songs use only these three.',
          'Play G (1) → C (4) → D (5) → G, four strums each.',
        ] },
      { id: 'l2-3', title: 'SONG: Down in the Valley', min: 10, songId: 'down-in-the-valley',
        objective: 'Play your first full song with just G and D7.',
        goal: 'Play the whole verse start-to-finish without stopping.',
        steps: [
          'Open the song. It’s a slow 3/4 waltz — one down-strum per beat.',
          'Change to D7 only where the chord label appears above the lyric.',
          'Sing or hum along — it locks in your timing.',
        ] },
      { id: 'l2-4', title: 'SONG: He’s Got the Whole World', min: 10, songId: 'whole-world',
        objective: 'A three-chord (G, C, D7) song at an easy pace.',
        steps: [
          'Strum down on each beat, 4 beats per bar.',
          'Watch for the C and D7 changes and give yourself a beat to move.',
        ] },
    ],
  },
  {
    id: 'u3',
    title: 'Strumming that grooves',
    blurb: 'A song sounds “right” when the strum has a groove. Here’s the all-purpose one.',
    lessons: [
      { id: 'l3-1', title: 'The down-up strum', min: 8, tool: '#/metronome',
        objective: 'Add up-strums to double your rhythm.',
        steps: [
          'On a held G, strum DOWN-UP, DOWN-UP evenly with the metronome.',
          'Let the up-strum brush only the top few strings.',
          'Keep the hand swinging steadily like a pendulum.',
        ] },
      { id: 'l3-2', title: 'The all-purpose pattern: D–DU–UDU', min: 10, tool: '#/metronome',
        objective: 'Learn the one strum pattern that fits most songs.',
        goal: 'Loop D–DU–UDU on a G chord for 2 minutes without a hiccup.',
        steps: [
          'Count “1, 2-and, -and-4-and”. Down on 1; down-up on 2; up-down-up on 3-4.',
          'Start at 60 BPM, keep the missing strums as “air” strums.',
          'Once smooth, change chords at the start of each bar.',
        ] },
      { id: 'l3-3', title: 'SONG: Amazing Grace', min: 12, songId: 'amazing-grace',
        objective: 'Apply a waltz strum to the world’s best-known hymn.',
        steps: [
          'It’s in 3/4 — strum a gentle DOWN, down, down per bar.',
          'Take the G→G7→C move slowly; G7 just lifts one finger off G.',
        ] },
      { id: 'l3-4', title: 'SONG: Oh! Susanna', min: 10, songId: 'oh-susanna',
        objective: 'A bouncy 4/4 with the D–DU–UDU groove.',
        steps: [
          'Use the all-purpose strum through the verse and chorus.',
          'Keep it light and bouncy — this one is meant to be fun.',
        ] },
    ],
  },
  {
    id: 'u4',
    title: 'Fuller sound & minor colors',
    blurb: 'Minor chords add feeling; more shapes open up more songs.',
    lessons: [
      { id: 'l4-1', title: 'Am and E', min: 10, chords: ['Am', 'E'],
        objective: 'Add two more essential open chords.',
        steps: [
          'Am is the same finger shape as E, moved down one string.',
          'E uses all six strings — big and bright.',
          'Practice Am→E and C→Am changes.',
        ] },
      { id: 'l4-2', title: 'A major & switching families', min: 8, chords: ['A'],
        objective: 'Learn A and practice moving between chord neighborhoods.',
        steps: [
          'A: three fingers squeezed into the 2nd fret (D, G, B strings).',
          'Practice D→A and E→A — the backbone of countless country tunes.',
        ] },
      { id: 'l4-3', title: 'SONG: Home on the Range', min: 12, songId: 'home-on-the-range',
        objective: 'A flowing waltz that stretches your G–C–D changes.',
        steps: [
          'Long phrases — keep the 3/4 strum steady even while you think ahead.',
          'Aim for smooth transitions, not speed.',
        ] },
    ],
  },
  {
    id: 'u5',
    title: 'Capo & the Nashville number system',
    blurb: 'Play in ANY key with the same easy shapes — the secret weapon for worship & jams.',
    lessons: [
      { id: 'l5-1', title: 'What a capo does', min: 6,
        objective: 'Use a capo to raise the key without new chord shapes.',
        steps: [
          'Clamp the capo just behind a fret; it becomes your new “nut”.',
          'Your G shape at the 2nd fret now sounds as an A chord.',
          'This lets you match a singer’s key with the easy open chords.',
        ] },
      { id: 'l5-2', title: 'Numbers, not letters (1–4–5–6)', min: 8,
        objective: 'Think in numbers so you can play a song in any key.',
        steps: [
          'In any key the pattern 1–5–6–4 is the most common progression.',
          'In G that’s G–D–Em–C. Learn the shape of the PATTERN, not the letters.',
          'When someone calls “1–4–5”, you already know the moves.',
        ] },
      { id: 'l5-3', title: 'SONG: Simple Gifts (try a capo)', min: 10, songId: 'simple-gifts',
        objective: 'Play a bright folk tune and experiment with a capo.',
        steps: [
          'Play it open first. Then put a capo on fret 2 and play the same shapes.',
          'Notice it’s the same song, a bit higher — great for singing along.',
        ] },
    ],
  },
  {
    id: 'u6',
    title: 'Fingerstyle first steps',
    blurb: 'The warm, rolling sound behind so much americana and folk.',
    lessons: [
      { id: 'l6-1', title: 'Thumb + fingers', min: 8,
        objective: 'Assign your picking hand: thumb on bass, fingers on top.',
        steps: [
          'Thumb plays the lowest string of the chord; index/middle/ring take G, B, e.',
          'On a G chord, pluck bass, then the top three together (“bass–strum”).',
        ] },
      { id: 'l6-2', title: 'A basic Travis-picking pattern', min: 12,
        objective: 'Roll a steady thumb-and-finger pattern.',
        goal: 'Loop the pattern on G and C smoothly for one minute.',
        steps: [
          'Alternate the thumb between two bass strings: bass, pluck, bass, pluck.',
          'Keep it slow and even — evenness beats speed every time.',
        ] },
      { id: 'l6-3', title: 'SONG: Amazing Grace, fingerpicked', min: 12, songId: 'amazing-grace',
        objective: 'Bring fingerpicking to a song you already know.',
        steps: [
          'Use the bass–strum idea, one cycle per beat of the 3/4 waltz.',
          'You already know the chords — now it’s all about the right hand.',
        ] },
    ],
  },
];

export const ALL_LESSONS = CURRICULUM.flatMap((u) => u.lessons.map((l) => ({ ...l, unitId: u.id })));
export const LESSON_BY_ID = Object.fromEntries(ALL_LESSONS.map((l) => [l.id, l]));
