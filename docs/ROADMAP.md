# Roadmap

## Shipped (MVP)
- [x] No-build web app (HTML + ES modules + Web Audio) — runs on `python -m http.server`
- [x] Mic **tuner** with autocorrelation pitch detection + cents needle
- [x] **Chord library** (big-8 open chords + worship/folk extras) with SVG diagrams + "hear it" strum
- [x] **Metronome** — lookahead scheduler, tap tempo, beats-per-bar, visual beats
- [x] **Curriculum** — 6 units, ~24 lessons, song-first, progress + streak tracking
- [x] **Songs** — 7 public-domain play-along charts (chord-over-lyric)

## Next up (high value, low effort)
- [ ] Capo transposer on song charts (shift chords by N frets, keep easy shapes)
- [ ] Nashville-number toggle on charts (show 1–4–5 instead of letters)
- [ ] Chord-change trainer game (count clean changes in 60s, save personal best)
- [ ] Strum-pattern player (visual/audible D/DU/UDU patterns to strum against)
- [ ] "Play-along" mode: auto-scroll the chart at the song tempo

## Later
- [ ] Chord-recognition feedback (listen and confirm the user is fretting the right chord)
- [ ] User song import (paste ChordPro / plain chord-over-lyric text)
- [ ] More public-domain songbook + a genre filter (country / folk / americana / church)
- [ ] Left-handed diagram mode; alternate tunings in the tuner
- [ ] Practice reminders / daily-goal notifications
- [ ] PWA: installable + offline (add manifest + service worker)
- [ ] Optional migration to Vite + React/TS if the app grows (state is getting complex)

## Known limitations
- Mic tuner needs a **secure context** — served over `http://localhost` (fine) or `https`.
  Opening `index.html` as a `file://` page will block the microphone.
- Pitch detection is monophonic (one string at a time), which is correct for a tuner.
