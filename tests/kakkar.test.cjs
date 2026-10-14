const test=require('node:test'),assert=require('node:assert'),C=require('../assets/kakkar/kakkar-core.js'),Z=require('../assets/khazana/khazana-core.js'),fs=require('fs'),path=require('path');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('5 Kakkars, complete data, intro note flagged',()=>{assert.deepStrictEqual(C.K.map(t=>t.name),['केश','कंगा','कड़ा','कच्छेरा','कृपाण']);
 assert.deepStrictEqual(C.K.map(t=>t.en),['Kesh','Kangha','Kara','Kachera','Kirpan']);
 for(const t of C.K){assert.ok(t.mean&&t.why&&t.tip&&t.m&&t.pa);assert.equal(t.quiz.length,3);for(const q of t.quiz)assert.ok(q[2]>=0&&q[2]<q[1].length)}
 assert.ok(C.INTRO&&C.NOTE&&/⚠️/.test(C.NOTE)&&C.SRC&&C.KEY==='kdn-kakkar-v1'&&C.BADGE==='कक्कार ज्ञानी');});
test('badge after all 5 cards (~2/3 correct)',()=>{let s=C.fresh();for(let n=1;n<=4;n++)s=C.finish(s,n,3,3).state;assert.equal(s.badge,false);const r=C.finish(s,5,2,3);assert.ok(r.badgeNew);assert.equal(C.finish(s,5,1,3).isNew,false);assert.deepStrictEqual(C.validate(null),C.fresh());});
test('single hub page, no photos/Khanda, wiring, pages, khazana, CACHE',()=>{
 const hub=R('panj-kakkar.html');assert.ok(hub.includes('id="kk-main"')&&hub.includes('kakkar-core.js')&&hub.includes('data-heritage')&&!/☬|<img/.test(hub));
 assert.ok(!/☬/.test(R('assets/kakkar/kakkar-core.js')+R('assets/kakkar/kakkar.js')+R('assets/kakkar/kakkar.css')));
 for(const f of['sab.html','dwar.html','guru.html','panj-takht.html'])assert.ok(R(f).includes('./panj-kakkar.html'),f);
 const P=JSON.parse(R('assets/pages.json')).pages;const e=P.find(p=>p.id==='panj-kakkar');assert.ok(e);assert.equal(e.cat,'j');assert.equal(e.status,'published');assert.equal(e.href,'./panj-kakkar.html');
 const g=Z.GAMES.find(x=>x.id==='kakkar');assert.ok(g);assert.equal(g.badge,'कक्कार ज्ञानी');assert.equal(g.key,'kdn-kakkar-v1');assert.equal(g.href,'./panj-kakkar.html');
 const sw=R('sw.js');assert.equal((sw.match(/const CACHE/g)||[]).length,1);assert.match(sw,/const CACHE=PREFIX\+'v0\.80\.0'/);
 for(const a of['./panj-kakkar.html','./assets/kakkar/kakkar-core.js','./assets/kakkar/kakkar.js','./assets/kakkar/kakkar.css'])assert.ok(sw.includes(a),a);
});
