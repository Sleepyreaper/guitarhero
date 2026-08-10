// Lightweight progress persistence via localStorage.
// Practice is tracked HONESTLY: only real, mic-detected playing time is logged
// (see lib/practice.js), and the day-streak only counts days you actually played.
const KEY = 'campfire.progress.v1';
const MIN_DAY_SECONDS = 60; // a day counts toward the streak after 1 minute of real playing
let cloud = null;
let cloudTimer = null;

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
  queueCloudSave(state);
}

function defaults() {
  return {
    done: {}, lastLesson: null, practiceSeconds: {}, bestChanges: {}, routine: {},
    profile: null, skillProofs: {}, feedback: {},
  };
}

function mergeMaps(local = {}, remote = {}, reducer = (_, b) => b) {
  const merged = { ...remote };
  for (const [key, value] of Object.entries(local)) {
    merged[key] = key in merged ? reducer(value, merged[key]) : value;
  }
  return merged;
}

export function mergeStates(localState, remoteState) {
  const local = { ...defaults(), ...(localState || {}) };
  const remote = { ...defaults(), ...(remoteState || {}) };
  const routine = mergeMaps(local.routine, remote.routine, (a, b) => ({ ...b, ...a }));
  return {
    ...remote,
    ...local,
    lastLesson: local.lastLesson || remote.lastLesson || null,
    done: mergeMaps(local.done, remote.done, (a, b) => Math.max(a || 0, b || 0)),
    practiceSeconds: mergeMaps(local.practiceSeconds, remote.practiceSeconds, (a, b) => Math.max(a || 0, b || 0)),
    bestChanges: mergeMaps(local.bestChanges, remote.bestChanges, (a, b) => Math.max(a || 0, b || 0)),
    skillProofs: mergeMaps(local.skillProofs, remote.skillProofs, (a, b) => Math.max(a || 0, b || 0)),
    feedback: mergeMaps(local.feedback, remote.feedback, (a) => a),
    profile: local.profile || remote.profile || null,
    routine,
  };
}

async function writeCloud(state = getState()) {
  if (!cloud) return;
  const { firestoreApi, db, uid } = cloud;
  const ref = firestoreApi.doc(db, 'users', uid, 'state', 'progress');
  try {
    await firestoreApi.setDoc(ref, {
      state,
      schemaVersion: 1,
      updatedAt: firestoreApi.serverTimestamp(),
    }, { merge: true });
  } catch (error) {
    console.warn('Campfire progress sync failed; local progress is safe.', error);
  }
}

function queueCloudSave(state) {
  if (!cloud) return;
  clearTimeout(cloudTimer);
  cloudTimer = setTimeout(() => writeCloud(state), 10000);
}

// Attach the currently authenticated account, merge its cloud progress with this
// device, then keep future writes synchronized (debounced to control Firestore cost).
export async function connectCloudProgress(user, services) {
  if (!user || !services?.available) return;
  if (cloud?.uid === user.uid) return;
  if (cloud) await writeCloud();
  cloud = { uid: user.uid, db: services.db, firestoreApi: services.firestoreApi };
  const ref = services.firestoreApi.doc(services.db, 'users', user.uid, 'state', 'progress');
  try {
    const snapshot = await services.firestoreApi.getDoc(ref);
    const merged = mergeStates(getState(), snapshot.exists() ? snapshot.data().state : null);
    try { localStorage.setItem(KEY, JSON.stringify(merged)); } catch { /* local-only failure */ }
    await writeCloud(merged);
    window.dispatchEvent(new CustomEvent('campfire:progress-sync'));
  } catch (error) {
    console.warn('Cloud progress could not be loaded; continuing locally.', error);
  }
}

export async function flushCloudProgress() {
  clearTimeout(cloudTimer);
  cloudTimer = null;
  await writeCloud();
}

export function disconnectCloudProgress() {
  clearTimeout(cloudTimer);
  cloudTimer = null;
  cloud = null;
}

// Used after a deliberate sign-out on a shared device. This does not queue a
// cloud write; the signed-in user's cloud copy has already been flushed.
export function clearLocalProgress() {
  try { localStorage.removeItem(KEY); } catch { /* local-only failure */ }
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

// --- Learner preferences, self-verified skills, and private pilot feedback ---

export function getProfile() {
  return getState().profile;
}

export function saveProfile(profile) {
  const s = getState();
  s.profile = { ...profile, updatedAt: Date.now() };
  save(s);
  return s.profile;
}

export function isSkillProven(skillId) {
  return !!getState().skillProofs[skillId];
}

export function setSkillProof(skillId, proven = true) {
  const s = getState();
  if (proven) s.skillProofs[skillId] = Date.now();
  else delete s.skillProofs[skillId];
  save(s);
  return proven;
}

export function getFeedback(lessonId) {
  return getState().feedback[lessonId] || null;
}

export function saveFeedback(lessonId, response) {
  const s = getState();
  s.feedback[lessonId] = { ...response, updatedAt: Date.now() };
  save(s);
  return s.feedback[lessonId];
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

// --- Daily practice routine (self-checked, resets each day) ---
export function isRoutineStepDone(id) {
  const r = getState().routine[today()];
  return !!(r && r[id]);
}

export function toggleRoutineStep(id) {
  const s = getState();
  const d = today();
  s.routine[d] = s.routine[d] || {};
  s.routine[d][id] = !s.routine[d][id];
  save(s);
  return s.routine[d][id];
}

export function routineDoneCount() {
  const r = getState().routine[today()] || {};
  return Object.values(r).filter(Boolean).length;
}

// --- Chord-change trainer personal bests, keyed by the chord pair (e.g. "Em-G") ---
export function pairKey(a, b) {
  return [a, b].sort().join('-');
}

export function getBestChanges(key) {
  return getState().bestChanges[key] || 0;
}

// Save only if it beats the previous best. Returns { best, isRecord }.
export function recordChanges(key, n) {
  const s = getState();
  const prev = s.bestChanges[key] || 0;
  const isRecord = n > prev;
  if (isRecord) { s.bestChanges[key] = n; save(s); }
  return { best: Math.max(prev, n), isRecord };
}

export function resetProgress() {
  save(defaults());
}
