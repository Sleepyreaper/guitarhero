import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [firebaseText, appText, indexText, curriculumText, diagramText, dashboardText, targetsText, accountText, cssText] = await Promise.all([
  read('firebase.json'), read('src/js/app.js'), read('index.html'),
  read('src/js/data/curriculum.js'), read('src/js/components/chordDiagram.js'),
  read('src/js/views/dashboard.js'), read('src/js/data/targets.js'),
  read('src/js/views/account.js'), read('src/css/styles.css'),
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
assert.match(indexText, /href="#\/privacy"/, 'privacy page must be linked from every screen');
assert.match(curriculumText, /youtube\.com|video:/, 'curriculum should contain video demonstrations');
assert.match(dashboardText, /Your first setlist/, 'music preference must produce a visible personalized setlist');
assert.match(dashboardText, /href: '#\/learn\/l1-4', doneId: 'l1-5'/,
  'day seven must teach strumming before remaining open until the first song is complete');
assert.match(dashboardText, /Review the total honestly/,
  'practice copy must not claim a level meter can prove the source is guitar');
assert.match(targetsText, /How Great Is Our God[\s\S]*tutorial:/, 'pilot worship target should include a curated tutorial');
assert.match(accountText, /learning preferences, chord-change records, and private lesson feedback/,
  'account privacy copy must accurately list cloud-synced learner data');
assert.match(cssText, /@media \(max-width: 560px\)[\s\S]*\.app-nav \{[^}]*overflow-x: auto/,
  'phone navigation must remain reachable without consuming the screen in wrapped rows');
assert.match(cssText, /\.app-nav a \{[^}]*min-height: 44px/,
  'phone navigation targets must remain finger-friendly');

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
