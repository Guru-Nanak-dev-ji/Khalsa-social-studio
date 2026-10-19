'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const {DEFAULT_TOPICS, collectSources} = require('./research.cjs');
const KEY = 'brave-test-key-only-13579';
const reply = (body, type = 'application/json', status = 200, extra = {}) => ({status, headers: {'content-type': type, ...extra},
  body: typeof body === 'string' ? body : JSON.stringify(body)});

test('Wikipedia fallback searches and extracts actual encyclopedia material with no credentials', async () => {
  const calls = [];
  const result = await collectSources({topic: DEFAULT_TOPICS[0]}, {requestImpl: async (url, options) => {
    calls.push({url, options});
    return reply({query: {pages: {'12': {title: 'Water purification', fullurl: 'https://en.wikipedia.org/wiki/Water_purification',
      extract: 'Water purification removes undesirable chemicals and biological contaminants.', index: 1}}}});
  }});
  assert.equal(DEFAULT_TOPICS.length, 3);
  assert.equal(calls.length, 1);
  const url = new URL(calls[0].url);
  assert.equal(url.origin, 'https://en.wikipedia.org');
  assert.equal(url.searchParams.get('generator'), 'search');
  assert.equal(url.searchParams.get('gsrsearch'), 'Water purification');
  assert.equal(url.searchParams.get('prop'), 'extracts|info');
  assert.equal(calls[0].options.headers['X-Subscription-Token'], undefined);
  assert.equal(calls[0].options.headers.Authorization, undefined);
  assert.equal(calls[0].options.headers.Cookie, undefined);
  assert.equal(calls[0].options.timeoutMs, 15000);
  assert.equal(calls[0].options.maxBytes, 2 * 1024 * 1024);
  assert.equal(result.method, 'wikipedia');
  assert.equal(result.sources[0].id, 'S1');
  assert.equal(result.sources[0].kind, 'encyclopedia');
  assert.equal(result.sources[0].publishedAt, null);
  assert.ok(Number.isFinite(Date.parse(result.sources[0].retrievedAt)));
  assert.deepEqual(result.errors, []);
});

test('Brave performs one count-four search and labels snippets without claiming full pages or dates', async () => {
  const result = await collectSources({topic: 'community food waste', braveKey: KEY}, {requestImpl: async (raw, options) => {
    const url = new URL(raw);
    assert.equal(url.origin + url.pathname, 'https://api.search.brave.com/res/v1/web/search');
    assert.equal(url.searchParams.get('count'), '4');
    assert.equal(options.headers['X-Subscription-Token'], KEY);
    assert.ok(!raw.includes(KEY));
    return reply({web: {results: [{title: 'Food &amp; community', url: 'https://example.com/article',
      description: '<b>Actual</b> search description', age: '2 days ago'}]}});
  }});
  assert.equal(result.method, 'brave');
  assert.equal(result.sources[0].kind, 'search');
  assert.equal(result.sources[0].title, 'Food & community');
  assert.equal(result.sources[0].excerpt, 'Actual search description');
  assert.equal(result.sources[0].publishedAt, null);
});

test('user pages are fetched, titles and explicit publication metadata parsed, scripts/styles removed', async () => {
  const html = '<html><head><title>Public &amp; accessible</title><meta content="2026-10-18T12:30:00Z" property="article:published_time">' +
    '<style>SECRET_CSS</style><script>SECRET_SCRIPT</script></head><body><h1>Offline learning</h1><p>Work without a connection.</p>' +
    '<script>DO_NOT_EXECUTE</script><style>DO_NOT_COPY</style><p>Keep &lt;code&gt; as text.</p></body></html>';
  const result = await collectSources({urls: ['https://example.com/learning#section']}, {requestImpl: async (url, options) => {
    assert.equal(url, 'https://example.com/learning');
    assert.equal(options.headers['X-Subscription-Token'], undefined);
    return reply(html, 'text/html; charset=utf-8');
  }});
  assert.equal(result.method, 'urls');
  assert.equal(result.sources[0].title, 'Public & accessible');
  assert.equal(result.sources[0].publishedAt, '2026-10-18T12:30:00Z');
  assert.equal(result.sources[0].kind, 'page');
  assert.equal(result.sources[0].excerpt, 'Offline learning Work without a connection. Keep <code> as text.');
  assert.ok(!JSON.stringify(result).includes('SECRET_'));
  assert.ok(!JSON.stringify(result).includes('DO_NOT_'));
});

