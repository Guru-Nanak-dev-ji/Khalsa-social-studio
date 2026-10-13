const test=require('node:test'),assert=require('node:assert/strict');
const P=require('../assets/palace/v013/palace-core.js'),W=require('../assets/world-core.js'),K=require('../assets/kingdom/v013/kingdom-core.js');
const memory=()=>{const map=new Map();return {map,getItem:k=>map.get(k)??null,setItem:(k,v)=>map.set(k,v)};};
test('profile bonus and reaction replacements cannot repeatedly increase rewards',()=>{
 const store=new P.Store(memory());store.edit(s=>({...s,profileBonus:true}));store.edit(s=>({...s,profileBonus:true,reactions:{welcome:'king'}}));
 assert.deepEqual(P.scores(store.data),{profilePoints:25,profileCoins:10,reactionPoints:1});
 store.edit(s=>({...s,reactions:{welcome:'queen'}}));assert.equal(P.scores(store.data).reactionPoints,1);
 assert.throws(()=>store.edit(s=>({...s,reactions:{madeup:'king'}})));
});
test('platform links allow only explicit HTTPS profile hosts, never credentials or lookalikes',()=>{
 assert.equal(P.link('instagram','https://www.instagram.com/example/#x'),'https://www.instagram.com/example/');
 for(const value of ['javascript:alert(1)','http://instagram.com/a','https://instagram.com.evil.test/a','https://evil.test/?instagram.com','https://u:p@instagram.com/a','https://instagram.com:8080/a'])assert.throws(()=>P.link('instagram',value));
 assert.equal(P.link('telegram',''),'');assert.throws(()=>P.link('not-platform','https://example.com'));
});
test('resume routes are bounded local paths and new worlds retain separate gift identities',()=>{
 assert.equal(P.route('mandal.html?room=economy'),'mandal.html?room=economy');
 for(const route of ['../index.html','//evil.test','https://evil.test/a','a\\b.html','index.html?next=https://evil.test'])assert.equal(P.route(route),null);
 assert.equal(K.roomFor('mandal.html?room=economy').id,'economy');assert.equal(K.roomFor('mandal.html?room=social').id,'social');
 assert.equal(K.gift('pran',0).coin,'Baba Nanak');assert.equal(K.gift('studio',0).coin,'Ram');
});
test('concurrent palace edits merge current notes; consent, bounds and corrupt storage are enforced',()=>{
 const storage=memory(),a=new P.Store(storage),b=new P.Store(storage);a.edit(s=>({...s,profileBonus:true}));b.edit(s=>({...s,reactions:{seva:'pawn'}}));a.edit(s=>({...s,last:{path:'creator.html',scroll:310}}));assert.equal(a.data.reactions.seva,'pawn');
 assert.throws(()=>a.edit(s=>({...s,notes:[{alias:'friend',strength:'kind',growth:'listen',kind:'consented',consent:false}]})));
 const raw=storage.getItem(P.KEY);storage.setItem=()=>{throw Error('quota');};assert.throws(()=>a.edit(s=>({...s,profileBonus:false})));assert.equal(storage.getItem(P.KEY),raw);
 storage.map.set(P.KEY,'{broken');assert.throws(()=>a.edit(s=>s));assert.equal(storage.getItem(P.KEY),'{broken');
});
test('incomplete quiz resumes without rewarding twice, stale questions are discarded, legacy saves migrate',()=>{
 let s=W.empty();s.pending={kind:'reflection',id:0,path:'shadow',remaining:25000,paused:false};s=W.validate(s);assert.equal(s.pending.id,0);
 s=W.reflect(s,2,'shadow');s=W.validate(s);assert.equal(s.pending,null);assert.equal(s.reflections.length,1);
 const legacy={...W.empty()};delete legacy.scene;delete legacy.introIndex;delete legacy.pending;assert.equal(W.validate(legacy).pending,null);
});
