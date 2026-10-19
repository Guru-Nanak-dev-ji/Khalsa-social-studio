'use strict';
// Deterministic local tests: all model adapters are replaced; no external API calls.
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const http = require('node:http');
const { KidoApp, createServer, APP_ID, MAX_PROMPT, dotenvValues, safePath } = require('./main.cjs');

const SECRET = 'test-only-credential-not-a-real-api-key-82';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));
async function until(check, ms = 2500) {
  const end = Date.now() + ms;
  while (Date.now() < end) { if (check()) return; await delay(5); }
  assert.fail('Condition was not reached before test deadline');
}
function deferred() { let resolve; const promise = new Promise(r => { resolve = r; }); return { promise, resolve }; }
function error(code) { return Object.assign(new Error(code), { code }); }
function fakeProviders({ ids = ['alpha', 'beta', 'gamma'], ready = true, call } = {}) {
  const CATALOG = Object.fromEntries(ids.map(id => [id, { id, label: id.toUpperCase(), kind: 'compatible' }]));
  const calls = [];
  return {
    CATALOG, calls,
    resolveProviders(config, secrets) {
      return ids.map(id => {
        const value = config.providers?.[id] || {};
        const enabled = value.enabled !== false;
        return { ...CATALOG[id], enabled, model: value.model || 'test-model', endpoint: value.endpoint || 'https://example.invalid/v1/chat/completions', key: secrets[id] || SECRET,
          state: !enabled ? 'DISABLED' : ready ? 'CONFIGURED_UNTESTED' : 'KEY_REQUIRED', reason: ready ? 'Test adapter configured' : 'Test adapter missing key', models: [] };
      });
    },
    async discover(providers) { return providers.map(p => ({ ...p })); },
    async callProvider(provider, options) {
      const entry = { provider: provider.id, system: options.system, prompt: options.prompt, signal: options.signal };
      calls.push(entry);
      if (call) return call(provider, options, entry, calls);
      return { text: options.system.includes('VISHNU') ? 'Reviewed answer' : 'Specialist draft', provider: provider.id, model: provider.model, usage: { input: 2, output: 3, total: 5 }, truncated: false };
    }
  };
}
function fixture(t, options = {}) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'kido-backend-test-'));
  const projectDir = path.join(root, 'project');
  const appDir = path.join(projectDir, 'KIDO-AUTO-AGENTS');
  fs.mkdirSync(projectDir);
  const providerModule = options.providerModule || fakeProviders();
  const app = new KidoApp({ appDir, projectDir, env: {}, providerModule });
  fs.writeFileSync(path.join(appDir, 'dashboard.html'), '<!doctype html><html><body><script>const token="__KIDO_TOKEN__";</script></body></html>');
  t.after(async () => {
    app.close();
    if (app.activeTaskId) await until(() => !app.activeTaskId).catch(() => {});
    fs.rmSync(root, { recursive: true, force: true });
  });
  return { root, projectDir, appDir, providerModule, app };
}
function request(runtime, route, { method = 'GET', auth = true, headers = {}, body, rawBody } = {}) {
  return new Promise((resolve, reject) => {
    const requestHeaders = { Host: '127.0.0.1:' + runtime.port, ...headers };
    if (auth) requestHeaders.Authorization = 'Bearer ' + runtime.token;
    if (body !== undefined || rawBody !== undefined) requestHeaders['Content-Type'] ||= 'application/json';
    const req = http.request({ hostname: '127.0.0.1', port: runtime.port, path: route, method, headers: requestHeaders }, res => {
      let text = '';
      res.setEncoding('utf8'); res.on('data', chunk => { text += chunk; });
      res.on('end', () => { let data; try { data = JSON.parse(text); } catch {} resolve({ status: res.statusCode, headers: res.headers, text, data }); });
      res.on('error', reject);
    });
    req.setTimeout(2500, () => req.destroy(error('TEST_HTTP_TIMEOUT')));
    req.on('error', reject);
    if (rawBody !== undefined) req.write(rawBody); else if (body !== undefined) req.write(JSON.stringify(body));
    req.end();
  });
}

