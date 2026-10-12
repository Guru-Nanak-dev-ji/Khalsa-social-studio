const {test}=require('node:test');
const assert=require('node:assert/strict');
const G=require('../assets/gyan-content.js');
const C=require('../assets/creator-core.js');
test('all twelve deep-link chapters fit the real Creator schema with citations preserved',()=>{
 assert.equal(G.chapters.length,12);assert.equal(new Set(G.chapters.map(c=>c.id)).size,12);
 assert.deepEqual(G.chapters.filter(c=>c.group==='truth').map(c=>c.number),[1,2,3,4,5,6,7,8,9]);
 for(const c of G.chapters){const body=G.text(c);C.validate({id:c.id,created:'2026-10-12T00:00:00Z',updated:'2026-10-12T00:00:00Z',language:'pa',kind:'social',platform:'general',heading:c.title[0],body,source:'',tags:''});assert.equal(G.get(c.id),c);for(const s of c.sources){assert.equal(new URL(s.url).protocol,'https:');assert.ok(body.includes(s.url));}}
 assert.equal(G.get('<script>'),null);assert.equal(G.get('__proto__'),null);assert.equal(G.get('unknown'),null);
});
