const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path');
const K=require('../assets/funny/kapil-core.js'),R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('8–12 videos, valid unique IDs, official channels only',()=>{assert.ok(K.VIDEOS.length>=8&&K.VIDEOS.length<=12);assert.strictEqual(new Set(K.VIDEOS.map(v=>v.id)).size,K.VIDEOS.length);
 for(const v of K.VIDEOS)assert.ok(K.valid(v),v.id);for(const c of Object.values(K.CH))assert.match(c.url,/^https:\/\/www\.youtube\.com\/@(KapilSharmaK9|NetflixIndiaOfficial|SETIndia)$/);});
test('nocookie click-to-load embeds, no rehosted media, credit + all-videos button',()=>{assert.match(K.embed('V16idqmsj4g'),/^https:\/\/www\.youtube-nocookie\.com\/embed\//);
 const h=R('funnybook.html');for(const x of ['🎤 कपिल शर्मा — पंजाब का मान','सारी videos देखें ↗','सभी videos उनके official channel से embed, अधिकार उनके पास','kapil.js'])assert.ok(h.includes(x),x);
 assert.ok(!/<iframe/.test(h));assert.ok(!R('assets/funny/kapil.js').includes('ytimg'));
 assert.match(R('sw.js'),/const CACHE=PREFIX\+'v0\.(6[4-9]|[7-9]\d)\./);});