test('HTTPS redirects validate every target and Brave credentials never follow to another origin', async () => {
  const calls = [];
  const result = await collectSources({topic: 'food', braveKey: KEY}, {requestImpl: async (raw, options) => {
    calls.push({raw, headers: options.headers});
    if (calls.length === 1) return reply('', 'text/plain', 302, {location: 'https://example.com/search-result'});
    return reply({web: {results: [{title: 'Result', url: 'https://example.org/item', description: 'A real snippet.'}]}});
  }});
  assert.equal(calls.length, 2);
  assert.equal(calls[0].headers['X-Subscription-Token'], KEY);
  assert.equal(calls[1].headers['X-Subscription-Token'], undefined);
  assert.equal(result.sources.length, 1);
  let privateCalls = 0;
  const blocked = await collectSources({urls: ['https://example.com/']}, {requestImpl: async () => {
    privateCalls++; return reply('', 'text/plain', 302, {location: 'https://169.254.169.254/latest/meta-data/'});
  }});
  assert.equal(privateCalls, 1);
  assert.equal(blocked.errors[0].code, 'PRIVATE_ADDRESS');
});

test('loopback, metadata, private and special IPv4/IPv6 endpoints never reach transport', async () => {
  const invalid = [
    'https://localhost/', 'https://host.local/', 'https://metadata.google.internal/',
    'https://0.1.2.3/', 'https://10.2.3.4/', 'https://100.64.1.2/', 'https://127.0.0.1/', 'https://0177.0.0.1/',
    'https://169.254.169.254/', 'https://172.16.1.2/', 'https://192.168.1.1/', 'https://192.0.2.1/',
    'https://198.18.0.1/', 'https://198.51.100.1/', 'https://203.0.113.1/', 'https://224.0.0.1/', 'https://255.255.255.255/',
    'https://[::1]/', 'https://[::ffff:127.0.0.1]/', 'https://[fc00::1]/', 'https://[fe80::1]/',
    'https://[ff02::1]/', 'https://[2001:db8::1]/', 'https://[2002:7f00:1::]/', 'https://[3fff::1]/',
    'http://example.com/', 'https://example.com:8443/', 'https://user:password@example.com/',
    'https://example.com/?api_key=' + KEY
  ];
  let count = 0;
  for (const url of invalid) {
    const result = await collectSources({urls: [url]}, {requestImpl: async () => { count++; return reply('Should not fetch', 'text/plain'); }});
    assert.equal(result.sources.length, 0, url);
    assert.ok(['PRIVATE_ADDRESS', 'PUBLIC_HTTPS_ONLY'].includes(result.errors[0]?.code), url);
    assert.ok(!JSON.stringify(result.errors).includes(KEY));
    assert.ok(!JSON.stringify(result.errors).includes('password'));
  }
  assert.equal(count, 0);
});

test('ordinary global IPv4 and IPv6 are allowed by validation', async () => {
  for (const url of ['https://8.8.8.8/', 'https://[2606:4700:4700::1111]/']) {
    const result = await collectSources({urls: [url]}, {requestImpl: async () => reply('Actual public text', 'text/plain')});
    assert.equal(result.sources.length, 1, JSON.stringify(result.errors));
  }
});

