import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');
const [firebaseText, appText, indexText, curriculumText, diagramText] = await Promise.all([
  read('firebase.json'), read('src/js/app.js'), read('index.html'),
  read('src/js/data/curriculum.js'), read('src/js/components/chordDiagram.js'),
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
assert.match(indexText, /href="#\/privacy"/, 'privacy page must be linked from every screen');
assert.match(curriculumText, /youtube\.com|video:/, 'curriculum should contain video demonstrations');

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
