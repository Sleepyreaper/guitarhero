# Score-driven song teaching

Chord accompaniment is not a reference performance. A learner recognizes a song through melody,
rhythm, pickups, phrasing, and harmony together. Campfire therefore grants **certified** status only
to songs with a literal public-domain melody timeline in `src/js/data/scores.js`.

Every melody event has an absolute beat, duration, MIDI pitch (or rest), and optional lyric cue.
Negative beats are pickups. The score and guitar arrangement use the same beat unit and loop clock.

Song Studio has three jobs:

1. **Hear song** — quiet generated guitar plus a clearly audible guide melody.
2. **Play with Campfire** — guide melody only; the learner supplies the guitar.
3. **Perform** — count-in and visual cues only; the learner and singer carry the music.

Songs without a certified score remain available as accompaniment practice, but the interface must
say that their melody audit is pending. Form/harmony checks must never be described as proof that a
generated backing sounds like the song.

Certification requires a dated source, chronological note/rest events, score-timed lyric cues,
pickup preservation, and a melody duration that fits the arrangement's harmony clock. Automated
tests enforce those structural facts; a human listening pass remains mandatory before expanding the
certified set.
