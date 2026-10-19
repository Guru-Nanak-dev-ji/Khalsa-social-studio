'use strict';
// Real localhost repair tests; every cloud/local AI provider is disabled.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const crypto = require('node:crypto');
const http = require('node:http');
const { spawn, spawnSync } = require('node:child_process');
const REPAIR = path.join(__dirname, 'KIDO-FIX-CROSS-SITE.cjs');
const SOURCE = path.resolve(__dirname, '../../src');
const ORIGINAL_MAIN = fs.readFileSync(path.join(__dirname, 'original/main.cjs'));
const MANIFEST = 'KIDO-AUTO-AGENTS-MANIFEST.json';
const digest = bytes => crypto.createHash('sha256').update(bytes).digest('hex');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function request(runtime, route, { method = 'GET', body, headers = {}, auth = true } = {}) {
  return new Promise((resolve, reject) => {
    const h = { Host: '127.0.0.1:' + runtime.port, Connection: 'close', ...headers };
    if (auth) h.Authorization = 'Bearer ' + runtime.token;
    const bytes = body === undefined ? null : Buffer.from(JSON.stringify(body));
    if (bytes) { h['Content-Type'] = 'application/json'; h['Content-Length'] = bytes.length; }
    const req = http.request({ hostname: '127.0.0.1', port: runtime.port, path: route, method, headers: h, agent: false }, res => {
      const chunks = []; res.on('data', chunk => chunks.push(chunk)); res.on('error', reject);
      res.on('end', () => { const text = Buffer.concat(chunks).toString('utf8'); let data; try { data = JSON.parse(text); } catch {} resolve({ status: res.statusCode, data, text }); });
    });
    req.setTimeout(1500, () => req.destroy(new Error('LOCAL_TEST_TIMEOUT'))); req.on('error', reject);
    if (bytes) req.write(bytes); req.end();
  });
}
function runtimeOf(f) { try { return JSON.parse(fs.readFileSync(path.join(f.addon, 'state/runtime.json'), 'utf8')); } catch { return null; } }
async function waitFor(check, timeout = 6000) {
  const until = Date.now() + timeout;
  while (Date.now() < until) { const value = await check(); if (value) return value; await sleep(40); }
  assert.fail('Local fixture did not reach expected state');
}
function fixture(t, { paused = false, queued = false } = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kido-navigation-repair-'));
  const project = path.join(root, 'KIDO-AI-COMMAND-CENTER'), addon = path.join(project, 'KIDO-AUTO-AGENTS');
  fs.mkdirSync(path.join(addon, 'state/tasks'), { recursive: true, mode: 0o700 });
  const originals = { 'package.json': '{"name":"original-project-sentinel"}\n', 'kido-master.js': 'throw new Error("Original project must not run");\n', 'index.html': '<title>Original site stays unchanged</title>\n' };
  for (const [name, bytes] of Object.entries(originals)) fs.writeFileSync(path.join(project, name), bytes);
  fs.writeFileSync(path.join(addon, 'main.cjs'), ORIGINAL_MAIN, { mode: 0o640 });
  for (const name of ['providers.cjs', 'research.cjs', 'autonomy.cjs', 'dashboard.html']) fs.copyFileSync(path.join(SOURCE, name), path.join(addon, name));
  const providerIds = ['ollama', 'openai', 'gemini', 'anthropic', 'deepseek', 'groq', 'openrouter', 'compatible'];
  const config = { providers: Object.fromEntries(providerIds.map(id => [id, { enabled: false }])), workerPaused: paused, userSetting: { preserve: ['all', 'values'], theme: 'test' } };
  fs.writeFileSync(path.join(addon, 'config.json'), JSON.stringify(config) + '\n', { mode: 0o600 });
  const secrets = Buffer.from('{"testNote":"inert test fixture; no real credentials"}\n');
  fs.writeFileSync(path.join(addon, 'secrets.json'), secrets, { mode: 0o600 });
  fs.writeFileSync(path.join(addon, 'narad.json'), JSON.stringify({ enabled: false, intervalHours: 24, topics: ['test'], sourceUrls: [], notion: { parentPageId: '', autoPublish: false } }));
  const manifest = { format: 'KIDO_AUTONOMOUS_MANIFEST_1', version: '1.0.0', files: Object.fromEntries(['main.cjs', 'providers.cjs', 'research.cjs', 'autonomy.cjs', 'dashboard.html'].map(name => { const bytes = fs.readFileSync(path.join(addon, name)); return [name, { sha256: digest(bytes), size: bytes.length }]; })) };
  const manifestBytes = Buffer.from(JSON.stringify(manifest, null, 2) + '\n'); fs.writeFileSync(path.join(addon, MANIFEST), manifestBytes);
  let queuedBytes;
  if (queued) {
    queuedBytes = Buffer.from(JSON.stringify({ id: 't-queue-fixture', prompt: 'Preserve this paused task', status: 'QUEUED', createdAt: '2026-01-01T00:00:00.000Z', updatedAt: '2026-01-01T00:00:00.000Z', progress: 0, requestCount: 0,
      results: ['brahma', 'mahesh', 'saraswati'].map(role => ({ role, name: role, state: 'WAITING', provider: null, model: null, text: '', error: null })), final: null, error: null, usage: { input: 0, output: 0, total: 0 } }, null, 2) + '\n');
    fs.writeFileSync(path.join(addon, 'state/tasks/t-queue-fixture.json'), queuedBytes);
  }
  const env = { ...process.env };
  for (const key of Object.keys(env)) if (/^(OPENAI|GEMINI|GOOGLE|ANTHROPIC|DEEPSEEK|GROQ|OPENROUTER|KIDO_LLM|OLLAMA|BRAVE|NOTION)_/.test(key)) delete env[key];
  Object.assign(env, { KIDO_AGENT_HOME: addon, KIDO_PROJECT: project, KIDO_AGENT_PORT: '0' });
  const f = { root, project, addon, originals, config, secrets, manifest, manifestBytes, env, queuedBytes, children: [] };
  f.run = (extraEnv = {}) => spawnSync(process.execPath, [REPAIR], { env: { ...env, ...extraEnv }, encoding: 'utf8', timeout: 20000 });
  f.runWithPreload = code => {
    const preload = path.join(root, 'fixture-fault-injection.cjs');
    fs.writeFileSync(preload, "'use strict';\n" + code);
    // --require affects only this repair process, never the daemon it subsequently starts.
    return spawnSync(process.execPath, ['--require', preload, REPAIR], { env, encoding: 'utf8', timeout: 20000 });
  };
  t.after(async () => {
    const runtime = runtimeOf(f);
    if (runtime) {
      try {
        const health = await request(runtime, '/health', { auth: false });
        if (health.data?.instance === runtime.instance) await request(runtime, '/api/stop', { method: 'POST', body: {} });
      } catch {}
      await waitFor(async () => { try { const h = await request(runtime, '/health', { auth: false }); return h.data?.instance !== runtime.instance; } catch { return true; } }, 2000).catch(() => {});
    }
    for (const child of f.children) if (child.exitCode === null && child.signalCode === null) child.kill('SIGTERM');
    await sleep(50); fs.rmSync(root, { recursive: true, force: true });
  });
  return f;
}
async function start(f, busy) {
  // Busy flags are injected only into an isolated fixture server to test the maintenance guard.
  const runner = busy ? `const {KidoApp,createServer}=require(${JSON.stringify(path.join(f.addon, 'main.cjs'))});(async()=>{const app=new KidoApp();const s=await createServer(app,{port:0});${busy === 'task' ? "app.activeTaskId='t-injected-busy-task';" : 'app.autonomy.running=true;'}require('node:fs').writeFileSync(${JSON.stringify(path.join(f.addon, 'state/busy-ready'))},'ready');for(const signal of ['SIGTERM','SIGINT'])process.once(signal,()=>s.close().then(()=>process.exit(0)));})().catch(()=>process.exit(1));` : null;
  const child = spawn(process.execPath, runner ? ['-e', runner] : [path.join(f.addon, 'main.cjs'), 'serve'], { cwd: f.addon, env: f.env, stdio: ['ignore', 'pipe', 'pipe'] });
  f.children.push(child); let output = ''; for (const stream of [child.stdout, child.stderr]) stream.on('data', bytes => { if (output.length < 12000) output += bytes; });
  child.on('error', () => {});
  return waitFor(async () => {
    if (child.exitCode !== null) assert.fail('Fixture server exited: ' + output);
    const runtime = runtimeOf(f); if (!runtime?.ready || busy && !fs.existsSync(path.join(f.addon, 'state/busy-ready'))) return false;
    try { const status = await request(runtime, '/api/status'); if (status.status === 200) return runtime; } catch {}
    return false;
  });
}
function originalProjectUnchanged(f) { for (const [name, bytes] of Object.entries(f.originals)) assert.equal(fs.readFileSync(path.join(f.project, name), 'utf8'), bytes); }
function repairDirectories(f) { const folder = path.join(f.addon, 'state/repairs'); return fs.existsSync(folder) ? fs.readdirSync(folder).filter(name => name.startsWith('cross-site-')) : []; }
const navigation = { 'Sec-Fetch-Site': 'cross-site', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document', Origin: 'https://example.com' };

test('actual old service is repaired, restarted as a new instance, verified, backed up five times and idempotent', async t => {
  const f = fixture(t); const before = await start(f);
  assert.equal((await request(before, '/', { auth: false, headers: navigation })).status, 403);
  const result = f.run(); assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /KIDO_NAVIGATION_FIXED/);
  const after = runtimeOf(f); assert.notEqual(after.instance, before.instance);
  assert.equal((await request(after, '/', { auth: false, headers: navigation })).status, 200);
  assert.equal((await request(after, '/news', { auth: false, headers: navigation })).status, 200);
  assert.equal((await request(after, '/api/status', { headers: navigation })).status, 403);
  const status = await request(after, '/api/status'); assert.equal(status.data.worker.paused, false); assert.equal(status.data.tasks.length, 0);
  const patched = fs.readFileSync(path.join(f.addon, 'main.cjs')); assert.equal(patched.toString().split('KIDO_NAVIGATION_FIX_V1').length, 2);
  assert.equal(fs.statSync(path.join(f.addon, 'main.cjs')).mode & 0o777, 0o640);
  const manifest = JSON.parse(fs.readFileSync(path.join(f.addon, MANIFEST), 'utf8'));
  assert.deepEqual(manifest.files['main.cjs'], { sha256: digest(patched), size: patched.length });
  for (const name of Object.keys(f.manifest.files).filter(name => name !== 'main.cjs')) assert.deepEqual(manifest.files[name], f.manifest.files[name]);
  const dirs = repairDirectories(f); assert.equal(dirs.length, 1);
  const backup = path.join(f.addon, 'state/repairs', dirs[0]);
  for (let n = 1; n <= 5; n++) {
    assert.deepEqual(fs.readFileSync(path.join(backup, 'copy-' + n, 'main.cjs')), ORIGINAL_MAIN);
    assert.deepEqual(fs.readFileSync(path.join(backup, 'copy-' + n, MANIFEST)), f.manifestBytes);
    assert.equal(fs.statSync(path.join(backup, 'copy-' + n, 'main.cjs')).mode & 0o777, 0o600);
  }
  assert.equal(JSON.parse(fs.readFileSync(path.join(backup, 'result.json'), 'utf8')).result, 'KIDO_NAVIGATION_FIXED');
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.addon, 'config.json'), 'utf8')), f.config);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'secrets.json')), f.secrets); originalProjectUnchanged(f);
  const configAfter = fs.readFileSync(path.join(f.addon, 'config.json'));
  const rerun = f.run(); assert.equal(rerun.status, 0, rerun.stderr); assert.match(rerun.stdout, /KIDO_NAVIGATION_ALREADY_FIXED/);
  assert.equal(runtimeOf(f).instance, after.instance); assert.deepEqual(repairDirectories(f), dirs);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'main.cjs')), patched); assert.deepEqual(fs.readFileSync(path.join(f.addon, 'config.json')), configAfter);
});

