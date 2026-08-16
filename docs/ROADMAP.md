# Roadmap

## Shipped (MVP)
- [x] No-build web app (HTML + ES modules + Web Audio) — runs on `python -m http.server`
- [x] Mic **tuner** with autocorrelation pitch detection + cents needle
- [x] **Chord library** (big-8 open chords + worship/folk extras) with SVG diagrams + "hear it" strum
- [x] **Metronome** — lookahead scheduler, tap tempo, beats-per-bar, visual beats
- [x] **Curriculum** — 8 units, 34 lessons, song-first, progress, proof checks, and streak tracking
- [x] **Songs** — 23 source-checked public-domain play-along charts with verified forms and
      lyric-synchronized chord cues, genre-tagged
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
- [x] Song-specific accompaniment forms, tempos, meters, grooves, dynamics, and lead guidance
- [x] Honest catalog tiers plus explicit musician-listening and student-approval quality gates
- [x] Six-string tuner diagnostic report with signal, clarity, and target-lock measurements
- [x] Auto-calibrated practice noise gate for quiet guitars and different rooms/microphones
- [x] **Real-guitar tuner calibration** — validated all six strings with an Elgato Wave:3 at
      96 kHz; target lock was 89–100% and median clarity was 0.87–0.99 (`AUDIO_CALIBRATION.md`)
- [x] **Real-guitar chord-listener calibration** — validated Em, G, C, and D with an Elgato
      Wave:3 at 96 kHz; guided-v4 reached 92% D target lock while retaining strict open-ended
      identification (`AUDIO_CALIBRATION.md`)
- [x] Automatic room-noise gates for the tuner plus measured pitch-class noise subtraction for
      chord analysis; reruns whenever the learner switches microphones
- [x] Capo key finder on song charts (keep easy shapes, show the sounding key, and transpose
      backing plus mic recognition to the selected fret)
- [ ] Nashville-number toggle on charts (show 1–4–5 instead of letters)
- [x] Chord-change trainer game (count clean changes in 60s, save personal best)
- [x] Strum-pattern player (visual/audible patterns to strum against)

## Later
- [ ] Open-ended "what chord am I playing?" mode (bestMatch across all templates)
- [ ] Explore an ML pitch/chord model (e.g. CREPE/TF.js) for tougher voicings — would add a
      dependency, so weigh against the no-build constraint
- [ ] User song import (paste ChordPro / plain chord-over-lyric text)
- [ ] Even more public-domain songs; "songs you can play now" based on chords you've learned
- [ ] Certify the five-song teen beta set in `docs/CONTENT_QUALITY.md` through listening QA
- [ ] Turn every modern-song idea into a curated tutorial bridge or remove it from the launch view
- [x] Left-handed diagram mode
- [ ] Alternate tunings in the tuner
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
