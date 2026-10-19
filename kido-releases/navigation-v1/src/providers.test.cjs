'use strict';

const test = require('node:test');
const assert = require('node:assert/strict');
const {CATALOG, resolveProviders, discover, callProvider} = require('./providers.cjs');

// Every transport is injected. These tests never contact an AI endpoint or a
// running Ollama service, and never read environment credentials.
const TEST_KEY = 'test-only-provider-key-2468';
const json = (data, status = 200, headers = {}) => new Response(JSON.stringify(data),
  {status, headers: {'Content-Type': 'application/json', ...headers}});

function provider(id, options = {}) {
  const cfg = {providers: {[id]: {enabled: true, ...options}}};
  if (id === 'ollama' && !options.model) cfg.providers[id].model = 'local-small:latest';
  if (id === 'openrouter' && !options.model) cfg.providers[id].model = 'example/model';
  if (id === 'compatible') {
    cfg.providers[id] = {enabled: true, model: 'custom/model', endpoint: 'https://custom.example/v1/chat/completions', ...options};
  }
  return resolveProviders(cfg, {[id]: TEST_KEY}, {}).find(item => item.id === id);
}

function fakeFetch(data, status = 200) {
  const requests = [];
  const fetchImpl = async (url, options) => { requests.push({url, ...options}); return json(data, status); };
  return {requests, fetchImpl};
}

function normalReply(id, text = 'Visible answer') {
  if (id === 'openai') return {status: 'completed', output: [{type: 'message', role: 'assistant', content: [{type: 'output_text', text}]}]};
  if (id === 'gemini') return {candidates: [{content: {parts: [{text}]}, finishReason: 'STOP'}]};
  if (id === 'anthropic') return {content: [{type: 'text', text}], stop_reason: 'end_turn'};
  if (id === 'ollama') return {message: {role: 'assistant', content: text}, done: true, done_reason: 'stop'};
  return {choices: [{message: {role: 'assistant', content: text}, finish_reason: 'stop'}]};
}

test('catalog and pure resolution preserve explicit disabled providers and use local credentials only', () => {
  assert.deepEqual(Object.keys(CATALOG), ['ollama', 'openai', 'gemini', 'anthropic', 'deepseek', 'groq', 'openrouter', 'compatible']);
  const config = {providers: {openai: {enabled: false}, gemini: {model: 'models/gemini-configured'}}};
  const before = JSON.stringify(config);
  const list = resolveProviders(config, {openai: TEST_KEY}, {GOOGLE_API_KEY: 'google-test-key', GEMINI_MODEL: 'ignored-model'});
  assert.equal(JSON.stringify(config), before);
  assert.equal(list.find(p => p.id === 'openai').state, 'DISABLED');
  assert.equal(list.find(p => p.id === 'openai').enabled, false);
  assert.equal(list.find(p => p.id === 'gemini').key, 'google-test-key');
  assert.equal(list.find(p => p.id === 'gemini').model, 'gemini-configured');
  assert.equal(list.find(p => p.id === 'gemini').state, 'CONFIGURED_UNTESTED');
  assert.match(list.find(p => p.id === 'gemini').reason, /first successful task/);
  assert.equal(list.find(p => p.id === 'ollama').state, 'UNTESTED');
  assert.equal(list.find(p => p.id === 'anthropic').enabled, false);
});

