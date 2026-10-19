'use strict';

// Public read-only research. Retrieved text is untrusted source material; never
// execute its instructions or use it to authorize tools, writes, or payments.
// Primary API references:
// https://api-dashboard.search.brave.com/app/documentation/web-search/codes
// https://www.mediawiki.org/wiki/API:Search
// https://www.mediawiki.org/wiki/Extension:TextExtracts#API
// Test-only transport injection:
// requestImpl(url, {headers, signal, timeoutMs, maxBytes}) =>
// Promise<{status, headers: object|Headers, body: string|Buffer}>.
// It must return redirects without following them. Production transport below
// pins public DNS results to the HTTPS socket and never reuses a pooled socket.

const https = require('node:https');
const dns = require('node:dns').promises;
const net = require('node:net');

const DEFAULT_TOPICS = Object.freeze([
  'Clean water: low-cost practical solutions',
  'Food waste reduction in the community',
  'Accessible learning that works offline'
]);
const WIKI_DEFAULT_QUERIES = ['Water purification', 'Food waste', 'Educational technology'];
const BRAVE_ENDPOINT = 'https://api.search.brave.com/res/v1/web/search';
const WIKI_ENDPOINT = 'https://en.wikipedia.org/w/api.php';
const MAX_BYTES = 2 * 1024 * 1024;
const TIMEOUT_MS = 15000;
const MAX_REQUESTS = 8;

function fail(code) { const error = new Error('Public research request failed.'); error.code = code; return error; }
const SAFE_CODES = new Set(['INVALID_URL', 'PUBLIC_HTTPS_ONLY', 'PRIVATE_ADDRESS', 'DNS_FAILED', 'HTTP_ERROR',
  'BODY_LIMIT', 'INVALID_RESPONSE', 'UNSUPPORTED_CONTENT', 'TIMEOUT', 'ABORTED', 'NETWORK_ERROR',
  'REQUEST_LIMIT', 'REDIRECT_LIMIT', 'REDIRECT_INVALID', 'NO_RESULTS', 'EMPTY_PAGE', 'INVALID_KEY', 'INPUT_REQUIRED']);
function safeCode(error) { return SAFE_CODES.has(error?.code) ? error.code : 'NETWORK_ERROR'; }

function publicIp(address) {
  const family = net.isIP(address);
  if (family === 4) {
    const [a, b, c] = address.split('.').map(Number);
    if (a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) ||
      (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) ||
      (a === 192 && (b === 0 && (c === 0 || c === 2) || b === 168 || b === 88 && c === 99 || b === 31 && c === 196 ||
        b === 52 && c === 193 || b === 175 && c === 48)) ||
      (a === 198 && (b === 18 || b === 19 || b === 51 && c === 100)) || (a === 203 && b === 0 && c === 113)) return false;
    return true;
  }
  if (family !== 6 || address.includes('.') || address.includes('%')) return false;
  const halves = address.toLowerCase().split('::');
  const left = halves[0] ? halves[0].split(':') : [];
  const right = halves.length > 1 && halves[1] ? halves[1].split(':') : [];
  const groups = halves.length === 1 ? left : [...left, ...Array(8 - left.length - right.length).fill('0'), ...right];
  if (groups.length !== 8) return false;
  let value = 0n;
  for (const group of groups) value = (value << 16n) + BigInt(parseInt(group || '0', 16));
  const prefix = (hex, bits) => value >> BigInt(128 - bits) === BigInt('0x' + hex) >> BigInt(128 - bits);
  // Global unicast only; exclude special-purpose, documentation, Teredo, 6to4,
  // old 6bone, mapped IPv4, unique-local, link-local and multicast ranges.
  return prefix('20000000000000000000000000000000', 3) &&
    !prefix('20010000000000000000000000000000', 23) && !prefix('20010db8000000000000000000000000', 32) &&
    !prefix('20020000000000000000000000000000', 16) && !prefix('3ffe0000000000000000000000000000', 16) &&
    !prefix('3fff0000000000000000000000000000', 20);
}

function publicUrl(raw) {
  if (typeof raw !== 'string' || raw.length > 2048) throw fail('INVALID_URL');
  let url;
  try { url = new URL(raw); } catch { throw fail('INVALID_URL'); }
  if (url.protocol !== 'https:' || url.username || url.password || url.port && url.port !== '443') throw fail('PUBLIC_HTTPS_ONLY');
  const host = url.hostname.replace(/^\[|\]$/g, '').toLowerCase().replace(/\.$/, '');
  if (net.isIP(host)) { if (!publicIp(host)) throw fail('PRIVATE_ADDRESS'); }
  else if (!host.includes('.') || /(?:^|\.)(?:localhost|local|internal|test|invalid|example|onion)$/.test(host) ||
    host === 'metadata.google.internal') throw fail('PRIVATE_ADDRESS');
  for (const name of url.searchParams.keys()) if (/^(?:api[_-]?key|key|token|access[_-]?token|auth|authorization|password|secret|signature)$/i.test(name)) {
    throw fail('PUBLIC_HTTPS_ONLY');
  }
  url.hash = '';
  return url;
}

