const test=require('node:test'),assert=require('node:assert/strict'),K=require('../assets/kingdom/v012/kingdom-core.js');
const memory=()=>{const map=new Map([['kdn-news-social-creator-v1','draft'],['kdn-community-local-v1','seva']]);return {map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v),removeItem:k=>map.delete(k)};};
test('aliases share six gifts; every named coin is represented and repeat claims give nothing',()=>{
 for(const p of ['','index.html','enter.html','world.html','kingdom.html','maze.html?test=1'])assert.equal(K.roomFor(p).id,'pran');
 assert.equal(K.roomFor('docs/Begampura_FAQ_542_Offline_Reader.html').id,'faq');
 let s=K.fresh();for(let i=0;i<6;i++)s=K.collect(s,'pran',i).state;
 assert.deepEqual(Object.values(K.totals(s)),[5,5,5,5,5,5]);assert.equal(K.collect(s,'pran',0).added,false);assert.equal(K.unlocked(s).length,1);
 assert.throws(()=>K.collect(s,'unknown',1));assert.throws(()=>K.collect(s,'pran',6));
});
test('keys unlock only at distinct discovery thresholds and records cannot inject balances',()=>{
 let s=K.fresh();for(const room of K.rooms.slice(0,4))for(let i=0;i<6;i++)s=K.collect(s,room.id,i).state;
 assert.equal(K.unlocked(s).length,3);assert.equal(Object.values(K.totals(s)).reduce((a,b)=>a+b),120);
 assert.deepEqual(K.validate({...s,coins:1000000000,money:5000}),s);
 for(const v of [{version:2,claims:[]},{version:1,claims:['pran:0','pran:0']},{version:1,claims:['pran:0:bad']},{version:1,claims:['pran:7']}])assert.throws(()=>K.validate(v));
});
test('two open pages merge current claims, quota failure awards nothing, clear preserves drafts',()=>{
 const storage=memory(),a=new K.Store(storage),b=new K.Store(storage);a.claim('pran',0);b.claim('studio',1);a.claim('pran',1);assert.equal(a.data.claims.length,3);assert.equal(b.claim('pran',0).added,false);
 storage.setItem=()=>{throw Error('quota');};assert.throws(()=>a.claim('pran',3));assert.equal(a.data.claims.length,3);
 a.clear();assert.equal(storage.getItem('kdn-news-social-creator-v1'),'draft');assert.equal(storage.getItem('kdn-community-local-v1'),'seva');assert.equal(storage.getItem(K.KEY),null);
});
test('corrupt and inaccessible storage never overwrite an old collection',()=>{
 const storage=memory();storage.map.set(K.KEY,'broken');const s=new K.Store(storage);assert.ok(s.error);assert.throws(()=>s.claim('pran',0));assert.equal(storage.getItem(K.KEY),'broken');
 const bad=new K.Store({getItem(){throw Error('denied');},setItem(){throw Error('must not write');}});assert.throws(()=>bad.claim('pran',0));
});
