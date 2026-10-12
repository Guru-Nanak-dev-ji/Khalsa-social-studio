const {test}=require('node:test');
const assert=require('node:assert/strict');
const C=require('../assets/community-core.js');
function memory(seed){let raw=seed??null;return {getItem(){return raw;},setItem(k,v){raw=v;}};}
const row=(id='s1',extra={})=>({id,date:'2026-10-12',types:['food','education'],notes:'सेवा · ਸੇਵਾ',...extra});
test('five unique choices conserve 25 points across removal and replacement',()=>{
 let chosen=[];for(const id of C.CANDIDATES.slice(0,5))chosen=C.toggle(chosen,id);
 assert.equal(C.points(chosen),25);assert.throws(()=>C.toggle(chosen,C.CANDIDATES[5]),/limit/);
 chosen=C.toggle(chosen,C.CANDIDATES[0]);assert.equal(C.points(chosen),20);
 chosen=C.toggle(chosen,C.CANDIDATES[5]);assert.equal(C.points(chosen),25);
 assert.throws(()=>C.validate({...C.empty(),choices:['demo-01','demo-01']}),/invalid/);
 assert.throws(()=>C.toggle([], 'real-person'),/invalid/);
});
test('multiple activities and dates survive reopening and editing',()=>{
 const mem=memory(),a=new C.Store(mem);a.save(row());a.save(row('s2',{date:'2026-10-11',types:['health','other']}));
 const b=new C.Store(mem);assert.equal(b.data.services.length,2);assert.deepEqual(b.data.services[0].types,['food','education']);
 b.save(row('s1',{notes:'Edited'}));assert.equal(b.data.services.length,2);assert.equal(new C.Store(mem).data.services[0].notes,'Edited');
 for(const bad of [{date:'2026-02-30'},{date:'2026-13-01'},{types:[]},{types:['food','food']},{types:['unknown']}])assert.throws(()=>b.save(row('bad',bad)),/invalid/);
 assert.equal(new C.Store(mem).data.services.length,2);
});
test('restore is additive and deduplicated; support choices require separate explicit restore',()=>{
 const mem=memory(),s=new C.Store(mem);s.save(row());s.select('demo-01');
 const backup={...C.empty(),services:[row(),row('s1-other',{notes:'Other record'})],choices:['demo-02']};
 assert.equal(s.import(backup),1);assert.equal(s.import(backup),0);assert.deepEqual(s.data.choices,['demo-01']);
 const collision={...C.empty(),services:[row('s1',{notes:'ID collision'})]};s.import(collision);assert.equal(s.data.services.length,3);assert.equal(new Set(s.data.services.map(x=>x.id)).size,3);
 s.restoreChoices(backup);assert.deepEqual(s.data.choices,['demo-02']);assert.equal(s.data.services.length,3);
 const before=mem.getItem();assert.throws(()=>s.import({...backup,services:[row('valid'),row('bad',{date:'no'})]}));assert.equal(mem.getItem(),before);
});
test('corrupt, unavailable, quota-limited and stale storage do not overwrite records',()=>{
 const bad=memory('{');const broken=new C.Store(bad);assert.ok(broken.error);assert.throws(()=>broken.save(row()),/storage/);assert.equal(bad.getItem(),'{');
 const denied=new C.Store({getItem(){throw new Error('denied');}});assert.ok(denied.error);
 const mem=memory(),a=new C.Store(mem),b=new C.Store(mem);a.save(row());const before=mem.getItem();assert.throws(()=>b.save(row('b')),/conflict/);assert.equal(mem.getItem(),before);
 const q=new C.Store(mem);mem.setItem=()=>{throw new Error('quota');};assert.throws(()=>q.save(row('q')),/quota/);assert.equal(q.data.services.length,1);assert.equal(mem.getItem(),before);
});
test('large restore is rejected atomically and timer estimates whole paise from elapsed time',()=>{
 const mem=memory(),s=new C.Store(mem);s.save(row());const before=mem.getItem();
 assert.throws(()=>s.import({...C.empty(),services:Array.from({length:501},(_,i)=>row('x'+i,{notes:String(i)}))}),/invalid/);assert.equal(mem.getItem(),before);
 assert.equal(C.estimate(3600000),12500);assert.equal(C.estimate(7200000),25000);assert.equal(C.estimate(1000),3);assert.equal(C.estimate(0),0);assert.throws(()=>C.estimate(-1));assert.throws(()=>C.estimate(NaN));
});
