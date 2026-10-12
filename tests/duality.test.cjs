const {test}=require('node:test');
const assert=require('node:assert/strict');
const D=require('../assets/duality-core.js');
test('either door gives equal participation with distinct, transparent practice rewards',()=>{
  assert.equal(D.bank.length,25);assert.equal(new Set(D.bank.map(q=>q.id)).size,25);
  for(const q of D.bank){assert.equal(q.options.length,2);assert.notEqual(q.options[0].text,q.options[1].text);
    for(const o of q.options){assert.equal(Object.values(o.gain).reduce((a,b)=>a+b,0),3);assert.ok(o.reply);for(const [k,v]of Object.entries(o.gain)){assert.ok(k in D.dimensions);assert.ok(v>0);}}
  }
});
test('invalid and repeated clicks cannot grant points or skip a question',()=>{
  const s=D.create();assert.equal(D.next(s),s);assert.equal(D.answer(s,2),s);
  const a=D.answer(s,0);assert.equal(s.history.length,0);assert.equal(D.answer(a,1),a);
  assert.equal(a.history.length,1);assert.equal(Object.values(a.scores).reduce((a,b)=>a+b,0),3);
});
test('early answers really select different routes and random positions',()=>{
  const light=D.answer(D.create(),0),shadow=D.answer(D.create(),1);
  assert.equal(D.get(D.next(light,()=>0).current).route,'light');assert.equal(D.get(D.next(shadow,()=>0).current).route,'shadow');
  assert.notEqual(D.next(light,()=>0).current,D.next(light,()=>.99).current);
});
test('all paths terminate after 25 unique questions, with six-answer breaks',()=>{
  for(const pattern of [()=>0,()=>1,i=>i%2]){
    let s=D.create(),seen=new Set(),breaks=[];
    for(let i=0;i<25;i++){
      assert.equal(s.phase,'question');assert.ok(!seen.has(s.current));seen.add(s.current);
      s=D.answer(s,pattern(i));s=D.next(s,()=>.62);
      if(s.phase==='checkpoint'){breaks.push(s.history.length);s=D.next(s,()=>.37);}
    }
    assert.equal(s.phase,'complete');assert.equal(seen.size,25);assert.deepEqual(breaks,[6,12,18,24]);
    assert.equal(Object.values(s.scores).reduce((a,b)=>a+b,0),75);assert.equal(D.next(s),s);
  }
});
test('changing an answer rolls back its reward, including at a break or completion',()=>{
  let s=D.create();for(let i=0;i<25;i++){s=D.answer(s,0);s=D.next(s,()=>0);if(s.phase==='checkpoint')s=D.next(s,()=>0);}
  const undo=D.back(s);assert.equal(undo.phase,'question');assert.equal(undo.history.length,24);
  assert.equal(Object.values(undo.scores).reduce((a,b)=>a+b,0),72);
  const changed=D.answer(undo,1);assert.equal(changed.history.length,25);assert.equal(Object.values(changed.scores).reduce((a,b)=>a+b,0),75);
  for(let i=0;i<25;i++)s=D.back(s);assert.deepEqual(s,D.create());
});