test('explicit key, model and endpoint precedence; OpenRouter requires a model', () => {
  const list = resolveProviders({providers: {openai: {model: 'gpt-6-luna', endpoint: 'https://api.openai.com/v1/'},
    anthropic: {enabled: true}}}, {openai: TEST_KEY}, {
    OPENAI_API_KEY: 'ignored-env-key', OPENAI_MODEL: 'ignored-env-model',
    OPENROUTER_API_KEY: TEST_KEY,
    KIDO_LLM_API_KEY: 'custom-local-key', KIDO_LLM_MODEL: 'custom/model', KIDO_LLM_ENDPOINT: 'https://custom.example/complete'
  });
  assert.equal(list.find(p => p.id === 'openai').key, TEST_KEY);
  assert.equal(list.find(p => p.id === 'openai').endpoint, 'https://api.openai.com/v1/responses');
  assert.equal(list.find(p => p.id === 'openrouter').state, 'MODEL_REQUIRED');
  assert.equal(list.find(p => p.id === 'anthropic').state, 'KEY_REQUIRED');
  assert.equal(list.find(p => p.id === 'compatible').state, 'CONFIGURED_UNTESTED');
  assert.equal(list.find(p => p.id === 'compatible').model, 'custom/model');
  assert.equal(CATALOG.openai.defaultModel, 'gpt-6-luna');
  assert.equal(CATALOG.gemini.defaultModel, 'gemini-3.8-flash');
  assert.equal(CATALOG.anthropic.defaultModel, 'claude-haiku-5-5');
  assert.equal(CATALOG.deepseek.defaultModel, 'deepseek-flash');
});

test('endpoint validation prevents credentials being forwarded to a different origin or insecure transport', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; throw Error('Must not run'); };
  const invalid = [
    ['openai', 'https://other.example/v1/responses'],
    ['gemini', 'https://generativelanguage.googleapis.com/v1beta?key=' + TEST_KEY],
    ['anthropic', 'https://api.anthropic.com/v1/messages#' + TEST_KEY],
    ['groq', 'http://api.groq.com/openai/v1/chat/completions'],
    ['compatible', 'http://custom.example/v1/chat/completions'],
    ['compatible', 'https://' + TEST_KEY + '@custom.example/v1/chat/completions'],
    ['compatible', 'https://custom.example/v1/chat/completions?'],
    ['compatible', 'https://custom.example/v1/chat/completions#'],
    ['ollama', 'http://remote.example:11434'],
    ['ollama', 'https://127.0.0.1:11434'],
    ['ollama', 'http://127.0.0.1:11434/api/chat']
  ];
  for (const [id, endpoint] of invalid) {
    const resolved = provider(id, {endpoint});
    assert.equal(resolved.state, 'INVALID_CONFIG');
    assert.ok(!resolved.reason.includes(TEST_KEY));
    // Revalidate even a forged runtime record which bypassed resolution.
    await assert.rejects(callProvider({...provider(id), endpoint}, {prompt: 'Task', fetchImpl}), error =>
      ['INVALID_ENDPOINT', 'ENDPOINT_REQUIRED'].includes(error.code) && !error.message.includes(TEST_KEY));
  }
  assert.equal(calls, 0);
});

test('local discovery only GETs tags, skips cloud-backed models and chooses the smallest local model', async () => {
  const original = resolveProviders({}, {openai: TEST_KEY, gemini: TEST_KEY}, {});
  const mocked = fakeFetch({models: [
    {name: 'big:latest', size: 8000}, {name: 'qwen:cloud', size: 0}, {name: 'cloudname:10b-cloud', size: 1},
    {name: 'remote:latest', size: 1, remote_host: 'cloud.example'},
    {name: 'small:latest', size: 200}, {name: 'small:latest', size: 200}, {name: 'unknown-size:latest'}
  ]});
  const list = await discover(original, {fetchImpl: mocked.fetchImpl});
  assert.equal(mocked.requests.length, 1);
  assert.equal(mocked.requests[0].url, 'http://127.0.0.1:11434/api/tags');
  assert.equal(mocked.requests[0].method, 'GET');
  assert.equal(mocked.requests[0].headers.Authorization, undefined);
  assert.equal(mocked.requests[0].body, undefined);
  assert.equal(mocked.requests[0].redirect, 'error');
  assert.equal(list[0].model, 'small:latest');
  assert.equal(list[0].state, 'AVAILABLE');
  assert.deepEqual(list[0].models, ['small:latest', 'big:latest', 'unknown-size:latest']);
  assert.equal(original[0].model, '');
  assert.equal(original[0].state, 'UNTESTED');
  assert.equal(list.find(p => p.id === 'openai').state, 'CONFIGURED_UNTESTED');
});