test('three specialists overlap; final review waits for all three and durable report has real identities', async t => {
  const gate = deferred();
  let active = 0, peak = 0, completed = 0;
  const pm = fakeProviders({ call: async (p, opts) => {
    if (opts.system.includes('VISHNU')) {
      assert.equal(completed, 3);
      assert.equal(active, 0);
      for (const name of ['BRAHMA', 'MAHESH', 'SARASWATI']) assert.ok(opts.prompt.includes(name));
      return { text: 'Final synthesis', model: p.model, usage: { input: 7, output: 8, total: 15 }, truncated: false };
    }
    active++; peak = Math.max(peak, active);
    await gate.promise; active--; completed++;
    return { text: 'Draft from ' + p.id, model: p.model, usage: { input: 1, output: 2, total: 3 }, truncated: false };
  } });
  const { app, appDir } = fixture(t, { providerModule: pm });
  const task = app.submit('एक उपयोगी योजना बनाओ');
  try { await until(() => active === 3); assert.equal(pm.calls.length, 3); assert.equal(task.final, null); }
  finally { gate.resolve(); }
  await app.waitForIdle(2500);
  assert.equal(peak, 3); assert.equal(task.status, 'DONE'); assert.equal(task.progress, 100);
  assert.equal(task.requestCount, 4); assert.equal(pm.calls.length, 4);
  assert.equal(task.final.text, 'Final synthesis');
  assert.deepEqual(task.results.map(r => r.provider), ['alpha', 'beta', 'gamma']);
  assert.ok(task.results.every(r => r.state === 'DONE' && r.model === 'test-model'));
  assert.deepEqual(task.usage, { input: 10, output: 14, total: 24 });
  const persisted = JSON.parse(fs.readFileSync(path.join(appDir, 'state/tasks', task.id + '.json'), 'utf8'));
  assert.equal(persisted.status, 'DONE'); assert.equal(persisted.final.text, task.final.text);
  assert.equal(fs.statSync(path.join(appDir, 'state/tasks', task.id + '.json')).mode & 0o777, 0o600);
});

test('no configured provider blocks with zero paid requests', async t => {
  const pm = fakeProviders({ ready: false }); const { app } = fixture(t, { providerModule: pm });
  const task = app.submit('Research an idea'); await app.waitForIdle(2500);
  assert.equal(task.status, 'BLOCKED'); assert.equal(task.requestCount, 0); assert.equal(pm.calls.length, 0); assert.equal(task.final, null);
});

test('named council runs Indra, Thor and Zeus then Vishnu within the same budget; ordinary work keeps the base team', async t => {
  const { app, providerModule } = fixture(t);
  const named = app.submit('इन्द्र, थॉर और ज़्यूस मिलकर इस योजना की समीक्षा करें।');
  await app.waitForIdle(2500);
  assert.equal(named.status, 'DONE');
  assert.deepEqual(named.results.map(row => row.role), ['indra', 'thor', 'zeus']);
  assert.deepEqual(providerModule.calls.map(call => call.system.match(/Your role: ([A-Z]+)/)[1]), ['INDRA', 'THOR', 'ZEUS', 'VISHNU']);
  assert.equal(named.requestCount, 4); assert.equal(app.limits.maxCalls, 8);
  assert.ok(providerModule.calls[3].prompt.includes('INDRA'));
  assert.ok(providerModule.calls[3].prompt.includes('THOR'));
  assert.ok(providerModule.calls[3].prompt.includes('ZEUS'));
  const ordinary = app.submit('एक छोटे उपयोगी प्रोजेक्ट की योजना बनाएँ।');
  await app.waitForIdle(2500);
  assert.equal(ordinary.status, 'DONE');
  assert.deepEqual(ordinary.results.map(row => row.role), ['brahma', 'mahesh', 'saraswati']);
  assert.deepEqual(providerModule.calls.slice(4).map(call => call.system.match(/Your role: ([A-Z]+)/)[1]), ['BRAHMA', 'MAHESH', 'SARASWATI', 'VISHNU']);
  assert.equal(ordinary.requestCount, 4); assert.ok(ordinary.requestCount <= app.limits.maxCalls);
});