function header(headers, name) {
  if (typeof headers?.get === 'function') return headers.get(name) || '';
  const key = Object.keys(headers || {}).find(key => key.toLowerCase() === name.toLowerCase());
  const value = key ? headers[key] : '';
  return Array.isArray(value) ? value[0] || '' : String(value || '');
}

async function pinnedRequest(raw, {headers, signal, maxBytes = MAX_BYTES}) {
  const url = publicUrl(raw);
  const host = url.hostname.replace(/^\[|\]$/g, '');
  let addresses;
  if (net.isIP(host)) addresses = [{address: host, family: net.isIP(host)}];
  else {
    try { addresses = await dns.lookup(host, {all: true, verbatim: true}); }
    catch { throw fail('DNS_FAILED'); }
  }
  if (signal.aborted) throw fail('ABORTED');
  if (!addresses.length || addresses.some(item => !publicIp(item.address))) throw fail('PRIVATE_ADDRESS');
  const selected = addresses.find(item => item.family === 4) || addresses[0];
  return new Promise((resolve, reject) => {
    let done = false;
    const finish = (error, result) => { if (done) return; done = true; error ? reject(error) : resolve(result); };
    const request = https.request(url, {method: 'GET', headers, signal, agent: false, family: selected.family,
      lookup: (_name, options, callback) => {
        if (options?.all) callback(null, [{address: selected.address, family: selected.family}]);
        else callback(null, selected.address, selected.family);
      }
    }, response => {
      const status = response.statusCode || 0;
      if (status >= 300 && status < 400 || status < 200 || status >= 400) {
        const result = {status, headers: response.headers, body: ''};
        response.destroy(); finish(null, result); return;
      }
      const encoding = header(response.headers, 'content-encoding').toLowerCase();
      if (encoding && encoding !== 'identity') { response.destroy(); finish(fail('UNSUPPORTED_CONTENT')); return; }
      const declared = Number(header(response.headers, 'content-length'));
      if (Number.isFinite(declared) && declared > maxBytes) { response.destroy(); finish(fail('BODY_LIMIT')); return; }
      const chunks = []; let size = 0;
      response.on('data', chunk => {
        size += chunk.length;
        if (size > maxBytes) { response.destroy(); request.destroy(); finish(fail('BODY_LIMIT')); return; }
        chunks.push(chunk);
      });
      response.on('end', () => finish(null, {status, headers: response.headers, body: Buffer.concat(chunks, size)}));
      response.on('error', () => finish(fail(signal.aborted ? 'ABORTED' : 'NETWORK_ERROR')));
    });
    request.on('error', () => finish(fail(signal.aborted ? 'ABORTED' : 'NETWORK_ERROR')));
    request.end();
  });
}

async function timedRequest(url, options, requestImpl, signal) {
  if (signal?.aborted) throw fail('ABORTED');
  const controller = new AbortController();
  let expired = false, abortReject;
  const aborted = new Promise((_, reject) => { abortReject = reject; });
  const onAbort = () => { controller.abort(); abortReject(fail('ABORTED')); };
  signal?.addEventListener('abort', onAbort, {once: true});
  const timer = setTimeout(() => { expired = true; controller.abort(); abortReject(fail('TIMEOUT')); }, TIMEOUT_MS);
  try {
    const result = await Promise.race([Promise.resolve().then(() => requestImpl(url, {...options,
      signal: controller.signal, timeoutMs: TIMEOUT_MS, maxBytes: MAX_BYTES})), aborted]);
    if (!Number.isInteger(result?.status) || !(typeof result.body === 'string' || Buffer.isBuffer(result.body))) throw fail('INVALID_RESPONSE');
    if (Buffer.byteLength(result.body) > MAX_BYTES) throw fail('BODY_LIMIT');
    return {...result, body: Buffer.isBuffer(result.body) ? result.body.toString('utf8') : result.body};
  } catch (error) { if (expired) throw fail('TIMEOUT'); if (signal?.aborted) throw fail('ABORTED'); throw fail(safeCode(error)); }
  finally { clearTimeout(timer); signal?.removeEventListener('abort', onAbort); }
}

