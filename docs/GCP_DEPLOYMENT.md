# Deploy Campfire on GCP with Firebase

Campfire uses Firebase services inside the same Google Cloud project:

- **Firebase Hosting** — public HTTPS site and CDN
- **Firebase Authentication** — anonymous, Google, and email/password accounts
- **Cloud Firestore** — one private progress document per account

Microphone audio never leaves the browser. Only lesson progress, verified practice totals,
routine checks, and personal bests synchronize.

## One-time console setup

1. Open [Firebase Console](https://console.firebase.google.com/) and choose **Add project**.
2. Select the existing Google Cloud project you want to use. Google Analytics is optional.
3. Under **Build → Authentication**, click **Get started** and enable:
   - Anonymous
   - Google
   - Email/Password
4. Under **Build → Firestore Database**, create the `(default)` database in **Production mode**.
   Choose a region near the expected learners; the database location cannot be changed later.
5. In Google Cloud Billing, create a small budget alert. Budget alerts notify you; they do not
   automatically cap spending.

## First deployment from Google Cloud Shell

Open Cloud Shell from the Google Cloud Console, then run:

```bash
git clone https://github.com/Sleepyreaper/guitarhero.git
cd guitarhero
npx firebase-tools login --no-localhost
npx firebase-tools use --add
npx firebase-tools deploy --only hosting,firestore:rules
```

During `use --add`, select the Firebase/GCP project and use the alias `default`.
The deploy output prints the public `https://PROJECT_ID.web.app` URL.

For later deployments:

```bash
cd ~/guitarhero
git pull
npx firebase-tools deploy --only hosting,firestore:rules
```

## How configuration works

The app fetches `/__/firebase/init.json`, a Firebase Hosting reserved URL containing the public
configuration for whichever project hosts the site. Nothing secret is committed to GitHub, and
the same source can be deployed to a staging project later.

When served from Python or Docker instead, that endpoint is unavailable and Campfire safely
continues in local-only mode. Sleepycore remains a useful private test deployment.

## Data and security

Progress is stored at:

```text
users/{firebase-auth-uid}/state/progress
```

`firestore.rules` permits access only when the authenticated UID matches the path. Deploy the
version-controlled rules with every release; never replace them with an allow-all test rule.

The app saves locally first, merges existing browser progress into the account, and batches cloud
writes on a ten-second delay. Practice audio is analyzed locally and is never uploaded.

## Optional custom domain

In Firebase Console, open **Hosting → Add custom domain** and follow the DNS instructions. Firebase
provisions and renews the TLS certificate automatically. Add the final domain to Authentication's
**Authorized domains** list if it is not added automatically.

## Before inviting more than a few friends

- Enable Firebase App Check with reCAPTCHA Enterprise and monitor it before enforcing.
- Add downloadable data export if the beta grows beyond a small friend group.
- Add automated rule tests with the Firebase Emulator Suite.
- Add GitHub Actions deployment after creating a narrowly scoped service account.
