'use strict';
const fs=require('fs'),path=require('path'),assert=require('assert');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const test=(n,fn)=>{try{fn();console.log('ok -',n)}catch(e){console.error('FAIL -',n);throw e}};

test('ai-tools: hindi, no Khanda, shapes section',()=>{
  const h=R('ai-tools.html');
  assert.ok(h.includes('lang="hi"'));
  assert.ok(h.includes('data-heritage="court"'));
  assert.ok(!h.includes('☬'));
  assert.ok(!/khanda/i.test(h));
  assert.ok(h.includes('मोबाइल आकार'));
  assert.ok(h.includes('Post shapes')||h.includes('post shapes')||h.includes('पोस्ट के लिए तैयार आकार'));
  assert.ok(h.includes('id="mobile-shapes"'));
  assert.ok(h.includes('./reels.html'));
  assert.ok(h.includes('./poster.html'));
  assert.ok(h.includes('9:16'));
  assert.ok(h.includes('1:1'));
  assert.ok(h.includes('4:5'));
  assert.ok(h.includes('16:9'));
  assert.ok(h.includes('1080×1920')||h.includes('1080x1920'));
  assert.ok(h.includes('goldtv.js'));
  assert.ok(h.includes('living-world'));
});

test('ai-tools: sw CACHE single line + asset',()=>{
  const sw=R('sw.js');
  assert.equal((sw.match(/const CACHE/g)||[]).length,1);
  assert.ok(sw.includes('./ai-tools.html'));
  assert.ok(/v0\.21\.\d+/.test(sw)||/v0\.\d+\.\d+/.test(sw));
});
