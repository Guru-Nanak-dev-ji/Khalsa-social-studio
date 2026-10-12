const {test} = require('node:test');
const assert = require('node:assert/strict');
const P = require('../assets/poster-core.js');
function measure() { return {font:'400 32px sans-serif', measureText(text) { const size = Number(this.font.match(/(\d+)px/)[1]); return {width:Array.from(text).length * size * .55}; }}; }
const draft = changes => ({format:'square',style:'royal',headline:'संगत की सेवा',detail:'ਸਾਥ · ਸੇਵਾ · ਸਹਿਯੋਗ',credit:'Khalsa Digital World',focusX:50,focusY:50,...changes});
test('photo crop stays within the image at all focus positions and both aspect ratios', () => {
  for (const [iw,ih] of [[4000,2000],[1200,4000],[1080,1080]]) {
    for (const [w,h] of [[952,386],[952,536]]) for (const x of [0,50,100]) for (const y of [0,50,100]) {
      const c = P.cover(iw,ih,w,h,x,y);
      assert.ok(c.sx >= 0 && c.sy >= 0 && c.sx + c.sw <= iw + .00001 && c.sy + c.sh <= ih + .00001);
      assert.ok(Math.abs(c.sw / c.sh - w / h) < .00001);
    }
  }
  assert.throws(() => P.cover(0,100,100,100), /dimensions/);
});
test('photo focus reaches both edges instead of stretching the photo', () => {
  assert.equal(P.cover(4000,1000,1000,1000,0,0).sx,0);
  assert.equal(P.cover(4000,1000,1000,1000,100,100).sx,3000);
  assert.equal(P.cover(1000,4000,1000,1000,100,100).sy,3000);
});
test('Hindi/Punjabi words and explicit paragraphs are not split or lost in line wrapping', () => {
  const ctx = measure();
  for (const text of ['श्रद्धा सेवा समुदाय','ਪੰਜਾਬੀ ਸੰਗਤ ਸਹਿਯੋਗ','Community service together']) {
    const lines = P.wrap(ctx,text,160);
    assert.equal(lines.join(' '),text);
    for (const word of text.split(' ')) assert.ok(lines.some(line => line.includes(word)));
  }
  assert.deepEqual(P.wrap(ctx,'One\n\nTwo',200),['One','','Two']);
});
test('both sizes support valid text with and without photos', () => {
  for (const format of ['square','portrait']) for (const photo of [true,false]) {
    const result = P.layout(measure(),draft({format}),photo);
    assert.equal(result.width,1080); assert.equal(result.height,format === 'square' ? 1080 : 1350);
    assert.equal(result.valid,true);
  }
});
test('blank, overflowing and over-limit text cannot be exported', () => {
  for (const value of [{headline:''},{headline:'W'.repeat(140)},{detail:'line\n'.repeat(70)},{credit:'x'.repeat(101)},{detail:'draft '.repeat(5000)}]) {
    const result = P.layout(measure(),draft(value),true);
    assert.equal(result.valid,false,JSON.stringify(value).slice(0,90));
  }
  assert.equal(P.layout(measure(),draft({detail:'x'.repeat(421)}),false).overLimit,true);
});
