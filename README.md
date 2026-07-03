# 🔥 Campfire — Learn Acoustic Guitar

A from-zero coach that gets a complete beginner playing **real songs** on a 6-string acoustic as
fast as possible. Built around **country, folk, americana, and church/worship** — genres where a
handful of open chords unlock hundreds of songs.

It's a **no-build web app**: plain HTML + ES modules + the Web Audio API. No Node, no bundler,
no dependencies.

## Run it

The mic tuner needs a secure context, so serve it over `localhost` (don't just open the file):

```bash
# from the project root
python -m http.server 5173
# then open http://localhost:5173
```

(That's exactly what the "campfire" config in `.claude/launch.json` runs.)

## What's inside

- **🎯 Tuner** — real pitch detection from your microphone (autocorrelation), with a cents needle
  and per-string targets for standard EADGBE tuning.
- **🎸 Chord library** — the beginner "big 8" open chords plus worship/folk extras, each with an
  SVG diagram and a "hear it" strum so you know what a clean chord should sound like.
- **🥁 Metronome** — sample-accurate Web Audio scheduler with tap tempo and visual beats.
- **📚 Learn** — a 6-unit, song-first curriculum (see `docs/PEDAGOGY.md`) with progress + streaks.
- **🎵 Songs** — 7 public-domain play-along charts spanning all four genres.

## Project layout

```
index.html               app shell + nav
src/css/styles.css        warm "campfire" americana theme
src/js/app.js             hash router
src/js/data/              chords, songs, curriculum (content lives here)
src/js/lib/               audio, pitch (tuner), metronome, storage
src/js/components/        chord diagram SVG builder
src/js/views/             one module per screen
docs/PEDAGOGY.md          the teaching method + research sources
docs/ROADMAP.md           what's next
```

## Adding content

- **A chord:** add an entry to `src/js/data/chords.js` (frets/fingers, low-E first).
- **A song:** add to `src/js/data/songs.js` — **public domain only** for anything shipped in-app.
- **A lesson:** add to `src/js/data/curriculum.js`; reference chords, a tool, or a song by id.

## Licensing note

All songs bundled in the app are public domain (pre-1929 or traditional). Do not embed lyrics or
charts for copyrighted songs — reference them by name only.
