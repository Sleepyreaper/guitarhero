# Rhythm and accompaniment audit

Campfire separates three things that must not be confused:

1. **The song** supplies melody, lyric, meter, and harmonic form.
2. **The cited chart or score** verifies the bar order, chords, and lyric-aligned changes used here.
3. **Campfire's groove** is a deliberately playable acoustic-guitar arrangement. Traditional songs
   do not have one mandatory strumming pattern, so the app must describe this as *an arrangement*,
   never *the official strum*.

The generated backing, visible count, and Accompany card now read from the same `GROOVES` record.
`songs.js` no longer stores a second rhythm description that can drift from playback.

## 2026-08-15 corrective audit

- **Row, Row, Row Your Boat:** replaced an internally contradictory 4/4 one-chord reduction with
  the source's G–D7, eight-bar 6/8 form. The beginner guitar part now emphasizes the two large
  dotted-quarter pulses: `ONE-and-a TWO-and-a`.
- **Amazing Grace:** removed an unsourced Em substitution from the source-checked beginner form.
- **He's Got the Whole World:** replaced the generic gospel generator with the cited chart's
  down / down-up / down / down-up 4/4 pattern.
- **Home on the Range:** retained the useful A7 secondary dominant but replaced the mismatched
  citation with the Ballad of America lead sheet that actually contains A7.
- **All songs:** removed duplicate `strum` fields, exposed a spoken count for every groove, and
  labeled 6/8 tempo as dotted-quarter BPM.

Automated checks now require every song to have one arrangement, an explicit spoken count, groove
events inside its meter, declared chords that agree across chart and backing, lyric slots matching
every chord change, and a dated source for every source-checked form.
