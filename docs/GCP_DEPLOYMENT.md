# Deploy Campfire on GCP with Firebase

Campfire uses Firebase services inside the same Google Cloud project:

- **Firebase Hosting** — public HTTPS site and CDN
- **Firebase Authentication** — anonymous, Google, and email/password accounts
- **Cloud Firestore** — one private progress document per account

Microphone audio never leaves the browser. Only lesson progress, mic-confirmed practice totals,
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

## Production domain: campfire.sleepyreaper.com

After the first successful deployment:

1. In Firebase Console, open **Build → Hosting** and click **Add custom domain**.
2. Enter `campfire.sleepyreaper.com` and continue through Firebase's verification wizard.
3. Keep that wizard open; it supplies the exact DNS records for this Hosting site.
4. In Namecheap, open **Domain List → sleepyreaper.com → Manage → Advanced DNS**.
5. Under **Host Records**, add each record Firebase requested:
   - For records whose full host is `campfire.sleepyreaper.com`, enter only `campfire` in
     Namecheap's **Host** field.
   - For a verification or ACME host, remove only the `.sleepyreaper.com` suffix and enter the
     remaining host exactly as Firebase provided it.
   - Copy Firebase's **Value/Target** exactly and use Automatic or the lowest available TTL.
6. Do not alter records for `@`, `www`, MX/email, or unrelated subdomains.
7. Return to Firebase and click **Verify**. DNS may begin resolving in roughly 30 minutes, while
   trusted TLS certificate provisioning can take up to 24 hours.
8. Under **Build → Authentication → Settings → Authorized domains**, confirm that
   `campfire.sleepyreaper.com` is listed; add it if necessary.

Once Firebase reports **Connected**, use `https://campfire.sleepyreaper.com` as the production URL.
Firebase provisions and renews its trusted TLS certificate automatically, so browser microphone
permission works without a self-signed-certificate warning.

If Namecheap's **Advanced DNS → Host Records** is not editable, the domain is using different
authoritative nameservers. Add the same Firebase-provided records at that DNS provider instead.

## Before inviting more than a few friends

- Enable Firebase App Check with reCAPTCHA Enterprise and monitor it before enforcing.
- Add downloadable data export if the beta grows beyond a small friend group.
- Add automated rule tests with the Firebase Emulator Suite.
- Add GitHub Actions deployment after creating a narrowly scoped service account.
