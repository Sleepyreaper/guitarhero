export default {
  render(root) {
    root.innerHTML = `
      <p class="eyebrow">Plain-language privacy</p>
      <h1>Your playing stays yours</h1>
      <p class="lead">Campfire is a small guitar-learning pilot. It has no advertising, public profiles, social feed, chat, or public recordings.</p>

      <div class="stack privacy-stack">
        <section class="panel">
          <h2>What Campfire saves</h2>
          <ul>
            <li>Your account identity from Google or email sign-in.</li>
            <li>Lesson completion, practice totals, chord-change records, learning preferences, and private lesson feedback.</li>
            <li>Guest progress stays in this browser. Signed-in progress is also stored privately in Firebase under your account ID.</li>
          </ul>
        </section>

        <section class="panel">
          <h2>Microphone and recordings</h2>
          <p>Microphone audio is analyzed live on your device for tuning, practice time, and chord feedback. Campfire does not upload or save that audio. It stores results such as practice seconds—not the sound itself.</p>
          <p>Your browser asks permission before Campfire can use the microphone. You can revoke that permission in the browser at any time.</p>
        </section>

        <section class="panel">
          <h2>Videos and outside links</h2>
          <p>Lesson videos come from YouTube. The embedded YouTube player is not loaded until you press <strong>Watch demonstration</strong>. Opening YouTube or an outside chord-chart search is then governed by that service's privacy policy.</p>
        </section>

        <section class="panel">
          <h2>Control your data</h2>
          <p>You can use Campfire as a guest, sign out, or delete your account and synced progress from the <a href="#/account">Account</a> page. For a shared device, sign out when you finish.</p>
          <p>For younger learners, a parent or guardian should help choose the account and review outside video links. Do not put personal information into the first-song field or lesson feedback.</p>
        </section>
      </div>

      <div class="callout" style="margin-top:1.2rem"><strong>Pilot promise:</strong> Campfire uses learner data to provide and improve guitar lessons. It does not sell learner information.</div>
    `;
  },
  destroy() {},
};
