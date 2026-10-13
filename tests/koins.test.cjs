const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const K=require('../assets/koins-core.js'),KC=require('../assets/kingdom/v014/kingdom-core.js');const r=f=>fs.readFileSync(path.resolve(__dirname,'..',f),'utf8');
test('welcome 1,25,000 once, separate from earned',()=>{let {state,added}=K.grantWelcome(K.fresh());assert.equal(added,125000);assert.equal(state.earned,0);
 const again=K.grantWelcome(state);assert.equal(again.added,0);assert.equal(K.total(again.state),125000);assert.equal(K.fmt(125000),'1,25,000');});
test('hidden spot +5 once (same as kingdom gift)',()=>{assert.equal(K.SPOT,KC.gift(KC.rooms[0].id,0).amount);let s=K.grantWelcome(K.fresh()).state;
 let r=K.claimSpot(s,'media:0');assert.equal(r.added,5);r=K.claimSpot(r.state,'media:0');assert.equal(r.added,0);assert.equal(K.total(r.state),125005);assert.equal(r.state.earned,5);});
test('quiz +10/-3 goes to अंक (score) only',()=>{let s=K.fresh();s=K.quiz(s,true).state;s=K.quiz(s,false).state;assert.equal(s.score,7);assert.equal(s.earned,0);assert.match(r('assets/world/v014/world-core.js'),/points\+=10[\s\S]*points-=3/);});
test('tampered storage cannot inflate welcome',()=>{assert.equal(K.validate({version:1,welcome:9e9,earned:-5,score:1,spots:['<x>']}).welcome,0);});
test('bar wired and labelled not real money',()=>{assert.match(r('studio.html'),/koins\.js/);assert.match(r('assets/koins.js'),/game koins, असली पैसा नहीं/);assert.match(r('sw.js'),/koins-core\.js/);});
