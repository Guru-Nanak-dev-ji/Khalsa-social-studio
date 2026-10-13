const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../assets/newsroom-core.js');const r=f=>fs.readFileSync(path.resolve(__dirname,'..',f),'utf8');
test('sizes',()=>{assert.deepEqual(C.size('portrait'),{w:1080,h:1920});assert.deepEqual(C.size('landscape'),{w:1920,h:1080});});
test('split layout',()=>{assert.equal(C.layout('portrait',false).length,1);const p=C.layout('portrait',true);assert.equal(p[0].x,p[1].x);assert.ok(p[1].y>p[0].y);const l=C.layout('landscape',true);assert.ok(l[1].x>l[0].x);assert.ok(l[1].x+l[1].w<=1920);});
test('cover fit',()=>{const c=C.cover(1280,720,{w:1080,h:1080});assert.equal(c.sh,720);assert.equal(c.sw,720);assert.equal(C.cover(0,0,{w:1,h:1}),null);});
test('room ids and links',()=>{const id=C.roomId();assert.ok(C.validRoom(id));assert.ok(!C.validRoom('x'));assert.equal(new URL(C.guestLink('https://a.b/newsroom.html?room=old#x',id)).searchParams.get('room'),id);});
test('ticker+mime+clock',()=>{assert.equal(C.tickerText(['a',' ','b']),'a   ◆   b');assert.equal(C.pickMime(m=>m==='video/webm'),'video/webm');assert.equal(C.pickMime(()=>false),'');assert.equal(C.clock(new Date(2026,0,1,4,5,6)),'04:05:06');});
test('no khanda, cached, linked',()=>{assert.doesNotMatch(r('newsroom.html'),/khanda|☬/i);assert.match(r('sw.js'),/'\.\/newsroom\.html'/);assert.match(r('studio.html'),/newsroom\.html/);});