test('pre-paused queue and config settings survive the repair without executing work', async t => {
  const f = fixture(t, { paused: true, queued: true }); const before = await start(f);
  const initial = await request(before, '/api/status'); assert.equal(initial.data.worker.queued, 1); assert.equal(initial.data.worker.activeTaskId, null);
  const result = f.run(); assert.equal(result.status, 0, result.stderr);
  const after = runtimeOf(f), status = await request(after, '/api/status');
  assert.notEqual(after.instance, before.instance); assert.equal(status.data.worker.paused, true); assert.equal(status.data.worker.queued, 1); assert.equal(status.data.worker.activeTaskId, null);
  assert.equal(status.data.tasks[0].status, 'QUEUED'); assert.equal(status.data.tasks[0].requestCount, 0);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'state/tasks/t-queue-fixture.json')), f.queuedBytes);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.addon, 'config.json'), 'utf8')), f.config); originalProjectUnchanged(f);
});

for (const busy of ['task', 'narad']) test('running ' + busy + ' refuses maintenance before backup, source, manifest or pause changes', async t => {
  const f = fixture(t); const before = await start(f, busy); const configBefore = fs.readFileSync(path.join(f.addon, 'config.json'));
  const result = f.run(); assert.equal(result.status, 1); assert.match(result.stderr, /AI_TASK_RUNNING_RETRY_WHEN_FINISHED/);
  assert.equal(runtimeOf(f).instance, before.instance);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'main.cjs')), ORIGINAL_MAIN); assert.deepEqual(fs.readFileSync(path.join(f.addon, MANIFEST)), f.manifestBytes);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'config.json')), configBefore); assert.equal(repairDirectories(f).length, 0); originalProjectUnchanged(f);
});

