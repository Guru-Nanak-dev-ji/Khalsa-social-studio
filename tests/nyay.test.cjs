const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path'),Dr=require('../assets/doors-core.js');
const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('nyay page: notice, 7 sections, honest status, no Khanda, wired',()=>{const h=R('nyay.html');
 assert.ok(h.includes('lang="hi"')&&h.includes('hindi-fonts.css')&&h.includes('डिजिटल न्याय मंडल'));
 assert.ok(h.includes('यह एक विचार/प्रस्ताव है, लागू कानून नहीं। किसी अदालत, पुलिस या सरकार का विकल्प नहीं। कानूनी सलाह नहीं।'));
 assert.equal((h.match(/<details/g)||[]).length,9);assert.ok(!/☬|तैयार है|ready/i.test(h.replace('“तैयार”','')));
 assert.ok(h.includes('href="./index.html"'));const pj=h.slice(h.indexOf('id="panj"'),h.indexOf('id="jury"'));for(const w of['स्वैच्छिक','ऐतिहासिक पंज प्यारे','random draw','recusal','अपील','निजता','सलाहकार'])assert.ok(pj.includes(w),w);assert.ok(h.includes('मसौदा तैयार'));assert.equal((h.match(/· पूरा नहीं/g)||[]).length,3);const jr=h.slice(h.indexOf('id="jury"'),h.indexOf('9. आगे'));for(const w of['random draw','तय नहीं','सर्वसम्मति','supermajority','लिखित कारण','गुप्त','अपील','स्वैच्छिक','असली अदालत'])assert.ok(jr.includes(w),w);assert.ok(h.includes('href="#jury"'));assert.ok(Dr.all().some(d=>d.href==='./nyay.html'));assert.ok(R('sw.js').includes("'./nyay.html'"));});
