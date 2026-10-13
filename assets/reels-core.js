'use strict';
(function(root){
// Pure helpers for KDN Reel Studio (no DOM) so they can be tested in Node.
const W=1080,H=1920;
const TAG_KEY='kdn-reel-hashtags-v1';
const DEFAULT_SETS=[
  {id:'kdn',name:'👑 KDN मूल',tags:'#KhalsaDigitalWorld #KDN #KhalsaKonnect #KNNNews #KiratKaro #VandChhako #NaamJapo #BookBarAudiobook #GameOfTakhats'},
  {id:'hi',name:'हिंदी',tags:'#हिंदी #सच्चीबात #गुरुनानक #सरबत_दा_भला #KDNहिंदी'},
  {id:'pa',name:'ਪੰਜਾਬੀ',tags:'#ਪੰਜਾਬੀ #ਕਿਰਤ_ਕਰੋ #ਵੰਡ_ਛਕੋ #ਸਰਬੱਤ_ਦਾ_ਭਲਾ #PunjabiReels'},
  {id:'en',name:'English',tags:'#Sikh #Punjab #SewaDaily #TruthMatters #ReelsIndia'},
  {id:'game',name:'♞ शतरंज·ताश',tags:'#Shatranj #ChessReels #TaashKiBaazi #GameOfTakhats #KDNGames'}
];
const TEMPLATES=['mehrab','shatranj','taash'];
function splitLines(text,max=12){return String(text||'').replace(/\r\n?/g,'\n').split('\n').map(s=>s.trim()).filter(Boolean).slice(0,max).map(s=>s.slice(0,140));}
// Which line is on screen at time t (seconds) and how far into its scene (0..1).
function sceneAt(t,count,per){if(!count||per<=0)return{index:-1,p:0,done:true};const i=Math.floor(t/per);if(i>=count)return{index:count-1,p:1,done:true};return{index:i,p:(t-i*per)/per,done:false};}
function ease(x){x=Math.max(0,Math.min(1,x));return x<.5?4*x*x*x:1-Math.pow(-2*x+2,3)/2;}
// Wrap text to max chars per row (canvas measure is injected; fallback by char count).
function wrap(text,maxWidth,measure){measure=measure||(s=>s.length);const words=String(text).split(/\s+/).filter(Boolean),rows=[];let cur='';
  for(const w of words){const t=cur?cur+' '+w:w;if(measure(t)>maxWidth&&cur){rows.push(cur);cur=w;}else cur=t;}if(cur)rows.push(cur);return rows;}
function pickMime(isSupported){const list=['video/mp4;codecs=avc1,mp4a','video/mp4','video/webm;codecs=vp9,opus','video/webm;codecs=vp8,opus','video/webm'];for(const m of list){try{if(isSupported(m))return m;}catch{}}return '';}
function extFor(mime){return /mp4/.test(mime)?'mp4':'webm';}
function normTags(s){return Array.from(new Set(String(s||'').split(/[\s,]+/).filter(Boolean).map(t=>t.startsWith('#')?t:'#'+t).map(t=>t.slice(0,60)))).join(' ');}
function loadSets(storage){try{const v=JSON.parse(storage.getItem(TAG_KEY)||'null');if(Array.isArray(v)&&v.every(x=>x&&typeof x.id==='string'&&typeof x.name==='string'&&typeof x.tags==='string'))return v;}catch{}return DEFAULT_SETS.map(x=>({...x}));}
function saveSets(storage,sets){storage.setItem(TAG_KEY,JSON.stringify(sets.map(x=>({id:x.id,name:x.name.slice(0,40),tags:normTags(x.tags)}))));}
function caption(text,tagStrings){const tags=normTags(tagStrings.join(' '));return [String(text||'').trim(),tags].filter(Boolean).join('\n\n');}
// Read Creator drafts (kdn-news-social-creator-v1) without modifying them.
function creatorDrafts(storage){try{const d=JSON.parse(storage.getItem('kdn-news-social-creator-v1')||'null');if(!d||!Array.isArray(d.drafts))return[];
  return d.drafts.filter(x=>x&&typeof x.body==='string').map(x=>({id:String(x.id),heading:String(x.heading||''),text:[x.heading,x.body].filter(Boolean).join('\n'),language:x.language||'hi'})).sort((a,b)=>0);}catch{return[];}}
const api={W,H,TAG_KEY,DEFAULT_SETS,TEMPLATES,splitLines,sceneAt,ease,wrap,pickMime,extFor,normTags,loadSets,saveSets,caption,creatorDrafts};
if(typeof module!=='undefined')module.exports=api;else root.ReelsCore=api;
})(this);
