// "Songs to aim for" — real, on-the-radio songs a beginner can play with the open chords.
//
// IMPORTANT: these are COPYRIGHTED. We never print their lyrics or a chord-over-lyric chart
// here — only the song's name/artist plus the (uncopyrightable) chord list + capo, and a link
// out to find a full chart. The bundled *play-along* songbook (songs.js) stays public-domain
// only. Chords/capo below are a common beginner arrangement; the recording's exact key may
// differ, so the "Find the chords" link is the source of truth.

export const TARGET_SONGS = [
  // ----- Sing with the kids -----
  { title: 'You Are My Sunshine', artist: 'Jimmie Davis (traditional country)', genres: ['kids', 'country'],
    chords: ['G', 'C', 'D'], capo: 'No capo',
    why: 'Maybe the ultimate parent-and-kid singalong. Three chords.' },
  { title: 'This Land Is Your Land', artist: 'Woody Guthrie', genres: ['kids', 'folk', 'americana'],
    chords: ['G', 'C', 'D'], capo: 'No capo',
    why: 'A joyful family singalong the whole car can belt out.' },
  { title: 'Rainbow Connection', artist: 'Kermit the Frog (Paul Williams)', genres: ['kids'],
    chords: ['G', 'Em', 'C', 'D'], capo: 'No capo',
    why: 'Sweet, gentle, and a little magic — great for winding down.' },

  // ----- Current hits (requested) -----
  { title: 'You Look Like You Love Me', artist: 'Ella Langley (feat. Riley Green)', genres: ['country'],
    chords: ['G', 'C', 'D'], capo: 'Capo — to taste',
    why: 'Her breakout duet — a modern honky-tonk singalong.' },
  { title: "Weren't For The Wind", artist: 'Ella Langley', genres: ['country', 'americana'],
    chords: ['Em', 'C', 'G', 'D'], capo: 'Capo — to taste',
    why: 'A slow, aching ballad — great for practicing smooth changes.' },
  { title: 'Last Night', artist: 'Morgan Wallen', genres: ['country'],
    chords: ['G', 'D', 'Em', 'C'], capo: 'Capo — to taste',
    why: 'His biggest hit — four chords and you\'re there.' },
  { title: 'Whiskey Glasses', artist: 'Morgan Wallen', genres: ['country'],
    chords: ['G', 'C', 'D', 'Em'], capo: 'Capo — to taste',
    why: 'A barroom singalong everybody knows.' },
  { title: 'Wasted on You', artist: 'Morgan Wallen', genres: ['country'],
    chords: ['G', 'D', 'Em', 'C'], capo: 'Capo — to taste',
    why: 'Big and emotional, and only four chords.' },

  // ----- Modern / classic country -----
  { title: 'Wagon Wheel', artist: 'Old Crow Medicine Show / Darius Rucker', genres: ['country', 'americana'],
    chords: ['G', 'D', 'Em', 'C'], capo: 'No capo',
    why: 'The ultimate 4-chord country singalong. If you learn one, learn this.' },
  { title: 'Take Me Home, Country Roads', artist: 'John Denver', genres: ['country', 'americana'],
    chords: ['G', 'Em', 'D', 'C'], capo: 'No capo',
    why: 'Everyone in the room knows every word.' },
  { title: 'Ring of Fire', artist: 'Johnny Cash', genres: ['country'],
    chords: ['G', 'C', 'D'], capo: 'No capo',
    why: 'Three chords and a horn line you can hum.' },
  { title: 'Chicken Fried', artist: 'Zac Brown Band', genres: ['country'],
    chords: ['G', 'C', 'D', 'Em'], capo: 'Capo 2',
    why: 'Feel-good and forgiving on the chord changes.' },
  { title: 'Jolene', artist: 'Dolly Parton', genres: ['country'],
    chords: ['Am', 'C', 'G'], capo: 'Capo 4',
    why: 'Mostly one hypnotic riff — a perfect first minor-key jam.' },
  { title: 'Tennessee Whiskey', artist: 'Chris Stapleton', genres: ['country', 'americana'],
    chords: ['G', 'Am'], capo: 'Capo 2',
    why: 'Basically two chords — it\'s all about smooth, slow changes.' },
  { title: 'Beautiful Crazy', artist: 'Luke Combs', genres: ['country'],
    chords: ['G', 'Em', 'C', 'D'], capo: 'Capo 1',
    why: 'The modern country slow-dance.' },
  { title: 'Something in the Orange', artist: 'Zach Bryan', genres: ['country', 'americana'],
    chords: ['G', 'D', 'Em', 'C'], capo: 'No capo',
    why: 'Slow, spacious, and only four chords.' },
  { title: 'Feathered Indians', artist: 'Tyler Childers', genres: ['americana', 'country'],
    chords: ['G', 'C', 'D', 'Em'], capo: 'Capo — to taste',
    why: 'A modern americana favorite built on the same four friends.' },

  // ----- Contemporary worship -----
  { title: '10,000 Reasons (Bless the Lord)', artist: 'Matt Redman', genres: ['church'],
    chords: ['G', 'C', 'D', 'Em'], capo: 'Capo 1',
    why: 'The gentlest on-ramp to worship guitar.' },
  { title: 'Great Are You Lord', artist: 'All Sons & Daughters', genres: ['church'],
    chords: ['G', 'C', 'D', 'Em'], capo: 'No capo',
    why: 'Four chords with lots of room to breathe.' },
  { title: 'How Great Is Our God', artist: 'Chris Tomlin', genres: ['church'],
    chords: ['G', 'Em', 'C', 'D'], capo: 'Capo — to taste',
    why: 'A modern hymn the whole room sings.' },
  { title: 'Build My Life', artist: 'Pat Barrett', genres: ['church'],
    chords: ['G', 'C', 'Em', 'D'], capo: 'Capo — to taste',
    why: 'A four-chord worship anthem.' },
];

// A neutral web search for the full chart (we don't bundle or endorse a specific chords site).
export function chartSearchUrl(t) {
  return 'https://www.google.com/search?q=' + encodeURIComponent(`${t.title} ${t.artist} guitar chords`);
}
