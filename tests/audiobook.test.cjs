const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const C=require('../assets/audiobook-core.js');
test('chapters split on Hindi, Punjabi, English headings',()=>{
  const c=C.splitChapters('भूमिका\nअध्याय 1\nपहला।\nਅਧਿਆਇ 2\nਦੂਜਾ।\nChapter 3\nThird.');
  assert.equal(c.length,4);assert.equal(c[2].title,'ਅਧਿਆਇ 2');assert.equal(C.splitChapters('').length,0);
});
test('chunks stay short',()=>{const p=C.chunks('क'.repeat(1000)+'। ठीक है।');assert.ok(p.every(x=>x.length<=220));});
test('page cached and linked',()=>{const r=f=>fs.readFileSync(path.resolve(__dirname,'..',f),'utf8');
  assert.match(r('sw.js'),/'\.\/audiobook\.html'/);assert.match(r('studio.html'),/audiobook\.html/);assert.match(r('ai-tools.html'),/audiobook\.html/);});
