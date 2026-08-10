// Build a deliberately identity-free summary a learner can choose to share with the
// Campfire pilot owner. No uid, email, name, raw timestamps, microphone data, or audio.
export function buildPilotReport(state, lessonTitles = {}) {
  const practice = Object.values(state.practiceSeconds || {})
    .map(Number)
    .filter((seconds) => Number.isFinite(seconds) && seconds >= 0);
  const feedback = Object.entries(state.feedback || {}).map(([lessonId, item]) => ({
    lesson: lessonTitles[lessonId] || lessonId,
    rating: item?.rating || 'unknown',
  }));
  const feedbackCounts = feedback.reduce((counts, item) => {
    counts[item.rating] = (counts[item.rating] || 0) + 1;
    return counts;
  }, {});

  return {
    reportVersion: 1,
    learningPath: state.profile?.genre || 'not chosen',
    handedness: state.profile?.hand || 'not chosen',
    experience: state.profile?.experience || 'not chosen',
    completedLessons: Object.keys(state.done || {}).length,
    practicedDays: practice.filter((seconds) => seconds >= 60).length,
    totalPracticeMinutes: Math.round(practice.reduce((sum, seconds) => sum + seconds, 0) / 60),
    skillChecksPassed: Object.keys(state.skillProofs || {}).length,
    bestChordChanges: { ...(state.bestChanges || {}) },
    feedbackCounts,
    lessonFeedback: feedback,
  };
}

export function formatPilotReport(report) {
  const feedback = report.lessonFeedback.length
    ? report.lessonFeedback.map((item) => `- ${item.lesson}: ${item.rating}`).join('\n')
    : '- No lesson feedback yet';
  const changes = Object.keys(report.bestChordChanges).length
    ? Object.entries(report.bestChordChanges).map(([pair, count]) => `${pair}: ${count}`).join(', ')
    : 'none yet';

  return `Campfire pilot report
Learning path: ${report.learningPath}
Handedness: ${report.handedness}
Starting experience: ${report.experience}
Lessons completed: ${report.completedLessons}
Practice days: ${report.practicedDays}
Practice minutes: ${report.totalPracticeMinutes}
Skill checks passed: ${report.skillChecksPassed}
Best chord changes: ${changes}

Lesson feedback:
${feedback}

Privacy: this report excludes name, email, account ID, audio, microphone data, and exact activity dates.`;
}
