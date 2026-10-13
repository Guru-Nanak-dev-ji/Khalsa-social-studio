(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNTakht=m;})(this,function(){'use strict';
const KEY='kdn-takht-v1',BADGE='तख़्त परिक्रमा';
// हर face: CSS में उसका अपना घुमाव (fx,fy) — cube के बाहर की ओर
const FACES=[
 {id:'mahal',icon:'🏰',name:'महल',sub:'Control Room · सारे द्वार',href:'./studio.html',fx:0,fy:0},
 {id:'gyan',icon:'📚',name:'ज्ञान',sub:'ज्ञान मंडल · 13 अध्याय',href:'./gyan.html',fx:0,fy:90},
 {id:'khel',icon:'🗝️',name:'खेल',sub:'चाबी वाला द्वार',href:'./chabi.html',fx:0,fy:180},
 {id:'samachar',icon:'📺',name:'समाचार',sub:'KNN News Studio',href:'./newsroom.html',fx:0,fy:-90},
 {id:'saathi',icon:'🎙️',name:'AI साथी',sub:'बोलने वाले साथी',href:'./saathi.html',fx:90,fy:0},
 {id:'bhav',icon:'🎭',name:'मेरे भाव',sub:'अनेक होकर भी एक',href:'./bhav.html',fx:-90,fy:0}];
const r=d=>d*Math.PI/180;
function rotY(v,a){const c=Math.cos(r(a)),s=Math.sin(r(a));return[v[0]*c+v[2]*s,v[1],-v[0]*s+v[2]*c];}
function rotX(v,a){const c=Math.cos(r(a)),s=Math.sin(r(a));return[v[0],v[1]*c-v[2]*s,v[1]*s+v[2]*c];}
// CSS "rotateX(a) rotateY(b)" = पहले Y फिर X
const apply=(v,ax,ay)=>rotX(rotY(v,ay),ax);
function normal(f){return apply([0,0,1],f.fx,f.fy);}
function front(rx,ry){let best=0,bz=-2;FACES.forEach((f,i)=>{const z=apply(normal(f),rx,ry)[2];if(z>bz){bz=z;best=i;}});return best;}
const snap=a=>Math.round(a/90)*90;
// face i को सामने लाने के लिए घुमाव
function target(i){const f=FACES[i];return f.fx?{rx:-f.fx,ry:0}:{rx:0,ry:-f.fy};}
function fresh(){return{v:1,seen:[],badge:false};}
function validate(s){if(!s||s.v!==1||!Array.isArray(s.seen))return fresh();const ids=FACES.map(f=>f.id);const seen=[...new Set(s.seen.filter(x=>ids.includes(x)))];return{v:1,seen,badge:seen.length===FACES.length};}
function visit(s,i){s=validate(s);const id=FACES[i]&&FACES[i].id;if(!id||s.seen.includes(id))return{state:s,isNew:false,badgeNew:false};const n=validate({...s,seen:[...s.seen,id]});return{state:n,isNew:true,badgeNew:n.badge&&!s.badge};}
return{KEY,BADGE,FACES,front,snap,target,normal,apply,fresh,validate,visit};});