test('unknown guard layout is refused without starting a server or altering unrelated files', t => {
  const f = fixture(t); const bytes = Buffer.from(ORIGINAL_MAIN.toString().replace("req.headers['sec-fetch-site']==='cross-site'", "req.headers['sec-fetch-site']=='cross-site'"));
  fs.writeFileSync(path.join(f.addon, 'main.cjs'), bytes);
  const result = f.run(); assert.equal(result.status, 1); assert.match(result.stderr, /UNRECOGNIZED_GUARD_LAYOUT/);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'main.cjs')), bytes); assert.equal(runtimeOf(f), null); assert.equal(repairDirectories(f).length, 0); originalProjectUnchanged(f);
});

test('source-file and ancestor symlinks are refused without patching the destination', t => {
  const f = fixture(t);
  const alias = path.join(f.root, 'project-alias'); fs.symlinkSync(f.project, alias);
  const parentResult = f.run({ KIDO_PROJECT: alias, KIDO_AGENT_HOME: path.join(alias, 'KIDO-AUTO-AGENTS') });
  assert.equal(parentResult.status, 1); assert.match(parentResult.stderr, /SYMLINK|REAL_DIRECTORY/);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'main.cjs')), ORIGINAL_MAIN); assert.equal(runtimeOf(f), null);
  const outside = path.join(f.root, 'original-main-outside.cjs'); fs.writeFileSync(outside, ORIGINAL_MAIN); fs.unlinkSync(path.join(f.addon, 'main.cjs')); fs.symlinkSync(outside, path.join(f.addon, 'main.cjs'));
  const fileResult = f.run(); assert.equal(fileResult.status, 1); assert.match(fileResult.stderr, /SYMLINK|REGULAR_FILE/);
  assert.deepEqual(fs.readFileSync(outside), ORIGINAL_MAIN); assert.equal(runtimeOf(f), null); originalProjectUnchanged(f);
});

