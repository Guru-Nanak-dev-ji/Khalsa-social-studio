(function(r,f){typeof module==='object'?module.exports=f():r.GoldTVCore=f();})(this,function(){
const INTERVAL=3000,API='https://kdn-telegram-bot.khatrinewsnetwork.workers.dev';
function clean(items){return (Array.isArray(items)?items:[]).filter(i=>i&&typeof i.text==='string'&&i.text.trim()).map(i=>({tag:String(i.tag||'✨').slice(0,40),text:String(i.text).slice(0,160),href:safeHref(i.href)}));}
function safeHref(h){h=String(h||'');return /^(\.\/[\w\-./#?=&]*|https:\/\/[\w\-.]+\/[^\s"'<>]*)$/.test(h)?h:'./goldtv.html';}
function fromChannels(chs){return (Array.isArray(chs)?chs:[]).slice(0,10).map(c=>({tag:'📺 नया News Channel',text:String(c.name||c.title||c.slug||'').slice(0,80),href:'./news-channels.html'})).filter(i=>i.text);}
function next(i,n){return n?(i+1)%n:0;}
return{INTERVAL,API,clean,safeHref,fromChannels,next};});
