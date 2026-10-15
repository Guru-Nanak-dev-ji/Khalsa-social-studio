'use strict';
const test=require('node:test'),assert=require('node:assert/strict');
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const root=path.join(__dirname,'..');
const source=fs.readFileSync(path.join(root,'assets/kahani/kahani-world.js'),'utf8');
const registry=require('../assets/kingdom/v014/kingdom-core.js');

// Deterministic DOM/event harness: lifecycle checks, not visual/browser QA.
function setup({reduced=false,hash='',roomCore=registry,missing=[],existingReturn=false}={}){
 class Element{
  constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.listeners={};this.attrs={};this.dataset={};this.style={setProperty(){}};this.box={top:100,bottom:450,width:1500,height:100};this.hidden=false;this.open=false;this.capture=null;}
  appendChild(child){this.children.push(child);return child;}
  get firstElementChild(){return this.children[0];}
  cloneNode(){return new Element();}
  setAttribute(name,value){this.attrs[name]=value;}
  addEventListener(name,fn){(this.listeners[name]??=[]).push(fn);}
  fire(name,event={}){for(const fn of this.listeners[name]||[])fn(event);}
  getBoundingClientRect(){return this.box;}
  closest(selector){return selector==='.card'?this.card||null:null;}
  querySelector(selector){return selector==='a[href="#kahani-world"]'?this.children.find(child=>child.href==='#kahani-world')||null:null;}
  scrollIntoView(){this.scrolled=true;}
  setPointerCapture(id){this.capture=id;}
  hasPointerCapture(id){return this.capture===id;}
  releasePointerCapture(){this.capture=null;}
 }
 const ids=Object.fromEntries(['kahani-world','kw-viewport','kw-track','kw-pause','kw-back','kw-forward','kw-old-rooms','kw-rooms-note','kw-controls','story-doors','safar','ch1','avatar','fb','her','wm','wm5','purani-duniya','khalsa-sanskriti','sanatan-sanskriti'].map(id=>[id,new Element()]));
 const cards=['safar','ch1','avatar','fb','her','wm'].map(id=>ids[id]);cards.forEach(card=>card.card=card);ids.wm5.card=ids.wm;
 for(const id of ['purani-duniya','khalsa-sanskriti','sanatan-sanskriti'])ids[id].tagName='DETAILS';
 const group=new Element();ids['kw-track'].appendChild(group);
 if(existingReturn){const link=new Element('a');link.href='#kahani-world';ids.safar.appendChild(link);}
 for(const id of missing)delete ids[id];
 const hud=new Element(),body=new Element(),document=new Element(),window=new Element();
 document.hidden=false;document.body=body;document.getElementById=id=>ids[id]||null;
 document.querySelector=selector=>selector==='.kw-hud'?hud:null;
 document.querySelectorAll=selector=>selector==='section.card'?cards:[];
 document.createElement=tag=>new Element(tag);
 const media=new Element();media.matches=reduced;window.matchMedia=()=>media;window.innerHeight=800;
 window.KDNKingdomCore=roomCore;
 const frames=new Map();let next=0,observer;
 class IntersectionObserver{constructor(fn){observer=fn;}observe(){}}
 class ResizeObserver{constructor(fn){this.callback=fn;}observe(){}}
 window.IntersectionObserver=IntersectionObserver;window.ResizeObserver=ResizeObserver;
 const location={hash};
 const context={window,document,location,IntersectionObserver,ResizeObserver,requestAnimationFrame:fn=>{frames.set(++next,fn);return next;},cancelAnimationFrame:id=>frames.delete(id)};
 Object.defineProperty(context,'localStorage',{get(){throw Error('Motion must not touch saved data');}});
 Object.defineProperty(window,'localStorage',{get(){throw Error('Motion must not touch saved data');}});
 vm.runInNewContext(source,context);
 return {ids,group,media,document,window,location,cards,frames,
  rerun(){vm.runInNewContext(source,context);},
  tick(time){const callbacks=[...frames.values()];frames.clear();callbacks.forEach(fn=>fn(time));},
  hash(value){location.hash=value;window.fire('hashchange');},
  visible(value){observer([{isIntersecting:value}]);},
  position(){return ids['kw-track'].style.transform;}
 };
}

