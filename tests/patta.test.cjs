const test=require('node:test'),assert=require('node:assert'),P=require('../assets/patta-core.js'),K=require('../assets/koins-core.js'),fs=require('fs'),path=require('path');
test('15 valid questions',()=>{assert.equal(P.Q.length,15);for(const q of P.Q){assert.equal(q.o.length,4);assert.ok(q.c>=0&&q.c<4);}assert.equal(new Set(P.Q.map(q=>q.id)).size,15);});
test('quiz gates periodic + hit',()=>{const g=P.gate(7,()=>.5);assert.ok(g.quiz);assert.ok(!P.gate(3,()=>.5).quiz);assert.ok(P.hit({x:0,y:0},0.1,0.1));assert.ok(!P.hit({x:0,y:0},0.5,0.5));});
test('ring koins separate from welcome',()=>{let s=K.grantWelcome(K.fresh()).state;s=K.ring(s).state;assert.equal(s.welcome,125000);assert.equal(s.earned,5);assert.equal(K.quiz(s,false).state.score,-3);});
test('no Khanda, hindi page',()=>{const h=fs.readFileSync(path.join(__dirname,'../patta.html'),'utf8');assert.ok(!h.includes('☬'));assert.ok(h.includes('lang="hi"'));});
