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

console.log('curriculum tests passed: song prerequisites and curated core-skill videos');
