'use strict';

// Provider transport only. This module never reads files, executes tools, installs
// models, or retries requests. Runtime provider records contain API keys: keep
// them private and whitelist fields before showing status or writing reports.

const MAX_RESPONSE_BYTES = 2 * 1024 * 1024;
const CLOUD_TIMEOUT_MS = 120000;
const LOCAL_TIMEOUT_MS = 180000;
const DISCOVERY_TIMEOUT_MS = 3000;
const CONFIGURED_REASON = 'Credentials and model are configured; verified by the first successful task.';

const CATALOG = Object.freeze(Object.fromEntries([
  {id: 'ollama', label: 'Ollama · local', kind: 'ollama', defaultModel: '',
    defaultEndpoint: 'http://127.0.0.1:11434', keyEnv: [], modelEnv: ['OLLAMA_MODEL'], endpointEnv: ['OLLAMA_HOST']},
  {id: 'openai', label: 'OpenAI', kind: 'openai', defaultModel: 'gpt-6-luna',
    defaultEndpoint: 'https://api.openai.com/v1/responses', keyEnv: ['OPENAI_API_KEY'], modelEnv: ['OPENAI_MODEL'], endpointEnv: []},
  {id: 'gemini', label: 'Gemini', kind: 'gemini', defaultModel: 'gemini-3.8-flash',
    defaultEndpoint: 'https://generativelanguage.googleapis.com/v1beta', keyEnv: ['GEMINI_API_KEY', 'GOOGLE_API_KEY'], modelEnv: ['GEMINI_MODEL', 'GOOGLE_MODEL'], endpointEnv: []},
  {id: 'anthropic', label: 'Claude', kind: 'anthropic', defaultModel: 'claude-haiku-5-5',
    defaultEndpoint: 'https://api.anthropic.com/v1/messages', keyEnv: ['ANTHROPIC_API_KEY'], modelEnv: ['ANTHROPIC_MODEL'], endpointEnv: []},
  {id: 'deepseek', label: 'DeepSeek', kind: 'compatible', defaultModel: 'deepseek-flash',
    defaultEndpoint: 'https://api.deepseek.com/chat/completions', keyEnv: ['DEEPSEEK_API_KEY'], modelEnv: ['DEEPSEEK_MODEL'], endpointEnv: []},
  {id: 'groq', label: 'Groq', kind: 'compatible', defaultModel: 'llama-3.3-70b-versatile',
    defaultEndpoint: 'https://api.groq.com/openai/v1/chat/completions', keyEnv: ['GROQ_API_KEY'], modelEnv: ['GROQ_MODEL'], endpointEnv: []},
  {id: 'openrouter', label: 'OpenRouter', kind: 'compatible', defaultModel: '',
    defaultEndpoint: 'https://openrouter.ai/api/v1/chat/completions', keyEnv: ['OPENROUTER_API_KEY'], modelEnv: ['OPENROUTER_MODEL'], endpointEnv: []},
  {id: 'compatible', label: 'Custom compatible API', kind: 'compatible', defaultModel: '',
    defaultEndpoint: '', keyEnv: ['KIDO_LLM_API_KEY'], modelEnv: ['KIDO_LLM_MODEL'], endpointEnv: ['KIDO_LLM_ENDPOINT']}
].map(entry => [entry.id, Object.freeze({...entry,
  keyEnv: Object.freeze(entry.keyEnv), modelEnv: Object.freeze(entry.modelEnv), endpointEnv: Object.freeze(entry.endpointEnv)
})])));

class ProviderError extends Error {
  constructor(code, message, status = null, retryable = false) {
    super(message);
    this.name = 'ProviderError';
    this.code = code;
    this.status = status;
    this.retryable = retryable;
  }
}

function problem(code, message, status = null, retryable = false) {
  return new ProviderError(code, message, status, retryable);
}

function nonempty(value) { return typeof value === 'string' ? value.trim() : ''; }
function firstEnv(env, names) {
  for (const name of names) if (nonempty(env?.[name])) return nonempty(env[name]);
  return '';
}

