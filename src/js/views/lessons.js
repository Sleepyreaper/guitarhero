import {
  CURRICULUM, ALL_LESSONS, LESSON_BY_ID, LEARNING_STAGES, STAGE_BY_LESSON,
} from '../data/curriculum.js';
import { CHORD_BY_NAME } from '../data/chords.js';
import { SONG_BY_ID } from '../data/songs.js';
import { chordSVG } from '../components/chordDiagram.js';
import {
  getFeedback, getProfile, isDone, isSkillProven, saveFeedback, setDone, setLastLesson, setSkillProof,
} from '../lib/storage.js';

function videoBlock(video) {
  if (!video) return '';
  const url = `https://www.youtube.com/watch?v=${video.id}`;
  return `
    <section class="panel lesson-video" style="margin-top:1rem" data-video-id="${video.id}">
      <div class="lesson-video-copy">
        <p class="eyebrow">Watch it happen</p>
        <h3>${video.title}</h3>
        <p class="muted">${video.teacher} · <strong>Watch for:</strong> ${video.watchFor}</p>
        <div class="btn-row">
          <button class="btn btn-primary load-video" type="button">▶ Watch demonstration</button>
          <a class="btn btn-ghost" href="${url}" target="_blank" rel="noopener noreferrer">Open on YouTube ↗</a>
        </div>
      </div>
      <div class="video-slot" aria-live="polite"></div>
      <p class="faint video-privacy">The embedded player loads only after you press Watch. Video is provided by ${video.teacher} on YouTube.</p>
    </section>`;
}

function proofBlock(proof) {
  if (!proof) return '';
  const proven = isSkillProven(proof.id);
  return `
    <section class="panel skill-proof ${proven ? 'proven' : ''}" style="margin-top:1rem">
      <p class="eyebrow">Prove it—or skip ahead</p>
      <h3>${proven ? '✓ ' : ''}${proof.title}</h3>
      <p class="muted">${proof.check}</p>
      <p class="faint">Use your ears and judgment. Campfire will never fail you just because the microphone is uncertain.</p>
      <button class="btn ${proven ? '' : 'btn-primary'} proof-toggle" data-proof="${proof.id}" type="button">
        ${proven ? 'Undo skill check' : 'I did it—mark this skill passed'}
      </button>
    </section>`;
}

