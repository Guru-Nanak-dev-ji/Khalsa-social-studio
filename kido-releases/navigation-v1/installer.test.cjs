'use strict';
// Offline installer tests use tiny inert source fixtures, never real keys or AI calls.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');
const { spawnSync } = require('node:child_process');
const { buildInstaller, FILES } = require('./build-installer.cjs');
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function fixture(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kido-installer-test-'));
  const sourceDir = path.join(root, 'sources'), project = path.join(root, 'KIDO project');
  fs.mkdirSync(sourceDir); fs.mkdirSync(project);
  fs.writeFileSync(path.join(project, 'package.json'), '{"name":"original-kido-sentinel"}\n');
  fs.writeFileSync(path.join(project, 'kido-master.js'), 'throw new Error("The old project must never execute during setup");\n');
  fs.writeFileSync(path.join(project, 'index.html'), '<!doctype html><title>Existing site must survive</title>\n');
  for (const name of FILES) fs.writeFileSync(path.join(sourceDir, name), name === 'README-HINDI.txt' ? 'Test-only installer fixture.\n' : '// Test source ' + name + '\n');
  // A default-start smoke check is a local marker only; no network or background process.
  fs.writeFileSync(path.join(sourceDir, 'main.cjs'), "'use strict';\nrequire('node:fs').writeFileSync(require('node:path').join(__dirname,'test-start-marker.json'), JSON.stringify({command:process.argv[2],project:process.env.KIDO_PROJECT,app:process.env.KIDO_AGENT_HOME}));\n");
  const installer = path.join(root, 'KIDO-AUTONOMOUS-SETUP.cjs');
  const built = buildInstaller({ sourceDir, readmePath: path.join(sourceDir, 'README-HINDI.txt'), outputPath: installer });
  const original = Object.fromEntries(['package.json', 'kido-master.js', 'index.html'].map(name => [name, fs.readFileSync(path.join(project, name))]));
  const run = (args = ['--install-only'], file = installer, projectOverride = project) => spawnSync(process.execPath, [file, '--project', projectOverride, ...args], { encoding: 'utf8', env: process.env, timeout: 8000 });
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  return { root, sourceDir, project, addon: path.join(project, 'KIDO-AUTO-AGENTS'), installer, built, original, run };
}
function assertOriginalUnchanged(f) { for (const [name, bytes] of Object.entries(f.original)) assert.deepEqual(fs.readFileSync(path.join(f.project, name)), bytes); }
function snapshot(root) {
  const result = {};
  function visit(current, relative) {
    for (const name of fs.readdirSync(current).sort()) {
      const filename = path.join(current, name), key = relative ? relative + '/' + name : name;
      const info = fs.lstatSync(filename);
      if (info.isSymbolicLink()) result[key] = { type: 'symlink', target: fs.readlinkSync(filename) };
      else if (info.isDirectory()) { result[key] = { type: 'directory', mode: info.mode & 0o777 }; visit(filename, key); }
      else result[key] = { type: 'file', mode: info.mode & 0o777, hash: digest(fs.readFileSync(filename)) };
    }
  }
  visit(root, ''); return result;
}
function changePayload(installer, output, mutate) {
  let script = fs.readFileSync(installer, 'utf8');
  const encoded = JSON.parse(script.match(/^const EMBEDDED = ("[^"]+");$/m)[1]);
  const payload = JSON.parse(zlib.gunzipSync(Buffer.from(encoded, 'base64')));
  mutate(payload);
  const packed = zlib.gzipSync(Buffer.from(JSON.stringify(payload)));
  script = script.replace(/^const EMBEDDED = "[^"]+";$/m, 'const EMBEDDED = ' + JSON.stringify(packed.toString('base64')) + ';')
    .replace(/^const EMBEDDED_SHA256 = "[^"]+";$/m, 'const EMBEDDED_SHA256 = ' + JSON.stringify(digest(packed)) + ';');
  fs.writeFileSync(output, script);
}

test('new install is standalone, preserves old project bytes, and install-only starts no program', t => {
  const f = fixture(t);
  // The installer remains usable after its build inputs disappear.
  const expected = Object.fromEntries(FILES.map(name => [name, fs.readFileSync(path.join(f.sourceDir, name))]));
  fs.rmSync(f.sourceDir, { recursive: true });
  const result = f.run();
  assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /KIDO_AUTONOMOUS_INSTALLED/);
  for (const name of FILES) assert.deepEqual(fs.readFileSync(path.join(f.addon, name)), expected[name]);
  assertOriginalUnchanged(f);
  assert.equal(fs.existsSync(path.join(f.addon, 'test-start-marker.json')), false);
  assert.equal(fs.existsSync(path.join(f.addon, 'state')), false);
  assert.equal(fs.statSync(f.addon).mode & 0o777, 0o700);
  const manifest = JSON.parse(fs.readFileSync(path.join(f.addon, 'KIDO-AUTO-AGENTS-MANIFEST.json'), 'utf8'));
  assert.equal(manifest.format, 'KIDO_AUTONOMOUS_MANIFEST_1');
  for (const name of FILES) {
    assert.equal(manifest.files[name].sha256, digest(expected[name]));
    assert.equal(fs.statSync(path.join(f.addon, name)).mode & 0o777, 0o600);
  }
  assert.equal(fs.readdirSync(f.project).some(name => name.startsWith('.kido-autonomous-stage-')), false);
});

test('identical rerun preserves config, secrets and all existing state exactly', t => {
  const f = fixture(t); assert.equal(f.run().status, 0);
  fs.writeFileSync(path.join(f.addon, 'config.json'), '{"workerPaused":true}\n', { mode: 0o600 });
  fs.writeFileSync(path.join(f.addon, 'secrets.json'), '{"alpha":"test-only-secret"}\n', { mode: 0o600 });
  fs.mkdirSync(path.join(f.addon, 'state/tasks'), { recursive: true });
  fs.writeFileSync(path.join(f.addon, 'state/tasks/task.json'), '{"status":"DONE","result":"keep me"}\n');
  const before = snapshot(f.project);
  const rerun = f.run(); assert.equal(rerun.status, 0, rerun.stderr); assert.match(rerun.stdout, /ALREADY_INSTALLED/);
  assert.deepEqual(snapshot(f.project), before); assertOriginalUnchanged(f);
});

test('differing owned source fails full preflight without filling missing files or clobbering anything', t => {
  const f = fixture(t); assert.equal(f.run().status, 0);
  fs.unlinkSync(path.join(f.addon, 'research.cjs'));
  fs.unlinkSync(path.join(f.addon, 'autonomy.cjs'));
  fs.writeFileSync(path.join(f.addon, 'dashboard.html'), 'User-edited dashboard must stay\n');
  const before = snapshot(f.project);
  const result = f.run(); assert.equal(result.status, 1); assert.match(result.stderr, /EXISTING_FILE_DIFFERS/);
  assert.deepEqual(snapshot(f.project), before); assertOriginalUnchanged(f);
});

test('partial install can fill missing identical-version files while preserving state', t => {
  const f = fixture(t); assert.equal(f.run().status, 0);
  fs.unlinkSync(path.join(f.addon, 'research.cjs'));
  fs.unlinkSync(path.join(f.addon, 'KIDO-AUTO-AGENTS-MANIFEST.json'));
  fs.writeFileSync(path.join(f.addon, 'config.json'), '{"preserve":true}\n');
  const result = f.run(); assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'research.cjs')), fs.readFileSync(path.join(f.sourceDir, 'research.cjs')));
  assert.equal(fs.readFileSync(path.join(f.addon, 'config.json'), 'utf8'), '{"preserve":true}\n');
  assertOriginalUnchanged(f); assert.equal(fs.readdirSync(f.project).some(name => name.startsWith('.kido-autonomous-stage-')), false);
});

