const test=require('node:test'),assert=require('node:assert'),C=require('../assets/khoya/khoya-core.js'),K=require('../assets/koins-core.js'),Dr=require('../assets/doors-core.js'),Z=require('../assets/khazana/khazana-core.js'),N=require('../assets/naksha/naksha-core.js'),fs=require('fs'),path=require('path');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('5 scenes, 8 unique Hindi objects each, items',()=>{assert.equal(C.SCENES.length,5);for(const s of C.SCENES){assert.equal(s.objs.length,8);assert.equal(new Set(s.objs.map(o=>o.id)).size,8);assert.ok(s.item&&s.item.e&&s.story);for(const o of s.objs)assert.ok(/[\u0900-\u097F]/.test(o.name)&&o.x>0&&o.x<100&&o.y>0&&o.y<100,o.id);}
 assert.deepEqual(C.SCENES.map(s=>s.name),['पुराना दरवाज़ा','लंगर हॉल','पुस्तकालय','बाग़','सुनहरा महल']);});
test('full playthrough: tap, lock, puzzle, badge, junk safe',()=>{let s=C.fresh();assert.ok(!C.unlocked(s,1));assert.ok(!C.tap(s,1,'roti').ok);assert.ok(C.tap(s,0,'nope').wrong);
 let badges=0;for(let i=0;i<5;i++){for(const o of C.SCENES[i].objs){assert.equal(C.hint(s,i).id,o.id);const r=C.tap(s,i,o.id);assert.ok(r.ok);s=r.state;if(r.badgeNew)badges++;}
  assert.ok(s.cleared.includes(i)&&s.inv.includes(C.SCENES[i].item.id));assert.ok(!C.tap(s,i,C.SCENES[i].objs[0].id).ok);
  if(i<4){assert.ok(!C.unlocked(s,i+1));let solved=false;for(let t=0;t<4;t++)while(s.tiles[i][t]!==0){const r=C.rotate(s,i,t);s=r.state;solved=solved||r.solved;}assert.ok(solved&&C.unlocked(s,i+1));}}
 assert.equal(badges,1);assert.ok(s.badge);assert.equal(C.progress(s).pct,100);assert.deepEqual(C.validate(JSON.parse(JSON.stringify(s))),s);
 assert.deepEqual(C.validate(null),C.fresh());assert.deepEqual(C.validate({v:1,found:[['x','ghanti','ghanti']],cleared:[0,9],scene:3}).found[0],['ghanti']);
 assert.ok(C.canHint(0,5));assert.ok(!C.canHint(1000,1000+C.HINT_MS-1));assert.ok(C.canHint(1000,1000+C.HINT_MS));
 let k=K.fresh();const a=K.claimSpot(k,'khoya:darwaza');assert.ok(a.added>0);assert.equal(K.claimSpot(a.state,'khoya:darwaza').added,0);});
test('page, door, khazana, naksha, sw, no Khanda, no Lost Lands copy',()=>{const h=R('kingdom-lands.html'),js=R('assets/khoya/khoya.js'),c=R('assets/khoya/khoya-core.js'),all=h+js+c;
 assert.ok(h.includes('lang="hi"')&&h.includes('data-heritage="immersive"')&&h.includes('heritage-banner')&&h.includes('goldtv.js')&&h.includes('hindi-fonts.css')&&h.includes('असली पैसा नहीं')&&h.includes('✨ संकेत')&&h.includes('kdn-nihang-guides-v22.webp'));
 assert.ok(js.includes("claimSpot(kst,'khoya:'")&&!/innerHTML|XMLHttpRequest|fetch\(/.test(js+c));assert.ok(!/☬/.test(all));assert.ok(!/lost lands|susan|five-bn/i.test(all));
 assert.ok(R('assets/khoya/khoya.css').includes('prefers-reduced-motion'));assert.ok(Dr.all().some(d=>d.href==='./kingdom-lands.html'));
 assert.ok(Z.GAMES.some(g=>g.id==='khoya'&&g.badge===C.BADGE&&g.key===C.KEY&&g.badge==='खोजी सिंह'));assert.ok(N.IDS.includes('kingdom-lands'));
 const sw=R('sw.js');assert.equal((sw.match(/const CACHE/g)||[]).length,1);for(const a of['./kingdom-lands.html','./assets/khoya/khoya-core.js','./assets/khoya/khoya.js','./assets/khoya/khoya.css'])assert.ok(sw.includes(a),a);});
test('land art: 5 webp < 250KB, wired in css + sw',()=>{const css=R('assets/khoya/khoya.css'),sw=R('sw.js');for(const s of C.SCENES){const f='assets/khoya/bg/'+s.bg+'.webp';const st=fs.statSync(path.join(__dirname,'..',f));assert.ok(st.size>1000&&st.size<250000,f);assert.ok(css.includes('./bg/'+s.bg+'.webp'));assert.ok(sw.includes('./'+f));}});
