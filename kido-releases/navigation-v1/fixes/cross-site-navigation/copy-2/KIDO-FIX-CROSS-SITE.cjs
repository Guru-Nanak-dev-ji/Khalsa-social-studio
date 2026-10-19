#!/usr/bin/env node
'use strict';
// KIDO navigation repair v1. Node 20+, built-ins only, no package downloads.
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const crypto = require('node:crypto');
const { spawnSync, spawn } = require('node:child_process');

const APP_ID = 'KIDO_AUTO_AGENTS_1';
const MANIFEST = 'KIDO-AUTO-AGENTS-MANIFEST.json';
const MARKER = 'KIDO_NAVIGATION_FIX_V1';
const OLD = [
  "    if(req.headers.origin && req.headers.origin!=='http://'+req.headers.host)return send(res,403,{error:'ORIGIN_DENIED'});",
  "    if(req.headers['sec-fetch-site']==='cross-site')return send(res,403,{error:'CROSS_SITE_DENIED'});",
  "    let url;try{url=new URL(req.url,'http://'+req.headers.host);}catch{return send(res,400,{error:'BAD_URL'});}",
  '    const route=url.pathname;'
].join('\n');
const FIXED = [
  "    let url;try{url=new URL(req.url,'http://'+req.headers.host);}catch{return send(res,400,{error:'BAD_URL'});}",
  '    const route=url.pathname;',
  '    // KIDO_NAVIGATION_FIX_V1: allow links to pages, never cross-site API access.',
  "    const pageNavigation=req.method==='GET' && (route==='/'||route==='/news') &&",
  "      req.headers['sec-fetch-mode']==='navigate' && req.headers['sec-fetch-dest']==='document';",
  "    if(!pageNavigation && req.headers.origin && req.headers.origin!=='http://'+req.headers.host)return send(res,403,{error:'ORIGIN_DENIED'});",
  "    if(!pageNavigation && req.headers['sec-fetch-site']==='cross-site')return send(res,403,{error:'CROSS_SITE_DENIED'});"
].join('\n');
const hash = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const fail = code => { throw Object.assign(new Error(code), { code }); };
function stat(file) { try { return fs.lstatSync(file); } catch (e) { if (e.code === 'ENOENT') return null; throw e; } }
function regular(file, optional = false) {
  directory(path.dirname(file));
  const info = stat(file);
  if (!info && optional) return null;
  if (!info || !info.isFile() || info.isSymbolicLink() || info.size > 8 * 1024 * 1024) fail('EXPECTED_REGULAR_FILE');
  return info;
}
function directory(file, create = false) {
  let parent = path.parse(file).root;
  for (const component of file.slice(parent.length).split(path.sep).filter(Boolean).slice(0, -1)) {
    parent = path.join(parent, component);
    const info = stat(parent);
    if (!info || !info.isDirectory() || info.isSymbolicLink()) fail('EXPECTED_REAL_DIRECTORY');
  }
  if (!stat(file) && create) fs.mkdirSync(file, { mode: 0o700 });
  const info = stat(file);
  if (!info || !info.isDirectory() || info.isSymbolicLink()) fail('EXPECTED_REAL_DIRECTORY');
}
function readJSON(file, fallback = null) {
  if (!regular(file, true)) return fallback;
  try { return JSON.parse(fs.readFileSync(file, 'utf8')); } catch { fail('INVALID_LOCAL_JSON'); }
}
function writeNew(file, bytes, mode = 0o600) {
  const fd = fs.openSync(file, 'wx', mode);
  try { fs.writeFileSync(fd, bytes); fs.fsyncSync(fd); } finally { fs.closeSync(fd); }
}
function atomic(file, bytes, mode = 0o600) {
  const temp = file + '.repair-' + crypto.randomBytes(8).toString('hex');
  try { writeNew(temp, bytes, mode); regular(file, true); fs.renameSync(temp, file); }
  finally { if (stat(temp)) fs.unlinkSync(temp); }
}
function alive(pid) {
  if (!Number.isSafeInteger(pid) || pid < 1) fail('INVALID_LOCAL_PID');
  try { process.kill(pid, 0); return true; } catch (e) { if (e.code === 'ESRCH') return false; return true; }
}
function planRepair(bytes) {
  const source = bytes.toString('utf8');
  if (!Buffer.from(source).equals(bytes) || !source.includes("const APP_ID = 'KIDO_AUTO_AGENTS_1';")) fail('UNRECOGNIZED_KIDO_SOURCE');
  if (source.includes(MARKER)) {
    if (source.split(FIXED).length !== 2 || source.includes(OLD)) fail('UNRECOGNIZED_EXISTING_FIX');
    return { changed: false, bytes };
  }
  if (source.split(OLD).length !== 2) fail('UNRECOGNIZED_GUARD_LAYOUT');
  return { changed: true, bytes: Buffer.from(source.replace(OLD, FIXED)) };
}
function request(runtime, route, { method = 'GET', body, headers = {}, auth = false } = {}) {
  return new Promise(resolve => {
    const h = { Host: '127.0.0.1:' + runtime.port, Connection: 'close', ...headers };
    if (auth) h.Authorization = 'Bearer ' + runtime.token;
    const data = body === undefined ? null : Buffer.from(JSON.stringify(body));
    if (data) { h['Content-Type'] = 'application/json'; h['Content-Length'] = data.length; }
    const req = http.request({ hostname: '127.0.0.1', port: runtime.port, path: route, method, headers: h, agent: false }, res => {
      const chunks = []; let size = 0;
      res.on('data', b => { size += b.length; if (size > 4 * 1024 * 1024) req.destroy(); else chunks.push(b); });
      res.on('error', () => resolve(null));
      res.on('end', () => {
        const text = Buffer.concat(chunks).toString('utf8'); let json = null;
        try { json = JSON.parse(text); } catch {}
        resolve({ status: res.statusCode, headers: res.headers, text, json });
      });
    });
    req.setTimeout(2000, () => req.destroy());
    req.on('error', () => resolve(null));
    if (data) req.write(data); req.end();
  });
}
async function currentService(addon) {
  const runtime = readJSON(path.join(addon, 'state/runtime.json'));
  if (!runtime) return null;
  if (runtime.id !== APP_ID || !Number.isInteger(runtime.port) || runtime.port < 1 || runtime.port > 65535 ||
      !/^[a-f0-9]{64}$/.test(runtime.token) || !/^[a-f0-9]{32}$/.test(runtime.instance) ||
      !Number.isSafeInteger(runtime.pid) || runtime.pid < 1) fail('UNRECOGNIZED_RUNTIME');
  const response = await request(runtime, '/health');
  if (response?.status === 200 && response.json?.id === APP_ID && response.json.instance === runtime.instance) return runtime;
  const lock = readJSON(path.join(addon, 'state/server.lock'));
  if (lock && alive(lock.pid)) fail('KIDO_PROCESS_NOT_RESPONDING');
  return null;
}
function assertStopped(addon) {
  const lock = readJSON(path.join(addon, 'state/server.lock'));
  if (lock && alive(lock.pid)) fail('KIDO_SERVER_STILL_RUNNING');
}
async function statusOf(runtime) {
  const r = await request(runtime, '/api/status', { auth: true });
  if (r?.status !== 200 || typeof r.json?.worker?.paused !== 'boolean') fail('KIDO_STATUS_UNAVAILABLE');
  return r.json;
}
function assertIdle(status) {
  if (status.worker.activeTaskId || status.narad?.running) fail('AI_TASK_RUNNING_RETRY_WHEN_FINISHED');
}
async function setPaused(runtime, paused) {
  const r = await request(runtime, '/api/worker', { method: 'POST', body: { paused }, auth: true });
  if (r?.status !== 200 || r.json?.worker?.paused !== paused) fail('WORKER_PAUSE_UPDATE_FAILED');
  return r.json;
}
async function stopService(addon, runtime) {
  const r = await request(runtime, '/api/stop', { method: 'POST', body: {}, auth: true });
  // A lost acknowledgement can still mean the authenticated stop took effect.
  if (r && (r.status !== 200 || r.json?.stopping !== true)) fail('KIDO_STOP_FAILED');
  const deadline = Date.now() + 7000;
  while (Date.now() < deadline) {
    const health = await request(runtime, '/health');
    const lock = readJSON(path.join(addon, 'state/server.lock'));
    if (health?.json?.instance !== runtime.instance && !lock) return;
    await sleep(100);
  }
  fail('KIDO_STOP_TIMEOUT');
}
async function verifyNavigation(runtime) {
  const headers = { 'Sec-Fetch-Site': 'cross-site', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document', Origin: 'https://example.com' };
  for (const route of ['/', '/news']) {
    const r = await request(runtime, route, { headers });
    if (r?.status !== 200 || !r.headers['content-type']?.startsWith('text/html')) return false;
  }
  const api = await request(runtime, '/api/status', { headers, auth: true });
  return api?.status === 403 && ['ORIGIN_DENIED', 'CROSS_SITE_DENIED'].includes(api.json?.error);
}
function openDashboard(runtime) {
  const child = spawn('termux-open-url', ['http://127.0.0.1:' + runtime.port + '/'], { stdio: 'ignore' });
  child.on('error', () => {}); child.unref();
}
function loadConfig(addon) {
  const config = readJSON(path.join(addon, 'config.json'), { providers: {}, workerPaused: false });
  if (!config || typeof config !== 'object' || Array.isArray(config)) fail('INVALID_CONFIG');
  return config;
}
function setStoppedPause(addon, paused) {
  assertStopped(addon);
  const config = loadConfig(addon); config.workerPaused = paused;
  atomic(path.join(addon, 'config.json'), Buffer.from(JSON.stringify(config, null, 2) + '\n'));
}
async function startService(addon, project, port) {
  assertStopped(addon);
  const env = { ...process.env, KIDO_AGENT_HOME: addon, KIDO_PROJECT: project };
  if (port) env.KIDO_AGENT_PORT = String(port);
  const run = spawnSync(process.execPath, [path.join(addon, 'main.cjs'), 'start'], {
    cwd: addon, env, stdio: ['ignore', 'pipe', 'pipe'], timeout: 25000, maxBuffer: 128 * 1024
  });
  const runtime = await currentService(addon);
  if (run.error || run.status !== 0 || !runtime) fail('DASHBOARD_START_FAILED');
  return runtime;
}
function lockRepair(addon) {
  const file = path.join(addon, 'state/cross-site-repair.lock');
  const previous = readJSON(file);
  if (previous) {
    if (alive(previous.pid)) fail('ANOTHER_REPAIR_IS_RUNNING');
    fs.renameSync(file, file + '.stale-' + Date.now());
  }
  const id = crypto.randomBytes(12).toString('hex');
  writeNew(file, JSON.stringify({ pid: process.pid, id }));
  return () => { try { if (readJSON(file)?.id === id) fs.unlinkSync(file); } catch {} };
}
async function repair() {
  if (Number(process.versions.node.split('.')[0]) < 20) fail('NODE_20_OR_NEWER_REQUIRED');
  if (process.argv.length > 2) fail('NO_ARGUMENTS_EXPECTED_USE_KIDO_AGENT_HOME');
  if (!process.env.KIDO_PROJECT && !process.env.KIDO_AGENT_HOME && !process.env.HOME) fail('KIDO_PATH_REQUIRED');
  const project = path.resolve(process.env.KIDO_PROJECT || (process.env.KIDO_AGENT_HOME ? path.dirname(path.resolve(process.env.KIDO_AGENT_HOME)) : path.join(process.env.HOME, 'KIDO-AI-COMMAND-CENTER')));
  const addon = path.resolve(process.env.KIDO_AGENT_HOME || path.join(project, 'KIDO-AUTO-AGENTS'));
  directory(addon); directory(path.join(addon, 'state'), true);
  const unlock = lockRepair(addon);
  let backupDir, runtime, originalPause, pauseTouched = false, applied = false, stopAttempted = false, startAttempted = false, verified = false;
  let original, candidate, originalManifest, fixedManifest, info;
  const mainFile = path.join(addon, 'main.cjs'), manifestFile = path.join(addon, MANIFEST);
  const restorePause = async () => {
    if (!pauseTouched) return;
    const service = await currentService(addon);
    if (service) await setPaused(service, originalPause); else setStoppedPause(addon, originalPause);
    pauseTouched = false;
  };
  try {
    info = regular(mainFile); original = fs.readFileSync(mainFile); candidate = planRepair(original);
    if (regular(manifestFile, true)) {
      originalManifest = fs.readFileSync(manifestFile);
      const m = readJSON(manifestFile);
      if (m?.format !== 'KIDO_AUTONOMOUS_MANIFEST_1' || m.files?.['main.cjs']?.sha256 !== hash(original) || m.files['main.cjs'].size !== original.length) fail('MANIFEST_MISMATCH');
      m.files['main.cjs'] = { ...m.files['main.cjs'], sha256: hash(candidate.bytes), size: candidate.bytes.length };
      fixedManifest = Buffer.from(JSON.stringify(m, null, 2) + '\n');
    }
    runtime = await currentService(addon);
    if (!candidate.changed && runtime && await verifyNavigation(runtime)) {
      console.log('KIDO_NAVIGATION_ALREADY_FIXED');
      console.log('DASHBOARD: http://127.0.0.1:' + runtime.port + '/'); openDashboard(runtime); return;
    }
    if (runtime) {
      const status = await statusOf(runtime); assertIdle(status); originalPause = status.worker.paused;
    } else { assertStopped(addon); originalPause = Boolean(loadConfig(addon).workerPaused); }
    const repairs = path.join(addon, 'state/repairs'); directory(repairs, true);
    backupDir = path.join(repairs, 'cross-site-' + new Date().toISOString().replace(/[:.]/g, '-') + '-' + crypto.randomBytes(4).toString('hex'));
    directory(backupDir, true);
    for (let n = 1; n <= 5; n++) {
      const dir = path.join(backupDir, 'copy-' + n); directory(dir, true);
      writeNew(path.join(dir, 'main.cjs'), original);
      if (originalManifest) writeNew(path.join(dir, MANIFEST), originalManifest);
      if (hash(fs.readFileSync(path.join(dir, 'main.cjs'))) !== hash(original)) fail('BACKUP_VERIFICATION_FAILED');
    }
    writeNew(path.join(backupDir, 'repair.json'), JSON.stringify({ repair: MARKER, originalSha256: hash(original), fixedSha256: hash(candidate.bytes), priorWorkerPaused: originalPause, previouslyRunning: Boolean(runtime) }, null, 2) + '\n');
    const syntaxFile = path.join(backupDir, 'candidate.cjs'); writeNew(syntaxFile, candidate.bytes);
    const syntax = spawnSync(process.execPath, ['--check', syntaxFile], { stdio: 'pipe', timeout: 10000 });
    if (syntax.error || syntax.status !== 0) fail('CANDIDATE_SYNTAX_FAILED');
    fs.unlinkSync(syntaxFile);
    pauseTouched = true;
    if (runtime) {
      assertIdle(await setPaused(runtime, true));
      stopAttempted = true;
      await stopService(addon, runtime);
    } else { setStoppedPause(addon, true); }
    regular(mainFile);
    if (!fs.readFileSync(mainFile).equals(original)) fail('SOURCE_CHANGED_DURING_REPAIR');
    if (originalManifest && !fs.readFileSync(manifestFile).equals(originalManifest)) fail('MANIFEST_CHANGED_DURING_REPAIR');
    assertStopped(addon);
    if (candidate.changed) {
      atomic(mainFile, candidate.bytes, info.mode & 0o777); applied = true;
      if (fixedManifest) atomic(manifestFile, fixedManifest);
    }
    startAttempted = true;
    const next = await startService(addon, project, runtime?.port);
    if (runtime && runtime.instance === next.instance) fail('OLD_SERVER_STILL_RUNNING');
    if (!await verifyNavigation(next)) fail('NAVIGATION_VERIFICATION_FAILED');
    // Once verified, logging or resume failures must not undo working code.
    verified = true;
    try {
      writeNew(path.join(backupDir, 'result.json'), JSON.stringify({ result: 'KIDO_NAVIGATION_FIXED', at: new Date().toISOString(), port: next.port, originalSha256: hash(original), fixedSha256: hash(candidate.bytes) }, null, 2) + '\n');
    } catch { console.error('REPAIR_RECEIPT_NOT_SAVED'); }
    await restorePause();
    console.log('KIDO_NAVIGATION_FIXED');
    console.log('BACKUPS: 5 copies in ' + backupDir);
    console.log('DASHBOARD: http://127.0.0.1:' + next.port + '/');
  } catch (e) {
    let recovered = false;
    try {
      if ((applied || startAttempted) && !verified) {
        const service = await currentService(addon);
        if (service && service.instance !== runtime?.instance) { assertIdle(await statusOf(service)); assertIdle(await setPaused(service, true)); await stopService(addon, service); }
      }
      if (applied && !verified) {
        assertStopped(addon); regular(mainFile);
        if (!fs.readFileSync(mainFile).equals(candidate.bytes)) fail('ROLLBACK_SOURCE_CHANGED');
        if (originalManifest) {
          regular(manifestFile);
          const actual = fs.readFileSync(manifestFile);
          if (!actual.equals(fixedManifest) && !actual.equals(originalManifest)) fail('ROLLBACK_MANIFEST_CHANGED');
        }
        atomic(mainFile, original, info.mode & 0o777);
        if (originalManifest) atomic(manifestFile, originalManifest);
      }
      if (stopAttempted && !await currentService(addon)) await startService(addon, project, runtime?.port);
      await restorePause(); recovered = true;
    } catch (recoveryError) { console.error('RECOVERY_REQUIRED: ' + (recoveryError.code || 'LOCAL_RECOVERY_FAILED')); }
    if (backupDir) console.error('BACKUPS: ' + backupDir);
    if (applied && recovered && !verified) console.error('PREVIOUS_CODE_RESTORED');
    if (verified) console.error('NAVIGATION_FIXED_CHECK_WORKER_PAUSE_IN_DASHBOARD');
    throw e;
  } finally { unlock(); }
}
if (require.main === module) repair().catch(e => {
  console.error('KIDO_REPAIR_ERROR: ' + (e.code || 'LOCAL_REPAIR_FAILED'));
  if (e.code === 'AI_TASK_RUNNING_RETRY_WHEN_FINISHED') console.error('चलता AI काम पूरा होने दें, फिर यही command दोबारा चलाएँ।');
  process.exitCode = 1;
});
module.exports = { planRepair, verifyNavigation, request, OLD, FIXED };
