import { ALL_LESSONS } from '../data/curriculum.js';
import { getState } from '../lib/storage.js';
import { buildPilotReport, formatPilotReport } from '../lib/report.js';

const LABELS = {
  clear: 'Clear',
  stuck: 'Got stuck',
  'listener-wrong': 'Microphone judged incorrectly',
};
const esc = (value) => String(value).replace(/[&<>"']/g, (char) => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
}[char]));

export default {
  render(root) {
    const titles = Object.fromEntries(ALL_LESSONS.map((lesson) => [lesson.id, lesson.title]));
    const report = buildPilotReport(getState(), titles);
    const text = formatPilotReport(report);
    root.innerHTML = `
      <p class="eyebrow">Private pilot handoff</p>
      <h1>Your Campfire report</h1>
      <p class="lead">This summary helps improve Campfire without sharing your name, email, account ID, exact practice dates, or microphone audio.</p>

      <div class="grid cards-3 report-stats">
        <div class="panel stat"><div class="n">${report.completedLessons}</div><div class="l">lessons</div></div>
        <div class="panel stat"><div class="n">${report.practicedDays}</div><div class="l">practice days</div></div>
        <div class="panel stat"><div class="n">${report.totalPracticeMinutes}</div><div class="l">practice minutes</div></div>
        <div class="panel stat"><div class="n">${report.skillChecksPassed}</div><div class="l">skill checks</div></div>
      </div>

      <section class="panel" style="margin-top:1rem">
        <h2>Lesson feedback</h2>
        ${report.lessonFeedback.length ? `<ul>${report.lessonFeedback.map((item) => `<li><strong>${esc(item.lesson)}</strong>: ${esc(LABELS[item.rating] || item.rating)}</li>`).join('')}</ul>` : '<p class="muted">No lesson feedback yet. Use the buttons at the bottom of any lesson.</p>'}
      </section>

      <section class="panel" style="margin-top:1rem">
        <h2>Share only when you choose</h2>
        <p class="muted">Copying puts this summary on your clipboard. Campfire does not send it anywhere automatically.</p>
        <button class="btn btn-primary" id="copy-report" type="button">Copy privacy-safe report</button>
        <span id="copy-status" class="faint" aria-live="polite"></span>
        <details style="margin-top:1rem"><summary>Preview report text</summary><pre class="report-preview"></pre></details>
      </section>
    `;
    root.querySelector('.report-preview').textContent = text;
    root.querySelector('#copy-report').addEventListener('click', async () => {
      const status = root.querySelector('#copy-status');
      try {
        await navigator.clipboard.writeText(text);
        status.textContent = 'Copied. Paste it into a message when you are ready.';
      } catch {
        status.textContent = 'Clipboard access was blocked. Open the preview and copy the text manually.';
      }
    });
  },
  destroy() {},
};