test('discovery respects selected installed model, empty list, unavailable service and disabled local transport', async () => {
  const selected = provider('ollama', {model: 'small'});
  const installed = await discover([selected], {fetchImpl: fakeFetch({models: [{name: 'small:latest', size: 2}]}).fetchImpl});
  assert.equal(installed[0].model, 'small:latest');
  assert.equal(installed[0].state, 'AVAILABLE');
  const missing = await discover([selected], {fetchImpl: fakeFetch({models: [{name: 'other', size: 1}]}).fetchImpl});
  assert.equal(missing[0].state, 'MODEL_REQUIRED');
  const empty = await discover([selected], {fetchImpl: fakeFetch({models: [{name: 'remote-cloud', size: 0}]}).fetchImpl});
  assert.equal(empty[0].state, 'MODEL_REQUIRED');
  assert.match(empty[0].reason, /Nothing was downloaded/);
  const offline = await discover([selected], {fetchImpl: async () => { throw Error(TEST_KEY); }});
  assert.equal(offline[0].state, 'OFFLINE');
  assert.ok(!offline[0].reason.includes(TEST_KEY));
  let count = 0;
  await discover([{...selected, enabled: false}, provider('openai')], {fetchImpl: async () => { count++; }});
  assert.equal(count, 0);
});

test('OpenAI uses native Responses, store:false and visible output blocks only', async () => {
  const mocked = fakeFetch({status: 'incomplete', incomplete_details: {reason: 'max_output_tokens'},
    output: [{type: 'reasoning', summary: [{text: 'Private analysis'}]},
      {type: 'message', role: 'assistant', content: [{type: 'output_text', text: 'Draft result'}, {type: 'reasoning', text: 'Hidden'}]}],
    usage: {input_tokens: 12, output_tokens: 7, total_tokens: 19}});
  const result = await callProvider(provider('openai'), {system: 'System rules', prompt: 'User task', maxTokens: 500, fetchImpl: mocked.fetchImpl});
  const request = mocked.requests[0], body = JSON.parse(request.body);
  assert.equal(request.url, 'https://api.openai.com/v1/responses');
  assert.equal(request.headers.Authorization, 'Bearer ' + TEST_KEY);
  assert.equal(body.model, 'gpt-6-luna');
  assert.equal(body.instructions, 'System rules');
  assert.equal(body.input, 'User task');
  assert.equal(body.max_output_tokens, 500);
  assert.equal(body.store, false);
  assert.deepEqual(body.reasoning, {effort: 'low'});
  assert.equal(body.messages, undefined);
  assert.equal(body.tools, undefined);
  assert.equal(body.temperature, undefined);
  assert.equal(result.text, 'Draft result');
  assert.equal(result.truncated, true);
  assert.deepEqual(result.usage, {input: 12, output: 7, total: 19});
});

test('OpenAI does not force reasoning settings on legacy or Pro/chat/Codex model variants', async () => {
  for (const model of ['gpt-4.1-mini', 'gpt-5-pro', 'gpt-5.2-chat-latest', 'gpt-5-codex']) {
    const mocked = fakeFetch(normalReply('openai'));
    await callProvider(provider('openai', {model}), {prompt: 'Task', fetchImpl: mocked.fetchImpl});
    assert.equal(JSON.parse(mocked.requests[0].body).reasoning, undefined);
  }
});