function localCloudModel(name) { return /:cloud\b|-cloud\b/i.test(name); }

function normalizeModel(id, value) {
  let model = nonempty(value);
  if (id === 'gemini') model = model.replace(/^models\//, '');
  if (model && (!/^[A-Za-z0-9][A-Za-z0-9._:/@-]{0,239}$/.test(model) || model.includes('..'))) {
    throw problem('INVALID_MODEL', 'The model ID has an unsupported format.');
  }
  if (id === 'gemini' && model.includes('/')) throw problem('INVALID_MODEL', 'Use a Gemini model ID.');
  if (id === 'ollama' && localCloudModel(model)) {
    throw problem('LOCAL_MODEL_REQUIRED', 'Choose an installed local Ollama model; cloud-backed Ollama models are disabled.');
  }
  return model;
}

function validKey(value) {
  const key = nonempty(value);
  if (key && (key.length > 16384 || /[^\x21-\x7e]/.test(key))) {
    throw problem('INVALID_KEY', 'The locally configured API key has an invalid format.');
  }
  return key;
}

function endpointFor(id, value) {
  const entry = CATALOG[id];
  if (!entry) throw problem('UNKNOWN_PROVIDER', 'This provider is not supported.');
  const raw = nonempty(value) || entry.defaultEndpoint;
  if (!raw) throw problem('ENDPOINT_REQUIRED', 'Configure a full HTTPS chat-completions endpoint.');
  let url;
  try { url = new URL(raw); } catch { throw problem('INVALID_ENDPOINT', 'The provider endpoint must be a valid URL.'); }
  if (url.username || url.password || url.hash || url.search || raw.includes('?') || raw.includes('#')) {
    throw problem('INVALID_ENDPOINT', 'Endpoint URLs cannot contain credentials, query parameters, or fragments.');
  }
  const cleanPath = url.pathname.replace(/\/+$/, '');
  if (id === 'ollama') {
    if (url.protocol !== 'http:' || !['localhost', '127.0.0.1', '[::1]'].includes(url.hostname) || cleanPath) {
      throw problem('INVALID_ENDPOINT', 'Ollama must use an HTTP loopback base URL without a path.');
    }
    return url.origin;
  }
  if (url.protocol !== 'https:') throw problem('INVALID_ENDPOINT', 'Cloud providers require HTTPS.');
  if (id === 'compatible') {
    if (!cleanPath) throw problem('ENDPOINT_REQUIRED', 'Configure the complete HTTPS chat-completions path.');
    return url.href.replace(/\/+$/, '');
  }
  const official = new URL(entry.defaultEndpoint);
  if (url.origin !== official.origin) throw problem('INVALID_ENDPOINT', 'This provider must use its official API origin.');
  // Accept a provider's normal base URL as well as its exact endpoint. Always
  // use the fixed path belonging to the selected native adapter.
  const paths = new Set(['', official.pathname.replace(/\/+$/, '')]);
  if (id === 'openai' || id === 'anthropic') paths.add('/v1');
  if (id === 'deepseek') { paths.add('/v1'); paths.add('/v1/chat/completions'); }
  if (id === 'groq') paths.add('/openai/v1');
  if (id === 'openrouter') paths.add('/api/v1');
  if (!paths.has(cleanPath)) throw problem('INVALID_ENDPOINT', 'Use the official endpoint for this provider adapter.');
  return entry.defaultEndpoint;
}

function resolveProviders(config = {}, secrets = {}, env = process.env) {
  return Object.values(CATALOG).map(entry => {
    const cfg = config?.providers?.[entry.id] || {};
    const rawKey = nonempty(secrets?.[entry.id]) || firstEnv(env, entry.keyEnv);
    const enabled = cfg.enabled === false ? false : cfg.enabled === true || entry.id === 'ollama' || Boolean(rawKey);
    const record = {id: entry.id, label: entry.label, kind: entry.kind, enabled,
      model: '', endpoint: '', key: '', state: 'DISABLED', reason: '', models: []};
    try {
      if (cfg.enabled != null && typeof cfg.enabled !== 'boolean') throw problem('INVALID_CONFIG', 'Provider enabled must be true or false.');
      if (cfg.model != null && typeof cfg.model !== 'string') throw problem('INVALID_MODEL', 'The model ID must be text.');
      if (cfg.endpoint != null && typeof cfg.endpoint !== 'string') throw problem('INVALID_ENDPOINT', 'The endpoint must be text.');
      record.key = entry.id === 'ollama' ? '' : validKey(rawKey);
      record.model = normalizeModel(entry.id, nonempty(cfg.model) || firstEnv(env, entry.modelEnv) || entry.defaultModel);
      record.endpoint = endpointFor(entry.id, nonempty(cfg.endpoint) || firstEnv(env, entry.endpointEnv));
      if (!enabled) {
        record.reason = cfg.enabled === false ? 'Disabled in local configuration.' : 'No local API key is configured.';
      } else if (entry.id !== 'ollama' && !record.key) {
        record.state = 'KEY_REQUIRED'; record.reason = 'Add this provider API key locally in Termux.';
      } else if (entry.id === 'ollama') {
        record.state = 'UNTESTED'; record.reason = 'Local model availability has not been checked.';
      } else if (!record.model) {
        record.state = 'MODEL_REQUIRED'; record.reason = 'Set an explicit model ID for this provider.';
      } else {
        record.state = 'CONFIGURED_UNTESTED'; record.reason = CONFIGURED_REASON;
      }
    } catch (error) {
      record.state = enabled ? 'INVALID_CONFIG' : 'DISABLED';
      record.reason = enabled ? (error instanceof ProviderError ? error.message : 'Invalid local provider configuration.')
        : 'Disabled; complete its local settings before enabling it.';
    }
    return record;
  });
}

function httpProblem(status) {
  const messages = {
    400: 'The provider rejected the request or model parameters.',
    401: 'The provider rejected the API key.',
    402: 'The provider requires available credits or billing.',
    403: 'The provider denied access to this key or model.',
    404: 'The model or endpoint was not found.',
    408: 'The provider timed out.',
    413: 'The provider rejected the request size.',
    429: 'The provider rate limit or quota was reached.'
  };
  return problem('HTTP_' + status, messages[status] || 'The provider returned an HTTP error.', status,
    status === 408 || status === 429 || status >= 500);
}

function cancelBody(response) {
  try {
    const result = response?.body?.cancel();
    if (result?.catch) result.catch(() => {});
  } catch {}
}

async function boundedJson(response, signal) {
  const length = response.headers?.get?.('content-length');
  if (length && /^\d+$/.test(length) && Number(length) > MAX_RESPONSE_BYTES) {
    cancelBody(response);
    throw problem('RESPONSE_TOO_LARGE', 'The provider response exceeded the 2 MiB limit.');
  }
  if (!response.body?.getReader) throw problem('INVALID_RESPONSE', 'The provider returned no readable response body.');
  const reader = response.body.getReader();
  const chunks = [];
  let size = 0;
  const abortRead = () => { try { Promise.resolve(reader.cancel()).catch(() => {}); } catch {} };
  signal.addEventListener('abort', abortRead, {once: true});
  try {
    while (true) {
      if (signal.aborted) throw problem('ABORTED', 'The provider request was cancelled.');
      const {done, value} = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > MAX_RESPONSE_BYTES) {
        abortRead();
        throw problem('RESPONSE_TOO_LARGE', 'The provider response exceeded the 2 MiB limit.');
      }
      chunks.push(Buffer.from(value));
    }
  } finally {
    signal.removeEventListener('abort', abortRead);
    try { reader.releaseLock(); } catch {}
  }
  let parsed;
  try { parsed = JSON.parse(Buffer.concat(chunks, size).toString('utf8')); }
  catch { throw problem('INVALID_RESPONSE', 'The provider returned invalid JSON.'); }
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw problem('INVALID_RESPONSE', 'The provider returned an invalid response structure.');
  return parsed;
}

