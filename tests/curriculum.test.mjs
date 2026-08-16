import assert from 'node:assert/strict';
import { ALL_LESSONS } from '../src/js/data/curriculum.js';
import { SONG_BY_ID } from '../src/js/data/songs.js';

const learned = new Set();
for (const lesson of ALL_LESSONS) {
  for (const chord of lesson.chords || []) learned.add(chord);
  if (!lesson.songId) continue;
  const song = SONG_BY_ID[lesson.songId];
  assert.ok(song, `${lesson.id} must reference an existing song`);
  const missing = song.chords.filter((chord) => !learned.has(chord));
  assert.deepEqual(missing, [],
    `${lesson.id} must teach every new physical chord shape before requiring ${song.title}`);
}

const coreVideoLessons = ['l0-1', 'l0-2', 'l1-0', 'l1-1', 'l1-2', 'l1-3', 'l1-4', 'l2-1', 'l2-2', 'l3-2', 'l5-1'];
for (const id of coreVideoLessons) {
  const lesson = ALL_LESSONS.find((item) => item.id === id);
  assert.match(lesson?.video?.id || '', /^[\w-]{11}$/, `${id} must keep its curated video demonstration`);
  assert.ok(lesson.video.title && lesson.video.teacher && lesson.video.watchFor,
    `${id} video must tell the learner what to watch for`);
}

const chordPairLesson = ALL_LESSONS.find((item) => item.id === 'l2-1');
const demonstratedCoreChords = [chordPairLesson.video, ...(chordPairLesson.extraVideos || [])]
  .map((video) => video.title);
assert.ok(demonstratedCoreChords.some((title) => /C Chord/i.test(title)), 'the C + D lesson must demonstrate C');
assert.ok(demonstratedCoreChords.some((title) => /D Chord/i.test(title)), 'the C + D lesson must demonstrate D');

const lessonText = (id) => {
  const lesson = ALL_LESSONS.find((item) => item.id === id);
  return [lesson?.title, lesson?.objective, lesson?.goal, lesson?.proof?.title, lesson?.proof?.check,
    ...(lesson?.steps || [])].filter(Boolean).join(' ');
};

assert.match(lessonText('l1-0'), /cannot certify that a note is buzz-free/i,
  'the pitch tuner must not be presented as a substitute for listening to tone quality');
assert.match(lessonText('l1-fingers'), /sharp, burning, joint, wrist, or persistent pain/i,
  'finger soreness guidance must distinguish adaptation from pain that means stop');
assert.match(lessonText('l3-2'), /without treating it as the right groove for every song/i,
  'the common folk strum must not be sold as a universal accompaniment');
assert.match(lessonText('l3-country'), /bass on 1 and 3/i,
  'country learners need an executable boom-chuck lesson before song-specific accompaniment');
assert.match(lessonText('l5-2'), /6m/i,
  'the number-system lesson must identify the diatonic six chord as minor');
assert.match(lessonText('l6-2'), /True Travis picking adds syncopation later/i,
  'a basic alternating-bass drill must not be mislabeled as complete Travis picking');
assert.match(lessonText('l6-3'), /one three-note cycle per BAR/i,
  'the 3/4 fingerstyle lesson must map one bass-high-middle cycle to a bar, not each beat');
assert.match(lessonText('l4-tab'), /thin high e is the TOP line/i,
  'the learning path must teach enough TAB literacy to follow its melody and fill guidance');
assert.match(lessonText('l7-2'), /capo only raises/i,
  'capo guidance must never tell a strained-high singer to move the capo upward');
assert.match(lessonText('l7-4'), /waltz/i,
  'count-ins must respect the song meter rather than always counting four');

console.log('curriculum tests passed: song prerequisites and curated core-skill videos');
