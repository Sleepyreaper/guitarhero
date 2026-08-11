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

console.log('curriculum tests passed: every song milestone follows explicit teaching of every required shape');
