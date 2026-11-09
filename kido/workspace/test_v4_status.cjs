'use strict';
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const source=fs.readFileSync(process.argv[2]||require('node:path').join(__dirname,'v4-status.js'),'utf8');
const ctx={}; vm.runInNewContext(source,ctx);
const api=ctx.KidoV4Status;
const snapshot={schema:'kido.workspace.v4.offline',workers:26,domains:11,connected_handoff:'NOT_VERIFIED',receiver_ack:'PENDING',strict_loops:0,publication:'HOLD',task_counts:{QUEUED:2,CLAIMED:1,COMPLETED:3}};
let pass=0;
function test(name,fn){fn();pass++;console.log('PASS',name)}
test('exports validate and render',()=>assert.equal(typeof api.render,'function'));
test('accepts grounded offline snapshot',()=>assert.equal(api.validate(snapshot).queued,2));
for(const [name,change] of [['wrong roster',{workers:25}],['fake connected',{connected_handoff:'VERIFIED'}],['fake ACK',{receiver_ack:'ACK'}],['fake loops',{strict_loops:50}],['public release',{publication:'LIVE'}],['wrong domains',{domains:12}],['negative count',{task_counts:{QUEUED:-1,CLAIMED:1,COMPLETED:3}}]])test('rejects '+name,()=>assert.throws(()=>api.validate({...snapshot,...change})));
function fakeDoc(){const host={children:[],get firstChild(){return this.children[0]},removeChild(){this.children.shift()},appendChild(n){this.children.push(n)}};return {host,getElementById(id){return id==='v4-verified-status'?host:null},createElement(tag){return {tag,textContent:''}}}}
test('renders text-only status',()=>{const d=fakeDoc();assert.equal(api.render(d,snapshot),4);assert.equal(d.host.children.length,4);assert.match(d.host.children[0].textContent,/no connected/)});
test('clears stale status before render',()=>{const d=fakeDoc();api.render(d,snapshot);api.render(d,snapshot);assert.equal(d.host.children.length,4)});
test('requires mount point',()=>assert.throws(()=>api.render({getElementById(){return null}},snapshot)));
console.log('TOTAL_PASS',pass);