async function requestJson(url, init, {fetchImpl = globalThis.fetch, signal, timeoutMs}) {
  if (typeof fetchImpl !== 'function') throw problem('FETCH_UNAVAILABLE', 'Node.js 20 or newer is required.');
  const controller = new AbortController();
  let expired = false;
  const outerAbort = () => controller.abort();
  if (signal?.aborted) throw problem('ABORTED', 'The provider request was cancelled.');
  signal?.addEventListener('abort', outerAbort, {once: true});
  let rejectAbort;
  const aborted = new Promise((_, reject) => { rejectAbort = reject; });
  const onAbort = () => rejectAbort(problem(expired ? 'TIMEOUT' : 'ABORTED',
    expired ? 'The provider request exceeded its time limit.' : 'The provider request was cancelled.', null, expired));
  controller.signal.addEventListener('abort', onAbort, {once: true});
  const timer = setTimeout(() => { expired = true; controller.abort(); }, timeoutMs);
  try {
    const operation = (async () => {
      const response = await fetchImpl(url, {...init, redirect: 'error', signal: controller.signal});
      if (controller.signal.aborted) { cancelBody(response); throw problem('ABORTED', 'The provider request was cancelled.'); }
      if (response?.redirected) { cancelBody(response); throw problem('REDIRECT_REFUSED', 'Provider redirects are not allowed.'); }
      if (!Number.isInteger(response?.status)) throw problem('INVALID_RESPONSE', 'The provider returned an invalid HTTP response.');
      if (response.status < 200 || response.status >= 300) { cancelBody(response); throw httpProblem(response.status); }
      return boundedJson(response, controller.signal);
    })();
    return await Promise.race([operation, aborted]);
  } catch (error) {
    if (expired) throw problem('TIMEOUT', 'The provider request exceeded its time limit.', null, true);
    if (signal?.aborted) throw problem('ABORTED', 'The provider request was cancelled.');
    if (error instanceof ProviderError) throw error;
    throw problem('NETWORK_ERROR', 'The provider connection failed. Check connectivity and local endpoint settings.', null, true);
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', outerAbort);
    controller.signal.removeEventListener('abort', onAbort);
  }
}

