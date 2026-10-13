const test=require('node:test'),assert=require('node:assert'),M=require('../assets/mala/mala-core.js'),K=require('../assets/koins-core.js'),Dr=require('../assets/doors-core.js'),Z=require('../assets/khazana/khazana-core.js'),N=require('../assets/naksha/naksha-core.js'),fs=require('fs'),path=require('path');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('108 beads, 4 naams',()=>{assert.equal(M.BEADS,108);assert.deepEqual(M.NAAMS.map(n=>n.text),['वाहेगुरु','सतनाम','राम','हरि']);assert.equal(M.naamText('nope'),'वाहेगुरु');});
test('tap, full mala, firstToday, badge at 7 days, week, junk safe',()=>{let s=M.fresh(),r;for(let i=0;i<107;i++){r=M.tap(s,'2026-10-13');s=r.state;assert.ok(!r.full);}
 assert.equal(s.bead,107);r=M.tap(s,'2026-10-13');assert.ok(r.full&&r.firstToday);s=r.state;assert.equal(s.bead,0);assert.equal(s.days['2026-10-13'],1);
 for(let i=0;i<108;i++){r=M.tap(s,'2026-10-13');s=r.state;}assert.ok(r.full&&!r.firstToday);assert.equal(s.days['2026-10-13'],2);assert.equal(M.total(s),2);
 let bn=0;for(let d=14;d<=19;d++){for(let i=0;i<108;i++){r=M.tap(s,'2026-10-'+d);s=r.state;if(r.badgeNew)bn++;}}assert.equal(bn,1);assert.ok(s.badge);assert.equal(M.daysDone(s),7);
 s=M.tap(s,'2026-10-20').state;assert.equal(M.restart(s).bead,0);assert.equal(M.setNaam(s,'ram').naam,'ram');assert.equal(M.setNaam(s,'x').naam,s.naam);
 const w=M.week(s,'2026-10-20');assert.equal(w.length,7);assert.ok(w[6].today);assert.equal(w[6].malas,0);assert.equal(w[0].malas,1);
 assert.deepEqual(M.validate(null),M.fresh());const v=M.validate({v:1,naam:'<x>',bead:500,days:{bad:3,'2026-01-01':-2,'2026-01-02':'4','2026-01-03':2}});assert.equal(v.naam,'waheguru');assert.equal(v.bead,0);assert.deepEqual(v.days,{'2026-01-03':2});
 assert.ok(!M.tap(M.fresh(),'bad').full);let k=K.fresh();k=K.claimSpot(k,'mala:2026-10-13').state;assert.equal(K.claimSpot(k,'mala:2026-10-13').added,0);});
test('page, door, feed, khazana, naksha, sw, no Khanda, no images',()=>{const h=R('mala.html'),js=R('assets/mala/mala.js'),c=R('assets/mala/mala-core.js'),all=h+js+c;
 assert.ok(h.includes('lang="hi"')&&h.includes('data-heritage')&&h.includes('goldtv.js')&&h.includes('hindi-fonts.css')&&h.includes('असली पैसा नहीं'));
 assert.ok(js.includes("'hi-IN'")&&js.includes('claimSpot')&&js.includes('createElementNS')&&!/innerHTML|XMLHttpRequest|fetch\(/.test(js));assert.ok(!/☬/.test(all));assert.ok(!/<img|\.webp|\.jpe?g|selfie/i.test(h+js));
 const css=R('assets/mala/mala.css');assert.ok(css.includes('prefers-reduced-motion')&&css.includes('@keyframes glow'));
 assert.ok(Dr.all().some(d=>d.href==='./mala.html'));assert.ok(JSON.parse(R('assets/goldtv/feed.json')).items.some(i=>i.href==='./mala.html'));
 assert.ok(Z.GAMES.some(g=>g.id==='mala'&&g.badge===M.BADGE&&g.key===M.KEY));assert.ok(N.IDS.includes('mala'));
 const sw=R('sw.js');assert.equal((sw.match(/const CACHE/g)||[]).length,1);for(const a of['./mala.html','./assets/mala/mala-core.js','./assets/mala/mala.js','./assets/mala/mala.css'])assert.ok(sw.includes(a),a);});
