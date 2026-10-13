const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const J=require('../assets/jeevit/jeevit-core.js'),K=require('../assets/koins-core.js');const r=f=>fs.readFileSync(path.resolve(__dirname,'..',f),'utf8');
test('every figure: 3-5 line Hindi sakhi + 4-option MCQ',()=>{assert.ok(J.IDS.length>=11);for(const id of J.IDS){const f=J.FIG[id];assert.ok(f.sakhi.length>=3&&f.sakhi.length<=5,id);assert.equal(f.opts.length,4);assert.ok(f.a>=0&&f.a<4);assert.match(f.name+f.q,/[\u0900-\u097F]/);}});
test('koins counted once per figure; wrong also counted (−3)',()=>{let s=J.fresh();let a=J.answer(s,'ram',0);assert.ok(a.right&&a.counted);a=J.answer(a.state,'ram',0);assert.equal(a.counted,false);
 const w=J.answer(J.fresh(),'kabir',2);assert.equal(w.right,false);assert.ok(w.counted);assert.equal(K.quiz(K.fresh(),w.right).added,-3);assert.equal(K.quiz(K.fresh(),true).added,10);});
test('badge only when all figures complete; tampered storage cleaned',()=>{let s=J.fresh();for(const id of J.IDS){assert.equal(J.badge(s),false);s=J.answer(s,id,J.FIG[id].a).state;}assert.equal(J.badge(s),true);assert.equal(J.BADGE,'साखी संग्रह');
 assert.deepEqual(J.validate({version:1,done:['x','ram','ram']}).done,['ram']);});
test('UI: hi-IN speech, play/stop, reduced motion, fonts',()=>{const u=r('assets/jeevit/jeevit.js'),c=r('assets/jeevit/jeevit.css');assert.match(u,/hi-IN/);assert.match(u,/speechSynthesis/);assert.match(u,/cancel\(\)/);assert.match(u,/K\.quiz\(/);
 assert.match(c,/prefers-reduced-motion/);assert.match(c,/Rozha One/);assert.match(c,/Mukta/);});
test('pages wired, every data-figure has sakhi, images cached + credited',()=>{const cred=JSON.parse(r('assets/palace/v014/pran/credits.json')),sw=r('sw.js');
 for(const p of ['index.html','palace.html','world.html','kingdom.html','khalsa.html','maze.html','enter.html']){const h=r(p);assert.match(h,/jeevit\.js/);assert.match(h,/koins-core\.js/);assert.doesNotMatch(h,/leftground/);
  for(const m of h.matchAll(/data-figure="([a-z]+)"/g))assert.ok(J.FIG[m[1]],m[1]);assert.match(h,/CREDITS\.md/);}
 for(const c of cred){assert.match(c.license,/Public domain|CC/);assert.match(c.source,/^https:\/\/commons\.wikimedia\.org\//);assert.ok(fs.existsSync(path.resolve(__dirname,'..',c.asset)));assert.ok(sw.includes("'./"+c.asset+"'"),c.asset);}
 assert.equal((sw.match(/const CACHE=/g)||[]).length,1);for(const f of ['jeevit-core.js','jeevit.js','jeevit.css'])assert.ok(sw.includes('./assets/jeevit/'+f));});
