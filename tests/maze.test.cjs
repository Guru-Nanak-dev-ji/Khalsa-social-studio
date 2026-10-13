const {test}=require('node:test');
const assert=require('node:assert/strict');
const W=require('../assets/world-core.js'),C=require('../assets/world-content.js');
const base={current:'घर की देखभाल',education:'',goal:'वीडियो बनाना सीखना',city:'',wish:'media',mode:'paid',experience:'new',hours:5,skills:['लेखन','वीडियो'],track:null};
test('every reflection option has bounded transparent rewards, including negative action feedback',()=>{
 for(let g=0;g<5;g++)for(let i=0;i<4;i++){
  const r=W.reward('reflection',g,i);assert.ok(r.positive>=0&&r.positive<=100);assert.ok(r.negative>=0&&r.negative<=100);assert.equal(r.points,(r.positive-r.negative)/10);assert.ok(r.reason);assert.ok(!(r.positive&&r.negative));
 }
 assert.ok(W.reward('reflection',0,3).negative>0);assert.ok(W.reward('reflection',0,2).points>=0);assert.ok(W.reward('reflection',2,2).points>=0);
 let s=W.reflect(W.empty(),3,'shadow');assert.equal(W.gameScore(s).JK.points,-6);assert.equal(W.reflect(s,0,'light').gate,2);assert.equal(W.reward('knowledge',C.quiz[0].id,null).positive,0);
});
test('previous version reflections are preserved and never retroactively given negative scores',()=>{
 const old={...W.empty(),gate:1,reflections:[{gate:0,choice:3,route:'shadow'}]};const restored=W.validate(old);
 assert.deepEqual(restored.reflections,old.reflections);assert.equal(W.gameScore(restored).JK.points,0);
 const next=W.reflect(restored,3,'light');assert.equal(next.reflections[1].rubric,2);assert.equal(W.gameScore(next).Study.points,-6);
});
test('work preferences are bounded, private extras removed, and no quiz/belief data enters matching',()=>{
 const clean=W.workProfile({...base,phone:'private',family:'private'});assert.equal(clean.phone,undefined);assert.equal(clean.family,undefined);
 assert.throws(()=>W.workProfile({...base,hours:0}));assert.throws(()=>W.workProfile({...base,hours:41}));assert.throws(()=>W.workProfile({...base,wish:'unknown'}));assert.throws(()=>W.workProfile({...base,skills:['unknown']}));
 assert.throws(()=>W.workProfile({...base,goal:' '}));assert.throws(()=>W.workProfile({...base,skills:['लेखन','लेखन']}));
 const matches=W.matchWork(clean);assert.equal(matches.length,3);assert.equal(matches[0].id,'media');assert.deepEqual(matches[0].matched,['लेखन','वीडियो']);
 assert.equal(W.matchWork({...base,skills:[],wish:'farm'})[0].id,'farm');
});
test('work form and chosen path survive validated opt-in storage; previous minimal profile still opens',()=>{
 let s=W.empty();for(let i=0;i<5;i++)s=W.reflect(s,0,'light');s.phase='world';s.profile={name:'Alias',language:'hi',interest:'Work',work:{...base,track:'media'}};
 const a=W.validate(JSON.parse(JSON.stringify(s)));assert.deepEqual(a.profile.work,s.profile.work);
 delete s.profile.work;assert.ok(W.validate(s));
});
