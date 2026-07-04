# Roadmap

## Shipped (MVP)
- [x] No-build web app (HTML + ES modules + Web Audio) — runs on `python -m http.server`
- [x] Mic **tuner** with autocorrelation pitch detection + cents needle
- [x] **Chord library** (big-8 open chords + worship/folk extras) with SVG diagrams + "hear it" strum
- [x] **Metronome** — lookahead scheduler, tap tempo, beats-per-bar, visual beats
- [x] **Curriculum** — 6 units, ~24 lessons, song-first, progress + streak tracking
- [x] **Songs** — 15 public-domain play-along charts (chord-over-lyric), genre-tagged
      (country/folk/americana/church), sorted easiest→hardest, with per-song strum patterns +
      a genre filter
- [x] **Chord Coach** — mic listens to a strummed chord and verifies it via a chromagram
      (pitch-class profile) with a live 12-note visualizer + per-note feedback

## Next up (high value, low effort)
- [x] **Play-along** — song pages listen and auto-advance through the chord progression, with a
      manual Skip/Back fallback (`views/song.js` + `lib/coach.js`)
- [x] Chord detection reworked to relative best-match (`ChordJudge`/`matchChroma`), self-
      calibrating to room/mic, with a live "I hear: X · NN%" readout in the Coach
- [x] **Sing-along mode** — the app strums a song's progression in time (adjustable tempo,
      loops) so a singer can sing to it (`strumAt` + a lookahead scheduler in `views/song.js`)
- [x] **Honest practice tracking** — mic-verified play time; day-streak needs 60s of real
      playing (`lib/practice.js` + `lib/storage.js`)
- [x] **"Playing with a singer" unit** — time-first, capo-to-her-key, leaving space, count-ins
- [x] **"Beat the buzz"** fundamentals lesson (fret placement, verified with the tuner)
- [ ] **Calibrate on a real guitar** — dial SIM_OK / cleanChroma floor / tuner minClarity from
      the on-screen readouts (needs real-mic data points from the user)
- [ ] Auto noise-floor baseline (sample the room when idle, subtract it)
- [ ] Capo transposer on song charts (shift chords by N frets, keep easy shapes)
- [ ] Nashville-number toggle on charts (show 1–4–5 instead of letters)
- [ ] Chord-change trainer game (count clean changes in 60s, save personal best)
- [ ] Strum-pattern player (visual/audible D/DU/UDU patterns to strum against)

## Later
- [ ] Open-ended "what chord am I playing?" mode (bestMatch across all templates)
- [ ] Explore an ML pitch/chord model (e.g. CREPE/TF.js) for tougher voicings — would add a
      dependency, so weigh against the no-build constraint
- [ ] User song import (paste ChordPro / plain chord-over-lyric text)
- [ ] Even more public-domain songs; "songs you can play now" based on chords you've learned
- [ ] Left-handed diagram mode; alternate tunings in the tuner
- [ ] Practice reminders / daily-goal notifications
- [ ] PWA: installable + offline (add manifest + service worker)
- [ ] Optional migration to Vite + React/TS if the app grows (state is getting complex)

## Known limitations
- All mic features need a **secure context** — `http://localhost` (fine) or `https`. Over the
  LAN that means HTTPS (self-signed cert or via a reverse proxy). `file://` blocks the mic.
- The **tuner** is monophonic (one string at a time) — correct for tuning.
- The **Chord Coach** is audio-based (chromagram), not MIDI, so it's a coach, not a judge:
  best with a clean, sustained strum in a quiet room. Chords sharing notes (e.g. C vs Am) are
  the hardest to tell apart; thresholds may need per-guitar/room calibration.
