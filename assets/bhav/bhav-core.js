(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNBhav=m;})(this,function(){'use strict';
const SAVE_KEY='kdn-bhav-mix-v1',SPOT='bhav:save',REWARD=10;
function clamp(v){v=Math.round(Number(v));return Number.isFinite(v)?Math.max(0,Math.min(100,v)):0;}
function norm(bhavs,vals){const raw=bhavs.map(b=>clamp(vals[b.id]));const s=raw.reduce((a,b)=>a+b,0);if(!s)return bhavs.map(()=>1/bhavs.length);return raw.map(v=>v/s);}
function percents(bhavs,vals){const w=norm(bhavs,vals);const p=w.map(x=>Math.floor(x*100));let r=100-p.reduce((a,b)=>a+b,0);const ord=w.map((x,i)=>[x*100-p[i],i]).sort((a,b)=>b[0]-a[0]);for(let k=0;r>0;k++,r--)p[ord[k%ord.length][1]]++;return p;}
function ranked(bhavs,vals){const p=percents(bhavs,vals);return bhavs.map((b,i)=>({b,p:p[i]})).sort((x,y)=>y.p-x.p);}
function hex(c){const n=parseInt(c.slice(1),16);return[n>>16&255,n>>8&255,n&255];}
function mixColor(bhavs,vals){const w=norm(bhavs,vals);const c=[0,0,0];bhavs.forEach((b,i)=>hex(b.color).forEach((v,k)=>c[k]+=v*w[i]));return'#'+c.map(v=>Math.round(v).toString(16).padStart(2,'0')).join('');}
function name(bhavs,vals){const r=ranked(bhavs,vals);if(r[0].p-r[r.length-1].p<=10)return'संतुलित संत-सिपाही';if(r[1].p>=r[0].p-10)return r[0].b.adj+' '+r[1].b.title;return r[0].b.adj+' '+r[0].b.title;}
function line(bhavs,vals){return'आप '+ranked(bhavs,vals).filter(x=>x.p>0).map(x=>x.p+'% '+x.b.adj).join(', ')+' — आप जैसा कोई दूसरा नहीं।';}
function guidance(bhavs,vals){const r=ranked(bhavs,vals);const t=[r[0].b.tip];if(r[1]&&r[1].p>=20)t.push(r[1].b.tip);return t;}
function sanitize(bhavs,v){const o={};bhavs.forEach(b=>{o[b.id]=v&&b.id in v?clamp(v[b.id]):50;});return o;}
function reward(st,K){st=K.validate(st);if(st.spots.includes(SPOT))return{state:st,added:0};return{state:{...st,earned:st.earned+REWARD,spots:[...st.spots,SPOT]},added:REWARD};}
return{SAVE_KEY,SPOT,REWARD,clamp,norm,percents,ranked,mixColor,name,line,guidance,sanitize,reward};});
