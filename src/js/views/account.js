import { getFirebaseServices } from '../lib/firebase.js';
import { clearLocalProgress, disconnectCloudProgress, flushCloudProgress } from '../lib/storage.js';

const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

const friendlyError = (error) => {
  const code = error?.code || '';
  if (code.includes('wrong-password') || code.includes('invalid-credential')) return 'That email or password did not match.';
  if (code.includes('email-already-in-use')) return 'That email already has an account. Use Sign in instead.';
  if (code.includes('weak-password')) return 'Use a password with at least six characters.';
  if (code.includes('popup-closed')) return 'The sign-in window was closed.';
  return error?.message || 'Something went wrong. Please try again.';
};

export default {
  async render(root) {
    this.root = root;
    root.innerHTML = `<section class="panel auth-panel"><h1>Your account</h1><p class="muted">Connecting to Campfire…</p></section>`;
    const services = await getFirebaseServices();
    if (!this.root || this.root !== root) return;

    if (!services.available) {
      root.innerHTML = `
        <section class="panel auth-panel">
          <p class="eyebrow">This device</p><h1>Local progress</h1>
          <p>Your practice and lesson progress is saved in this browser.</p>
          <div class="callout">Cloud accounts become available when this app is deployed to Firebase Hosting.</div>
        </section>`;
      return;
    }

    const { auth, authApi } = services;
    const continueToLessons = () => { location.hash = '#/learn'; };
    const paint = () => {
      const user = auth.currentUser;
      const permanent = user && !user.isAnonymous;
      root.innerHTML = `
        <section class="panel auth-panel">
          <p class="eyebrow">Campfire account</p>
          <h1>${permanent ? 'Progress is synced' : 'Save your progress anywhere'}</h1>
          ${permanent ? `
            <p>Signed in as <strong>${esc(user.displayName || user.email || 'Campfire learner')}</strong>.</p>
            <p class="muted">Lessons, verified practice time, routines, and chord-change records follow you to every device.</p>
            <div class="btn-row">
              <button class="btn" id="sign-out">Sign out</button>
              <button class="btn btn-ghost" id="delete-account">Delete account</button>
            </div>
          ` : `
            <p class="muted">You are currently practicing as a guest. Create an account and everything already saved on this device comes with you.</p>
            <button class="btn btn-primary auth-google" id="google-auth">Continue with Google</button>
            <div class="auth-divider"><span>or use email</span></div>
            <form id="auth-form" class="auth-form">
              <label>Email<input id="auth-email" type="email" autocomplete="email" required /></label>
              <label>Password<input id="auth-password" type="password" autocomplete="current-password" minlength="6" required /></label>
              <div class="btn-row">
                <button class="btn btn-primary" type="submit" data-action="signup">Create account</button>
                <button class="btn" type="button" id="email-signin">Sign in</button>
                <button class="btn btn-ghost" type="button" id="reset-password">Reset password</button>
              </div>
            </form>
          `}
          <p id="auth-message" class="faint auth-message" aria-live="polite"></p>
          <div class="callout" style="margin-top:1rem"><strong>Privacy:</strong> microphone audio stays on your device. Campfire syncs lesson progress, practice totals, learning preferences, chord-change records, and private lesson feedback.</div>
        </section>`;

      const message = root.querySelector('#auth-message');
      const busy = (text) => { if (message) message.textContent = text; };

      root.querySelector('#google-auth')?.addEventListener('click', async () => {
        busy('Opening Google sign-in…');
        try {
          const provider = new authApi.GoogleAuthProvider();
          if (auth.currentUser?.isAnonymous) await authApi.linkWithPopup(auth.currentUser, provider);
          else await authApi.signInWithPopup(auth, provider);
          continueToLessons();
        } catch (error) {
          if (error.code === 'auth/credential-already-in-use') {
            const credential = authApi.GoogleAuthProvider.credentialFromError(error);
            if (credential) {
              await authApi.signInWithCredential(auth, credential);
              continueToLessons();
            }
            else busy(friendlyError(error));
          } else busy(friendlyError(error));
        }
      });

      const emailValues = () => ({
        email: root.querySelector('#auth-email').value.trim(),
        password: root.querySelector('#auth-password').value,
      });

      root.querySelector('#auth-form')?.addEventListener('submit', async (event) => {
        event.preventDefault();
        const { email, password } = emailValues();
        busy('Creating your account…');
        try {
          if (auth.currentUser?.isAnonymous) {
            const credential = authApi.EmailAuthProvider.credential(email, password);
            await authApi.linkWithCredential(auth.currentUser, credential);
          } else await authApi.createUserWithEmailAndPassword(auth, email, password);
          continueToLessons();
        } catch (error) {
          if (error.code === 'auth/email-already-in-use' || error.code === 'auth/credential-already-in-use') {
            try {
              await authApi.signInWithEmailAndPassword(auth, email, password);
              continueToLessons();
            }
            catch (signInError) { busy(friendlyError(signInError)); }
          } else busy(friendlyError(error));
        }
      });

      root.querySelector('#email-signin')?.addEventListener('click', async () => {
        const { email, password } = emailValues();
        busy('Signing in…');
        try {
          await authApi.signInWithEmailAndPassword(auth, email, password);
          continueToLessons();
        }
        catch (error) { busy(friendlyError(error)); }
      });

      root.querySelector('#reset-password')?.addEventListener('click', async () => {
        const { email } = emailValues();
        if (!email) { busy('Enter your email address first.'); return; }
        try {
          await authApi.sendPasswordResetEmail(auth, email);
          busy('Password reset email sent.');
        } catch (error) { busy(friendlyError(error)); }
      });

      root.querySelector('#sign-out')?.addEventListener('click', async () => {
        busy('Saving progress and signing out…');
        const saved = await flushCloudProgress();
        if (!saved) {
          busy('Could not reach cloud sync. You are still signed in and your progress is safe on this device. Check the connection, then try Sign out again.');
          return;
        }
        disconnectCloudProgress();
        clearLocalProgress();
        await authApi.signOut(auth);
      });

      root.querySelector('#delete-account')?.addEventListener('click', async () => {
        if (!confirm('Delete this account and all Campfire progress? This cannot be undone.')) return;
        busy('Deleting your progress and account…');
        try {
          const ref = services.firestoreApi.doc(services.db, 'users', user.uid, 'state', 'progress');
          await services.firestoreApi.deleteDoc(ref);
          try {
            await authApi.deleteUser(user);
          } catch (deleteError) {
            // Restore progress if Auth requires the learner to sign in again first.
            await flushCloudProgress();
            throw deleteError;
          }
          disconnectCloudProgress();
          clearLocalProgress();
        } catch (error) {
          busy(error.code === 'auth/requires-recent-login'
            ? 'For security, sign out and sign back in before deleting your account.'
            : friendlyError(error));
        }
      });
    };

    this.unsubscribe = authApi.onAuthStateChanged(auth, paint);
    paint();
  },
  destroy() {
    this.root = null;
    this.unsubscribe?.();
    this.unsubscribe = null;
  },
};
