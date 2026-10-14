const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),Dr=require('../assets/doors-core.js');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('nyay page: notice, 7 sections, honest status, no Khanda, wired',()=>{const h=R('nyay.html');
 assert.ok(h.includes('lang="hi"')&&h.includes('hindi-fonts.css')&&h.includes('डिजिटल न्याय मंडल'));
 assert.ok(h.includes('यह एक विचार/प्रस्ताव है, लागू कानून नहीं। किसी अदालत, पुलिस या सरकार का विकल्प नहीं। कानूनी सलाह नहीं।'));
 assert.equal((h.match(/<details/g)||[]).length,7);assert.ok(!/☬|तैयार है|ready/i.test(h.replace('“तैयार”','')));
 assert.ok(h.includes('href="./index.html"'));assert.ok(Dr.all().some(d=>d.href==='./nyay.html'));assert.ok(R('sw.js').includes("'./nyay.html'"));});
