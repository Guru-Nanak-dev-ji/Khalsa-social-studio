const test=require('node:test'),assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const A=require('../assets/avatar/avatar-core.js');const r=f=>fs.readFileSync(path.resolve(__dirname,'..',f),'utf8');
const px=(...c)=>new Uint8ClampedArray(c.flatMap(x=>[...x,255]));
test('infers dastaar, beard and true skin tone from samples',()=>{const o=A.inferFromSamples({cheek:px([200,150,110],[200,150,110]),hair:px([28,63,149]),chin:px([25,18,12])});assert.equal(o.skin,'#c8966e');assert.equal(o.head,'dastaar');assert.equal(o.dastaar,'#1c3f95');assert.equal(o.beard,'full');});
test('plain dark hair and clean chin',()=>{const o=A.inferFromSamples({cheek:px([220,180,150]),hair:px([30,20,18]),chin:px([215,175,145])});assert.equal(o.head,'hair');assert.equal(o.beard,'none');assert.equal(o.hair,'#1b1210');});
test('sanitize rejects junk and persists to storage',()=>{const s=new Map(),store={getItem:k=>s.get(k)??null,setItem:(k,v)=>s.set(k,v)};
 assert.deepEqual(A.load(store),A.DEFAULTS);A.save(store,{skin:'#ABCDEF',head:'x',smile:9,name:'a'.repeat(50),evil:'<script>'});const o=A.load(store);
 assert.equal(o.skin,'#abcdef');assert.equal(o.head,'dastaar');assert.equal(o.smile,1);assert.equal(o.name.length,30);assert.ok(!('evil'in o));s.set(A.KEY,'{bad');assert.deepEqual(A.load(store),A.DEFAULTS);});
test('six Hindi stickers and three GIFs',()=>{assert.deepEqual(A.STICKERS.map(s=>s.n),['हँसी','नमस्ते','ताली','हैरान','गुस्सा','प्यार']);assert.deepEqual(A.GIFS.map(g=>g.id),['blink','smile','wave']);assert.ok(A.DASTAAR.length>=6);});
test('draw runs for every expression on a mock canvas',()=>{const calls=[];const ctx=new Proxy({},{get:(t,k)=>k in t?t[k]:(k==='createRadialGradient'?()=>({addColorStop(){}}):(...a)=>calls.push(k)),set:(t,k,v)=>(t[k]=v,true)});
 for(const e of['neutral',...A.STICKERS.map(s=>s.id)])for(const head of A.HEADS)A.draw(ctx,100,{...A.DEFAULTS,head:head.id},e,{blink:.5,wave:.3,t:.2});assert.ok(calls.length>100);});
test('smileFromLandmarks is bounded',()=>{const l=[];for(let i=0;i<478;i++)l[i]={x:.5,y:.5};l[234]={x:.2,y:.5};l[454]={x:.8,y:.5};l[61]={x:.35,y:.7};l[291]={x:.65,y:.7};l[13]={x:.5,y:.72};l[14]={x:.5,y:.74};const v=A.smileFromLandmarks(l);assert.ok(v>=0&&v<=1);assert.equal(A.smileFromLandmarks(null),.5);});
test('page is Hindi, private, wired into SW and door palace, no Khanda',()=>{const h=r('avatar.html');assert.match(h,/lang="hi"/);assert.match(h,/मेरा अवतार/);assert.match(h,/Tiro\+Devanagari\+Hindi/);assert.match(h,/Mukta/);
 assert.doesNotMatch(h,/[A-Za-z]{3,} [A-Za-z]{3,} [A-Za-z]{3,}<\//);
 for(const f of['avatar.html','assets/avatar/avatar.js','assets/avatar/avatar.css','assets/avatar/avatar-core.js']){assert.doesNotMatch(r(f),/☬|khanda/i);assert.match(r('sw.js'),new RegExp("'\\./"+f.replace(/[.]/g,'\\.')+"'"));}
 const js=r('assets/avatar/avatar.js');assert.doesNotMatch(js,/fetch\(|XMLHttpRequest|sendBeacon/);assert.match(js,/tasks-vision/);assert.match(r('assets/avatar/vendor/GIFENC-LICENSE.md'),/MIT/);
 assert.ok(require('../assets/doors-core.js').all().some(d=>d.href==='./avatar.html'));assert.match(r('sw.js'),/v0\.15\.3/);});
