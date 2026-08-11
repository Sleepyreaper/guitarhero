import assert from 'node:assert/strict';
import { learnedShapes, rankPlayableSongs } from '../src/js/views/dashboard.js';

const songs = [
  { title: 'Kids only', genres: ['kids'], level: 1 },
  { title: 'Americana first', genres: ['americana', 'folk'], level: 1 },
  { title: 'Church later', genres: ['church'], level: 3 },
  { title: 'Church first', genres: ['church', 'folk'], level: 2 },
];

assert.deepEqual(rankPlayableSongs(songs, 'church').map((song) => song.title), [
  'Church first', 'Church later', 'Americana first', 'Kids only',
]);
assert.equal(songs[0].title, 'Kids only', 'ranking must not mutate shared song data');

const learned = learnedShapes(['Em', 'G', 'C', 'D']);
assert.deepEqual([...learned], ['Em', 'G', 'C', 'D']);
for (const unlearnedShape of ['Em7', 'G7', 'Cadd9', 'D7']) {
  assert.equal(learned.has(unlearnedShape), false,
    `${unlearnedShape} must not unlock just because a related major/minor shape was learned`);
}

console.log('personalization tests passed: preferred genre first and only explicitly learned shapes unlock songs');