function boundedTimeout(value, maximum) {
  return Number.isFinite(value) && value > 0 ? Math.min(Math.floor(value), maximum) : maximum;
}

async function discover(providers, {fetchImpl = globalThis.fetch, signal, timeoutMs = DISCOVERY_TIMEOUT_MS} = {}) {
  // Discovery never authenticates to or probes a cloud provider, and never
  // invokes /api/pull. It only reads the explicitly enabled local Ollama host.
  return Promise.all(providers.map(async provider => {
    const result = {...provider, models: [...(provider.models || [])]};
    if (provider.id !== 'ollama' || !provider.enabled || provider.state === 'INVALID_CONFIG') return result;
    try {
      const endpoint = endpointFor('ollama', provider.endpoint);
      const data = await requestJson(endpoint + '/api/tags', {method: 'GET', headers: {Accept: 'application/json'}},
        {fetchImpl, signal, timeoutMs: boundedTimeout(timeoutMs, DISCOVERY_TIMEOUT_MS)});
      if (!Array.isArray(data.models)) throw problem('INVALID_RESPONSE', 'The local model list has an invalid format.');
      const local = [];
      for (const item of data.models) {
        if (!item || typeof item !== 'object' || item.remote_host || item.remote_model) continue;
        const name = nonempty(item.name) || nonempty(item.model);
        if (!name || localCloudModel(name)) continue;
        try { normalizeModel('ollama', name); } catch { continue; }
        if (!local.some(model => model.name === name)) local.push({name,
          size: Number.isFinite(item.size) && item.size >= 0 ? item.size : Number.POSITIVE_INFINITY});
      }
      local.sort((a, b) => a.size - b.size || a.name.localeCompare(b.name));
      result.models = local.map(item => item.name);
      if (!result.model && local.length) result.model = local[0].name;
      if (result.model && !result.models.includes(result.model) && result.models.includes(result.model + ':latest')) result.model += ':latest';
      if (result.model && result.models.includes(result.model)) {
        result.state = 'AVAILABLE'; result.reason = 'An installed local model is available; no cloud API key is used.';
      } else {
        result.state = 'MODEL_REQUIRED';
        result.reason = local.length ? 'The configured local model is not installed; choose one of the listed models.'
          : 'No installed local models were found. Nothing was downloaded.';
      }
    } catch (error) {
      result.state = error?.code === 'INVALID_ENDPOINT' ? 'INVALID_CONFIG' : 'OFFLINE';
      result.models = [];
      result.reason = error?.code === 'ABORTED' ? 'Local discovery was cancelled.'
        : error?.code === 'INVALID_ENDPOINT' ? 'The local endpoint is invalid.'
          : 'The local Ollama service did not return an available model list.';
    }
    return result;
  }));
}

