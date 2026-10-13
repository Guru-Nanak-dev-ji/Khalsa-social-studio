const test=require('node:test'),assert=require('node:assert'),Dr=require('../assets/doors-core.js'),N=require('../assets/naksha/naksha-core.js'),fs=require('fs'),path=require('path');
const P=f=>path.join(__dirname,'..',f),R=f=>fs.readFileSync(P(f),'utf8');
test('kyon reader: no embedded data, assets exist, 16 chapters',()=>{const h=R('kyon.html');assert.ok(h.includes('lang="hi"')&&h.includes('data-heritage')&&h.includes('goldtv.js'));assert.ok(!h.includes('data:'),'no data URIs');assert.ok(!/☬/.test(h));
 const j=h.slice(h.indexOf('id="bookData">')+14);const b=JSON.parse(j.slice(0,j.indexOf('</script>')));assert.equal(b.chapters.length,16);assert.equal(b.pdf,'./assets/kyon/kyon-pustak.pdf');
 for(const u of Object.values(b.images).concat([b.pdf,'./assets/kyon/kyon-audio.mp3','./assets/kyon/dev.woff2','./assets/kyon/gur.woff2']))assert.ok(fs.existsSync(P(u)),u);
 assert.ok(h.includes('तर्क सिंह')&&h.includes('भावना कौर'));});
test('kyon assets size budget',()=>{let t=0;for(const f of fs.readdirSync(P('assets/kyon')))t+=fs.statSync(P('assets/kyon/'+f)).size;assert.ok(t<15e6,String(t));assert.ok(fs.statSync(P('assets/kyon/kyon-pustak.pdf')).size<4e6);});
test('kyon wiring: door, naksha, feed, gyan, sw (no huge precache)',()=>{assert.ok(Dr.all().some(d=>d.href==='./kyon.html'));assert.ok(N.IDS.includes('kyon'));assert.ok(JSON.parse(R('assets/goldtv/feed.json')).items.some(i=>i.href==='./kyon.html'));assert.ok(R('gyan.html').includes('./kyon.html'));
 const sw=R('sw.js');assert.equal((sw.match(/const CACHE/g)||[]).length,1);assert.ok(sw.includes("'./kyon.html'"));assert.ok(!sw.includes('kyon-audio.mp3')&&!sw.includes('kyon-pustak.pdf'));});
