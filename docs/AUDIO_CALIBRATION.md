# Audio calibration evidence

This file records derived measurements only. It contains no recorded audio.

## 2026-08-15 — six-string tuner check

- Microphone: Elgato Wave:3 (USB `0fd9:0070`)
- Browser audio sample rate: 96,000 Hz
- Room-noise gate: 0.0040
- Guitar tuning: standard E A D G B E

| String | Signal | Clear | Target lock | Median | Clarity | Input | Pitch offset |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Low E (6th) | 83% | 96% | 89% | 82.3 Hz | 0.95 | 0.0136 | -2.2 cents |
| A (5th) | 71% | 97% | 100% | 109.8 Hz | 0.96 | 0.0130 | -3.2 cents |
| D (4th) | 45% | 100% | 100% | 146.6 Hz | 0.96 | 0.0069 | -2.7 cents |
| G (3rd) | 57% | 100% | 100% | 195.2 Hz | 0.95 | 0.0090 | -7.1 cents |
| B (2nd) | 36% | 100% | 95% | 246.0 Hz | 0.87 | 0.0053 | -6.6 cents |
| High E (1st) | 91% | 100% | 99% | 328.5 Hz | 0.99 | 0.0177 | -5.9 cents |

`Target lock` is the share of accepted readings within 35 cents of the selected string. Pitch
offsets compare each median with equal-tempered A4 = 440 Hz.

### Decision

The tuner passes on all six strings, including low E. Its current `minClarity` of 0.6 has ample
margin below the observed 0.87 minimum. The quieter B string was only 1.33 times the room gate
but still produced 100% clear readings and 95% target lock, confirming that the adaptive gate
admits quiet, clean notes. No tuner threshold change is justified by this check.

This evidence validates monophonic string tuning only. The polyphonic Chord Coach still needs a
separate real-guitar check with Em, G, C, and D before its similarity or chroma thresholds are
treated as calibrated.
