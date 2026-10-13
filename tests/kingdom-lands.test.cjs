const test=require('node:test'),assert=require('node:assert'),C=require('../assets/khoya/khoya-core.js'),K=require('../assets/koins-core.js'),Dr=require('../assets/doors-core.js'),Z=require('../assets/khazana/khazana-core.js'),N=require('../assets/naksha/naksha-core.js'),fs=require('fs'),path=require('path');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('5 scenes, 8 unique Hindi objects each, items',()=>{assert.equal(C.SCENES.length,15);assert.equal(new Set(C.SCENES.map(x=>x.item.id)).size,15);for(const s of C.SCENES){assert.equal(s.objs.length,8);assert.equal(new Set(s.objs.map(o=>o.id)).size,8);assert.ok(s.item&&s.item.e&&s.story);for(const o of s.objs)assert.ok(/[\u0900-\u097F]/.test(o.name)&&o.x>0&&o.x<100&&o.y>0&&o.y<100,o.id);}
 assert.deepEqual(C.SCENES.slice(0,5).map(s=>s.name),['पुराना दरवाज़ा','लंगर हॉल','पुस्तकालय','बाग़','सुनहरा महल']);assert.ok(C.SCENES.slice(5,10).every(x=>x.ch===2)&&C.SCENES.slice(10).every(x=>x.ch===3&&x.card)&&C.SCENES.slice(0,5).every(x=>x.ch===1));});