test('lost stop acknowledgement still observes shutdown, repairs and restarts successfully', async t => {
  const f = fixture(t); const before = await start(f); const marker = path.join(f.root, 'lost-ack-injected');
  const result = f.runWithPreload(`
const http=require('node:http'),fs=require('node:fs'),original=http.request;
let injected=false;
http.request=function(options,callback){
  if(!injected&&options.path==='/api/stop'){
    injected=true;let req;
    req=original.call(this,options,response=>{response.resume();response.once('end',()=>{fs.writeFileSync(${JSON.stringify(marker)},'injected');req.emit('error',new Error('fixture lost acknowledgement'));});});
    return req;
  }
  return original.call(this,options,callback);
};
`);
  assert.equal(fs.existsSync(marker), true); assert.equal(result.status, 0, result.stderr); assert.match(result.stdout, /KIDO_NAVIGATION_FIXED/);
  const after = runtimeOf(f); assert.notEqual(after.instance, before.instance);
  assert.equal((await request(after, '/', { auth: false, headers: navigation })).status, 200);
  assert.equal((await request(after, '/api/status')).data.worker.paused, false);
  assert.ok(fs.readFileSync(path.join(f.addon, 'main.cjs'), 'utf8').includes('KIDO_NAVIGATION_FIX_V1'));
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.addon, 'config.json'), 'utf8')), f.config); originalProjectUnchanged(f);
});

