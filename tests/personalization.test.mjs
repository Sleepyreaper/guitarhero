import assert from 'node:assert/strict';
import { rankPlayableSongs } from '../src/js/views/dashboard.js';

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

console.log('personalization tests passed: preferred genre first, kids-only material last');
