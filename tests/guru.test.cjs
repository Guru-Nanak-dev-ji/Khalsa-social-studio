const test=require('node:test'),assert=require('node:assert'),C=require('../assets/guru/guru-core.js'),Z=require('../assets/khazana/khazana-core.js'),fs=require('fs'),path=require('path');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
const VERIFIED={1:1,2:463,3:917,4:305,5:394,9:1427,10:1429};
test('10 Guru Sahiban, complete data, quizzes valid',()=>{assert.equal(C.G.length,10);C.G.forEach((g,i)=>{assert.equal(g.n,i+1);for(const k of['name','pa','m'])assert.ok(g[k]);assert.ok(g.born[0]&&g.born[1]&&g.jj[0]&&g.jj[1]);
 assert.ok(g.teach.length>=3&&g.work.length>=3&&g.tl.length>=3);assert.equal(g.quiz.length,3);for(const q of g.quiz)assert.ok(q[2]>=0&&q[2]<q[1].length);});});
test('gurbani only where verified (Ang pinned), Gurmukhi, none for 6/7/8',()=>{for(const g of C.G){if(VERIFIED[g.n]){assert.equal(g.bani.length,1);assert.equal(g.bani[0].ang,VERIFIED[g.n]);assert.match(g.bani[0].g,/^[\u0A00-\u0A7F\s॥]+$/)}else assert.equal(g.bani.length,0,g.n)}
 assert.match(C.G[9].note,/मतभेद/);assert.match(C.G[0].note,/मतभेद/);});
test('badge needs all 10, pass mark 2/3, no double',()=>{let s=C.fresh();assert.equal(C.finish(s,1,1,3).isNew,false);for(let n=1;n<=9;n++)s=C.finish(s,n,2,3).state;assert.equal(s.badge,false);const r=C.finish(s,10,3,3);assert.ok(r.badgeNew);assert.equal(C.finish(r.state,10,3,3).isNew,false);assert.deepStrictEqual(C.validate('x'),C.fresh());});
test('pages, no Khanda, no face images, wiring',()=>{for(let n=1;n<=10;n++){const h=R('guru-'+n+'.html');assert.ok(h.includes('data-guru="'+n+'"'));assert.ok(!/☬|<img/.test(h))}
 assert.ok(!/☬/.test(R('assets/guru/guru-core.js')+R('assets/guru/guru.js')+R('guru.html')));for(const f of['sab.html','dwar.html','gyan.html'])assert.ok(R(f).includes('./guru.html'),f);
 const P=JSON.parse(R('assets/pages.json')).pages;for(const id of['guru',...Array.from({length:10},(_,i)=>'guru-'+(i+1))])assert.equal(P.find(p=>p.id===id).cat,'j');
 assert.equal(Z.GAMES.find(g=>g.id==='guru').badge,'दस गुरू यात्री');assert.match(R('sw.js'),/const CACHE=PREFIX\+'v0\.(69|[7-9]\d)\./);});
