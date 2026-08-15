// Shared confidence policy for microphone chord recognition.
// Similarity says "this resembles X"; margin says "X clearly beat the alternatives."
export function isConfidentMatch(best, minSimilarity = 0.86, minMargin = 0.025) {
  return !!best?.name && best.sim >= minSimilarity && best.margin >= minMargin;
}

// Guided practice already knows which shape the learner is attempting. Requiring that target
// to beat every richer chord template creates false negatives (C is often absorbed by Fmaj7).
// Similarity plus complete target-note coverage still rejects a clean different triad.
export function isGuidedMatch(target, evaluation, minSimilarity = 0.72, winnerName = null) {
  if (!target?.name) return false;
  const completeTarget = target.sim >= minSimilarity && evaluation?.coverage >= 0.99;
  // A real acoustic chord can lose one quiet pitch class between FFT frames. Allow that
  // only when the intended shape also wins the open-ended ranking; shared-note chords
  // cannot use this fallback to impersonate the selected target.
  const winnerFallback = target.name === winnerName
    && target.sim >= 0.62 && evaluation?.coverage >= (2 / 3);
  return completeTarget || winnerFallback;
}