test('Gemini uses key header, native contents/systemInstruction and excludes thought parts', async () => {
  const mocked = fakeFetch({candidates: [{content: {parts: [{text: 'Private thought', thought: true}, {text: 'Visible Gemini answer'}]}, finishReason: 'MAX_TOKENS'},
    {content: {parts: [{text: 'Alternative not selected'}]}, finishReason: 'STOP'}],
    usageMetadata: {promptTokenCount: 10, candidatesTokenCount: 4, thoughtsTokenCount: 2, totalTokenCount: 16}});
  const result = await callProvider(provider('gemini'), {system: 'Rules', prompt: 'Task', maxTokens: 600, fetchImpl: mocked.fetchImpl});
  const request = mocked.requests[0], body = JSON.parse(request.body);
  assert.equal(request.url, 'https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent');
  assert.equal(request.headers['x-goog-api-key'], TEST_KEY);
  assert.equal(request.headers.Authorization, undefined);
  assert.ok(!request.url.includes(TEST_KEY));
  assert.deepEqual(body.systemInstruction, {parts: [{text: 'Rules'}]});
  assert.deepEqual(body.contents, [{role: 'user', parts: [{text: 'Task'}]}]);
  assert.deepEqual(body.generationConfig, {maxOutputTokens: 600});
  assert.equal(result.text, 'Visible Gemini answer');
  assert.equal(result.truncated, true);
  assert.deepEqual(result.usage, {input: 10, output: 6, total: 16});
});

test('Claude uses native Messages with its version header and excludes thinking blocks', async () => {
  const mocked = fakeFetch({content: [{type: 'thinking', thinking: 'Private analysis'}, {type: 'text', text: 'Visible Claude answer'}],
    stop_reason: 'max_tokens', usage: {input_tokens: 8, cache_creation_input_tokens: 2, cache_read_input_tokens: 3, output_tokens: 5}});
  const result = await callProvider(provider('anthropic'), {system: 'Rules', prompt: 'Task', maxTokens: 700, fetchImpl: mocked.fetchImpl});
  const request = mocked.requests[0], body = JSON.parse(request.body);
  assert.equal(request.url, 'https://api.anthropic.com/v1/messages');
  assert.equal(request.headers['x-api-key'], TEST_KEY);
  assert.equal(request.headers['anthropic-version'], '2023-06-01');
  assert.equal(request.headers.Authorization, undefined);
  assert.equal(body.model, 'claude-haiku-5-5');
  assert.equal(body.max_tokens, 700);
  assert.equal(body.system, 'Rules');
  assert.deepEqual(body.messages, [{role: 'user', content: 'Task'}]);
  assert.equal(body.temperature, undefined);
  assert.equal(result.text, 'Visible Claude answer');
  assert.equal(result.truncated, true);
  assert.deepEqual(result.usage, {input: 13, output: 5, total: 18});
});

test('compatible providers send their own token parameter and parse visible assistant content', async () => {
  for (const id of ['deepseek', 'groq', 'openrouter', 'compatible']) {
    const mocked = fakeFetch({choices: [{message: {content: [{type: 'text', text: 'Visible result'}], reasoning_content: 'Do not reveal'}, finish_reason: 'length'}],
      usage: {prompt_tokens: 20, completion_tokens: 6, total_tokens: 26}});
    const result = await callProvider(provider(id), {system: 'Rules', prompt: 'Task', maxTokens: 800, fetchImpl: mocked.fetchImpl});
    const request = mocked.requests[0], body = JSON.parse(request.body);
    assert.equal(request.headers.Authorization, 'Bearer ' + TEST_KEY);
    assert.equal(body[id === 'groq' ? 'max_completion_tokens' : 'max_tokens'], 800);
    assert.equal(body[id === 'groq' ? 'max_tokens' : 'max_completion_tokens'], undefined);
    assert.equal(body.stream, false);
    assert.deepEqual(body.messages, [{role: 'system', content: 'Rules'}, {role: 'user', content: 'Task'}]);
    assert.ok(!request.url.includes(TEST_KEY));
    assert.ok(!request.body.includes(TEST_KEY));
    assert.equal(result.text, 'Visible result');
    assert.equal(result.provider, id);
    assert.equal(result.truncated, true);
    assert.deepEqual(result.usage, {input: 20, output: 6, total: 26});
  }
});

