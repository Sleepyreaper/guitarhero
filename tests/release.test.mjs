import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [firebaseText, appText, indexText, curriculumText, diagramText, dashboardText, targetsText, accountText, cssText, songViewText, practiceText, pitchText, listenerText, chromaText, routineText, tunerViewText, chordsViewText, chordCalibrationText, lessonsViewText, rulesText] = await Promise.all([
  read('firebase.json'), read('src/js/app.js'), read('index.html'),
  read('src/js/data/curriculum.js'), read('src/js/components/chordDiagram.js'),
  read('src/js/views/dashboard.js'), read('src/js/data/targets.js'),
  read('src/js/views/account.js'), read('src/css/styles.css'), read('src/js/views/song.js'), read('src/js/lib/practice.js'),
  read('src/js/lib/pitch.js'), read('src/js/lib/listener.js'), read('src/js/lib/chroma.js'), read('src/js/views/routine.js'),
  read('src/js/views/tuner.js'), read('src/js/views/chords.js'), read('src/js/lib/chordCalibration.js'), read('src/js/views/lessons.js'), read('firestore.rules'),
]);

const firebase = JSON.parse(firebaseText);
assert.ok(firebase.hosting.ignore.includes('tests/**'), 'test sources must not be publicly hosted');
assert.ok(firebase.hosting.ignore.includes('.git/**'), 'Git internals must not be publicly hosted');
assert.ok(firebase.hosting.ignore.includes('firebase-debug.log*'), 'deployment logs must not be publicly hosted');
const allHeaders = firebase.hosting.headers.flatMap((entry) => entry.headers || []);
const rootHeaders = firebase.hosting.headers.find((entry) => entry.source === '/')?.headers || [];
assert.ok(rootHeaders.some((header) => header.key === 'Cache-Control' && header.value === 'no-store'),
  'the app shell must not strand returning learners on an old release');
assert.ok(allHeaders.some((header) => header.key === 'Permissions-Policy' && header.value.includes('microphone=(self)')),
  'microphone should be limited to Campfire itself');
assert.match(appText, /privacy from '.\/views\/privacy\.js'/, 'privacy view must be routed');
assert.match(appText, /report from '.\/views\/report\.js'/, 'pilot report must be routed');
assert.match(appText, /aria-current/, 'active navigation must be announced to assistive technology');
assert.match(appText, /root\.focus\(\{ preventScroll: true \}\)/,
  'hash navigation must move focus to the newly rendered main content');
assert.match(appText, /showRouteError/, 'route failures must show a recovery screen instead of a blank main area');
assert.match(appText, /Your saved progress is still safe/, 'the recovery screen must reassure the learner without exposing error details');
assert.match(appText, /rendering\.catch\(\(error\) => showRouteError/,
  'asynchronous account or service views must use the same route recovery path');
assert.match(appText, /user && !user\.isAnonymous\) await connectCloudProgress/,
  'guest progress must remain browser-only until the learner creates or enters an account');
