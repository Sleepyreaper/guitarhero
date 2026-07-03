# CLAUDE.md

Guidance for Claude Code when working in this repo.

## What this is
**Campfire** — a web app that teaches a complete beginner to play 6-string **acoustic** guitar as
fast as possible, focused on **country, folk, americana, and church/worship** music. The design
bet is *song-first, minimal-theory* teaching (see `docs/PEDAGOGY.md`).

## Architecture — important
- **No build step. No framework. No dependencies.** Plain HTML + ES modules + Web Audio API.
- This was a deliberate choice: **Node/npm is not installed on the dev machine.** Do not introduce
  a bundler, npm packages, JSX, or TypeScript without first confirming with the user — it would
  break the "just works" setup. If the app outgrows vanilla JS, the migration target is Vite +
  React/TS (noted in the roadmap), but that requires installing Node first.
- Serve with `python -m http.server 5173` (see `.claude/launch.json`, config name `campfire`).
  The tuner's microphone needs a **secure context**, so use `http://localhost`, never `file://`.

## Layout
- `src/js/data/` — **content** (chords, songs, curriculum). Most additions go here, data-driven.
- `src/js/lib/` — `audio.js` (AudioContext + pluck/strum synth), `pitch.js` (Tuner +
  autocorrelation), `metronome.js` (lookahead scheduler), `storage.js` (localStorage progress).
- `src/js/components/chordDiagram.js` — builds chord SVGs (strings low-E → high-e, left to right).
- `src/js/views/` — one module per screen; each exports `{ render(root, param), destroy() }`.
  `destroy()` MUST stop any audio (mic/metronome) and remove listeners — the router calls it on
  navigation.
- `src/js/app.js` — hash router (`#/`, `#/learn/:id`, `#/songs/:id`, `#/chords`, `#/tuner`,
  `#/metronome`).

## Conventions
- Chord shapes: `frets`/`fingers` arrays are 6 entries, **low-E first**; `-1` = muted, `0` = open.
- SVG/theme colors come from CSS variables in `src/css/styles.css` (warm "campfire" palette).
- Songs are stored as token lines `{ c: 'G', t: 'lyric' }` and rendered chord-over-lyric in
  monospace. **Only public-domain songs may be bundled** — reference copyrighted songs by name only.

## Verifying changes
Start the `campfire` preview server and check the affected screen. For audio features (tuner,
metronome, "hear it"), remember they require a user gesture to start and the tuner requires mic
permission on localhost.