test('full playthrough: tap, lock, puzzle, badge, junk safe',()=>{let s=C.fresh();assert.ok(!C.unlocked(s,1));assert.ok(!C.tap(s,1,'roti').ok);assert.ok(C.tap(s,0,'nope').wrong);
 let badges=0,b2=0;for(let i=0;i<15;i++){for(const o of C.SCENES[i].objs){assert.equal(C.hint(s,i).id,o.id);const r=C.tap(s,i,o.id);assert.ok(r.ok);s=r.state;if(r.badgeNew)badges++;if(r.badge2New)b2++;}if(i===4){assert.ok(s.badge&&!s.badge2);}
  assert.ok(s.cleared.includes(i)&&s.inv.includes(C.SCENES[i].item.id));assert.ok(!C.tap(s,i,C.SCENES[i].objs[0].id).ok);
  {if(i<14)assert.ok(!C.unlocked(s,i+1));s=solve(s,i);if(i<14)assert.ok(C.unlocked(s,i+1),'puz '+i);}}
 assert.equal(badges,1);assert.equal(b2,1);assert.ok(s.badge&&s.badge2&&s.badge3&&C.ending3(s));assert.ok(Z.GAMES.some(g=>g.id==='khoya3'&&g.badge==='खालसा योद्धा'&&g.got(s)));assert.ok(Z.GAMES.some(g=>g.id==='khoya2'&&g.badge===C.BADGE2&&g.got(s)));assert.equal(C.progress(s).pct,100);assert.deepEqual(C.validate(JSON.parse(JSON.stringify(s))),s);
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

function solve(s,p){const t=C.ptype(p);let solved=false,g=0;
 for(const x of C.partsFor(p)){assert.ok(!C.ready(s,p));const r=C.place(s,p,x.id);assert.ok(r.ok,x.id);s=r.state;assert.ok(!C.place(s,p,x.id).ok);}assert.ok(C.ready(s,p));
 if(t==='rings'){for(const i of[0,1])while(s.pz[p].r[i]!==C.RING_GOAL[i]){const r=C.ring(s,p,i);s=r.state;solved=solved||r.solved;}}
 if(t==='scale'){let r=C.vial(s,p,1);s=r.state;assert.ok(!r.solved);s=C.vial(s,p,1).state;s=C.vial(s,p,0).state;r=C.vial(s,p,2);s=r.state;solved=r.solved;}
 if(t==='veena'){const w=C.pluck(s,p,(C.VEENA[0]+1)%5);assert.ok(w.wrong);for(const i of C.VEENA){const r=C.pluck(s,p,i);s=r.state;solved=r.solved;}}
 if(t==='beam'){assert.ok(!C.trace(s.pz[p].m).hit);let r=C.mirror(s,p,0);s=r.state;r=C.mirror(s,p,1);s=r.state;solved=r.solved;}
 if(t==='jigsaw'){assert.ok(!C.jig(s,p,0,1).ok);for(let k=0;k<4;k++){const r=C.jig(s,p,k,k);assert.ok(r.ok);s=r.state;solved=r.solved;}assert.ok(C.ending(s));}
 if(t==='tiles')for(let k=0;k<4;k++)while(s.tiles[p][k]!==0){const r=C.rotate(s,p,k);s=r.state;solved=solved||r.solved;}
 if(t==='gears'){for(let a=0;a<6&&!solved;a++)for(let b=0;b<6&&!solved;b++)for(let c=0;c<6&&!solved;c++){let x=s;for(const[i,n]of[[0,a],[1,b],[2,c]])for(let k=0;k<n;k++)x=C.gear(x,p,i).state;if(x.puzzles.includes(p)){s=x;solved=true;}}}
 if(t==='runes'){const w=C.rune(s,p,(C.runeSeq(p)[0]+1)%6);assert.ok(w.wrong);for(const i of C.runeSeq(p)){const r=C.rune(s,p,i);s=r.state;solved=r.solved;}}
 if(t==='match'){const c=C.matchCards(p);assert.ok(!C.match(s,p,0,0).ok);for(let a=0;a<12;a++)for(let b=a+1;b<12;b++)if(c[a]===c[b]){const r=C.match(s,p,a,b);assert.ok(r.ok);s=r.state;solved=solved||r.solved;}}
 assert.ok(solved,t+' '+p);return s;}
test('puzzle types: all four used, gears solvable, wrong rune resets, junk pz safe',()=>{assert.deepEqual([...new Set([...Array(15).keys()].map(C.ptype))].sort(),['beam','gears','jigsaw','match','rings','runes','scale','tiles','veena']);assert.equal(C.ptype(9),'jigsaw');
 for(let p=0;p<9;p++)if(C.ptype(p)==='gears')assert.ok(C.gearStart(p).some(x=>x));
 for(let p=0;p<9;p++){const c=C.matchCards(p);if(C.ptype(p)==='match'){assert.equal(c.length,12);for(const x of new Set(c))assert.equal(c.filter(y=>y===x).length,2);}}
 const v=C.validate({v:1,found:[],pz:[{},{g:[9,'x']},{k:99},{m:[1,1,'z']},{r:[9,9],pl:['x','surya-tukda']}]});assert.deepEqual(v.pz[1],{g:C.gearStart(1),pl:[]});assert.deepEqual(v.pz[2],{k:0,pl:[]});assert.deepEqual(v.pz[3],{m:[1],pl:[]});assert.deepEqual(v.pz[4],{r:[3,4],pl:['surya-tukda']});
 const h0=R('kingdom-lands.html');assert.ok(h0.includes('Harsheen Loops')&&h0.includes('काफ़िर से खत्री, खत्री से खालसा')&&!h0.includes('<li>🛤️')&&h0.includes('id="ending"'));assert.ok(!/susan|aethelgard/i.test(h0+R('assets/khoya/khoya.js')+R('assets/khoya/khoya-core.js')));
 const h=R('kingdom-lands.html');assert.ok(h.includes('id="puz-how"'));});

test('sound: procedural only, off by default, remembered, wired',()=>{const S=require('../assets/khoya/khoya-sound.js'),src=R('assets/khoya/khoya-sound.js'),js=R('assets/khoya/khoya.js'),h=R('kingdom-lands.html');
 assert.equal(S.parsePref(null),false);assert.equal(S.parsePref('off'),false);assert.equal(S.parsePref('on'),true);assert.equal(S.isOn(),false);
 assert.equal(S.set(true,null),false);S.sfx('find');for(const k of['find','wrong','hint','open','clear'])assert.ok(S.SFX[k].length);assert.ok(Math.abs(S.freq(0)-261.62)<.1);
 assert.ok(!/\.mp3|\.ogg|\.wav|new Audio\(|fetch\(/.test(src));assert.ok(src.includes('createOscillator'));
 for(const k of['find','wrong','hint','open','clear'])assert.ok(js.includes("sfx('"+k+"')"),k);assert.ok(js.includes('pointerdown')&&h.includes('id="snd"')&&h.includes('khoya-sound.js'));
 assert.ok(R('sw.js').includes('./assets/khoya/khoya-sound.js'));});
test('drag ghost class does not hide .btn.ghost buttons',()=>{const css=R('assets/khoya/khoya.css');assert.ok(!/(^|\n)\.ghost\{position:fixed/.test(css));assert.ok(css.includes('.dragghost{'));});

test('inventory: defs, 12 slots, stacks, use tags, full, migration',()=>{const I=C.ITEMS;for(const id in I){const d=I[id];assert.ok(d.itemId===id&&/[\u0900-\u097F]/.test(d.displayName)&&d.icon&&typeof d.stackable==='boolean'&&d.maxStack>=1&&Array.isArray(d.usableTags));}
 assert.equal(C.CAP,12);let b=[];b=C.addItem(b,C.KAN,5).bag;b=C.addItem(b,C.KAN,3).bag;assert.deepEqual(b,[{id:C.KAN,n:8}]);assert.ok(!C.addItem(b,'nope').ok);
 b=C.addItem(b,C.KAN,200).bag;assert.equal(b.length,3);assert.ok(C.hasItem(b,C.KAN,208));b=C.removeItem(b,C.KAN,108).bag;assert.ok(C.hasItem(b,C.KAN,100)&&!C.hasItem(b,C.KAN,101));
 let f=[];const ids=Object.keys(I).filter(i=>!I[i].stackable);for(const id of ids.slice(0,12))f=C.addItem(f,id).bag;const r=C.addItem(f,ids[12]);assert.ok(r.full&&!r.ok&&r.bag.length===12);
 let u=C.useItem([{id:'surya-tukda',n:1}],'surya-tukda','lock:9');assert.equal(u.reason,'tag');u=C.useItem([{id:'surya-tukda',n:1}],'surya-tukda','lock:4');assert.ok(u.ok&&u.bag.length===0);assert.equal(C.useItem([],'chabi','door:0').reason,'none');
 let s=C.fresh();for(const o of C.SCENES[0].objs)s=C.tap(s,0,o.id).state;assert.ok(C.hasItem(s.bag,'chabi')&&C.hasItem(s.bag,C.KAN,8));
 const old=JSON.parse(JSON.stringify(s));delete old.bag;assert.deepEqual(C.validate(old).bag.map(x=>x.id).sort(),['chabi',C.KAN].sort());
 for(let t=0;t<4;t++)while(s.tiles[0][t]!==0)s=C.rotate(s,0,t).state;assert.ok(!C.hasItem(s.bag,'chabi'),'key used on door');
 const k=C.useKan(s,3);assert.ok(k.ok&&C.hasItem(k.state.bag,C.KAN,5));assert.deepEqual(C.validate({v:1,found:[],bag:[{id:'x',n:1},{id:'chabi',n:7}]}).bag,[{id:'chabi',n:1}]);
 const js=R('assets/khoya/khoya.js');assert.ok(js.includes("'kl-bag-change'")&&js.includes('झोला भर गया')&&js.includes("sfx('pickup')"));assert.ok(require('../assets/khoya/khoya-sound.js').SFX.pickup);});

test('lock manager: requiredItemIds, wrong item, tap fallback, reward',()=>{assert.deepEqual(C.requiredItemIds(4),['surya-tukda','chandra-lens']);assert.deepEqual(C.requiredItemIds(0),[]);
 let s=C.fresh();for(let i=0;i<=4;i++){for(const o of C.SCENES[i].objs)s=C.tap(s,i,o.id).state;if(i<4)s.puzzles.push(i);}s=C.validate(s);
 assert.ok(!C.place(s,4,'agni').ok);let r=C.place(s,4,'surya-tukda');assert.ok(r.ok&&!r.ready);r=C.place(r.state,4,'chandra-lens');assert.ok(r.ready&&!C.hasItem(r.state.bag,'chandra-lens'));
 const js=R('assets/khoya/khoya.js');assert.ok(js.includes('यह यहाँ फिट नहीं होता')&&js.includes("'khoya-lock:'")&&js.includes('selItem'));});

test('chapter 3: story cards, hero art, content rules',()=>{const c3=C.SCENES.slice(10);assert.deepEqual(c3.map(x=>x.name),['टूटा घर','कचहरी','किताबों की कोठरी','छिपा नेटवर्क','गुरु दा दर']);
 let s=C.fresh();assert.equal(C.seeCard(s,0).cards.length,0);s=C.seeCard(s,10);assert.deepEqual(s.cards,[10]);assert.deepEqual(C.seeCard(s,10).cards,[10]);assert.deepEqual(C.validate({v:1,found:[],cards:[10,10,3,'x']}).cards,[10]);
 const all=R('kingdom-lands.html')+R('assets/khoya/khoya-core.js')+R('assets/khoya/khoya.js'),svg=R('assets/khoya/hero-daljit.svg');
 assert.ok(all.includes('मैं ज़िंदगी नहीं, एक कहानी जी रहा हूँ!')&&all.includes('काल्पनिक'));assert.ok(!/☬|khalistan|खालिस्तान|ड्रग|drug|BJP|Congress|AAP|भाजपा|कांग्रेस/i.test(all+svg));
 assert.ok(svg.startsWith('<svg')&&!/<image|href=/.test(svg));assert.ok(!/\.jpe?g|selfie/i.test(R('kingdom-lands.html')));
 for(const k of['ghar','kachehri','kothri','network','gurudar'])assert.ok(fs.statSync(path.join(__dirname,'..','assets/khoya/bg/'+k+'.webp')).size<250000);
 assert.ok(R('sw.js').includes('./assets/khoya/hero-daljit.svg'));});