test('Ollama sends no credentials, disables thinking, limits prediction and never requests model downloads', async () => {
  const mocked = fakeFetch({message: {content: '<think>Private local reasoning</think>\nVisible local result', thinking: 'Private'},
    done: true, done_reason: 'length', prompt_eval_count: 4, eval_count: 9});
  const local = {...provider('ollama'), key: TEST_KEY};
  const result = await callProvider(local, {prompt: 'Task', maxTokens: 99, fetchImpl: mocked.fetchImpl});
  const request = mocked.requests[0], body = JSON.parse(request.body);
  assert.equal(request.url, 'http://127.0.0.1:11434/api/chat');
  assert.equal(request.headers.Authorization, undefined);
  assert.equal(request.headers['x-api-key'], undefined);
  assert.equal(body.think, false);
  assert.equal(body.options.num_predict, 99);
  assert.equal(body.stream, false);
  assert.equal(result.text, 'Visible local result');
  assert.equal(result.truncated, true);
  assert.deepEqual(result.usage, {input: 4, output: 9, total: 13});
  let calls = 0;
  await assert.rejects(callProvider({...local, model: 'remote:cloud'}, {prompt: 'Task', fetchImpl: async () => { calls++; }}),
    error => error.code === 'LOCAL_MODEL_REQUIRED');
  assert.equal(calls, 0);
});

test('HTTP failures carry safe codes/status/retryability and never reveal error bodies or keys', async () => {
  for (const status of [400, 401, 402, 403, 404, 429, 503]) {
    const mocked = fakeFetch({error: {message: 'Provider echoed secret: ' + TEST_KEY}}, status);
    await assert.rejects(callProvider(provider('openai'), {prompt: 'Task', fetchImpl: mocked.fetchImpl}), error => {
      assert.equal(error.code, 'HTTP_' + status);
      assert.equal(error.status, status);
      assert.equal(error.retryable, status === 429 || status >= 500);
      assert.ok(!String(error.stack).includes(TEST_KEY));
      assert.ok(!JSON.stringify(error).includes(TEST_KEY));
      assert.equal(error.cause, undefined);
      return true;
    });
    assert.equal(mocked.requests.length, 1);
  }
});

test('network and invalid JSON errors are redacted without retaining a native cause', async () => {
  await assert.rejects(callProvider(provider('gemini'), {prompt: 'Task', fetchImpl: async () => { throw Error('Network ' + TEST_KEY); }}), error => {
    assert.equal(error.code, 'NETWORK_ERROR');
    assert.equal(error.retryable, true);
    assert.ok(!error.stack.includes(TEST_KEY));
    assert.equal(error.cause, undefined);
    return true;
  });
  await assert.rejects(callProvider(provider('openai'), {prompt: 'Task', fetchImpl: async () => new Response('not json ' + TEST_KEY)}), error => {
    assert.equal(error.code, 'INVALID_RESPONSE');
    assert.ok(!error.stack.includes(TEST_KEY));
    return true;
  });
});

test('all fetches refuse redirects and do not retry or forward credentials', async () => {
  let calls = 0;
  await assert.rejects(callProvider(provider('openai'), {prompt: 'Task', fetchImpl: async (_url, options) => {
    calls++;
    assert.equal(options.redirect, 'error');
    const response = json(normalReply('openai'));
    Object.defineProperty(response, 'redirected', {value: true});
    return response;
  }}), error => error.code === 'REDIRECT_REFUSED');
  assert.equal(calls, 1);
});

test('responses larger than 2 MiB are rejected from declared size or a chunked body', async () => {
  const max = 2 * 1024 * 1024;
  for (const fetchImpl of [
    async () => json(normalReply('openai'), 200, {'Content-Length': String(max + 1)}),
    async () => new Response(new ReadableStream({start(controller) {
      controller.enqueue(new Uint8Array(1024 * 1024));
      controller.enqueue(new Uint8Array(1024 * 1024 + 1));
      controller.close();
    }}))
  ]) {
    await assert.rejects(callProvider(provider('openai'), {prompt: 'Task', fetchImpl}), error => error.code === 'RESPONSE_TOO_LARGE');
  }
});

