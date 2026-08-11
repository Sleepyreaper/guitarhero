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
import privacy from './views/privacy.js';
import report from './views/report.js';
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
  privacy,
  report,
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

function showRouteError(error, failedView) {
  if (current !== failedView) return; // an older async view failed after navigation
  console.error('Campfire could not render this screen.', error);
  root.innerHTML = `
    <section class="panel" role="alert">
      <p class="eyebrow">Campfire hit a snag</p>
      <h1>This screen did not load</h1>
      <p class="lead">Your saved progress is still safe. Refresh this screen, or return home and keep practicing.</p>
      <div class="btn-row">
        <button class="btn btn-primary" id="retry-screen" type="button">Refresh screen</button>
        <a class="btn" href="#/">Return home</a>
      </div>
    </section>`;
  root.querySelector('#retry-screen').addEventListener('click', () => location.reload());
  root.tabIndex = -1;
  root.focus({ preventScroll: true });
}

function parseHash() {
  const raw = location.hash.replace(/^#\/?/, '');
  const [section, param] = raw.split('/');
  return { section: section || 'home', param: param || null };
}

function setActiveNav(section) {
  const href = NAV_HREF[section];
  document.querySelectorAll('#app-nav a').forEach((a) => {
    const active = a.getAttribute('href') === href;
    a.classList.toggle('active', active);
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });
}

function route() {
  const { section, param } = parseHash();
  const view = ROUTES[section] || dashboard;

  // Let the outgoing view clean up (stop mic/metronome audio, remove listeners).
  if (current && typeof current.destroy === 'function') {
    try { current.destroy(); } catch (error) { console.warn('Campfire screen cleanup failed.', error); }
  }

  root.innerHTML = '';
  setActiveNav(ROUTES[section] ? section : 'home');
  current = view;
  try {
    const rendering = view.render(root, param);
    if (rendering && typeof rendering.catch === 'function') {
      rendering.catch((error) => showRouteError(error, view));
    }
  } catch (error) {
    showRouteError(error, view);
  }
  window.scrollTo(0, 0);
  // Hash navigation replaces the main view without a full page load. Move keyboard and
  // screen-reader focus to the new content so mobile/assistive users are not stranded in nav.
  root.tabIndex = -1;
  root.focus({ preventScroll: true });
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