test('one alternate provider is tried after failure and request budget is enforced', async t => {
  const pm = fakeProviders({ call: async p => {
    if (p.id === 'alpha') throw error('AUTH_REJECTED');
    return { text: 'Successful fallback', model: p.model, usage: {}, truncated: false };
  } });
  const { app } = fixture(t, { providerModule: pm });
  const task = app.submit('Fallback task'); await app.waitForIdle(2500);
  assert.equal(task.status, 'DONE'); assert.equal(task.requestCount, 6);
  assert.equal(pm.calls.filter(c => c.provider === 'alpha').length, 2);
  assert.ok(task.results.every(r => r.state === 'DONE')); assert.equal(task.final.provider, 'beta');
  assert.ok(task.requestCount <= app.limits.maxCalls);

  app.limits.maxCalls = 2;
  const before = pm.calls.length; const limited = app.submit('Budget task'); await app.waitForIdle(2500);
  assert.equal(limited.requestCount, 2); assert.equal(pm.calls.length - before, 2);
  assert.ok(['PARTIAL', 'BLOCKED'].includes(limited.status));
  assert.equal(limited.final, null);
});

test('failed specialist produces a disclosed partial result without discarding good drafts', async t => {
  const pm = fakeProviders({ ids: ['alpha'], call: async (p, opts) => {
    if (opts.system.includes('SARASWATI')) throw error('RATE_LIMITED');
    return { text: opts.system.includes('VISHNU') ? 'Review with missing checker' : 'Saved good draft', model: p.model, usage: {}, truncated: false };
  } });
  const { app } = fixture(t, { providerModule: pm }); const task = app.submit('Partial task'); await app.waitForIdle(2500);
  assert.equal(task.status, 'PARTIAL'); assert.equal(task.requestCount, 4);
  assert.equal(task.results.filter(r => r.state === 'DONE').length, 2);
  assert.equal(task.results.find(r => r.role === 'saraswati').state, 'ERROR');
  assert.ok(task.error); assert.ok(app.exportTask(task).includes('Saved good draft'));
});

test('oversized provider output is truncated and persists as a reloadable partial report', async t => {
  const huge = 'x'.repeat(2 * 1024 * 1024);
  const pm = fakeProviders({ call: async p => ({ text: huge, model: p.model, usage: {}, truncated: false, debug: huge }) });
  const { app, appDir, projectDir } = fixture(t, { providerModule: pm });
  const task = app.submit('Large output regression'); await app.waitForIdle(2500);
  assert.equal(task.status, 'PARTIAL'); assert.equal(task.requestCount, 4);
  assert.ok(task.results.every(row => row.truncated && row.text.length <= 24000 && !Object.hasOwn(row, 'debug')));
  assert.equal(task.final.truncated, true); assert.ok(task.final.text.length <= 24000); assert.equal(Object.hasOwn(task.final, 'debug'), false);
  assert.ok(fs.statSync(path.join(appDir, 'state/tasks', task.id + '.json')).size < 1024 * 1024);
  const reloaded = new KidoApp({ appDir, projectDir, env: {}, providerModule: pm });
  try { assert.equal(reloaded.getTask(task.id).status, 'PARTIAL'); assert.equal(reloaded.getTask(task.id).final.truncated, true); }
  finally { reloaded.close(); }
});

test('pause persists and leaves queued work idle; resume executes it automatically', async t => {
  const { app, appDir, projectDir, providerModule } = fixture(t);
  app.setPaused(true); const task = app.submit('Queued task'); await delay(25);
  assert.equal(task.status, 'QUEUED'); assert.equal(providerModule.calls.length, 0);
  const snapshot = new KidoApp({ appDir, projectDir, env: {}, providerModule });
  assert.equal(snapshot.status().worker.paused, true); assert.equal(snapshot.getTask(task.id).status, 'QUEUED'); snapshot.close();
  app.setPaused(false); await app.waitForIdle(2500);
  assert.equal(task.status, 'DONE'); assert.equal(providerModule.calls.length, 4);
});

