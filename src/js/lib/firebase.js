// Firebase bootstrap for the no-build app.
// On Firebase Hosting, /__/firebase/init.json supplies the active project's public config.
// Local/Docker installs simply continue in local-only mode when that URL is unavailable.
const SDK = 'https://www.gstatic.com/firebasejs/12.16.0';

let servicesPromise;

export async function getFirebaseServices() {
  if (servicesPromise) return servicesPromise;
  servicesPromise = (async () => {
    try {
      const configResponse = await fetch('/__/firebase/init.json', { cache: 'no-store' });
      if (!configResponse.ok) throw new Error('Firebase Hosting configuration is unavailable');
      const config = await configResponse.json();
      const [{ initializeApp }, authApi, firestoreApi] = await Promise.all([
        import(`${SDK}/firebase-app.js`),
        import(`${SDK}/firebase-auth.js`),
        import(`${SDK}/firebase-firestore.js`),
      ]);
      const app = initializeApp(config);
      return {
        available: true,
        app,
        auth: authApi.getAuth(app),
        db: firestoreApi.getFirestore(app),
        authApi,
        firestoreApi,
      };
    } catch (error) {
      console.info('Campfire cloud sync is unavailable; using this device only.', error.message);
      return { available: false, error };
    }
  })();
  return servicesPromise;
}
export async function startCloudSession(onUser) {
  const services = await getFirebaseServices();
  if (!services.available) {
    onUser?.(null, services);
    return () => {};
  }

  const { auth, authApi } = services;
  return authApi.onAuthStateChanged(auth, async (user) => {
    if (!user) {
      try {
        await authApi.signInAnonymously(auth);
      } catch (error) {
        console.warn('Anonymous sign-in failed.', error);
        onUser?.(null, services);
      }
      return;
    }
    onUser?.(user, services);
  });
}
