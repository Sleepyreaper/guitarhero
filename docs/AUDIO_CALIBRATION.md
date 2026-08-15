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

## 2026-08-15 — four-chord Coach baseline

- Microphone: Elgato Wave:3 (USB `0fd9:0070`)
- Room gate: -69.1 dB
- Input medians: Em -42.8 dB, G -51.6 dB, C -46.2 dB, D -43.0 dB
- Best-match medians: Em 0.86, G 0.80, C/Fmaj7 0.81, D 0.81
- Target lock with the original open-ended 0.88 policy: Em 8%, G 5%, C 0%, D 15%

Every chord cleared the room gate by at least 17 dB, ruling out microphone level as the cause of
the low lock rates. Em, G, and D were the winning shapes but fell below an overly strict 0.88
similarity floor. C was absorbed by the richer Fmaj7 template even though guided practice already
knows the intended shape. The follow-up policy uses 0.78 similarity plus complete target-note
coverage for the selected chord, while preserving open-ended best-match reporting. A second
four-chord report is required before this calibration is marked complete.

## 2026-08-15 — guided-policy follow-up

| Target | Heard | Target lock | Target similarity | Best similarity | Input | Room gate |
| --- | --- | ---: | ---: | ---: | ---: | ---: |
| Em | Em | 55% | 0.83 | 0.84 | -45.2 dB | -68.1 dB |
| G | G | 73% | 0.86 | 0.87 | -44.5 dB | -68.1 dB |
| C | C | 73% | 0.86 | 0.86 | -42.6 dB | -68.1 dB |
| D | Em (uncertain) | 7% | 0.21 | 0.69 | -52.7 dB | -68.1 dB |

The guided policy fixed the measured false negatives for Em, G, and C, including the C/Fmaj7
confusion. D does not justify another threshold reduction: the baseline check heard D at 0.81,
while this follow-up was 9.7 dB quieter and contained too little D–F#–A energy to resemble D.
Its 0.002 winner margin correctly kept the result uncertain. Recheck D with the top four strings
picked individually and a stronger top-string signal before treating chord calibration as complete.

## 2026-08-15 — isolated D retest

- Heard D, target similarity 0.74, best similarity 0.75
- Target lock 17%, open-ended clear 13%
- Input -44.3 dB, room gate -66.5 dB, sample rate 96000 Hz

The isolated retest rules out the earlier weak capture: D is now the winning template with more
than 22 dB of room-gate clearance. The 0.74 real-guitar median sits just below the provisional
0.78 guided floor, while the near-zero winner margin remains expected because open D overlaps
related templates. Guided-v3 lowers only target-aware similarity to 0.72 and expected-note
presence to 0.22; complete D-F#-A coverage remains mandatory. Open-ended identification stays
strict.