function decodeEntities(text) {
  const names = {amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' '};
  return text.replace(/&(#x[0-9a-f]+|#\d+|amp|lt|gt|quot|apos|nbsp);/gi, (all, code) => {
    if (code[0] !== '#') return names[code.toLowerCase()] || all;
    const n = code[1].toLowerCase() === 'x' ? parseInt(code.slice(2), 16) : parseInt(code.slice(1), 10);
    return n >= 0 && n <= 0x10ffff && !(n >= 0xd800 && n <= 0xdfff) ? String.fromCodePoint(n) : ' ';
  });
}

function plainText(html) {
  return decodeEntities(String(html || '').replace(/<!--([\s\S]*?)-->/g, ' ')
    .replace(/<(script|style|noscript|template|svg)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, ' ')
    .replace(/<(?:script|style|noscript|template|svg)\b[^>]*>[\s\S]*$/gi, ' ')
    .replace(/<[^>]*>/g, ' ')).replace(/[\u0000-\u001f\u007f]/g, ' ').replace(/\s+/g, ' ').trim();
}

function attributes(tag) {
  const values = {};
  for (const match of tag.matchAll(/([\w:-]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) values[match[1].toLowerCase()] = decodeEntities(match[2] ?? match[3] ?? match[4]);
  return values;
}

function publishedDate(html) {
  for (const tag of html.match(/<meta\b[^>]*>/gi) || []) {
    const attrs = attributes(tag), name = (attrs.property || attrs.name || '').toLowerCase();
    if (!['article:published_time', 'datepublished'].includes(name)) continue;
    const date = (attrs.content || '').trim();
    if (/^\d{4}-\d{2}-\d{2}(?:T[0-9:.]+(?:Z|[+-]\d{2}:?\d{2})?)?$/.test(date) && Number.isFinite(Date.parse(date))) return date;
  }
  return null;
}

function parseJson(response) {
  try { const data = JSON.parse(response.body); if (!data || typeof data !== 'object' || Array.isArray(data) || data.error) throw Error(); return data; }
  catch { throw fail('INVALID_RESPONSE'); }
}

function finalSources(candidates, errors, method) {
  const unique = [], seen = new Set();
  for (const candidate of candidates) {
    if (seen.has(candidate.url) || !candidate.excerpt || unique.length >= 6) continue;
    seen.add(candidate.url);
    unique.push({id: 'S' + (unique.length + 1), title: candidate.title.slice(0, 200), url: candidate.url,
      publishedAt: candidate.publishedAt || null, retrievedAt: candidate.retrievedAt,
      excerpt: candidate.excerpt.slice(0, 1400), kind: candidate.kind});
  }
  const result = {sources: unique, errors: errors.slice(0, 12), method};
  // Bound the complete serialized payload as well as individual excerpts.
  while (JSON.stringify(result).length > 9000 && unique.length) {
    const last = unique[unique.length - 1], excess = JSON.stringify(result).length - 9000;
    if (last.excerpt.length > excess + 80) last.excerpt = last.excerpt.slice(0, last.excerpt.length - excess - 16);
    else unique.pop();
  }
  return result;
}

async function collectSources({topic = '', urls = [], braveKey = ''} = {}, {signal, requestImpl = pinnedRequest} = {}) {
  const query = typeof topic === 'string' ? topic.trim().slice(0, 300) : '';
  const sourceUrls = Array.isArray(urls) ? urls.slice(0, 3) : [];
  const hasKey = typeof braveKey === 'string' && Boolean(braveKey.trim());
  const method = query && sourceUrls.length ? 'mixed' : query ? hasKey ? 'brave' : 'wikipedia' : 'urls';
  const errors = [], candidates = [];
  let requests = 0;
  async function read(raw, brave = false) {
    let current = publicUrl(raw);
    for (let hop = 0; hop < 4; hop++) {
      if (signal?.aborted) throw fail('ABORTED');
      if (requests >= MAX_REQUESTS) throw fail('REQUEST_LIMIT');
      requests++;
      const headers = {Accept: 'application/json, text/html, text/plain, application/xml;q=0.8',
        'Accept-Encoding': 'identity', 'User-Agent': 'KIDO-NaradResearch/1.0 (read-only public source collection)'};
      if (brave && current.origin + current.pathname === BRAVE_ENDPOINT) headers['X-Subscription-Token'] = braveKey.trim();
      const response = await timedRequest(current.href, {headers}, requestImpl, signal);
      if ([301, 302, 303, 307, 308].includes(response.status)) {
        const target = header(response.headers, 'location');
        if (!target) throw fail('REDIRECT_INVALID');
        try { current = publicUrl(new URL(target, current).href); } catch (error) { throw fail(safeCode(error)); }
        continue;
      }
      if (response.status < 200 || response.status >= 300) throw fail('HTTP_ERROR');
      return {...response, url: current.href, retrievedAt: new Date().toISOString()};
    }
    throw fail('REDIRECT_LIMIT');
  }
  async function search() {
    if (!query) return [];
    try {
      if (hasKey) {
        if (braveKey.length > 16384 || /[^\x21-\x7e]/.test(braveKey.trim())) throw fail('INVALID_KEY');
        const target = new URL(BRAVE_ENDPOINT); target.searchParams.set('q', query); target.searchParams.set('count', '4');
        const response = await read(target.href, true), data = parseJson(response), results = [];
        for (const row of (data.web?.results || []).slice(0, 4)) {
          try {
            const url = publicUrl(row.url).href;
            const excerpt = plainText(row.description);
            if (excerpt) results.push({title: plainText(row.title) || new URL(url).hostname, url, publishedAt: null,
              retrievedAt: response.retrievedAt, excerpt, kind: 'search'});
          } catch {}
        }
        if (!results.length) throw fail('NO_RESULTS');
        return results;
      }
      const target = new URL(WIKI_ENDPOINT);
      const index = DEFAULT_TOPICS.indexOf(query);
      const parameters = {action: 'query', format: 'json', generator: 'search', gsrsearch: index >= 0 ? WIKI_DEFAULT_QUERIES[index] : query,
        gsrlimit: '3', gsrnamespace: '0', prop: 'extracts|info', exintro: '1', explaintext: '1', exchars: '1400', exlimit: '3', inprop: 'url'};
      for (const [key, value] of Object.entries(parameters)) target.searchParams.set(key, value);
      const response = await read(target.href), data = parseJson(response);
      const pages = Object.values(data.query?.pages || {}).sort((a, b) => (a.index || 0) - (b.index || 0));
      const results = [];
      for (const page of pages.slice(0, 3)) {
        if (!page || typeof page.title !== 'string' || !plainText(page.extract)) continue;
        try {
          const url = publicUrl(page.fullurl || 'https://en.wikipedia.org/wiki/' + encodeURIComponent(page.title.replace(/ /g, '_'))).href;
          results.push({title: plainText(page.title), url, publishedAt: null, retrievedAt: response.retrievedAt,
            excerpt: plainText(page.extract), kind: 'encyclopedia'});
        } catch {}
      }
      if (!results.length) throw fail('NO_RESULTS');
      return results;
    } catch (error) { errors.push({source: hasKey ? 'brave' : 'wikipedia', code: safeCode(error)}); return []; }
  }
  async function page(raw, index) {
    try {
      const response = await read(raw);
      const type = header(response.headers, 'content-type').split(';')[0].trim().toLowerCase();
      if (!['text/html', 'application/xhtml+xml', 'text/plain', 'application/xml', 'text/xml', 'application/rss+xml', 'application/atom+xml'].includes(type)) throw fail('UNSUPPORTED_CONTENT');
      const isHtml = /html/.test(type);
      const titleMatch = isHtml ? response.body.match(/<title\b[^>]*>([\s\S]*?)<\/title\s*>/i) : null;
      const textBody = isHtml ? response.body.replace(/<head\b[^>]*>[\s\S]*?<\/head\s*>/i, ' ') : response.body;
      const excerpt = plainText(textBody);
      if (!excerpt) throw fail('EMPTY_PAGE');
      return {title: titleMatch ? plainText(titleMatch[1]) : new URL(response.url).hostname,
        url: response.url, publishedAt: isHtml ? publishedDate(response.body) : null,
        retrievedAt: response.retrievedAt, excerpt, kind: 'page'};
    } catch (error) { errors.push({source: 'url:' + (index + 1), code: safeCode(error)}); return null; }
  }
  if (!query && !sourceUrls.length) errors.push({source: 'input', code: 'INPUT_REQUIRED'});
  const [searched, pages] = await Promise.all([search(), Promise.all(sourceUrls.map(page))]);
  candidates.push(...pages.filter(Boolean), ...searched);
  // Do not allow an upstream service to echo its credential into saved text.
  if (hasKey && braveKey.trim().length >= 4) {
    const key = braveKey.trim();
    for (const source of candidates) {
      source.title = source.title.split(key).join('[REDACTED]'); source.excerpt = source.excerpt.split(key).join('[REDACTED]');
      // Dropping an unsafe link preserves provenance; substituting another URL
      // would incorrectly imply that the replacement was the retrieved source.
      if (source.url.includes(key)) source.excerpt = '';
    }
  }
  return finalSources(candidates, errors, method);
}

module.exports = {DEFAULT_TOPICS, collectSources};
