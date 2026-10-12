const {test}=require('node:test'),assert=require('node:assert/strict'),vm=require('node:vm');
const {readFileSync}=require('node:fs'),{resolve}=require('node:path');
const source=readFileSync(resolve(__dirname,'../assets/app-update.js'),'utf8');
function harness({supported=true,fail=false}={}){
  const elements=Object.fromEntries(['app-update-check','app-update-reload','app-update-status'].map(id=>[id,{hidden:true,disabled:false,textContent:'',events:{},addEventListener(name,fn){this.events[name]=fn;}}]));
  const listeners={},registrations=[];let updates=0,reloads=0;
  const registration={installing:null,waiting:null,addEventListener(name,fn){listeners[name]=fn;},async update(){updates++;if(fail)throw Error('offline');}};
  const sw={addEventListener(name,fn){listeners[name]=fn;},async register(url,options){registrations.push({url,options});if(fail)throw Error('offline');return registration;}};
  const document={readyState:'complete',getElementById:id=>elements[id]},window={location:{reload(){reloads++;}}};
  vm.runInNewContext(source,{document,window,navigator:supported?{serviceWorker:sw}:{}});
  return {elements,listeners,registrations,registration,get updates(){return updates;},get reloads(){return reloads;}};
}
test('worker registration bypasses HTTP cache and a controller change only offers reload',async()=>{
  const h=harness();await Promise.resolve();assert.equal(h.registrations[0].url,'./sw.js');assert.equal(h.registrations[0].options.updateViaCache,'none');
  h.listeners.controllerchange();assert.equal(h.elements['app-update-reload'].hidden,false);assert.equal(h.reloads,0);
  h.elements['app-update-reload'].events.click();assert.equal(h.reloads,1);
});
test('manual checks recover from failures and never erase storage or navigate automatically',async()=>{
  const h=harness();await Promise.resolve();await h.elements['app-update-check'].events.click();assert.equal(h.updates,1);assert.equal(h.elements['app-update-check'].disabled,false);assert.equal(h.reloads,0);
  const offline=harness({fail:true});await Promise.resolve();await offline.elements['app-update-check'].events.click();assert.equal(offline.elements['app-update-check'].disabled,false);assert.match(offline.elements['app-update-status'].textContent,/अपडेट नहीं मिल/);assert.equal(offline.reloads,0);
  for(const forbidden of ['localStorage','sessionStorage','caches.delete','unregister(','location.replace','location.assign'])assert.ok(!source.includes(forbidden));
});
test('no-service-worker browsers keep the opening usable without a broken check button',()=>{
  const h=harness({supported:false});assert.equal(h.elements['app-update-check'].hidden,true);assert.equal(h.registrations.length,0);
});