function count(value) { return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0; }
function usage(input, output, total) {
  const a = count(input), b = count(output);
  return {input: a, output: b, total: Number.isFinite(total) && total >= 0 ? Math.floor(total) : a + b};
}

function textParts(parts, type) {
  return Array.isArray(parts) ? parts.filter(part => part && part.type === type && typeof part.text === 'string').map(part => part.text).join('\n') : '';
}

function visible(text, key) {
  let value = String(text || '').replace(/<(think(?:ing)?)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<(?:think|thinking)\b[^>]*>[\s\S]*$/gi, '').trim();
  if (key && key.length >= 4) value = value.split(key).join('[REDACTED_API_KEY]');
  return value;
}

function lowReasoningSupported(model) {
  // Do not apply reasoning settings to legacy GPT models, chat-only aliases,
  // or specialized Pro/Codex variants with different parameter support.
  return /^gpt-(?:5|6)(?:[.-]|$)/i.test(model) && !/-(?:pro|chat|codex)(?:-|$)/i.test(model);
}

function parseReply(id, data) {
  if (data.error) throw problem('PROVIDER_ERROR', 'The provider reported an unsuccessful result.');
  if (id === 'openai') {
    if (['failed', 'cancelled'].includes(data.status)) throw problem('PROVIDER_ERROR', 'The provider did not complete the response.');
    const messages = Array.isArray(data.output) ? data.output.filter(item => item?.type === 'message' && (!item.role || item.role === 'assistant')) : [];
    const text = messages.map(item => textParts(item.content, 'output_text')).filter(Boolean).join('\n');
    return {text, usage: usage(data.usage?.input_tokens, data.usage?.output_tokens, data.usage?.total_tokens),
      truncated: data.status === 'incomplete' || Boolean(data.incomplete_details)};
  }
  if (id === 'gemini') {
    const first = data.candidates?.[0];
    if (data.promptFeedback?.blockReason || ['SAFETY', 'BLOCKLIST', 'PROHIBITED_CONTENT', 'SPII'].includes(first?.finishReason)) {
      throw problem('CONTENT_BLOCKED', 'The provider declined to produce a visible answer.');
    }
    const text = Array.isArray(first?.content?.parts) ? first.content.parts.filter(part => part && !part.thought && typeof part.text === 'string').map(part => part.text).join('\n') : '';
    const u = data.usageMetadata || {};
    return {text, usage: usage(u.promptTokenCount, count(u.candidatesTokenCount) + count(u.thoughtsTokenCount), u.totalTokenCount),
      truncated: first?.finishReason === 'MAX_TOKENS'};
  }
  if (id === 'anthropic') {
    const u = data.usage || {};
    return {text: textParts(data.content, 'text'),
      usage: usage(count(u.input_tokens) + count(u.cache_creation_input_tokens) + count(u.cache_read_input_tokens), u.output_tokens),
      truncated: data.stop_reason === 'max_tokens'};
  }
  if (id === 'ollama') {
    return {text: typeof data.message?.content === 'string' ? data.message.content : '',
      usage: usage(data.prompt_eval_count, data.eval_count), truncated: data.done_reason === 'length'};
  }
  const first = data.choices?.[0];
  if (first?.finish_reason === 'content_filter') throw problem('CONTENT_BLOCKED', 'The provider declined to produce a visible answer.');
  const content = first?.message?.content;
  return {text: typeof content === 'string' ? content : textParts(content, 'text'),
    usage: usage(data.usage?.prompt_tokens, data.usage?.completion_tokens, data.usage?.total_tokens),
    truncated: first?.finish_reason === 'length'};
}

