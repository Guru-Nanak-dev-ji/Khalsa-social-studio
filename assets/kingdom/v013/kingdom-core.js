/* Shared room registry and local game inventory. No money, identity or API keys. */
(function(root,factory){const api=factory();if(typeof module==='object'&&module.exports)module.exports=api;else root.KDNKingdomCore=api;})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const KEY='kdn-kingdom-collection-v1';
const coins=['Baba Nanak','Ram','Jesus','रविदास','वाल्मीकि','Khalsa'];
const rooms=[
 {id:'pran',path:'maze.html',name:'प्रण का चक्रव्यूह',device:'arch',mark:'☯',purpose:'पाँच द्वार, सवाल और अपना रास्ता'},
 {id:'studio',path:'studio.html',name:'राजसभा · सभी साधन',device:'led',mark:'♚',purpose:'सभी पुराने साधन और काम की स्थिति'},
 {id:'creator',path:'creator.html',name:'लिखतों का महल',device:'laptop',mark:'♜',purpose:'लेखन, drafts, TXT और JSON'},
 {id:'poster',path:'poster.html',name:'चित्रकार का आँगन',device:'phone',mark:'♝',purpose:'फोटो से पोस्टर बनाना और PNG निकालना'},
 {id:'community',path:'community.html',name:'संगत दरबार',device:'tv',mark:'♛',purpose:'लिखतें, सेवा रिकॉर्ड और My Neta demo'},
 {id:'gyan',path:'gyan.html',name:'ज्ञान मंडल',device:'arch',mark:'♞',purpose:'ज्ञान, विचार और बारह पढ़ने वाले द्वार'},
 {id:'reading',path:'dwar.html',name:'पढ़ने का द्वार',device:'book',mark:'♙',purpose:'पंजाबी पाठ और हिंदी सार'},
 {id:'faq',path:'Begampura_FAQ_542_Offline_Reader.html',name:'बेगमपुरा पुस्तकालय',device:'book',mark:'♜',purpose:'542 प्रश्नों का offline reader'},
 {id:'news',path:'docs/newsdesk.html',name:'खबरों की चौकी',device:'led',mark:'♟',purpose:'News Desk के वर्तमान साधन'},
 {id:'media',path:'docs/post-studio.html',name:'प्रसारण महल',device:'tv',mark:'♝',purpose:'Media drafts और post calendar'},
 {id:'connections',path:'docs/social-connections.html',name:'संपर्क मंडल',device:'pager',mark:'♞',purpose:'Social connections की स्थिति और योजना'},
 {id:'gateway',path:'docs/gateway.html',name:'संगत प्रवेश सभा',device:'arch',mark:'♛',purpose:'संगत, विचार और सहयोग के द्वार'},
 {id:'docs',path:'docs/index.html',name:'योजना की राजसभा',device:'laptop',mark:'♚',purpose:'परियोजना के दस्तावेज़ और साधन'},
 {id:'economy',path:'mandal.html?room=economy',name:'आर्थिक मंडल',device:'led',mark:'♜',purpose:'हुनर, कार्य-सुझाव और पूरा demo हिसाब'},
 {id:'social',path:'mandal.html?room=social',name:'सामाजिक चौपाल',device:'phone',mark:'♛',purpose:'Chess / cards reactions और अपने profile links'},
 {id:'feedback',path:'mandal.html?room=feedback',name:'संगत की आवाज़',device:'pager',mark:'♞',purpose:'खूबी और सुधार के सहमति वाले निजी नोट'}
];
const keys=[{id:'gyan-key',at:6,name:'ज्ञान की चाबी',task:'ज्ञान मंडल में एक पाठ पढ़ें। फिर Creator में तीन पंक्तियों में अपनी समझ लिखें।',room:'gyan'},
 {id:'seva-key',at:12,name:'सेवा की चाबी',task:'संगत दरबार में अपनी की हुई सेवा की तारीख और काम दर्ज करें। केवल वास्तविक काम का अपना रिकॉर्ड रखें।',room:'community'},
 {id:'hunar-key',at:24,name:'हुनर की चाबी',task:'अपने सीखे हुनर पर एक उपयोगी पोस्टर बनाएँ। इसे सहयोग के लिए साझा करें।',room:'poster'}];
const fresh=()=>({version:1,claims:[]});
function roomFor(path){const exact=rooms.find(r=>r.path===String(path).split('#')[0]);if(exact)return exact;let p=String(path).split(/[?#]/)[0].replace(/^\.\//,'');if(['','index.html','enter.html','world.html','kingdom.html','palace.html'].includes(p))p='maze.html';if(p==='docs/Begampura_FAQ_542_Offline_Reader.html')p='Begampura_FAQ_542_Offline_Reader.html';return rooms.find(r=>r.path===p)||rooms[0];}
function gift(room,slot){const i=rooms.findIndex(r=>r.id===room);if(i<0||!Number.isInteger(slot)||slot<0||slot>5)throw Error('Invalid gift');return {id:room+':'+slot,coin:coins[(i+slot)%coins.length],amount:5};}
function validate(v){if(!v||v.version!==1||!Array.isArray(v.claims)||v.claims.length>rooms.length*6)throw Error('संग्रह का format नहीं पढ़ा जा सका।');const claims=[];for(const id of v.claims){if(typeof id!=='string')throw Error('Invalid record');const [room,slot,...tail]=id.split(':');if(tail.length||!/^\d$/.test(slot)||gift(room,Number(slot)).id!==id||claims.includes(id))throw Error('Invalid record');claims.push(id);}return {version:1,claims};}
function collect(state,room,slot){const s=validate(state),g=gift(room,slot);if(s.claims.includes(g.id))return {state:s,gift:g,added:false};s.claims.push(g.id);return {state:s,gift:g,added:true};}
function totals(state){const result=Object.fromEntries(coins.map(c=>[c,0]));for(const id of validate(state).claims){const [r,s]=id.split(':');const g=gift(r,Number(s));result[g.coin]+=g.amount;}return result;}
function unlocked(state){return keys.filter(k=>validate(state).claims.length>=k.at);}
class Store{
 constructor(storage){this.storage=storage;this.data=fresh();this.error='';this.reload();}
 reload(){try{const raw=this.storage.getItem(KEY);this.data=raw===null?fresh():validate(JSON.parse(raw));this.error='';}catch(e){this.error='सेव संग्रह पढ़ा नहीं जा सका; पुराना रिकॉर्ड सुरक्षित है।';}return !this.error;}
 claim(room,slot){if(!this.reload())throw Error(this.error);const result=collect(this.data,room,slot);if(result.added){this.storage.setItem(KEY,JSON.stringify(result.state));this.data=result.state;}return result;}
 clear(){this.storage.removeItem(KEY);this.data=fresh();this.error='';}
}
return {KEY,coins,rooms,keys,fresh,roomFor,gift,validate,collect,totals,unlocked,Store};
});
