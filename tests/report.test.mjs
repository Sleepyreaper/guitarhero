import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const source = await readFile(new URL('../src/js/lib/report.js', import.meta.url), 'utf8');
const { buildPilotReport, formatPilotReport } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const state = {
  uid: 'secret-uid', email: 'learner@example.com', audio: 'must-never-appear',
  profile: { genre: 'church', hand: 'left', experience: 'new', song: 'private song note' },
  done: { 'l0-1': 1786000000000, 'l0-2': 1786000010000 },
  practiceSeconds: { '2026-08-01': 30, '2026-08-02': 90, '2026-08-03': 150, corrupt: -999 },
  skillProofs: { 'tune-six': 1786000000000 },
  bestChanges: { 'Em-G': 7 },
  feedback: { 'l0-1': { rating: 'clear', updatedAt: 1786000000000 } },
};
const report = buildPilotReport(state, { 'l0-1': 'Meet your guitar' });
assert.equal(report.completedLessons, 2);
assert.equal(report.practicedDays, 2);
assert.equal(report.totalPracticeMinutes, 5);
assert.equal(report.skillChecksPassed, 1);
assert.deepEqual(report.feedbackCounts, { clear: 1 });

const serialized = JSON.stringify(report);
for (const secret of ['secret-uid', 'learner@example.com', 'must-never-appear', 'private song note', '2026-08-01', '1786000000000']) {
  assert.ok(!serialized.includes(secret), `report leaked ${secret}`);
}
const text = formatPilotReport(report);
assert.match(text, /Meet your guitar: clear/);
assert.match(text, /Feedback summary: clear 1 · stuck 0 · microphone wrong 0/);
assert.match(text, /excludes name, email, account ID, audio/);

console.log('report tests passed: aggregation, useful feedback, and identity/date/audio redaction');