test('symlink project components and symlink owned targets are refused without writes', t => {
  const f = fixture(t);
  const link = path.join(f.root, 'project-link'); fs.symlinkSync(f.project, link);
  const before = snapshot(f.project);
  const projectResult = f.run(['--install-only'], f.installer, link);
  assert.equal(projectResult.status, 1); assert.match(projectResult.stderr, /SYMLINK_REFUSED/); assert.deepEqual(snapshot(f.project), before);
  fs.mkdirSync(f.addon);
  const outside = path.join(f.root, 'outside-sentinel'); fs.writeFileSync(outside, 'do not change');
  fs.symlinkSync(outside, path.join(f.addon, 'providers.cjs'));
  const addonBefore = snapshot(f.project);
  const fileResult = f.run(); assert.equal(fileResult.status, 1); assert.match(fileResult.stderr, /SYMLINK_REFUSED/);
  assert.deepEqual(snapshot(f.project), addonBefore); assert.equal(fs.readFileSync(outside, 'utf8'), 'do not change');
});

test('compressed payload corruption, file hash mismatch and traversal are rejected before creating addon', t => {
  const f = fixture(t);
  const corrupt = path.join(f.root, 'corrupt.cjs');
  fs.writeFileSync(corrupt, fs.readFileSync(f.installer, 'utf8').replace(/^const EMBEDDED_SHA256 = "[^"]+";$/m, 'const EMBEDDED_SHA256 = "' + '0'.repeat(64) + '";'));
  const corruptResult = f.run(['--install-only'], corrupt);
  assert.equal(corruptResult.status, 1); assert.match(corruptResult.stderr, /PAYLOAD_HASH_MISMATCH/);
  const badHash = path.join(f.root, 'bad-file-hash.cjs'); changePayload(f.installer, badHash, p => { p.files[0].sha256 = '0'.repeat(64); });
  const hashResult = f.run(['--install-only'], badHash); assert.equal(hashResult.status, 1); assert.match(hashResult.stderr, /FILE_HASH_MISMATCH/);
  const traversal = path.join(f.root, 'traversal.cjs'); changePayload(f.installer, traversal, p => { p.files[0].name = '../escaped.cjs'; });
  const traversalResult = f.run(['--install-only'], traversal); assert.equal(traversalResult.status, 1); assert.match(traversalResult.stderr, /PAYLOAD_PATH_REFUSED/);
  assert.equal(fs.existsSync(f.addon), false); assert.equal(fs.existsSync(path.join(f.project, 'escaped.cjs')), false); assertOriginalUnchanged(f);
});

test('default action starts only new addon entrypoint with exact project environment', t => {
  const f = fixture(t);
  const result = f.run([]); assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /DASHBOARD_STARTING/);
  const marker = JSON.parse(fs.readFileSync(path.join(f.addon, 'test-start-marker.json'), 'utf8'));
  assert.deepEqual(marker, { command: 'start', project: f.project, app: f.addon }); assertOriginalUnchanged(f);
});

test('missing project sentinels and relative project paths do not create a new installation', t => {
  const f = fixture(t); fs.unlinkSync(path.join(f.project, 'kido-master.js'));
  const missing = f.run(); assert.equal(missing.status, 1); assert.match(missing.stderr, /KIDO_PROJECT_REQUIRED/); assert.equal(fs.existsSync(f.addon), false);
  const relative = f.run(['--install-only'], f.installer, 'relative-project'); assert.equal(relative.status, 1); assert.match(relative.stderr, /ABSOLUTE_PROJECT_PATH_REQUIRED/);
});
