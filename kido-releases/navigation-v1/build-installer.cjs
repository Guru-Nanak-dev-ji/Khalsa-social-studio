'use strict';
// Build a standalone, offline Termux installer. No project code is executed here.
const fs = require('node:fs');
const path = require('node:path');
const crypto = require('node:crypto');
const zlib = require('node:zlib');

const VERSION = '1.0.0';
const FILES = Object.freeze(['main.cjs', 'providers.cjs', 'research.cjs', 'autonomy.cjs', 'dashboard.html', 'README-HINDI.txt']);
const sha256 = bytes => crypto.createHash('sha256').update(bytes).digest('hex');

function installerRuntime(EMBEDDED, EMBEDDED_SHA256) {
  'use strict';
  const fs = require('node:fs');
  const path = require('node:path');
  const crypto = require('node:crypto');
  const zlib = require('node:zlib');
  const { spawnSync } = require('node:child_process');
  const EXPECTED = ['main.cjs', 'providers.cjs', 'research.cjs', 'autonomy.cjs', 'dashboard.html', 'README-HINDI.txt'];
  const MANIFEST = 'KIDO-AUTO-AGENTS-MANIFEST.json';
  const ADDON = 'KIDO-AUTO-AGENTS';
  const FORMAT = 'KIDO_AUTONOMOUS_PAYLOAD_1';
  const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
  const fail = (code, detail) => { const e = new Error(detail || code); e.code = code; throw e; };
  function stat(filename) { try { return fs.lstatSync(filename); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
  function inspectPath(filename, allowMissing = false) {
    const root = path.parse(filename).root;
    let current = root;
    const parts = filename.slice(root.length).split(path.sep).filter(Boolean);
    for (let i = 0; i < parts.length; i++) {
      current = path.join(current, parts[i]);
      const info = stat(current);
      if (!info) { if (allowMissing) return null; fail('PATH_NOT_FOUND', current); }
      if (info.isSymbolicLink()) fail('SYMLINK_REFUSED', current);
      if (i < parts.length - 1 && !info.isDirectory()) fail('PATH_COMPONENT_NOT_DIRECTORY', current);
      if (i === parts.length - 1) return info;
    }
    return stat(root);
  }
  function projectPath(value) {
    if (typeof value !== 'string' || !path.isAbsolute(value) || /[\x00-\x1f\x7f]/.test(value)) fail('ABSOLUTE_PROJECT_PATH_REQUIRED');
    if (value.split(/[\\/]/).some(part => part === '.' || part === '..')) fail('PATH_TRAVERSAL_REFUSED');
    return path.normalize(value);
  }
  function decodePayload() {
    const packed = Buffer.from(EMBEDDED, 'base64');
    if (digest(packed) !== EMBEDDED_SHA256) fail('PAYLOAD_HASH_MISMATCH');
    let bundle;
    try { bundle = JSON.parse(zlib.gunzipSync(packed, { maxOutputLength: 16 * 1024 * 1024 }).toString('utf8')); }
    catch { fail('INVALID_PAYLOAD'); }
    if (!bundle || bundle.format !== FORMAT || bundle.version !== '1.0.0' || !Array.isArray(bundle.files) || bundle.files.length !== EXPECTED.length) fail('INVALID_PAYLOAD_SCHEMA');
    const seen = new Set();
    const files = bundle.files.map(file => {
      if (!file || !EXPECTED.includes(file.name) || seen.has(file.name)) fail('PAYLOAD_PATH_REFUSED');
      seen.add(file.name);
      if (typeof file.data !== 'string' || !/^(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?$/.test(file.data)) fail('INVALID_FILE_DATA');
      const bytes = Buffer.from(file.data, 'base64');
      if (bytes.length > 5 * 1024 * 1024 || bytes.length !== file.size || !/^[a-f0-9]{64}$/.test(file.sha256) || digest(bytes) !== file.sha256) fail('FILE_HASH_MISMATCH', file.name);
      return { name: file.name, bytes, sha256: file.sha256, size: bytes.length };
    });
    const manifest = Buffer.from(JSON.stringify({ format: 'KIDO_AUTONOMOUS_MANIFEST_1', version: bundle.version,
      files: Object.fromEntries(files.map(file => [file.name, { sha256: file.sha256, size: file.size }])) }, null, 2) + '\n');
    files.push({ name: MANIFEST, bytes: manifest, sha256: digest(manifest), size: manifest.length });
    return files;
  }
  function compareTarget(addon, file) {
    const filename = path.join(addon, file.name);
    const info = inspectPath(filename, true);
    if (!info) return false;
    if (!info.isFile()) fail('OWNED_PATH_NOT_FILE', file.name);
    if (info.size !== file.size || digest(fs.readFileSync(filename)) !== file.sha256) fail('EXISTING_FILE_DIFFERS', file.name + ' — मौजूदा file बदली नहीं गई।');
    return true;
  }
  function install(project, files) {
    const info = inspectPath(project);
    if (!info.isDirectory()) fail('PROJECT_NOT_DIRECTORY');
    for (const name of ['package.json', 'kido-master.js']) {
      const existing = inspectPath(path.join(project, name), true);
      if (!existing || !existing.isFile()) fail('KIDO_PROJECT_REQUIRED', 'इस folder में package.json और kido-master.js चाहिए: ' + project);
    }
    const addon = path.join(project, ADDON);
    const addonInfo = inspectPath(addon, true);
    if (addonInfo && !addonInfo.isDirectory()) fail('ADDON_NOT_DIRECTORY');
    // Preflight every owned target before making any directory or writing bytes.
    const missing = files.filter(file => !compareTarget(addon, file));
    if (!missing.length) return { addon, changed: false, installed: 0 };
    const stage = path.join(project, '.kido-autonomous-stage-' + process.pid + '-' + crypto.randomBytes(8).toString('hex'));
    const committed = [];
    let movedWholeDirectory = false;
    fs.mkdirSync(stage, { mode: 0o700 });
    try {
      for (const file of missing) fs.writeFileSync(path.join(stage, file.name), file.bytes, { flag: 'wx', mode: 0o600 });
      inspectPath(project);
      if (!addonInfo) {
        if (inspectPath(addon, true)) fail('INSTALL_TARGET_CHANGED');
        // Staging is on the same filesystem; initial installation moves atomically.
        fs.renameSync(stage, addon);
        movedWholeDirectory = true;
        return { addon, changed: true, installed: missing.length };
      }
      const currentAddon = inspectPath(addon);
      if (!currentAddon.isDirectory() || currentAddon.dev !== addonInfo.dev || currentAddon.ino !== addonInfo.ino) fail('INSTALL_TARGET_CHANGED');
      // Recheck the complete set immediately before committing an incomplete install.
      for (const file of files) compareTarget(addon, file);
      for (const file of missing) {
        if (compareTarget(addon, file)) continue;
        const destination = path.join(addon, file.name);
        // Hard-link plus unlink is an atomic, no-replacement move on the same filesystem.
        // EEXIST never overwrites a file created after preflight.
        fs.linkSync(path.join(stage, file.name), destination);
        committed.push({ destination, info: fs.lstatSync(destination), file });
        fs.unlinkSync(path.join(stage, file.name));
      }
      return { addon, changed: true, installed: committed.length };
    } catch (e) {
      for (const entry of committed.reverse()) {
        try {
          const current = stat(entry.destination);
          if (current && current.isFile() && current.dev === entry.info.dev && current.ino === entry.info.ino && digest(fs.readFileSync(entry.destination)) === entry.file.sha256) fs.unlinkSync(entry.destination);
        } catch {}
      }
      throw e;
    } finally {
      if (!movedWholeDirectory) fs.rmSync(stage, { recursive: true, force: true });
    }
  }
  function main() {
    if (Number(process.versions.node.split('.')[0]) < 20) fail('NODE_20_OR_NEWER_REQUIRED');
    let explicitProject, installOnly = false;
    const args = process.argv.slice(2);
    for (let index = 0; index < args.length; index++) {
      if (args[index] === '--install-only') installOnly = true;
      else if (args[index] === '--project') { if (!args[index + 1] || args[index + 1].startsWith('--')) fail('PROJECT_VALUE_REQUIRED'); explicitProject = args[++index]; }
      else if (args[index] === '--help' || args[index] === '-h') {
        console.log('KIDO autonomous setup\nnode KIDO-AUTONOMOUS-SETUP.cjs [--project /absolute/KIDO-AI-COMMAND-CENTER] [--install-only]\nDefault: install के बाद स्थानीय dashboard शुरू होगा।');
        return;
      } else fail('UNKNOWN_OPTION', args[index]);
    }
    const chosen = explicitProject || process.env.KIDO_PROJECT || (process.env.HOME ? path.join(process.env.HOME, 'KIDO-AI-COMMAND-CENTER') : null);
    const project = projectPath(chosen);
    const files = decodePayload();
    const result = install(project, files);
    console.log(result.changed ? 'KIDO_AUTONOMOUS_INSTALLED' : 'KIDO_AUTONOMOUS_ALREADY_INSTALLED');
    console.log('ADDON: ' + result.addon);
    if (installOnly) { console.log('INSTALL_ONLY: dashboard अभी शुरू नहीं किया गया।'); return; }
    console.log('DASHBOARD_STARTING');
    const child = spawnSync(process.execPath, [path.join(result.addon, 'main.cjs'), 'start'], {
      cwd: result.addon, env: { ...process.env, KIDO_AGENT_HOME: result.addon, KIDO_PROJECT: project }, stdio: 'inherit'
    });
    if (child.error || child.status !== 0) fail('DASHBOARD_START_FAILED', 'Files install हैं। शुरू करें: node "' + path.join(result.addon, 'main.cjs') + '" start');
  }
  try { main(); } catch (e) { console.error('KIDO_SETUP_ERROR: ' + (e.code || 'INSTALL_FAILED') + ' — ' + e.message); process.exitCode = 1; }
}

function buildInstaller({ sourceDir = path.join(__dirname, 'src'), readmePath, outputPath = path.join(__dirname, 'dist', 'KIDO-AUTONOMOUS-SETUP.cjs') } = {}) {
  if (!readmePath) {
    const preferred = path.join(path.dirname(sourceDir), 'README-HINDI.txt');
    readmePath = fs.existsSync(preferred) ? preferred : path.join(sourceDir, 'README-HINDI.txt');
  }
  const files = FILES.map(name => {
    const filename = name === 'README-HINDI.txt' ? readmePath : path.join(sourceDir, name);
    const info = fs.lstatSync(filename);
    if (!info.isFile() || info.isSymbolicLink()) throw new Error('Expected regular source file: ' + name);
    const bytes = fs.readFileSync(filename);
    return { name, data: bytes.toString('base64'), size: bytes.length, sha256: sha256(bytes) };
  });
  const packed = zlib.gzipSync(Buffer.from(JSON.stringify({ format: 'KIDO_AUTONOMOUS_PAYLOAD_1', version: VERSION, files })), { level: 9 });
  const source = '#!/usr/bin/env node\n\'use strict\';\n// KIDO autonomous setup: self-contained, no package downloads.\n' +
    'const EMBEDDED = ' + JSON.stringify(packed.toString('base64')) + ';\n' +
    'const EMBEDDED_SHA256 = ' + JSON.stringify(sha256(packed)) + ';\n' +
    '(' + installerRuntime.toString() + ')(EMBEDDED, EMBEDDED_SHA256);\n';
  fs.mkdirSync(path.dirname(outputPath), { recursive: true, mode: 0o700 });
  const temporary = outputPath + '.tmp-' + crypto.randomBytes(8).toString('hex');
  try {
    fs.writeFileSync(temporary, source, { flag: 'wx', mode: 0o600 });
    fs.renameSync(temporary, outputPath);
  } finally { try { fs.unlinkSync(temporary); } catch (e) { if (e.code !== 'ENOENT') throw e; } }
  return { path: outputPath, bytes: Buffer.byteLength(source), sha256: sha256(source), files: files.map(({ name, size, sha256: hash }) => ({ name, size, sha256: hash })) };
}

if (require.main === module) {
  try { const result = buildInstaller(); console.log(JSON.stringify(result, null, 2)); }
  catch (e) { console.error('BUILD_FAILED: ' + e.message); process.exitCode = 1; }
}
module.exports = { buildInstaller, FILES, VERSION };