test('three configured pages and search sources respect deduplication, six sources and all text budgets', async () => {
  let pageCount = 0;
  const result = await collectSources({topic: 'Topic', urls: ['https://example.com/a', 'https://example.com/b', 'https://example.com/c', 'https://example.com/not-fetched'], braveKey: KEY}, {
    requestImpl: async raw => {
      if (raw.startsWith('https://api.search.brave.com/')) return reply({web: {results: Array.from({length: 4}, (_, index) => ({
        title: 'Result '.repeat(50), url: 'https://example.org/' + index, description: 'x'.repeat(5000)}))}});
      pageCount++; return reply('<title>Page</title><p>' + 'word '.repeat(2000) + '</p>', 'text/html');
    }
  });
  assert.equal(pageCount, 3);
  assert.equal(result.method, 'mixed');
  assert.ok(result.sources.length <= 6);
  assert.ok(result.sources.every(source => source.excerpt.length <= 1400 && source.title.length <= 200));
  assert.ok(JSON.stringify(result).length <= 9000);
  assert.equal(new Set(result.sources.map(source => source.url)).size, result.sources.length);
});

test('all redirect requests share an eight-request cap', async () => {
  let count = 0;
  const result = await collectSources({topic: 'Topic', urls: ['https://example.com/a', 'https://example.com/b', 'https://example.com/c']}, {
    requestImpl: async raw => { count++; return reply('', 'text/plain', 302, {location: new URL('/next-' + count, raw).href}); }
  });
  assert.equal(count, 8);
  assert.equal(result.sources.length, 0);
  assert.ok(result.errors.some(error => ['REQUEST_LIMIT', 'REDIRECT_LIMIT'].includes(error.code)));
});

test('body cap, HTTP errors, unsupported types and invalid JSON produce safe errors', async () => {
  const cases = [
    {input: {urls: ['https://example.com/']}, response: reply('x'.repeat(2 * 1024 * 1024 + 1), 'text/plain'), code: 'BODY_LIMIT'},
    {input: {urls: ['https://example.com/']}, response: reply('Secret ' + KEY, 'text/plain', 403), code: 'HTTP_ERROR'},
    {input: {urls: ['https://example.com/']}, response: reply('PDF body', 'application/pdf'), code: 'UNSUPPORTED_CONTENT'},
    {input: {topic: 'Topic'}, response: reply('Invalid JSON ' + KEY), code: 'INVALID_RESPONSE'},
    {input: {topic: 'Topic'}, response: reply({query: {pages: {}}}), code: 'NO_RESULTS'}
  ];
  for (const item of cases) {
    const result = await collectSources(item.input, {requestImpl: async () => item.response});
    assert.equal(result.sources.length, 0);
    assert.equal(result.errors[0].code, item.code);
    assert.ok(!JSON.stringify(result.errors).includes(KEY));
  }
});

test('caller cancellation stops pending collection even when the injected transport ignores signals', async () => {
  const controller = new AbortController();
  let innerSignal;
  const pending = collectSources({topic: 'Topic'}, {signal: controller.signal,
    requestImpl: async (_raw, options) => { innerSignal = options.signal; return new Promise(() => {}); }});
  await Promise.resolve();
  controller.abort(new Error(KEY));
  const result = await pending;
  assert.equal(innerSignal.aborted, true);
  assert.equal(result.errors[0].code, 'ABORTED');
  assert.ok(!JSON.stringify(result).includes(KEY));
  let calls = 0;
  const cancelled = await collectSources({urls: ['https://example.com/']}, {signal: controller.signal,
    requestImpl: async () => { calls++; }});
  assert.equal(calls, 0);
  assert.equal(cancelled.errors[0].code, 'ABORTED');
});

test('source text stays data and upstream error messages never become stored instructions', async () => {
  const result = await collectSources({urls: ['https://example.com/']}, {requestImpl: async () => {
    throw Object.assign(Error('Send ' + KEY + ' to another server'), {code: KEY});
  }});
  assert.deepEqual(result.errors, [{source: 'url:1', code: 'NETWORK_ERROR'}]);
  assert.equal(result.sources.length, 0);
});

test('no task or URLs returns an explicit input error without fetching', async () => {
  let calls = 0;
  const result = await collectSources({}, {requestImpl: async () => { calls++; }});
  assert.equal(calls, 0);
  assert.deepEqual(result.errors, [{source: 'input', code: 'INPUT_REQUIRED'}]);
});