test('motion pauses during original stories and resumes at the same position on return',()=>{
 const h=setup();h.tick(100);h.tick(200);const p=h.position();assert.notEqual(p,'translate3d(0.00px,0,0)');
 for(const id of ['safar','ch1','avatar','wm','wm5','fb','her']){
  h.hash('#'+id);assert.equal(h.frames.size,0,id);h.tick(900);assert.equal(h.position(),p);
  h.hash('#kahani-world');assert.equal(h.frames.size,1);assert.equal(h.position(),p);
 }
 h.ids['kw-pause'].fire('click');assert.equal(h.frames.size,0);h.hash('#ch1');h.hash('#kahani-world');assert.equal(h.frames.size,0,'return respects an explicit pause');
 h.ids['kw-pause'].fire('click');assert.equal(h.frames.size,1);
});

test('missing registry or incomplete optional scenery leaves original navigation usable',()=>{
 for(const roomCore of [null,{}, {rooms:null},{rooms:'wrong'}, {rooms:[null,{path:5}]}]){
  const h=setup({roomCore});assert.equal(h.ids['kw-old-rooms'].children.length,0);assert.equal(h.ids['kw-rooms-note'].hidden,false);
  assert.equal(h.frames.size,1,'scenery still works without the room registry');
  for(const card of h.cards)assert.equal(card.children.at(-1).href,'#kahani-world');
 }
 for(const id of ['kw-track','kw-viewport','kw-pause','kw-back','kw-forward','kw-controls']){
  const h=setup({missing:[id]});assert.equal(h.frames.size,0);assert.equal(h.ids['kahani-world'].dataset.kwReady,undefined);
 }
});

test('repeated initialization does not duplicate scenes, return links, room links or handlers',()=>{
 const h=setup({existingReturn:true});h.tick(100);h.tick(200);const before=h.position();
 h.rerun();h.rerun();assert.equal(h.ids['kw-track'].children.length,2);assert.equal(h.frames.size,1);assert.equal(h.position(),before);
 assert.equal(h.ids['kw-old-rooms'].children.length,registry.rooms.length);
 for(const card of h.cards)assert.equal(card.children.filter(child=>child.href==='#kahani-world').length,1);
 h.ids['kw-pause'].fire('click');assert.equal(h.frames.size,0,'one click invokes one pause handler');
});

test('capture failure, blur and visibility interruption release a drag without freezing it',()=>{
 const down={pointerId:3,isPrimary:true,button:0,clientX:100,clientY:20};
 const h=setup(),v=h.ids['kw-viewport'];
 v.setPointerCapture=()=>{throw Error('pointer no longer active');};
 v.fire('pointerdown',down);assert.doesNotThrow(()=>v.fire('pointermove',{...down,clientX:150}));assert.equal(h.frames.size,1);
 v.setPointerCapture=id=>{v.capture=id;};
 for(const interrupt of [()=>h.window.fire('blur'),()=>{h.document.hidden=true;h.document.fire('visibilitychange');}]){
  v.fire('pointerdown',down);v.fire('pointermove',{...down,clientX:150});assert.equal(v.capture,3);
  interrupt();assert.equal(v.capture,null);const before=h.position();v.fire('pointermove',{...down,clientX:400});assert.equal(h.position(),before);
  h.document.hidden=false;h.document.fire('visibilitychange');assert.equal(h.frames.size,1);
 }
});