test('cancellation aborts active calls, clears waiting lanes, and does not launch review', async t => {
  let started = 0, aborted = 0;
  const pm = fakeProviders({ ids: ['alpha'], call: async (p, opts) => {
    started++;
    return new Promise((resolve, reject) => {
      const abort = () => { aborted++; reject(error('CANCELLED')); };
      if (opts.signal.aborted) return abort();
      opts.signal.addEventListener('abort', abort, { once: true });
    });
  } });
  const { app } = fixture(t, { providerModule: pm });
  const task = app.submit('Long task'); await until(() => started === 2);
  await assert.rejects(app.configure({ id: 'alpha', key: 'changed-test-key' }), { code: 'TASK_RUNNING' });
  app.cancel(task.id); await app.waitForIdle(2500);
  assert.equal(task.status, 'CANCELLED'); assert.equal(started, 2); assert.equal(aborted, 2); assert.equal(task.final, null);
  assert.ok(task.results.every(r => r.state === 'CANCELLED'));
  assert.equal(app.globalLane.active, 0); assert.equal(app.lanes.get('alpha').active, 0); assert.equal(app.lanes.get('alpha').waiters.length, 0);
});

test('closing service marks unfinished task INTERRUPTED and preserves queued work for later', async t => {
  let started = 0;
  const pm = fakeProviders({ ids: ['alpha'], call: async (p, opts) => {
    started++;
    return new Promise((resolve, reject) => {
      const abort = () => reject(error('CANCELLED'));
      if (opts.signal.aborted) return abort();
      opts.signal.addEventListener('abort', abort, { once: true });
    });
  } });
  const { app, appDir } = fixture(t, { providerModule: pm });
  const active = app.submit('First task'), queued = app.submit('Later task');
  await until(() => started === 2); app.close(); await until(() => !app.activeTaskId);
  assert.equal(active.status, 'INTERRUPTED'); assert.equal(queued.status, 'QUEUED');
  assert.equal(active.requestCount, 2); assert.equal(queued.requestCount, 0);
  assert.equal(JSON.parse(fs.readFileSync(path.join(appDir, 'state/tasks', active.id + '.json'), 'utf8')).status, 'INTERRUPTED');
  assert.equal(started, 2);
});

test('server protects API by token, Host and Origin and excludes keys from status/results', async t => {
  const pm = fakeProviders({ ids: ['alpha'], call: async p => ({ text: 'Echo ' + p.key, model: p.model, usage: {}, truncated: false }) });
  const { app, appDir } = fixture(t, { providerModule: pm });
  await app.configure({ id: 'alpha', enabled: true, key: SECRET });
  const service = await createServer(app, { port: 0, allowFallback: false, sourceDir: appDir, autonomy: false });
  try {
    const health = await request(service.runtime, '/health', { auth: false });
    assert.equal(health.status, 200); assert.equal(health.data.id, APP_ID);
    assert.equal((await request(service.runtime, '/api/status', { auth: false })).data.error, 'AUTH_REQUIRED');
    assert.equal((await request(service.runtime, '/api/status', { headers: { Authorization: 'wrong' }, auth: false })).status, 403);
    assert.equal((await request(service.runtime, '/api/status', { headers: { Host: 'evil.example' } })).data.error, 'HOST_DENIED');
    assert.equal((await request(service.runtime, '/api/status', { headers: { Origin: 'https://evil.example' } })).data.error, 'ORIGIN_DENIED');
    assert.equal((await request(service.runtime, '/api/status', { headers: { 'Sec-Fetch-Site': 'cross-site' } })).data.error, 'CROSS_SITE_DENIED');
    const page = await request(service.runtime, '/', { auth: false });
    assert.equal(page.status, 200); assert.ok(page.text.includes(service.runtime.token)); assert.ok(!page.text.includes('__KIDO_TOKEN__'));
    assert.match(page.text, /<script nonce="[^"]+">/); assert.match(page.headers['content-security-policy'], /frame-ancestors 'none'/);
    const invalid = await request(service.runtime, '/api/tasks', { method: 'POST', rawBody: '{broken' });
    assert.equal(invalid.status, 400); assert.equal(invalid.data.error, 'INVALID_JSON');
    const posted = await request(service.runtime, '/api/tasks', { method: 'POST', body: { prompt: 'Do not leak ' + SECRET } });
    assert.equal(posted.status, 202); await app.waitForIdle(2500);
    const status = await request(service.runtime, '/api/status');
    assert.equal(status.status, 200); assert.equal(status.data.providers[0].keyPresent, true);
    assert.ok(!status.text.includes(SECRET)); assert.ok(!Object.hasOwn(status.data.providers[0], 'key'));
    const detail = await request(service.runtime, '/api/tasks/' + posted.data.id);
    assert.ok(!detail.text.includes(SECRET)); assert.ok(detail.data.final.text.includes('[API_KEY_REDACTED]'));
    const exported = await request(service.runtime, '/api/tasks/' + posted.data.id + '/export');
    assert.equal(exported.status, 200); assert.match(exported.headers['content-type'], /text\/plain/); assert.ok(!exported.text.includes(SECRET));
    assert.equal(fs.statSync(path.join(appDir, 'secrets.json')).mode & 0o777, 0o600);
    assert.equal(fs.statSync(path.join(appDir, 'state/runtime.json')).mode & 0o777, 0o600);
  } finally { await service.close(); }
});