function overview(root) {
  const stageCards = LEARNING_STAGES.map((stage) => {
    const lessons = stage.lessonIds.map((id) => LESSON_BY_ID[id]);
    const completed = lessons.filter((lesson) => isDone(lesson.id)).length;
    const proofs = lessons.filter((lesson) => lesson.proof);
    const passed = proofs.filter((lesson) => isSkillProven(lesson.proof.id)).length;
    const next = lessons.find((lesson) => !isDone(lesson.id)) || lessons.at(-1);
    const pct = Math.round((completed / lessons.length) * 100);
    return `
      <article class="panel stage-card ${completed === lessons.length ? 'done' : ''}">
        <div class="stage-head"><div><p class="eyebrow">${stage.label}</p><h3>${stage.title}</h3></div>
          <span class="pill ${completed === lessons.length ? 'green' : ''}">${completed}/${lessons.length}</span></div>
        <div class="progress-track"><div class="progress-fill" style="width:${pct}%"></div></div>
        <p><strong>Practice:</strong> ${stage.practice}</p>
        <p class="muted"><strong>Ready when:</strong> ${stage.checkpoint}</p>
        <div class="stage-foot"><span class="faint">${proofs.length ? `${passed}/${proofs.length} skill checks passed` : 'Song performance is the checkpoint'}</span>
          <a class="btn" href="#/learn/${next.id}">${completed ? 'Review' : 'Continue'} →</a></div>
      </article>`;
  }).join('');
  root.innerHTML = `
    <p class="eyebrow">Your path from zero</p>
    <h1>Learn guitar</h1>
    <p class="lead">Nine flexible stages from first touch to accompanying a singer. “Week” is a pacing guide,
    never a deadline: repeat a stage until its ready-when checkpoint feels dependable.</p>
    <div class="callout mastery-note">Progress has two layers: <strong>Completed</strong> means you worked through a lesson;
      <strong>skill passed</strong> means you demonstrated its checkpoint. Slow, honest progress wins.</div>
    <div class="stage-grid">${stageCards}</div>

    <p class="eyebrow" style="margin-top:1.6rem">All lessons by unit</p>
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
  const feedback = getFeedback(lessonId);
  const stage = STAGE_BY_LESSON[lessonId];
  const leftHanded = getProfile()?.hand === 'left';
  const steps = lesson.steps.map((step) => leftHanded
    ? step.replace('low E on the left', 'low E on the right').replace('low-E on the left', 'low-E on the right')
    : step);

  root.innerHTML = `
    <a class="back-link" href="#/learn">← All lessons</a>
    <p class="eyebrow">${stage?.label || ''} · Lesson ${idx + 1} of ${ALL_LESSONS.length} · ${lesson.min} min</p>
    <h1>${lesson.title}</h1>
    <p class="lead">${lesson.objective}</p>
    ${stage ? `<p class="faint stage-context"><strong>${stage.title}:</strong> ${stage.checkpoint}</p>` : ''}

    ${[lesson.video, ...(lesson.extraVideos || [])].filter(Boolean).map(videoBlock).join('')}

    ${lesson.chords ? `
      ${leftHanded ? '<p class="pill gold">Left-handed diagrams are mirrored</p>' : ''}
      <div class="grid chords-grid" style="margin-bottom:1.1rem">
        ${lesson.chords.map((n) => CHORD_BY_NAME[n] ? `
          <div class="panel chord-card"><div class="chord-name">${n}</div>${chordSVG(CHORD_BY_NAME[n])}<div class="chord-sub">${CHORD_BY_NAME[n].label}</div></div>` : '').join('')}
      </div>` : ''}

    <section class="panel">
      <h3>Do this</h3>
      <ol class="steps">${steps.map((s) => `<li>${s}</li>`).join('')}</ol>
      ${lesson.chords && lesson.chords[0] && CHORD_BY_NAME[lesson.chords[0]] ? `<p class="faint" style="margin:.4rem 0 0">💡 ${CHORD_BY_NAME[lesson.chords[0]].tip}</p>` : ''}
    </section>

    ${lesson.goal ? `<div class="callout" style="margin-top:1rem">🎯 <strong>Practice goal:</strong> ${lesson.goal}</div>` : ''}

    ${proofBlock(lesson.proof)}

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

    <section class="panel lesson-feedback" style="margin-top:1.2rem">
      <p class="eyebrow">Private pilot feedback</p>
      <h3>How did this lesson go?</h3>
      <div class="chip-row" style="margin:.7rem 0">
        <button class="chip-btn feedback-btn ${feedback?.rating === 'clear' ? 'sel' : ''}" data-rating="clear" type="button">Clear 👍</button>
        <button class="chip-btn feedback-btn ${feedback?.rating === 'stuck' ? 'sel' : ''}" data-rating="stuck" type="button">I got stuck</button>
        <button class="chip-btn feedback-btn ${feedback?.rating === 'listener-wrong' ? 'sel' : ''}" data-rating="listener-wrong" type="button">Mic judged me wrong</button>
      </div>
      <p class="faint feedback-status">${feedback ? 'Saved privately with your progress.' : 'One tap helps us improve the pilot. This is not public.'}</p>
    </section>
  `;

  root.querySelectorAll('.load-video').forEach((button) => {
    button.addEventListener('click', (event) => {
      const section = event.currentTarget.closest('.lesson-video');
      const slot = section.querySelector('.video-slot');
      const id = section.dataset.videoId;
      const title = section.querySelector('h3')?.textContent || 'Guitar demonstration';
      slot.innerHTML = `<div class="video-frame"><iframe src="https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1" title="${title}" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen loading="lazy"></iframe></div>`;
      event.currentTarget.remove();
    });
  });

  root.querySelector('.proof-toggle')?.addEventListener('click', (event) => {
    const proofId = event.currentTarget.dataset.proof;
    const proven = !isSkillProven(proofId);
    setSkillProof(proofId, proven);
    if (proven) setDone(lessonId, true);
    detail(root, lessonId);
  });

  root.querySelectorAll('.feedback-btn').forEach((button) => {
    button.addEventListener('click', () => {
      saveFeedback(lessonId, { rating: button.dataset.rating });
      root.querySelectorAll('.feedback-btn').forEach((item) => item.classList.toggle('sel', item === button));
      root.querySelector('.feedback-status').textContent = 'Saved privately with your progress. Thank you.';
    });
  });

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
