const test=require('node:test'),assert=require('node:assert'),C=require('../assets/panj/panj-core.js'),Z=require('../assets/khazana/khazana-core.js'),fs=require('fs'),path=require('path');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('5 Takhts, complete data, disputes flagged',()=>{assert.deepStrictEqual(C.T.map(t=>t.name),['श्री अकाल तख़्त साहिब','तख़्त श्री केसगढ़ साहिब','तख़्त श्री दमदमा साहिब','तख़्त श्री पटना साहिब','तख़्त श्री हज़ूर साहिब']);
 for(const t of C.T){assert.ok(t.place&&t.hist.length>=3&&t.sig.length>=3&&t.tl.length>=3&&t.go);assert.match(t.note,/⚠️/);assert.equal(t.quiz.length,3);for(const q of t.quiz)assert.ok(q[2]>=0&&q[2]<q[1].length)}assert.ok(C.GUIDE.length>=4&&C.SRC);});
test('badge after all 5',()=>{let s=C.fresh();for(let n=1;n<=4;n++)s=C.finish(s,n,3,3).state;assert.equal(s.badge,false);const r=C.finish(s,5,2,3);assert.ok(r.badgeNew);assert.equal(C.finish(s,5,1,3).isNew,false);assert.deepStrictEqual(C.validate(null),C.fresh());});
test('pages, no photos/Khanda, old takht pages linked not touched, wiring',()=>{for(let n=1;n<=5;n++){const h=R('takht-'+n+'.html');assert.ok(h.includes('data-takht="'+n+'"')&&!/☬|<img/.test(h))}
 const hub=R('panj-takht.html');assert.ok(hub.includes('./takht.html')&&hub.includes('./takht3d.html')&&!/☬|<img/.test(hub));assert.ok(!/☬/.test(R('assets/panj/panj-core.js')+R('assets/panj/panj.js')));
 for(const f of['sab.html','dwar.html','guru.html'])assert.ok(R(f).includes('./panj-takht.html'),f);assert.ok(R('assets/jaan.js').includes("a.href='./panj-takht.html'"));
 const P=JSON.parse(R('assets/pages.json')).pages;for(const id of['panj-takht','takht-1','takht-5'])assert.equal(P.find(p=>p.id===id).cat,'j');
 assert.equal(Z.GAMES.find(g=>g.id==='panj').badge,'पंज तख़्त यात्री');assert.match(R('sw.js'),/const CACHE=PREFIX\+'v0\.(7\d|[89]\d)\./);});
