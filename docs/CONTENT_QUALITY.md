# Campfire content quality standard

Campfire does not treat “a chord progression exists” as “this teaches the song.” Every song moves
through explicit gates, and the interface must state the highest gate it has actually passed.

## The gates

1. **Licensed for its use** — full in-app lyrics and notation are public domain. Copyrighted songs
   stay as outbound goals with no copied lyric/chart content.
2. **Harmony and form checked** — key, meter, complete section order, chord changes, and a dated
   source agree. This earns **Accompaniment only**, never reference-performance language.
3. **Score complete** — literal pitches, rests, durations, pickups, and lyric syllables share the
   arrangement clock. Structural tests pass, the source is displayed, and a deployed timing trace
   proves the complete form and loop execute in order.
4. **Playback recognition passed** — a listener who already knows the song hears every mode from
   count-in through the loop. The melody is recognizable without reading the title, and the cues,
   ending, and loop can be followed. Guitar expertise is not implied. This earns **Pilot ready**.
5. **Expert guitar review** — an experienced teacher/player checks whether the accompaniment,
   technique advice, and lead role are authentic and mechanically sound. Track this separately;
   never infer it from an owner or learner recognition pass.
6. **Student pass** — a pilot learner can identify the song, understand when to change, finish it
   without the interface causing confusion, and wants to play it again. Feedback is recorded and
   any blocking issue is fixed. This earns **Student approved**.

Automated tests protect facts and state transitions. They cannot grant human experience gates.
A playback, expert, or student pass must name its reviewer and date. A student pass must include a dated,
behavior-based session note; anonymous “looks good” approval is not sufficient.

## Playback-recognition checklist

- Start from a hard refresh and test Hear song, Play with Campfire, and Perform.
- Test the default tempo and a slower beginner tempo.
- Sing the lyrics against the guide; do not merely watch the cue text.
- Verify pickups occur before beat 1 and do not steal time from the previous phrase.
- Verify stretched words follow each pitch change and short syllables are not grouped into one note.
- Verify every chord change supports the sung phrase and every displayed strum matches the audio.
- Let the form loop twice; the ending and next pickup must not collide.
- Test phone and desktop controls, pause/restart, and navigation away while playing.

## Student-session checklist

- Can the learner explain what to do before pressing Play?
- Can they recognize the tune with their eyes closed?
- Can they follow one complete pass at a reduced tempo?
- Do chord diagrams, lyric cues, or animation compete for attention?
- Where do they stop, hesitate, or ask for help?
- What do they voluntarily replay?

Record behavior, not politeness. “Looks good” is not a pass if the learner cannot complete the task.

## Content production pipeline

### Public-domain studio song

Select for genre fit and a skill the curriculum needs. Save authoritative melody and harmony
sources. Transcribe the complete form into literal score events. Build one simple authentic
accompaniment and one restrained lead lesson. Add structural tests. Complete playback QA, record
expert-review status, then run a student pass. Only then promote it in the trusted launch collection.

### Modern copyrighted song

Confirm title, artist, chord vocabulary, capo/tuning, meter, and section-level learning needs.
Link a stable licensed or creator-published tutorial/chart. Campfire may teach the required chord
changes, groove, count, capo choice, and accompaniment role, but must not reproduce lyrics or a
chord-over-lyric chart. A title with only a search link remains an idea, not curated content.

## Teen beta launch bar

Do not call the catalog launch-ready until it has at least:

- five Pilot-ready in-app songs spanning church, country/americana, and two rhythm families;
- six curated modern-song bridges, including at least two current country and two worship choices;
- a complete first-seven-session path tested on phone and desktop;
- zero blocker findings in tuning, chord diagrams, progress saving, playback, pause, or restart;
- one supervised pilot session followed by fixes, then one clean repeat session.

## First certification batch

1. He’s Got the Whole World in His Hands — finish the active four-line phrasing review.
2. Amazing Grace — church/americana anchor; audit every syllable and dominant-chord change.
3. Shady Grove — source-locked Hindman/WSU E-minor score complete; automated and independent playback QA pending.
4. Kumbaya — source-locked Musica Viva 3/4 score complete; deployed timing and independent playback QA pending.
5. Will the Circle Be Unbroken — communal country/church chorus and first true boom-chuck test.
6. What a Friend We Have in Jesus — slower vocal accompaniment and phrase-space test.

Row, Row, Row Your Boat remains valuable for 6/8 and rounds, but it is not a lead teen-engagement
song. It should be certified as a teaching tool, not used as the beta’s headline repertoire.
