const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const C=require('../assets/realm/v014/realm-core.js'),K=require('../assets/kingdom/v014/kingdom-core.js');
const root=path.resolve(__dirname,'..');
test('every current room has a readable intro, while five pledge gates keep distinct context',()=>{
 const gates=Array.from({length:5},(_,i)=>C.scene({id:'pran-'+i}));assert.equal(new Set(gates.map(g=>g.title)).size,5);
 for(const room of K.rooms){const s=C.scene(room);assert.equal(s.title,room.name);assert.equal(s.copy,room.purpose);assert.ok(['amber','jade','rose','indigo'].includes(s.tone));}
 assert.equal(C.scene({id:'not-a-room'}).title,'पहला आईना');assert.equal(C.progress(-10,2800),0);assert.equal(C.progress(30000,2800),1);
});
test('new entry shares saved gift identity and all seven entries have the same complete first screen',()=>{
 const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
 for(const p of ['enter','world','maze','kingdom','palace','khalsa'])assert.equal(fs.readFileSync(path.join(root,p+'.html'),'utf8'),html);
 assert.equal(K.roomFor('khalsa.html').id,'pran');assert.equal(K.gift(K.roomFor('khalsa.html').id,0).id,K.gift(K.roomFor('index.html').id,0).id);
 for(const text of [C.mission.sharing,C.mission.bani,C.mission.signature])assert.ok(html.includes(text),text);
 assert.ok(html.includes('id="realm-direct"'));assert.ok(html.includes('id="realm-motion"'));assert.ok(html.includes('id="realm-quality"'));
});
test('offline shell contains all real-time renderer dependencies and original fallback assets',()=>{
 let assets;
 const context={self:{registration:{scope:'https://example.org/Khalsa-social-studio/'},addEventListener(){}},URL,Set};
 vm.runInNewContext(fs.readFileSync(path.join(root,'sw.js'),'utf8')+'\nglobalThis.assets=ASSETS;',context);assets=context.assets;
 for(const file of ['realm-core.js','realm.js','realm-world.mjs','realm.css','city.svg','door.svg','vendor/three.module.min.js','vendor/three.core.min.js','vendor/THREE-LICENSE.txt'])assert.ok(assets.includes('./assets/realm/v014/'+file),file);
 assert.ok(assets.includes('./khalsa.html'));for(const p of assets)assert.ok(fs.existsSync(path.join(root,p)),p);
 const module=fs.readFileSync(path.join(root,'assets/realm/v014/vendor/three.module.min.js'),'utf8');assert.match(module,/three\.core\.min\.js/);
});