async function callProvider(provider, {system = '', prompt, maxTokens = 1600, signal,
  fetchImpl = globalThis.fetch, timeoutMs} = {}) {
  const entry = CATALOG[provider?.id];
  if (!entry) throw problem('UNKNOWN_PROVIDER', 'This provider is not supported.');
  if (provider.enabled !== true) throw problem('PROVIDER_DISABLED', 'This provider is disabled.');
  if (typeof system !== 'string' || typeof prompt !== 'string' || !prompt.trim()) throw problem('INVALID_PROMPT', 'A non-empty text task is required.');
  if (!Number.isSafeInteger(maxTokens) || maxTokens < 1 || maxTokens > 32768) throw problem('INVALID_TOKEN_LIMIT', 'The output token limit must be an integer from 1 to 32768.');
  const endpoint = endpointFor(entry.id, provider.endpoint);
  const model = normalizeModel(entry.id, provider.model);
  if (!model) throw problem('MODEL_REQUIRED', 'Select a model before running this provider.');
  const key = entry.id === 'ollama' ? '' : validKey(provider.key);
  if (entry.id !== 'ollama' && !key) throw problem('KEY_REQUIRED', 'Add the API key locally before running this provider.');
  const headers = {'Content-Type': 'application/json', Accept: 'application/json'};
  const messages = [...(system ? [{role: 'system', content: system}] : []), {role: 'user', content: prompt}];
  let url = endpoint, body;
  if (entry.id === 'openai') {
    headers.Authorization = 'Bearer ' + key;
    body = {model, instructions: system, input: prompt, max_output_tokens: maxTokens, store: false};
    if (lowReasoningSupported(model)) body.reasoning = {effort: 'low'};
  } else if (entry.id === 'gemini') {
    headers['x-goog-api-key'] = key;
    url += '/models/' + encodeURIComponent(model) + ':generateContent';
    body = {contents: [{role: 'user', parts: [{text: prompt}]}], generationConfig: {maxOutputTokens: maxTokens}};
    if (system) body.systemInstruction = {parts: [{text: system}]};
  } else if (entry.id === 'anthropic') {
    headers['x-api-key'] = key; headers['anthropic-version'] = '2023-06-01';
    body = {model, max_tokens: maxTokens, system, messages: [{role: 'user', content: prompt}]};
  } else if (entry.id === 'ollama') {
    url += '/api/chat';
    body = {model, messages, stream: false, think: false, options: {num_predict: maxTokens}};
  } else {
    headers.Authorization = 'Bearer ' + key;
    body = {model, messages, stream: false, [entry.id === 'groq' ? 'max_completion_tokens' : 'max_tokens']: maxTokens};
  }
  const data = await requestJson(url, {method: 'POST', headers, body: JSON.stringify(body)},
    {fetchImpl, signal, timeoutMs: boundedTimeout(timeoutMs, entry.id === 'ollama' ? LOCAL_TIMEOUT_MS : CLOUD_TIMEOUT_MS)});
  const parsed = parseReply(entry.id, data);
  const text = visible(parsed.text, key);
  if (!text) throw problem('EMPTY_RESPONSE', 'The provider returned no visible answer. Try another model or a larger output limit.');
  return {text, provider: entry.id, model, usage: parsed.usage, truncated: Boolean(parsed.truncated)};
}

module.exports = {CATALOG, resolveProviders, discover, callProvider};
