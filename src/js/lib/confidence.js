// Shared confidence policy for microphone chord recognition.
// Similarity says "this resembles X"; margin says "X clearly beat the alternatives."
export function isConfidentMatch(best, minSimilarity = 0.86, minMargin = 0.025) {
  return !!best?.name && best.sim >= minSimilarity && best.margin >= minMargin;
}
