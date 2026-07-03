// Lightweight progress persistence via localStorage.
const KEY = 'campfire.progress.v1';

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
  return { done: {}, lastLesson: null, practiceDays: [], streak: 0 };
}

export function getState() {
  return { ...defaults(), ...load() };
}

export function isDone(lessonId) {
  return !!getState().done[lessonId];
}

export function setDone(lessonId, done = true) {
  const s = getState();
  if (done) s.done[lessonId] = Date.now();
  else delete s.done[lessonId];
  s.lastLesson = lessonId;
  touchToday(s);
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

// Record that the learner did something today and update the streak.
function touchToday(s) {
  const today = new Date().toISOString().slice(0, 10);
  if (!s.practiceDays.includes(today)) {
    s.practiceDays.push(today);
    s.practiceDays = s.practiceDays.slice(-400);
  }
  s.streak = computeStreak(s.practiceDays);
}

export function markPracticedToday() {
  const s = getState();
  touchToday(s);
  save(s);
  return s;
}

function computeStreak(days) {
  const set = new Set(days);
  let streak = 0;
  const d = new Date();
  // If today isn't logged yet, start counting from yesterday.
  if (!set.has(d.toISOString().slice(0, 10))) d.setDate(d.getDate() - 1);
  for (;;) {
    const key = d.toISOString().slice(0, 10);
    if (set.has(key)) { streak++; d.setDate(d.getDate() - 1); } else break;
  }
  return streak;
}

export function resetProgress() {
  save(defaults());
}
