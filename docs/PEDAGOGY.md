# Teaching Method — Research & Rationale

This app's curriculum is built on a **song-first, minimal-theory** method: the fastest,
best-documented way to take a complete beginner to playing a real acoustic song. Genres are
**country, folk, americana, and church/worship** — styles that lean heavily on a small set of
open chords, which is exactly why beginners can succeed in them fast.

## The core principles (and why)

1. **Learn songs from day one.** Song-based practice teaches real chord progressions, builds
   rhythm and motor coordination through repetition, and gives practice an immediately musical
   purpose. Exercises still appear when they solve a specific problem inside a song.
2. **Minimal theory up front.** From zero, chord shapes and basic technique matter more than
   theory. Theory is layered in later (the 1–4–5 / Nashville number idea) only when it directly
   unlocks more songs.
3. **The three-chord shortcut.** G, C, and D (the I–IV–V in the key of G) plus Em/Am cover a huge
   share of country, folk, and church songs. Master a handful of shapes → unlock hundreds of songs.
4. **Stack skills in order.** Understand the instrument → first chords → a strum → combine into a
   song. Each unit in the app ends on a playable song.
5. **Short, frequent practice.** Begin with manageable 10–20 minute sessions and frequent breaks,
   then increase duration as the hands adapt. Consistency matters more than an occasional marathon.
6. **Rhythm is a first-class skill.** A metronome from day one; **D–DU–UDU** is a useful common
   starter pattern, then every play-along teaches the meter and groove that actually fit that song.
7. **Tune first, always.** An out-of-tune guitar makes correct playing sound wrong and kills
   confidence — hence the built-in tuner and its place in Unit 0.
8. **Capo + numbers for worship/jams.** A capo raises easy open shapes to match a singer; moving it
   down lowers the result, and a different shape family is needed below the open key. The Nashville
   number system (including minor quality, such as 6m) makes progressions portable.
9. **Technique claims stay honest.** Pitch detection can confirm tuning and stable pitch, but ears
   still judge buzz, unwanted contact, dynamics, and musical tone. The Coach is feedback, not an
   automatic pass/fail authority.

## Expected timeline

- **Week 1–2:** clean first chords (Em, G), first two-chord song (*Down in the Valley*).
- **Week 3–4:** G–C–D changes, a steady strum, first three-chord songs.
- **Month 2:** a common down-up strum plus song-specific grooves, several full songs, minor chords.
- **Month 3+:** capo/number system, first fingerpicking — americana territory.

These are pacing guides, not promises. A learner may play a one-chord song on day one; clean chord
changes and full-song time develop at different rates depending on practice, instrument setup, and
physical comfort.

## Curriculum map (see `src/js/data/curriculum.js`)

| Unit | Focus | Ends on |
|------|-------|---------|
| 0 | Setup, tuning, reading chord boxes | — |
| 1 | First two chords (Em, G), first changes & strum | 1-min change goal |
| 2 | Add C & D, the 1–4–5 family | *Down in the Valley*, *Whole World* |
| 3 | Rhythm families: folk down-up, country boom-chuck, waltz | *Amazing Grace*, *Oh! Susanna* |
| 4 | Minor colors (Am, E, A) | *Home on the Range* |
| 5 | Capo & Nashville numbers | *Simple Gifts* (with capo) |
| 6 | Fingerstyle first steps | *Amazing Grace* fingerpicked |
| 7 | Accompanying a singer, dynamics, and lead fills | A real sing-along |

## Song selection & licensing

Every in-app song is **public domain** (pre-1929 or traditional), so the app can ship the full
chord/lyric charts with zero licensing risk. They were also chosen to be genuinely representative
of the target genres and to progress cleanly in difficulty (2 chords → 3 chords → more).

Popular *copyrighted* songs (e.g. modern country/worship hits) can still be referenced by name as
"practice targets," but their lyrics/charts should not be embedded — link out or let users import.

## Teaching references

The song arrangements have their own per-song verification sources and dates in
`src/js/data/arrangements.js`. The references below support the learning sequence and technique
guidance; they do not imply that one method or chord order is uniquely correct.

- [Berklee Online — Guitar for Beginners](https://online.berklee.edu/courses/guitar-for-beginners)
  (healthy playing habits; technique, musicianship, reading, and repertoire taught together)
- [Berklee Online — Guitar Fundamentals](https://online.berklee.edu/courses/guitar-fundamentals)
  (open chords; chord charts; 4/4, 3/4, and 6/8 strumming; common progressions)
- [JustinGuitar — A & D Chords: Play Your First Song](https://www.justinguitar.com/modules/a-d-chords-play-your-first-song)
  (early songs, one-minute changes, anchor fingers, bars, and correct-string strumming)
- [Fender — Five Tips to Master Chord Changes](https://www.fender.com/articles/chords/5-tips-to-master-chord-changes)
  (look ahead, minimize motion, keep time, pivot fingers, and place fingers together)
- [Fender — Five Tips to Fight Finger Pain](https://www.fender.com/articles/techniques/5-tips-to-fight-finger-pain)
  (short sessions, minimum pressure, lighter strings, and playable action)
- [Berklee — Country Music Guitar Essentials](https://online.berklee.edu/takenote/country-music-guitar-essentials-chicken-pickin-string-bending-and-more/)
  (alternating bass, rhythm chords, and fingerstyle roles in country accompaniment)
