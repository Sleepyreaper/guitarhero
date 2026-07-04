// Shared Web Audio context + a simple plucked-string synth for "hear it" buttons.
let ctx = null;

export function getAudioContext() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    ctx = new AC();
  }
  // Browsers start the context suspended until a user gesture.
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

// Pluck a single note with a fast attack and exponential decay (guitar-ish).
export function pluck(freq, when = 0, dur = 1.4, gain = 0.22) {
  const ac = getAudioContext();
  const t0 = ac.currentTime + when;

  const osc = ac.createOscillator();
  const osc2 = ac.createOscillator();
  osc.type = 'triangle';
  osc2.type = 'sine';
  osc.frequency.value = freq;
  osc2.frequency.value = freq * 2; // a touch of octave shimmer

  const g = ac.createGain();
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.exponentialRampToValueAtTime(gain, t0 + 0.006);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);

  const g2 = ac.createGain();
  g2.gain.value = 0.35;

  osc.connect(g);
  osc2.connect(g2).connect(g);
  g.connect(ac.destination);

  osc.start(t0); osc2.start(t0);
  osc.stop(t0 + dur); osc2.stop(t0 + dur);
}

// Strum a chord by staggering the plucks slightly (low-to-high).
export function strum(freqs, spread = 0.035) {
  freqs.forEach((f, i) => pluck(f, i * spread, 1.6, 0.18));
}

// Strum at a precise AudioContext time (for scheduled accompaniment/backing).
export function strumAt(freqs, atTime, gain = 0.16, spread = 0.028) {
  const ac = getAudioContext();
  const when = Math.max(0, atTime - ac.currentTime);
  freqs.forEach((f, i) => pluck(f, when + i * spread, 1.5, gain));
}
