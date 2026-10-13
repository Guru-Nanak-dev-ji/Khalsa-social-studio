const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path');
const R=p=>fs.readFileSync(path.join(__dirname,'..',p),'utf8');
test('suggest bubble wired',()=>{const j=R('assets/suggest/suggest.js');assert.ok(j.includes('💬 सुझाव'));assert.ok(j.includes("'hi-IN'"));assert.ok(j.includes('/suggest'));assert.ok(j.includes('भेजें'));assert.ok(!j.includes('APP_KEY'));
assert.ok(R('assets/goldtv/goldtv.js').includes('suggest/suggest.js'));const sw=R('sw.js');assert.equal((sw.match(/const CACHE/g)||[]).length,1);assert.ok(sw.includes('./assets/suggest/suggest.js'));});
