const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../assets/promo-core.js');const r=f=>fs.readFileSync(path.resolve(__dirname,'..',f),'utf8');
test('10 scenes, 45-60s loop',()=>{assert.equal(C.SCENES.length,10);assert.ok(C.TOTAL_MS>=45000&&C.TOTAL_MS<=60000);});
test('sceneAt loops',()=>{assert.equal(C.sceneAt(0).index,0);assert.equal(C.sceneAt(C.TOTAL_MS+5001).index,1);assert.equal(C.sceneAt(-1).index,9);});
test('honest claims',()=>{const all=JSON.stringify(C.SCENES);assert.match(all,/1,25,000/);assert.match(all,/game koins/);assert.match(all,/जल्द/);assert.doesNotMatch(all,/ੴ|☬/);});
test('linked and cached',()=>{assert.match(r('studio.html'),/promo\.html/);assert.match(r('sw.js'),/'\.\/promo\.html'/);assert.match(r('promo.html'),/MediaRecorder|promo\.js/);});
