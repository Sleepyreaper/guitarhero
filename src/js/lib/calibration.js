const median = (values) => {
  if (!values.length) return null;
  const sorted = [...values].sort((a, b) => a - b);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[middle] : (sorted[middle - 1] + sorted[middle]) / 2;
};

export function createMicCheck(strings) {
  return strings.map((string) => ({ string, frames: 0, signal: 0, clear: 0, locked: 0, frequencies: [], clarities: [] }));
}

export function addMicCheckReading(row, reading, targetFreq, minClarity = 0.6) {
  // Ignore room silence between plucks so leaving a string selected cannot make its
  // score decay. A row represents audible guitar frames, not elapsed wall time.
  if (reading.level < 0.004) return;
  row.frames += 1;
  if (reading.level >= 0.008) row.signal += 1;
  if (!reading.raw || reading.raw.clarity < minClarity) return;

  row.clear += 1;
  row.frequencies.push(reading.raw.freq);
  row.clarities.push(reading.raw.clarity);
  const cents = 1200 * Math.log2(reading.raw.freq / targetFreq);
  if (Math.abs(cents) <= 35) row.locked += 1;
}

export function summarizeMicCheck(row) {
  const pct = (part, whole) => whole ? Math.round(part / whole * 100) : 0;
  return {
    label: row.string.label,
    signalPct: pct(row.signal, row.frames),
    clearPct: pct(row.clear, row.frames),
    lockPct: pct(row.locked, row.clear),
    medianFreq: median(row.frequencies),
    medianClarity: median(row.clarities),
    sampled: row.frames >= 20 && row.signal >= 5,
  };
}

export function formatMicCheck(rows, micLabel = 'unknown microphone', sampleRate = null) {
  const lines = [
    'Campfire six-string mic check (derived measurements only; no audio)',
    `Mic: ${micLabel || 'unknown microphone'}`,
    `Sample rate: ${sampleRate ? `${sampleRate} Hz` : 'unknown'}`,
  ];
  rows.map(summarizeMicCheck).forEach((row) => {
    const frequency = row.medianFreq ? `${row.medianFreq.toFixed(1)} Hz` : '--';
    const clarity = row.medianClarity ? row.medianClarity.toFixed(2) : '--';
    lines.push(`${row.label}: signal ${row.signalPct}% | clear ${row.clearPct}% | target lock ${row.lockPct}% | median ${frequency} | clarity ${clarity}`);
  });
  return lines.join('\n');
}