test('receipt write failure after verified navigation preserves working patch and resumes original pause setting', async t => {
  const f = fixture(t); const before = await start(f); const marker = path.join(f.root, 'receipt-fault-injected');
  const result = f.runWithPreload(`
const fs=require('node:fs'),original=fs.openSync;
fs.openSync=function(file,...args){
  if(typeof file==='string'&&file.includes('/state/repairs/cross-site-')&&file.endsWith('/result.json')){
    fs.writeFileSync(${JSON.stringify(marker)},'injected');throw Object.assign(new Error('fixture full disk for receipt only'),{code:'ENOSPC'});
  }
  return original.call(this,file,...args);
};
`);
  assert.equal(fs.existsSync(marker), true); assert.equal(result.status, 0, result.stderr); assert.match(result.stderr, /REPAIR_RECEIPT_NOT_SAVED/);
  assert.match(result.stdout, /KIDO_NAVIGATION_FIXED/); assert.doesNotMatch(result.stderr, /PREVIOUS_CODE_RESTORED|RECOVERY_REQUIRED/);
  const after = runtimeOf(f); assert.notEqual(after.instance, before.instance);
  assert.equal((await request(after, '/', { auth: false, headers: navigation })).status, 200);
  assert.equal((await request(after, '/api/status')).data.worker.paused, false);
  const patched = fs.readFileSync(path.join(f.addon, 'main.cjs')); assert.ok(patched.toString().includes('KIDO_NAVIGATION_FIX_V1'));
  assert.equal(JSON.parse(fs.readFileSync(path.join(f.addon, MANIFEST), 'utf8')).files['main.cjs'].sha256, digest(patched));
  const dirs = repairDirectories(f); assert.equal(dirs.length, 1); assert.equal(fs.existsSync(path.join(f.addon, 'state/repairs', dirs[0], 'result.json')), false);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.addon, 'config.json'), 'utf8')), f.config); originalProjectUnchanged(f);
});

for (const failureMode of ['startup', 'verification']) test('already-fixed initially-stopped ' + failureMode + ' failure stops the new service and preserves source/config', async t => {
  const f = fixture(t); const { planRepair } = require(REPAIR); const fixed = planRepair(ORIGINAL_MAIN).bytes;
  fs.writeFileSync(path.join(f.addon, 'main.cjs'), fixed);
  const fixedManifest = { ...f.manifest, files: { ...f.manifest.files, 'main.cjs': { sha256: digest(fixed), size: fixed.length } } };
  const fixedManifestBytes = Buffer.from(JSON.stringify(fixedManifest, null, 2) + '\n'); fs.writeFileSync(path.join(f.addon, MANIFEST), fixedManifestBytes);
  const marker = path.join(f.root, failureMode + '-fault-injected');
  const code = failureMode === 'startup' ? `
const cp=require('node:child_process'),fs=require('node:fs'),original=cp.spawnSync;
cp.spawnSync=function(command,args,...rest){const result=original.call(this,command,args,...rest);
  if(Array.isArray(args)&&args[0]?.endsWith('/main.cjs')&&args[1]==='start'){
    fs.writeFileSync(${JSON.stringify(marker)},'injected after daemon started');return {...result,status:1};
  }return result;
};
` : `
const http=require('node:http'),fs=require('node:fs'),original=http.request;
http.request=function(options,callback){return original.call(this,options,response=>{
  if(options.path==='/'&&options.headers?.['Sec-Fetch-Site']==='cross-site'){
    fs.writeFileSync(${JSON.stringify(marker)},'injected');response.statusCode=503;
  }callback(response);
});};
`;
  assert.equal(runtimeOf(f), null);
  const result = f.runWithPreload(code); assert.equal(fs.existsSync(marker), true); assert.equal(result.status, 1);
  assert.match(result.stderr, failureMode === 'startup' ? /DASHBOARD_START_FAILED/ : /NAVIGATION_VERIFICATION_FAILED/);
  assert.doesNotMatch(result.stderr, /RECOVERY_REQUIRED/);
  const stoppedRuntime = runtimeOf(f); assert.ok(stoppedRuntime, 'new service must have started before the injected failure');
  await assert.rejects(request(stoppedRuntime, '/health', { auth: false }));
  assert.equal(fs.existsSync(path.join(f.addon, 'state/server.lock')), false);
  assert.deepEqual(fs.readFileSync(path.join(f.addon, 'main.cjs')), fixed); assert.deepEqual(fs.readFileSync(path.join(f.addon, MANIFEST)), fixedManifestBytes);
  assert.deepEqual(JSON.parse(fs.readFileSync(path.join(f.addon, 'config.json'), 'utf8')), f.config); originalProjectUnchanged(f);
});
