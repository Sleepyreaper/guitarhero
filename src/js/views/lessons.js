import { CURRICULUM, ALL_LESSONS, LESSON_BY_ID } from '../data/curriculum.js';
import { CHORD_BY_NAME } from '../data/chords.js';
import { SONG_BY_ID } from '../data/songs.js';
import { chordSVG } from '../components/chordDiagram.js';
import { isDone, setDone, setLastLesson } from '../lib/storage.js';

function overview(root) {
  root.innerHTML = `
    <p class="eyebrow">Your path from zero</p>
    <h1>Learn guitar</h1>
    <p class="lead">Six short units. Each one ends on a real, playable song so you always have something
    to show for your practice. Do a little every day — 15–20 minutes beats one long weekly session.</p>
    ${CURRICULUM.map((u) => {
      const allDone = u.lessons.every((l) => isDone(l.id));
      return `
      <section class="panel ${allDone ? '' : ''}" style="margin-top:1rem">
        <div class="unit ${allDone ? 'done' : ''}">
          <div style="display:flex;justify-content:space-between;align-items:baseline;gap:1rem">
            <h2 style="margin:0">${u.title}</h2>
            <span class="pill ${allDone ? 'green' : ''}">${u.lessons.filter((l) => isDone(l.id)).length}/${u.lessons.length}</span>
          </div>
          <p class="muted" style="margin:.2rem 0 .6rem">${u.blurb}</p>
          ${u.lessons.map((l) => `
            <a class="lesson-item" href="#/learn/${l.id}">
              <span class="lesson-check ${isDone(l.id) ? 'done' : ''}">${isDone(l.id) ? '✓' : ''}</span>
              <span class="lesson-title">${l.title}</span>
              <span class="lesson-meta pill">${l.min} min</span>
            </a>`).join('')}
        </div>
      </section>`;
    }).join('')}
  `;
}

function detail(root, lessonId) {
  const lesson = LESSON_BY_ID[lessonId];
  if (!lesson) return overview(root);
  setLastLesson(lessonId);

  const idx = ALL_LESSONS.findIndex((l) => l.id === lessonId);
  const next = ALL_LESSONS[idx + 1];
  const song = lesson.songId ? SONG_BY_ID[lesson.songId] : null;
  const done = isDone(lessonId);

  root.innerHTML = `
    <a class="back-link" href="#/learn">← All lessons</a>
    <p class="eyebrow">Lesson ${idx + 1} of ${ALL_LESSONS.length} · ${lesson.min} min</p>
    <h1>${lesson.title}</h1>
    <p class="lead">${lesson.objective}</p>

    ${lesson.chords ? `
      <div class="grid chords-grid" style="margin-bottom:1.1rem">
        ${lesson.chords.map((n) => CHORD_BY_NAME[n] ? `
          <div class="panel chord-card"><div class="chord-name">${n}</div>${chordSVG(CHORD_BY_NAME[n])}<div class="chord-sub">${CHORD_BY_NAME[n].label}</div></div>` : '').join('')}
      </div>` : ''}

    <section class="panel">
      <h3>Do this</h3>
      <ol class="steps">${lesson.steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      ${lesson.chords && lesson.chords[0] && CHORD_BY_NAME[lesson.chords[0]] ? `<p class="faint" style="margin:.4rem 0 0">💡 ${CHORD_BY_NAME[lesson.chords[0]].tip}</p>` : ''}
    </section>

    ${lesson.goal ? `<div class="callout" style="margin-top:1rem">🎯 <strong>Practice goal:</strong> ${lesson.goal}</div>` : ''}

    ${lesson.tool ? `<div class="btn-row" style="margin-top:1rem"><a class="btn" href="${lesson.tool}">Open the ${lesson.tool.replace('#/', '')} →</a></div>` : ''}

    ${song ? `
      <div class="panel" style="margin-top:1rem;display:flex;justify-content:space-between;align-items:center;gap:1rem;flex-wrap:wrap">
        <div><span class="pill rust">Song</span> <strong style="margin-left:.4rem">${song.title}</strong>
          <div class="faint" style="font-size:.85rem">${song.chords.join(' · ')} · ${song.time}</div></div>
        <a class="btn btn-primary" href="#/songs/${song.id}">Open song chart →</a>
      </div>` : ''}

    <div class="btn-row" style="margin-top:1.4rem;justify-content:space-between">
      <button id="mark" class="btn ${done ? '' : 'btn-primary'}">${done ? '✓ Completed — undo' : 'Mark complete'}</button>
      ${next ? `<a class="btn ${done ? 'btn-primary' : ''}" href="#/learn/${next.id}">Next: ${next.title} →</a>` : `<a class="btn btn-primary" href="#/learn">Finish 🎉</a>`}
    </div>
  `;

  root.querySelector('#mark').addEventListener('click', () => {
    setDone(lessonId, !isDone(lessonId));
    detail(root, lessonId); // re-render
  });
}

export default {
  render(root, param) {
    if (param) detail(root, param);
    else overview(root);
  },
  destroy() {},
};
