(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNKhel=m;})(this,function(){'use strict';
// 🎮 खेल बनाओ — quiz / रास्ता चुनो templates. Local + URL share. Game koins only.
const KEY='kdn-khel-v1',BADGE='खेल निर्माता';
const fresh=()=>({v:1,games:[],played:[],badge:false});
const s60=x=>String(x||'').slice(0,120);
function clean(g){if(!g||!['quiz','path'].includes(g.type))return null;const title=s60(g.title).trim();if(title.length<3)return null;
 if(g.type==='quiz'){const qs=(g.qs||[]).slice(0,10).map(q=>({q:s60(q.q).trim(),opts:(q.opts||[]).slice(0,4).map(s60).map(x=>x.trim()),a:+q.a})).filter(q=>q.q&&q.opts.length>=2&&q.opts.every(Boolean)&&q.a>=0&&q.a<q.opts.length);return qs.length?{type:'quiz',title,qs}:null;}
 const steps=(g.steps||[]).slice(0,12).map(st=>({t:s60(st.t).trim(),ch:(st.ch||[]).slice(0,3).map(c=>({l:s60(c.l).trim(),go:+c.go}))}));
 if(!steps.length||!steps[0].t)return null;for(const st of steps){if(!st.t)return null;for(const c of st.ch)if(!c.l||!(c.go>=0&&c.go<steps.length))return null}
 if(!steps.some(st=>!st.ch.length))return null;return{type:'path',title,steps};}
function textOf(g){return g.title+' '+(g.qs||[]).map(q=>q.q+' '+q.opts.join(' ')).join(' ')+(g.steps||[]).map(s=>s.t+' '+s.ch.map(c=>c.l).join(' ')).join(' ');}
function check(g,F){const c=clean(g);if(!c)return{ok:false,why:['🧩 खेल अधूरा है — हर सवाल/कदम भरो, path में कम से कम एक अंत (बिना विकल्प) हो']};if(F){const r=F.check(textOf(c));if(!r.ok)return{ok:false,why:r.why}}return{ok:true,game:c};}
function score(g,answers){return g.qs.reduce((n,q,i)=>n+(answers[i]===q.a?1:0),0);}
function validate(s){if(!s||s.v!==1)return fresh();const games=(Array.isArray(s.games)?s.games:[]).map(clean).filter(Boolean).slice(0,30);return{v:1,games,played:(Array.isArray(s.played)?s.played:[]).filter(x=>typeof x==='string').slice(-200),badge:s.badge===true};}
function save(s,g){s=validate(s);return{state:{...s,games:[...s.games,g],badge:true},badgeNew:!s.badge};}
function gid(g){let h=0;const t=JSON.stringify(g);for(let i=0;i<t.length;i++)h=(h*31+t.charCodeAt(i))|0;return 'k'+(h>>>0).toString(36);}
return{KEY,BADGE,fresh,clean,check,score,validate,save,gid};});
