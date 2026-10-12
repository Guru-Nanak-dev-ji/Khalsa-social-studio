const {test}=require('node:test');
const assert=require('node:assert/strict');
const {readFileSync,existsSync}=require('node:fs');
const {resolve}=require('node:path');
const vm=require('node:vm');
const C=require('../assets/creator-core.js');
function memory(seed={}){const values=new Map(Object.entries(seed));return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)};}
function draft(overrides={}){return {id:'draft-1',created:'2026-10-12T18:00:00.000Z',updated:'2026-10-12T18:00:00.000Z',language:'hi',kind:'news',platform:'general',heading:'संगत की सेवा',body:'ਸਾਥ • सेवा • Community 🌍',source:'https://example.org/story',tags:'#Sangat',...overrides};}
test('Hindi, Punjabi and English survive save, reopen, edit and backup round trips',()=>{
  const storage=memory(),store=new C.Store(storage);
  for(const language of ['hi','pa','en'])store.save(draft({id:language,language}));
  const reopened=new C.Store(storage);assert.equal(reopened.drafts.length,3);
  reopened.save({...reopened.drafts[0],body:'Updated ਪੰਜਾਬੀ हिंदी 🌍'});
  assert.equal(reopened.drafts.length,3);
  assert.deepEqual(C.parse(C.serialize(reopened.drafts)),reopened.drafts);
  assert.equal(new C.Store(storage).drafts[0].body,'Updated ਪੰਜਾਬੀ हिंदी 🌍');
});
test('TXT includes title, source attribution and tags without HTML interpretation',()=>{
  const d=draft({heading:'<img src=x onerror=alert(1)>',body:'A\nB'});
  assert.equal(C.compose(d),'<img src=x onerror=alert(1)>\n\nA\nB\n\nस्रोत: https://example.org/story\n\n#Sangat');
  assert.match(C.compose({...d,language:'pa'}),/ਸਰੋਤ:/);assert.match(C.compose({...d,language:'en'}),/Source:/);
});
test('unsafe source protocols and credential-bearing URLs cannot enter saved data',()=>{
  for(const source of ['javascript:alert(1)','data:text/html,hello','file:///tmp/x','https://user:pass@example.org','not a url']){
    assert.equal(C.safeUrl(source),'');assert.throws(()=>C.validate(draft({source})),/source/);
  }
  assert.equal(C.safeUrl('https://example.org/a?q=1'),'https://example.org/a?q=1');
});
test('quota failure preserves previous saved drafts and in-memory state',()=>{
  const storage=memory(),store=new C.Store(storage);store.save(draft());const before=storage.getItem(C.KEY);
  storage.setItem=()=>{throw new Error('QuotaExceededError');};
  assert.throws(()=>store.save(draft({body:'Changed'})),/Quota/);
  assert.equal(storage.getItem(C.KEY),before);assert.equal(store.drafts[0].body,draft().body);
  assert.throws(()=>store.remove('draft-1'),/Quota/);assert.equal(store.drafts.length,1);
});
test('corrupt existing storage is preserved and cannot be overwritten',()=>{
  const storage=memory({[C.KEY]:'{corrupt'}),store=new C.Store(storage);
  assert.ok(store.error);assert.throws(()=>store.save(draft()),/storage/);assert.equal(storage.getItem(C.KEY),'{corrupt');
});
test('blocked storage is an explicit error',()=>{
  const store=new C.Store({getItem:()=>{throw new Error('SecurityError');}});
  assert.ok(store.error);assert.throws(()=>store.save(draft()),/storage/);
});
test('stale tabs cannot overwrite another tab, even after deletion',()=>{
  const storage=memory(),a=new C.Store(storage),b=new C.Store(storage);a.save(draft());
  assert.throws(()=>b.save(draft({id:'other'})),/conflict/);
  const c=new C.Store(storage);a.remove('draft-1');assert.throws(()=>c.save(draft()),/conflict/);
  assert.equal(new C.Store(storage).drafts.length,0);
});
test('import merges, deduplicates by content, and preserves ID collisions as separate drafts',()=>{
  const store=new C.Store(memory());store.save(draft());
  assert.equal(store.import([draft()]),0);
  assert.equal(store.import([draft({body:'different'})]),1);
  assert.equal(store.drafts.length,2);assert.notEqual(store.drafts[0].id,store.drafts[1].id);
  assert.equal(store.import([draft({body:'different'})]),0);
});
test('invalid or oversized imports never partially save',()=>{
  const storage=memory(),store=new C.Store(storage);store.save(draft());const before=storage.getItem(C.KEY);
  assert.throws(()=>store.import([draft({id:'valid',body:'new'}),draft({id:'bad',language:'xx'})]));
  assert.equal(storage.getItem(C.KEY),before);
  assert.throws(()=>C.parse(C.serialize([draft(),draft()])));
  assert.throws(()=>C.parse('{"format":"other","version":1,"drafts":[]}'));
  assert.throws(()=>store.save(draft({body:'x'.repeat(30001)})));
  assert.throws(()=>C.parse(C.serialize(Array.from({length:501},(_,i)=>draft({id:String(i)})))));
});
test('legacy import is copy-only and repeatable with all three old storage keys',()=>{
  const seed={
    'kdn-newsdesk-v03':JSON.stringify([{id:'a',title:'ਪੰਜਾਬ',body:'ਖ਼ਬਰ',language:'Punjabi',source:'https://example.org'}]),
    'kdn-sangat-post-studio-v1':JSON.stringify({heading:'Current',body:'Message',platform:'instagram'}),
    'kdn-sangat-draft-library-v1':JSON.stringify([{heading:'Library',body:'Saved',tags:'#Sangat'},null,{body:'unsafe',source:'javascript:alert(1)'}]),
    'kdn-sangat-calendar-v1':'untouched calendar'
  };
  const storage=memory(seed),result=C.legacy(storage),store=new C.Store(storage);
  assert.equal(result.drafts.length,3);assert.equal(result.skipped,2);assert.equal(result.drafts[0].language,'pa');
  assert.equal(store.import(result.drafts),3);assert.equal(store.import(C.legacy(storage).drafts),0);
  for(const [key,value] of Object.entries(seed))assert.equal(storage.getItem(key),value);
});
function swHarness(){
  const scope='https://example.org/Khalsa-social-studio/',events={},deleted=[],cached=new Map();
  let claimed=false,skipped=false,network=0;
  const caches={keys:async()=>['other-app','kdn-studio-v2','kdn-studio-/Khalsa-social-studio/-v0.4','kdn-studio-/Khalsa-social-studio/-v0.5.1','kdn-studio-/Khalsa-social-studio/-v0.6.0','kdn-studio-/Khalsa-social-studio/-v0.7.0','kdn-studio-/Khalsa-social-studio/-v0.8.0','kdn-studio-/Khalsa-social-studio/-v0.9.0','kdn-studio-/Khalsa-social-studio/-v0.9.1'],delete:async key=>{deleted.push(key);return true;},open:async()=>({addAll:async paths=>{for(const request of paths){assert.equal(request.cache,'reload');const path=new URL(request.url).pathname.slice(new URL(scope).pathname.length)||'index.html';assert.ok(existsSync(resolve(__dirname,'..',path)));cached.set(request.url,{ok:true,body:path});}},match:async url=>cached.get(url)})};
  const self={registration:{scope},location:{origin:'https://example.org'},addEventListener:(name,fn)=>events[name]=fn,skipWaiting:async()=>{skipped=true;},clients:{claim:async()=>{claimed=true;}}};
  vm.runInNewContext(readFileSync(resolve(__dirname,'../sw.js'),'utf8'),{URL,Request,Set,Promise,self,caches,fetch:async()=>{network++;throw new Error('offline');}});
  return {events,deleted,get claimed(){return claimed;},get skipped(){return skipped;},get network(){return network;}};
}
test('offline cache contains the complete Creator and cleans up only this scope',async()=>{
  const h=swHarness();let done;h.events.install({waitUntil:p=>done=p});await done;assert.ok(h.skipped);
  h.events.activate({waitUntil:p=>done=p});await done;assert.ok(h.claimed);
  assert.deepEqual(h.deleted,['kdn-studio-/Khalsa-social-studio/-v0.4','kdn-studio-/Khalsa-social-studio/-v0.5.1','kdn-studio-/Khalsa-social-studio/-v0.6.0','kdn-studio-/Khalsa-social-studio/-v0.7.0','kdn-studio-/Khalsa-social-studio/-v0.8.0','kdn-studio-/Khalsa-social-studio/-v0.9.0']);
  for(const file of ['enter.html','assets/app-update.js','studio.html','assets/duality.css','assets/duality-core.js','assets/duality.js','gyan.html','dwar.html','assets/gyan-content.js','assets/gyan.js','assets/gyan.css','docs/GYAN_READER_V08.txt','community.html','assets/community.js','assets/community-core.js','assets/community.css','assets/branding/nihang-greeters-v1.webp','docs/COMMUNITY_AGREEMENT_DRAFT.txt','creator.html','assets/creator.js','assets/creator-core.js','assets/creator.css','manifest.webmanifest','poster.html','assets/poster-core.js','assets/poster.js','assets/poster.css','assets/heritage.css','assets/motifs/gateway.svg','assets/motifs/court.svg','assets/motifs/gallery.svg','assets/motifs/chess-cards.svg','assets/fonts/NotoSansDevanagari.woff2','assets/fonts/NotoSansGurmukhi.woff2']){
    let response;h.events.fetch({request:{method:'GET',url:'https://example.org/Khalsa-social-studio/'+file+'?test=1'},respondWith:p=>response=p});
    assert.ok((await response).ok);
  }
  assert.equal(h.network,0);
});
test('service worker leaves API, other apps and write requests alone',()=>{
  const h=swHarness();
  for(const request of [{method:'GET',url:'https://api.github.com/repos/a/b'},{method:'GET',url:'https://example.org/other-app/'},{method:'POST',url:'https://example.org/Khalsa-social-studio/creator.html'},{method:'GET',url:'https://example.org/Khalsa-social-studio/unbundled'}])h.events.fetch({request,respondWith:()=>assert.fail('must not intercept')});
});
