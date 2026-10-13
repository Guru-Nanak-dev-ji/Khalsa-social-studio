const test=require('node:test'),assert=require('node:assert'),C=require('../assets/swad/swad-core.js'),Z=require('../assets/khazana/khazana-core.js'),fs=require('fs'),path=require('path'),{execSync}=require('child_process');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('8 regions, 4–5 dishes, recipes, tips, quizzes',()=>{assert.deepStrictEqual(C.R.map(r=>r.name),['पंजाब','हरियाणा','राजस्थान','गुजरात','महाराष्ट्र','बंगाल','तमिलनाडु','कश्मीर']);
 for(const r of C.R){assert.ok(r.dishes.length>=4&&r.dishes.length<=5);for(const d of r.dishes)assert.ok(d.e&&d.n&&d.i&&d.s.length>=2);assert.ok(r.tip);assert.equal(r.quiz.length,3);for(const q of r.quiz)assert.ok(q[2]>=0&&q[2]<q[1].length)}});
test('vegetarian only: no meat/egg/fish/alcohol words',()=>{const t=JSON.stringify(C.R);assert.doesNotMatch(t,/मांस|मीट|चिकन|मटन|अंडा|अंडे|मछली|गोश्त|कीमा|शराब|(^|[^ज])वाइन|दारू/);});
test('badge after all regions',()=>{let s=C.fresh();for(const id of C.IDS.slice(0,7))s=C.finish(s,id,3,3).state;assert.equal(s.badge,false);assert.ok(C.finish(s,C.IDS[7],2,3).badgeNew);assert.deepStrictEqual(C.validate(1),C.fresh());});
test('pages, langar/vand untouched + linked, wiring',()=>{for(const r of C.R)assert.ok(R('swad-'+r.id+'.html').includes('data-swad="'+r.id+'"'));const h=R('swad.html');assert.ok(h.includes('./langar.html')&&h.includes('./vand.html'));
 for(const f of['sab.html','dwar.html'])assert.ok(R(f).includes('./swad.html'),f);const P=JSON.parse(R('assets/pages.json')).pages;assert.equal(P.find(p=>p.id==='swad').cat,'s');assert.equal(P.find(p=>p.id==='swad-kashmir').cat,'s');
 assert.equal(Z.GAMES.find(g=>g.id==='swad').badge,'स्वाद यात्री');assert.match(R('sw.js'),/const CACHE=PREFIX\+'v0\.(7[1-9]|[89]\d)\./);});
