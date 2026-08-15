const REQUIRED_SAMPLES = 36;
const MAX_SAMPLES = 60;

const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

export function createChordCheck(targets = ['Em', 'G', 'C', 'D']) {
  return targets.map((target) => ({ target, samples: [] }));
}

export function addChordCheckReading(row, best, frame, clear, targetLocked, targetSimilarity = null) {
  if (!row || !frame?.active || !best?.name || row.samples.length >= MAX_SAMPLES) return;
  row.samples.push({
    heard: best.name,
    similarity: Number(best.sim) || 0,
    margin: Number(best.margin) || 0,
    clear: !!clear,
    targetLocked: !!targetLocked,
    maxDb: Number.isFinite(frame.maxDb) ? frame.maxDb : null,
    noiseGateDb: Number.isFinite(frame.noiseGateDb) ? frame.noiseGateDb : null,
    targetSimilarity: Number.isFinite(targetSimilarity) ? targetSimilarity : null,
  });
}

export function summarizeChordCheck(row) {
  const samples = row.samples || [];
  const counts = samples.reduce((all, sample) => {
    all[sample.heard] = (all[sample.heard] || 0) + 1;
    return all;
  }, {});
  const heard = Object.entries(counts).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))[0]?.[0] || '—';
  const pct = (test) => samples.length ? Math.round(samples.filter(test).length / samples.length * 100) : 0;
  return {
    target: row.target,
    heard,
    clearPct: pct((sample) => sample.clear),
    targetPct: pct((sample) => sample.targetLocked),
    medianSimilarity: median(samples.map((sample) => sample.similarity)),
    medianMargin: median(samples.map((sample) => sample.margin)),
    medianMaxDb: median(samples.map((sample) => sample.maxDb).filter(Number.isFinite)),
    medianNoiseGateDb: median(samples.map((sample) => sample.noiseGateDb).filter(Number.isFinite)),
    medianTargetSimilarity: median(samples.map((sample) => sample.targetSimilarity).filter(Number.isFinite)),
    count: samples.length,
    sampled: samples.length >= REQUIRED_SAMPLES,
  };
}

export function formatChordCheck(rows, micLabel = 'unknown microphone', sampleRate) {
  const rate = sampleRate ? `${Math.round(sampleRate)} Hz` : 'unknown';
  const sampled = rows.filter((row) => summarizeChordCheck(row).sampled).length;
  const fmt = (value, digits = 2) => value == null ? 'n/a' : value.toFixed(digits);
  return [
    'Campfire four-chord mic check (derived measurements only; no audio)',
    'Policy: guided-v3 (0.72 similarity + complete target-note coverage at 0.22)',
    `Coverage: ${sampled}/${rows.length} chords sampled`,
    `Mic: ${micLabel || 'unknown microphone'}`,
    `Sample rate: ${rate}`,
    ...rows.map((row) => {
      const item = summarizeChordCheck(row);
      return `${item.target}: heard ${item.heard} | clear ${item.clearPct}% | target lock ${item.targetPct}% | target similarity ${fmt(item.medianTargetSimilarity)} | best similarity ${fmt(item.medianSimilarity)} | median margin ${fmt(item.medianMargin, 3)} | input ${fmt(item.medianMaxDb, 1)} dB | room gate ${fmt(item.medianNoiseGateDb, 1)} dB`;
    }),
  ].join('\n');
}
