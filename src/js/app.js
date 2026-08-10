// Tiny hash router. No build step, no framework — just ES modules.
import dashboard from './views/dashboard.js';
import lessons from './views/lessons.js';
import song from './views/song.js';
import chords from './views/chords.js';
import tuner from './views/tuner.js';
import metronome from './views/metronome.js';
import train from './views/train.js';
import warmup from './views/warmup.js';
import routine from './views/routine.js';
import strumTrainer from './views/strum.js';
import account from './views/account.js';
import { startCloudSession } from './lib/firebase.js';
import { connectCloudProgress, flushCloudProgress, disconnectCloudProgress } from './lib/storage.js';

const ROUTES = {
  home: dashboard,
  learn: lessons,
  songs: song,
  chords,
  tuner,
  metronome,
  train,
  warmup,
  routine,
  strum: strumTrainer,
  account,
};

const NAV_HREF = {
  home: '#/',
  learn: '#/learn',
  songs: '#/songs',
  chords: '#/chords',
  tuner: '#/tuner',
  metronome: '#/metronome',
  account: '#/account',
};

const root = document.getElementById('app');
let current = null;

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [section, param] = raw.split('/');
  return { section: section || 'home', param: param || null };
}

function setActiveNav(section) {
  const href = NAV_HREF[section];
  document.querySelectorAll('#app-nav a').forEach((a) => {
    a.classList.toggle('active', a.getAttribute('href') === href);
  });
}

function route() {
  const { section, param } = parseHash();
  const view = ROUTES[section] || dashboard;

  // Let the outgoing view clean up (stop mic/metronome audio, remove listeners).
  if (current && typeof current.destroy === 'function') current.destroy();

  root.innerHTML = '';
  setActiveNav(ROUTES[section] ? section : 'home');
  current = view;
  view.render(root, param);
  window.scrollTo(0, 0);
}

window.addEventListener('hashchange', route);
route();

const accountLink = document.getElementById('account-link');
startCloudSession(async (user, services) => {
  if (user) await connectCloudProgress(user, services);
  else disconnectCloudProgress();
  if (accountLink) {
    accountLink.textContent = user && !user.isAnonymous ? (user.displayName?.split(' ')[0] || 'Account') : 'Save progress';
    accountLink.classList.toggle('synced', !!user && !user.isAnonymous);
  }
  window.dispatchEvent(new CustomEvent('campfire:auth-change', { detail: { user } }));
});

window.addEventListener('campfire:progress-sync', () => {
  if (current === dashboard || current === lessons || current === routine || current === train) route();
});
window.addEventListener('pagehide', () => { flushCloudProgress(); });
document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'hidden') flushCloudProgress();
});