test('thought-only and empty answers fail instead of reporting a successful agent result', async () => {
  const examples = {
    openai: {output: [{type: 'reasoning', summary: [{text: 'Private'}]}]},
    gemini: {candidates: [{content: {parts: [{thought: true, text: 'Private'}]}}]},
    anthropic: {content: [{type: 'thinking', thinking: 'Private'}]},
    deepseek: {choices: [{message: {content: '', reasoning_content: 'Private'}}]},
    ollama: {message: {content: '<think>Private unfinished thought', thinking: 'Private'}}
  };
  for (const [id, data] of Object.entries(examples)) {
    await assert.rejects(callProvider(provider(id), {prompt: 'Task', fetchImpl: fakeFetch(data).fetchImpl}), error => error.code === 'EMPTY_RESPONSE');
  }
});

test('provider timeout aborts even an injected transport which ignores its signal', async () => {
  let innerSignal;
  const start = Date.now();
  await assert.rejects(callProvider(provider('openai'), {prompt: 'Task', timeoutMs: 15,
    fetchImpl: async (_url, options) => { innerSignal = options.signal; return new Promise(() => {}); }}), error => {
    assert.equal(error.code, 'TIMEOUT');
    assert.equal(error.retryable, true);
    return true;
  });
  assert.equal(innerSignal.aborted, true);
  assert.ok(Date.now() - start < 2000);
  const local = await discover([provider('ollama')], {timeoutMs: 10, fetchImpl: async () => new Promise(() => {})});
  assert.equal(local[0].state, 'OFFLINE');
});

test('caller cancellation aborts a pending request and an already aborted task never fetches', async () => {
  const controller = new AbortController();
  let innerSignal;
  const promise = callProvider(provider('openai'), {prompt: 'Task', signal: controller.signal,
    fetchImpl: async (_url, options) => { innerSignal = options.signal; return new Promise(() => {}); }});
  controller.abort(new Error(TEST_KEY));
  await assert.rejects(promise, error => error.code === 'ABORTED' && !error.message.includes(TEST_KEY));
  assert.equal(innerSignal.aborted, true);
  let calls = 0;
  await assert.rejects(callProvider(provider('openai'), {prompt: 'Task', signal: controller.signal,
    fetchImpl: async () => { calls++; }}), error => error.code === 'ABORTED');
  assert.equal(calls, 0);
});

test('accidentally echoed local API keys are redacted from visible provider text', async () => {
  const result = await callProvider(provider('openai'), {prompt: 'Task', fetchImpl: fakeFetch(normalReply('openai', 'Echo: ' + TEST_KEY)).fetchImpl});
  assert.equal(result.text, 'Echo: [REDACTED_API_KEY]');
});

test('missing settings, disabled providers and invalid task limits never reach fetch', async () => {
  let calls = 0;
  const fetchImpl = async () => { calls++; };
  const cases = [
    [{...provider('openai'), enabled: false}, {prompt: 'Task'}, 'PROVIDER_DISABLED'],
    [{...provider('openai'), key: ''}, {prompt: 'Task'}, 'KEY_REQUIRED'],
    [{...provider('openrouter'), model: ''}, {prompt: 'Task'}, 'MODEL_REQUIRED'],
    [provider('openai'), {prompt: ''}, 'INVALID_PROMPT'],
    [provider('openai'), {prompt: 'Task', maxTokens: 0}, 'INVALID_TOKEN_LIMIT'],
    [provider('openai'), {prompt: 'Task', maxTokens: 999999}, 'INVALID_TOKEN_LIMIT'],
    [{id: 'grok', enabled: true}, {prompt: 'Task'}, 'UNKNOWN_PROVIDER']
  ];
  for (const [selected, options, code] of cases) await assert.rejects(callProvider(selected, {...options, fetchImpl}), error => error.code === code);
  assert.equal(calls, 0);
});