test('offscreen, hidden, reduced-motion and BFCache lifecycle leave no animation running',()=>{
 const h=setup();h.visible(false);assert.equal(h.frames.size,0);h.visible(true);assert.equal(h.frames.size,1);
 h.document.hidden=true;h.document.fire('visibilitychange');assert.equal(h.frames.size,0);
 h.document.hidden=false;h.document.fire('visibilitychange');assert.equal(h.frames.size,1);
 h.media.matches=true;h.media.fire('change');assert.equal(h.frames.size,0);assert.equal(h.ids['kw-pause'].disabled,true);
 h.ids['kw-forward'].fire('click');assert.equal(h.frames.size,0,'manual movement is allowed without autoplay');
 h.media.matches=false;h.media.fire('change');assert.equal(h.frames.size,0,'manual step remains paused');
 h.ids['kw-pause'].fire('click');h.tick(100);h.tick(200);const before=h.position();
 h.window.fire('pagehide');assert.equal(h.frames.size,0);h.window.fire('pageshow');assert.equal(h.frames.size,1);assert.equal(h.position(),before);
 const r=setup({reduced:true,hash:'#ch1'});assert.equal(r.frames.size,0);r.hash('#kahani-world');assert.equal(r.frames.size,0);
});

test('swipe handles vertical scroll, cancellation, outside release and wrapping',()=>{
 const h=setup(),v=h.ids['kw-viewport'];
 const down={pointerId:3,isPrimary:true,button:0,clientX:100,clientY:20};
 v.fire('pointerdown',down);assert.equal(h.frames.size,0);
 v.fire('pointermove',{...down,clientY:60});assert.equal(h.frames.size,1,'vertical scrolling is not captured');assert.equal(v.capture,null);
 v.fire('pointerdown',down);v.fire('pointermove',{...down,clientX:150});assert.equal(v.capture,3);assert.match(h.position(),/-1450.00px/);
 h.window.fire('pointercancel',down);assert.equal(v.capture,null);assert.equal(h.frames.size,1);
 v.fire('pointerdown',down);h.window.fire('pointerup',down);assert.equal(h.frames.size,1,'click ending outside does not leave the scene frozen');
 const before=h.position();v.fire('pointermove',{...down,clientX:600});assert.equal(h.position(),before);
 h.group.box.width=3000;h.window.fire('resize');assert.match(h.position(),/-2900.00px/,'resize keeps progress');
});

test('original registry and story return links are reused without touching storage',()=>{
 const h=setup({hash:'#purani-duniya'}),links=h.ids['kw-old-rooms'].children;
 assert.equal(links.length,registry.rooms.length);
 assert.deepEqual(links.map(a=>a.href),registry.rooms.map(r=>'./'+r.path));
 assert.equal(h.ids['purani-duniya'].open,true);
 for(const card of h.cards)assert.equal(card.children.at(-1).href,'#kahani-world');
 h.hash('#khalsa-sanskriti');assert.equal(h.ids['khalsa-sanskriti'].open,true);
 h.ids['khalsa-sanskriti'].open=false;
 h.document.fire('click',{target:{closest:()=>({getAttribute:()=>'#khalsa-sanskriti'})}});
 assert.equal(h.ids['khalsa-sanskriti'].open,true,'a second click reopens the current destination');
 h.hash('#sanatan-sanskriti');assert.equal(h.ids['sanatan-sanskriti'].open,true);
 assert.doesNotThrow(()=>h.hash('#%E0%A4%A'));
});

test('new page assets and original scene artwork are bundled for offline use',()=>{
 const html=fs.readFileSync(path.join(root,'kahani.html'),'utf8');
 const css=fs.readFileSync(path.join(root,'assets/kahani/kahani-world.css'),'utf8');
 const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8');
 for(const asset of ['assets/kahani/kahani-world.css','assets/kahani/kahani-world.js']){assert.ok(html.includes('./'+asset));assert.ok(sw.includes('./'+asset));}
 for(const match of css.matchAll(/url\('([^']+)'\)/g)){
  const file=path.join('assets/kahani',match[1]);assert.ok(fs.existsSync(path.join(root,file)),file);assert.ok(sw.includes('./'+file),file);
 }
});
