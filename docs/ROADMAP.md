# Roadmap

## Shipped (MVP)
- [x] No-build web app (HTML + ES modules + Web Audio) — runs on `python -m http.server`
- [x] Mic **tuner** with autocorrelation pitch detection + cents needle
- [x] **Chord library** (big-8 open chords + worship/folk extras) with SVG diagrams + "hear it" strum
- [x] **Metronome** — lookahead scheduler, tap tempo, beats-per-bar, visual beats
- [x] **Curriculum** — 6 units, ~24 lessons, song-first, progress + streak tracking
- [x] **Songs** — 7 public-domain play-along charts (chord-over-lyric)
- [x] **Chord Coach** — mic listens to a strummed chord and verifies it via a chromagram
      (pitch-class profile) with a live 12-note visualizer + per-note feedback

## Next up (high value, low effort)
- [ ] **Embed the Chord Coach into songs/lessons** — auto-advance the chart when the correct
      chord is heard (the "Piano Marvel" play-along loop)
- [ ] Calibrate Chord Coach thresholds against real guitars (presentThresh/foreignThresh in
      `lib/chroma.js`) — maybe an auto-gain/room-noise baseline
- [ ] Capo transposer on song charts (shift chords by N frets, keep easy shapes)
- [ ] Nashville-number toggle on charts (show 1–4–5 instead of letters)
- [ ] Chord-change trainer game (count clean changes in 60s, save personal best)
- [ ] Strum-pattern player (visual/audible D/DU/UDU patterns to strum against)

## Later
- [ ] Open-ended "what chord am I playing?" mode (bestMatch across all templates)
- [ ] Explore an ML pitch/chord model (e.g. CREPE/TF.js) for tougher voicings — would add a
      dependency, so weigh against the no-build constraint
- [ ] User song import (paste ChordPro / plain chord-over-lyric text)
- [ ] More public-domain songbook + a genre filter (country / folk / americana / church)
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