test('cross-site top-level page navigation works while API, embeds, fetches and invalid origins remain blocked', async t => {
  const { app, appDir } = fixture(t);
  app.autonomy = { newsHTML: () => '<!doctype html><html><body>Local news fixture</body></html>', status: () => ({ enabled: false }), close() {} };
  const service = await createServer(app, { port: 0, allowFallback: false, sourceDir: appDir, autonomy: false });
  const navigation = { 'Sec-Fetch-Site': 'cross-site', 'Sec-Fetch-Mode': 'navigate', 'Sec-Fetch-Dest': 'document' };
  try {
    for (const route of ['/', '/news']) {
      const fromLink = await request(service.runtime, route, { auth: false, headers: navigation });
      assert.equal(fromLink.status, 200, route + ' should open from an external link');
      const withOrigin = await request(service.runtime, route, { auth: false, headers: { ...navigation, Origin: 'https://chatgpt.com' } });
      assert.equal(withOrigin.status, 200, route + ' top-level navigation may carry an external Origin');
    }
    assert.equal((await request(service.runtime, '/', { auth: false, headers: { ...navigation, Host: 'evil.example' } })).data.error, 'HOST_DENIED');
    // A real local token does not make cross-site API access permissible.
    const apiNavigation = await request(service.runtime, '/api/status', { headers: navigation });
    assert.equal(apiNavigation.status, 403); assert.equal(apiNavigation.data.error, 'CROSS_SITE_DENIED');
    assert.equal(apiNavigation.text.includes(service.runtime.token), false);
    const postNavigation = await request(service.runtime, '/api/tasks', { method: 'POST', headers: navigation, body: { prompt: 'This must never enter the queue' } });
    assert.equal(postNavigation.status, 403); assert.equal(app.tasks.length, 0);
    const originMismatch = await request(service.runtime, '/api/status', { headers: { 'Sec-Fetch-Site': 'same-origin', Origin: 'https://evil.example' } });
    assert.equal(originMismatch.status, 403); assert.equal(originMismatch.data.error, 'ORIGIN_DENIED');
    assert.equal(originMismatch.text.includes(service.runtime.token), false);
    const forgedApiOrigin = await request(service.runtime, '/api/status', { headers: { ...navigation, Origin: 'https://evil.example' } });
    assert.equal(forgedApiOrigin.status, 403); assert.equal(forgedApiOrigin.data.error, 'ORIGIN_DENIED');
    for (const [mode, destination] of [['navigate', 'iframe'], ['no-cors', 'image'], ['cors', 'empty'], ['same-origin', 'empty']]) {
      const embedded = await request(service.runtime, '/', { auth: false, headers: { ...navigation, 'Sec-Fetch-Mode': mode, 'Sec-Fetch-Dest': destination } });
      assert.equal(embedded.status, 403, mode + '/' + destination + ' must stay blocked');
      assert.equal(embedded.data.error, 'CROSS_SITE_DENIED');
      assert.equal(embedded.text.includes(service.runtime.token), false, 'blocked embeds must not receive the dashboard token');
      assert.equal(embedded.headers['x-frame-options'], 'DENY');
      assert.match(embedded.headers['content-security-policy'], /frame-ancestors 'none'/);
    }
    const plainCrossSite = await request(service.runtime, '/', { auth: false, headers: { 'Sec-Fetch-Site': 'cross-site' } });
    assert.equal(plainCrossSite.status, 403);
    const pagePost = await request(service.runtime, '/', { method: 'POST', headers: navigation, body: {} });
    assert.equal(pagePost.status, 403);
    const unknownPage = await request(service.runtime, '/not-an-allowlisted-page', { auth: false, headers: navigation });
    assert.equal(unknownPage.status, 403);
    const legitimateApi = await request(service.runtime, '/api/status', { headers: { 'Sec-Fetch-Site': 'same-origin', Origin: 'http://127.0.0.1:' + service.runtime.port } });
    assert.equal(legitimateApi.status, 200);
  } finally { await service.close(); }
});