assert.doesNotMatch(rulesText, /match \/users\/\{userId\} \{\s*allow/,
  'Firestore must not expose an unrestricted parent user document');
assert.match(rulesText, /stateId == 'progress'/,
  'Firestore writes must stay confined to the one private progress document');
assert.match(indexText, /href="#\/privacy"/, 'privacy page must be linked from every screen');
assert.match(curriculumText, /youtube\.com|video:/, 'curriculum should contain video demonstrations');
assert.match(curriculumText, /l2-1[\s\S]*f18EV2dr008[\s\S]*clean-c-d/,
  'the difficult C\/D mechanical step needs demonstration and honest proof');
assert.match(curriculumText, /l7-5[\s\S]*songId: 'kumbaya'[\s\S]*back-a-singer/,
  'the first singer handoff must use a lyric-verified arrangement');
assert.match(curriculumText, /l1-5[\s\S]*songId: 'row-your-boat'/,
  'the first song milestone must be immediately playable with the learner\'s known G chord');
assert.match(curriculumText, /l2-shady[\s\S]*Shady Grove \(Em \+ D \+ G\)/,
  'Shady Grove must wait until D is taught and use the complete Hindman E-minor chord movement');
assert.match(curriculumText, /l2-4[\s\S]*only G and D while the vocal enters before beat 1/,
  'the first church song must use its sourced two-chord beginner form');
assert.match(curriculumText, /l2-3[\s\S]*chords: \['D7'\][\s\S]*xx0212/,
  'the first D7 song must teach and display D7 before requiring it');
assert.match(curriculumText, /l3-3[\s\S]*chords: \['G7'\][\s\S]*G7 is 320001/,
  'Amazing Grace must accurately teach and display its previously unseen G7 shape');
assert.doesNotMatch(curriculumText, /G7 just lifts one finger off G/,
  'curriculum must not teach the mechanically false G-to-G7 shortcut');
assert.match(curriculumText, /l4-3[\s\S]*chords: \['A7'\][\s\S]*x02020/,
  'Home on the Range must display A7 while teaching its one-finger lift from A');
assert.match(curriculumText, /l3-4[\s\S]*quick 2\/4 country pulse[\s\S]*bass note on 1/,
  'Oh Susanna lesson must teach its real two-beat country meter');
assert.doesNotMatch(curriculumText, /Play Along/,
  'curriculum must use the honest chord-rehearsal label');
assert.match(curriculumText, /Accompaniment vs\. lead: choose your job[\s\S]*B–D–G/,
  'curriculum must explicitly teach the different jobs of backing and lead guitar');
assert.match(dashboardText, /Your first setlist/, 'music preference must produce a visible personalized setlist');
assert.match(dashboardText, /recommendedLesson\(profile, done\)/,
  'a returning beginner must start at an honest skill check instead of receiving the never-played CTA');
assert.match(dashboardText, /Quick start:[\s\S]*Days 1–2 stay here/,
  'the returning-beginner shortcut must preserve setup and tuning as optional review');
assert.match(dashboardText, /rankPlayableSongs/, 'unlocked songs must prioritize the learner\'s chosen style');
assert.match(dashboardText, /canPlay\.slice\(0, 6\)/, 'the phone dashboard must keep unlocked songs focused');
assert.doesNotMatch(dashboardText, /EQUIV/, 'related chords must not silently unlock physically different shapes');
assert.match(routineText, /buildRoutine/, 'daily practice must be derived from the learner’s completed skills');
assert.match(routineText, /No song is unlocked yet/, 'a zero-chord learner must get a valid musical fallback instead of a dead end');
assert.doesNotMatch(routineText, /STEPS\.length/, 'adaptive routine rendering must not reference the removed fixed step list');
assert.match(routineText, /const stage = STAGE_BY_LESSON\[nextLesson\.id\]/,
  'the routine renderer must derive its stage before displaying stage-specific pacing');
assert.match(dashboardText, /href: '#\/learn\/l1-4', doneId: 'l1-5'/,
  'day seven must teach strumming before remaining open until the first song is complete');
assert.match(dashboardText, /Review the total honestly/,
  'practice copy must not claim a level meter can prove the source is guitar');
assert.match(dashboardText, /beginRoomCheck/, 'practice tracking must calibrate to the selected room and microphone');
assert.match(practiceText, /median \* 3/, 'practice threshold must rise above steady room noise');
assert.match(pitchText, /room \* 2\.5/, 'tuner threshold must rise above the selected microphone’s idle noise');
assert.match(tunerViewText, /signal, room gate, clarity, and target lock/,
  'the real-mic diagnostic must tell the tester which measurements to compare');
assert.match(tunerViewText, /checkCopy\.disabled = tested !== 6/,
  'the calibration report must require comparable samples from all six strings');
assert.match(listenerText, /calibrateChromaNoise/, 'chord listening must build a room-specific noise profile');
assert.match(chromaText, /subtractChromaFloor/, 'chord listening must subtract the measured room spectrum');
assert.match(chordsViewText, /Four-chord Coach check/, 'the Coach must expose a real-guitar calibration workflow');
assert.match(chordsViewText, /checkCopy\.disabled = tested === 0/,
  'the Coach must allow one-chord reports so a failed chord can be retested alone');
assert.match(chordsViewText, /data-retest-chord/, 'a tester must be able to replace one stale chord sample');
assert.match(songViewText, /isGuidedMatch\(target, evaluation, GUIDED_SIM_OK, best\.name\)/,
  'song rehearsal must use the same calibrated target-aware policy as the Chord Coach');
assert.match(songViewText, /evaluateChord\(judge\.profile\(\), expected/,
  'song target-note coverage must use the same smoothed ringing chord as similarity');
assert.match(songViewText, /groove\.count/,
  'every song page must show the exact spoken count used by its generated groove');
assert.match(songViewText, /dotted-quarter BPM/,
  'compound-meter tempo must identify the dotted-quarter pulse instead of showing an ambiguous BPM');
assert.match(songViewText, /rhythmGrid\(beatsPerBar, groove\)/,
  'sing-along must render the exact sounding and air-stroke grid used by playback');
assert.match(songViewText, /The hand follows the count; the lyric floats across it/,
  'word guidance must not falsely teach one strum per lyric word');
assert.match(songViewText, /toggleFavorite/,
  'play-along and target songs must support a persistent personal songbook');
assert.match(songViewText, /scoreFor\(song\)/,
  'song pages must distinguish scored references from chord-only accompaniment practice');
assert.match(songViewText, /function singAlong\(root, song, self\)[\s\S]{0,180}const score = scoreFor\(song\)/,
  'Song Studio must load its score inside the playback scope');
assert.match(songViewText, /data-mode="reference"[\s\S]*data-mode="play"[\s\S]*data-mode="perform"/,
  'certified songs must separate hearing, playing with melody, and performing alone');
assert.match(songViewText, /studioMode === 'reference' \? \.45 : 1/,
  'reference accompaniment must stay below the guide melody instead of masking it');
assert.match(songViewText, /score\.melody\.filter\(\(event\) => event\.beat < 0\)/,
  'score pickups must sound during the count-in rather than entering late on beat 1');
assert.match(lessonsViewText, /function stageGate\(stage\)/,
  'the learning path must calculate mastery gates before exposing later stages');
assert.match(lessonsViewText, /Pass.*first/,
  'a direct URL to locked content must explain which prior stage must be passed');
assert.match(chordsViewText, /evaluateChord\(judge\.profile\(\), expectedPCs/,
  'Coach target-note coverage must not flicker with a single microphone frame');
assert.match(songViewText, /const confident = isConfidentMatch\(best, OPEN_SIM_OK\)/,
  'song rehearsal must keep open-ended chord labels conservative');
assert.match(lessonsViewText, /querySelectorAll\('\.load-video'\)/,
  'every demonstration in a multi-video lesson must receive a working load handler');
assert.match(chordCalibrationText, /derived measurements only; no audio/,
  'the Coach calibration report must explicitly exclude recorded audio');
assert.match(targetsText, /How Great Is Our God[\s\S]*tutorial:/, 'pilot worship target should include a curated tutorial');
assert.match(targetsText, /You Look Like You Love Me[\s\S]*bridge:/,
  'requested modern-country targets must include an actionable beginner bridge');
assert.match(accountText, /learning preferences, chord-change records, and private lesson feedback/,
  'account privacy copy must accurately list cloud-synced learner data');
assert.match(accountText, /const saved = await flushCloudProgress\(\)/,
  'sign-out must verify the final cloud save before clearing this device');
assert.match(accountText, /You are still signed in and your progress is safe on this device/,
  'a failed final sync must preserve progress and explain the recovery path');
assert.match(accountText, /Signed in — sync needs attention/,
  'the account page must not claim synchronization after a cloud failure');
assert.match(accountText, /campfire:sync-status/,
  'the visible account state must follow real cloud-write outcomes');
assert.match(cssText, /@media \(max-width: 560px\)[\s\S]*\.app-nav \{[^}]*overflow-x: auto/,
  'phone navigation must remain reachable without consuming the screen in wrapped rows');
assert.match(cssText, /\.onboarding-form fieldset \{[^}]*min-width: 0/,
  'browser fieldset minimum sizing must not widen the onboarding panel past the phone viewport');
assert.match(cssText, /@media \(max-width: 560px\)[\s\S]*\.choice-grid \{[^}]*grid-template-columns: 1fr/,
  'phone onboarding choices must stack instead of clipping a two-column grid');
assert.match(cssText, /@media \(max-width: 560px\)[\s\S]*html, body \{[^}]*overflow-x: hidden/,
  'phone pages must contain min-content overflow inside the viewport');
assert.match(cssText, /@media \(max-width: 560px\)[\s\S]*\.capo-finder \{[^}]*grid-template-columns: 1fr/,
  'the phone capo finder must stack without widening song pages');
assert.match(cssText, /\.app-nav a \{[^}]*min-height: 44px/,
  'phone navigation targets must remain finger-friendly');
assert.match(cssText, /\.coach-pick button \{[^}]*min-height: 44px/,
  'phone chord selector targets must remain finger-friendly');
assert.match(cssText, /\.routine-step \.lesson-check \{[^}]*width: 44px[^}]*height: 44px/,
  'daily practice completion controls must be finger-sized');
assert.match(cssText, /\.chip-btn \{[^}]*min-height: 44px/,
  'lesson feedback and song filters must remain finger-friendly');
assert.match(routineText, /aria-label="Mark \$\{s\.title\}/,
  'daily practice completion controls must name their individual step');
assert.match(songViewText, /arrangement\.bpm/, 'sing-along tempo must come from the song arrangement');
assert.match(songViewText, /groove\.events/, 'sing-along rhythm must come from the song groove');
assert.match(songViewText, /groove\.barEvents/, 'action songs must be able to leave silence in specific bars');
assert.match(songViewText, /barChangeBeats/, 'song playback must support chord changes on exact beats');
assert.match(songViewText, /Scored melody \+ source-checked accompaniment/,
  'certified pages must identify the stronger note-level musical evidence');
assert.match(songViewText, /no note-by-note melody yet[\s\S]*accompaniment practice/,
  'unaudited songs must never present generated chords as a reference performance');
assert.match(songViewText, /Lyric \/ chord-change cue/, 'verified timed arrangements must expose synchronized lyric cues');
assert.match(songViewText, /arrangement\.pickup\.beat \* seconds/,
  'songs whose vocals begin before beat 1 must schedule the pickup during the count-in');
assert.match(songViewText, /vocalCues\.filter\(\(item\) => !score && item\.bar === idx\)/,
  'unscored songs must schedule broad vocal entrances while scored songs preserve note-level syllable cues');
assert.match(songViewText, /arrangement\.verification\.url/, 'verified timing claims must expose their evidence');
assert.match(songViewText, /Checked:<\/strong> \$\{arrangement\.verification\.checked\}/, 'verified timing claims must show their review date');
assert.match(songViewText, /Rehearse chord order/, 'mic chord rehearsal must not be mislabeled as a timed play-along');
assert.match(songViewText, /Practice accompaniment/, 'unchecked arrangements must be labeled as accompaniment practice');
assert.match(songViewText, /does not claim exact lyric timing/, 'practice reductions must state their timing limitation');
assert.doesNotMatch(songViewText, /let bpm = 84/, 'songs must not all default to the same tempo');
assert.match(songViewText, /Capo key finder/, 'song charts must help a learner match a singer without changing shapes');
assert.match(songViewText, /new ChordJudge\(0\.35, capo\)/, 'song listening must recognize shapes shifted by the selected capo');
assert.match(songViewText, /transposeFrequencies\(chordFrequencies\(chord\), capo\)/,
  'heard chords and timed backing must sound at the selected capo pitch');

// Exercise the SVG renderer without introducing a package/build system.
const isolatedDiagram = diagramText.replace("import { getProfile } from '../lib/storage.js';", 'const getProfile = () => null;');
const diagram = await import(`data:text/javascript;base64,${Buffer.from(isolatedDiagram).toString('base64')}`);
const g = { name: 'G', frets: [3, 2, 0, 0, 0, 3], fingers: [2, 1, 0, 0, 0, 3], baseFret: 1 };
const right = diagram.chordSVG(g, { leftHanded: false });
const left = diagram.chordSVG(g, { leftHanded: true });
assert.notEqual(left, right, 'left-handed diagram must actually be mirrored');
assert.match(left, /mirrored for left-handed guitar/, 'left-handed SVG needs an accessible label');
assert.doesNotMatch(right, /mirrored for left-handed guitar/, 'right-handed SVG must remain standard');

console.log('release tests passed: private hosting output, security headers, privacy route, videos, handed diagrams');
