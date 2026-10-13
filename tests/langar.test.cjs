const test=require('node:test'),assert=require('node:assert'),L=require('../assets/langar/langar-core.js'),K=require('../assets/koins-core.js'),Dr=require('../assets/doors-core.js'),fs=require('fs'),path=require('path');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('steps complete in order, round + badge',()=>{let s=L.fresh(),steps=[],badge=0,rounds=0;const total=L.STEPS.reduce((a,x)=>a+x.taps,0);
 for(let i=0;i<total;i++){const r=L.tap(s);s=r.state;if(r.stepDone){steps.push(r.stepDone.id);assert.ok(r.firstTime);}if(r.badgeNew)badge++;if(r.roundDone)rounds++;}
 assert.deepEqual(steps,L.STEPS.map(x=>x.id));assert.equal(badge,1);assert.equal(rounds,1);assert.ok(s.badge);assert.equal(s.step,0);
 for(let i=0;i<L.STEPS[0].taps;i++){const r=L.tap(s);s=r.state;if(r.stepDone)assert.ok(!r.firstTime&&!r.badgeNew);}assert.equal(L.BADGE,'लंगर सेवादार');});
test('validate + koins',()=>{assert.deepEqual(L.validate({v:1,step:99,taps:-4,done:['x','dal','dal']}).done,['dal']);assert.equal(L.validate(null).step,0);
 let k=K.fresh();k=K.claimSpot(k,'langar:aata').state;assert.equal(K.claimSpot(k,'langar:aata').added,0);assert.equal(K.ring(k).added,5);});
test('page, door, feed, sw, no Khanda',()=>{const h=R('langar.html');assert.ok(h.includes('lang="hi"')&&h.includes('data-heritage')&&h.includes('goldtv.js'));
 assert.ok(!/☬/.test(h+R('assets/langar/langar.js')+R('assets/langar/langar-core.js')));assert.ok(R('assets/langar/langar.css').includes('prefers-reduced-motion'));
 assert.ok(Dr.all().some(d=>d.href==='./langar.html'));assert.ok(JSON.parse(R('assets/goldtv/feed.json')).items.some(i=>i.href==='./langar.html'));
 const sw=R('sw.js');assert.equal((sw.match(/const CACHE/g)||[]).length,1);assert.ok(sw.includes('./langar.html')&&sw.includes('./assets/langar/langar.js'));});
