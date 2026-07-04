// Lightweight progress persistence via localStorage.
// Practice is tracked HONESTLY: only real, mic-detected playing time is logged
// (see lib/practice.js), and the day-streak only counts days you actually played.
const KEY = 'campfire.progress.v1';
const MIN_DAY_SECONDS = 60; // a day counts toward the streak after 1 minute of real playing

function load() {
  try {
    return JSON.parse(localStorage.getItem(KEY)) || {};
  } catch {
    return {};
  }
}

function save(state) {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* storage full or disabled — fail quietly */
  }
}

function defaults() {
  return { done: {}, lastLesson: null, practiceSeconds: {} };
}

const today = () => new Date().toISOString().slice(0, 10);

export function getState() {
  return { ...defaults(), ...load() };
}

export function isDone(lessonId) {
  return !!getState().done[lessonId];
}

// Completing a lesson tracks PROGRESS only — it does NOT fake a practice day.
export function setDone(lessonId, done = true) {
  const s = getState();
  if (done) s.done[lessonId] = Date.now();
  else delete s.done[lessonId];
  s.lastLesson = lessonId;
  save(s);
  return s;
}

export function setLastLesson(lessonId) {
  const s = getState();
  s.lastLesson = lessonId;
  save(s);
}

export function doneCount() {
  return Object.keys(getState().done).length;
}

// --- Honest practice tracking ---

// Add real, mic-verified seconds of playing to today's total.
export function addPracticeSeconds(sec) {
  const s = getState();
  const d = today();
  s.practiceSeconds[d] = (s.practiceSeconds[d] || 0) + sec;
  save(s);
  return s.practiceSeconds[d];
}

export function todaySeconds() {
  return getState().practiceSeconds[today()] || 0;
}

// Consecutive days (ending today, or yesterday if you haven't played yet today) with
// at least MIN_DAY_SECONDS of real playing.
export function streak() {
  const secs = getState().practiceSeconds;
  const counts = (key) => (secs[key] || 0) >= MIN_DAY_SECONDS;
  let n = 0;
  const d = new Date();
  if (!counts(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  for (;;) {
    if (counts(d.toISOString().slice(0, 10))) { n++; d.setDate(d.getDate() - 1); } else break;
  }
  return n;
}

export function playedToday() {
  return todaySeconds() >= MIN_DAY_SECONDS;
}

export function resetProgress() {
  save(defaults());
}