test('read-only app construction preserves RUNNING state; only owning server recovers interrupted work', async t => {
  const { app, appDir, projectDir, providerModule } = fixture(t);
  app.setPaused(true);
  const task = app.submit('Interrupted task'); task.status = 'RUNNING'; task.requestCount = 2; app.touch(task); app.close();
  const statusReader = new KidoApp({ appDir, projectDir, env: {}, providerModule });
  assert.equal(statusReader.getTask(task.id).status, 'RUNNING');
  assert.equal(JSON.parse(fs.readFileSync(path.join(appDir, 'state/tasks', task.id + '.json'), 'utf8')).status, 'RUNNING');
  statusReader.close();
  const restarted = new KidoApp({ appDir, projectDir, env: {}, providerModule });
  const service = await createServer(restarted, { port: 0, allowFallback: false, sourceDir: appDir, autonomy: false });
  try {
    assert.equal(restarted.getTask(task.id).status, 'INTERRUPTED');
    assert.equal(restarted.getTask(task.id).requestCount, 2);
    assert.equal(providerModule.calls.length, 0);
    const concurrent = new KidoApp({ appDir, projectDir, env: {}, providerModule });
    await assert.rejects(createServer(concurrent, { port: 0, allowFallback: false, sourceDir: appDir, autonomy: false }), { code: 'ALREADY_RUNNING' }); concurrent.close();
  } finally { await service.close(); }
});

test('prompt limits, dotenv parsing and path guards do not execute shell text or follow symlinks', async t => {
  const { app, appDir, root } = fixture(t);
  assert.throws(() => app.submit(' '), { code: 'TASK_REQUIRED' });
  assert.throws(() => app.submit('x'.repeat(MAX_PROMPT + 1)), { code: 'TASK_TOO_LONG' });
  const marker = path.join(root, 'must-not-exist');
  const envFile = path.join(appDir, 'sample.env');
  fs.writeFileSync(envFile, 'OPENAI_API_KEY="$(touch ' + marker + ')"\nGEMINI_MODEL=example-model # note\nIGNORED_SECRET=not-imported\n');
  const values = dotenvValues(envFile);
  assert.equal(values.OPENAI_API_KEY, '$(touch ' + marker + ')');
  assert.equal(values.GEMINI_MODEL, 'example-model'); assert.equal(values.IGNORED_SECRET, undefined); assert.equal(fs.existsSync(marker), false);
  assert.throws(() => safePath(appDir, '../outside'), { code: 'INVALID_PATH' });
  fs.symlinkSync(root, path.join(appDir, 'external'));
  assert.throws(() => safePath(appDir, 'external/file'), { code: 'SYMLINK_REFUSED' });
});
