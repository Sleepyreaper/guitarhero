// Shared confidence policy for microphone chord recognition.
// Similarity says "this resembles X"; margin says "X clearly beat the alternatives."
export function isConfidentMatch(best, minSimilarity = 0.86, minMargin = 0.025) {
  return !!best?.name && best.sim >= minSimilarity && best.margin >= minMargin;
}

// Guided practice already knows which shape the learner is attempting. Requiring that target
// to beat every richer chord template creates false negatives (C is often absorbed by Fmaj7).
// Similarity plus complete target-note coverage still rejects a clean different triad.
export function isGuidedMatch(target, evaluation, minSimilarity = 0.78) {
  return !!target?.name && target.sim >= minSimilarity && evaluation?.coverage >= 0.99;
}
