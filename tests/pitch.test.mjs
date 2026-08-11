import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

// The app deliberately has no package.json/build step. Load its browser ES module as a
// data URL so this test remains runnable with plain Node in Cloud Shell.
const source = await readFile(new URL('../src/js/lib/pitch.js', import.meta.url), 'utf8');
const pitch = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);

const sampleRate = 48000;
const size = 4096;

function guitarString(freq, { cents = 0, fundamental = 0.45 } = {}) {
  const actual = freq * 2 ** (cents / 1200);
  const out = new Float32Array(size);
  // A deterministic, harmonic-rich pluck. The low fundamental can be much quieter than
  // its second harmonic on real acoustic-guitar and USB-microphone combinations.
  const amplitudes = [fundamental, 0.75, 0.36, 0.18, 0.09];
  for (let i = 0; i < size; i++) {
    const t = i / sampleRate;
    const envelope = Math.exp(-t * 2.2);
    let value = 0;
    for (let h = 1; h <= amplitudes.length; h++) {
      value += amplitudes[h - 1] * Math.sin(2 * Math.PI * actual * h * t + h * 0.17);
    }
    out[i] = value * envelope * 0.35 + Math.sin(i * 12.9898) * 0.0008;
  }
  return { out, actual };
}

for (const string of pitch.STRINGS) {
  const target = pitch.midiToFreq(string.midi);
  for (const cents of [-100, 0, 100]) {
    const { out, actual } = guitarString(target, { cents, fundamental: string.midi <= 45 ? 0.12 : 0.4 });
    const result = pitch.autoCorrelate(out, sampleRate, target);
    assert.ok(result, `${string.label} ${cents}c should produce a reading`);
    const error = Math.abs(1200 * Math.log2(result.freq / actual));
    assert.ok(error < 8, `${string.label} ${cents}c error was ${error.toFixed(1)} cents (${result.freq.toFixed(1)} Hz)`);
  }
}

const pureA = guitarString(110, { fundamental: 1 }).out;
const automatic = pitch.autoCorrelate(pureA, sampleRate);
assert.ok(automatic && Math.abs(automatic.freq - 110) < 0.8, 'automatic mode should detect a clear A2');

assert.equal(pitch.autoCorrelate(new Float32Array(size), sampleRate, 82.41), null, 'silence must be rejected');

const roomHum = new Float32Array(size);
for (let i = 0; i < size; i++) roomHum[i] = Math.sin(2 * Math.PI * 110 * i / sampleRate) * 0.01;
assert.ok(pitch.autoCorrelate(roomHum, sampleRate, 110), 'a fixed global gate would mistake periodic room hum for a string');
assert.equal(pitch.autoCorrelate(roomHum, sampleRate, 110, 0.02), null,
  'the calibrated tuner gate must reject periodic sound below this room’s signal floor');

console.log('pitch tests passed: six strings, ±100 cents, harmonic-heavy low strings, auto mode, silence');
