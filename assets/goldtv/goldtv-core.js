(function(r,f){typeof module==='object'?module.exports=f():r.GoldTVCore=f();})(this,function(){
const INTERVAL=3000,API='https://kdn-telegram-bot.khatrinewsnetwork.workers.dev';
function clean(items){return (Array.isArray(items)?items:[]).filter(i=>i&&typeof i.text==='string'&&i.text.trim()).map(i=>({tag:String(i.tag||'✨').slice(0,40),text:String(i.text).slice(0,160),href:safeHref(i.href)}));}
function safeHref(h){h=String(h||'');return /^(\.\/[\w\-./#?=&]*|https:\/\/[\w\-.]+\/[^\s"'<>]*)$/.test(h)?h:'./goldtv.html';}
function fromChannels(chs){return (Array.isArray(chs)?chs:[]).slice(0,10).map(c=>({tag:'📺 नया News Channel',text:String(c.name||c.title||c.slug||'').slice(0,80),href:'./news-channels.html'})).filter(i=>i.text);}
function granthItem(q){if(!q||!q.short||!q.source)return null;let t='“'+q.short+'” — '+(q.meaning||'')+' ('+q.source+')';if(t.length>160)t='“'+q.short+'” — '+q.source+(q.speaker?' · '+q.speaker:'');return{tag:'📜 ग्रंथ से',text:t.slice(0,160),href:'./saathi.html'};}
function quizItem(q){if(!q||!q.short||!q.source)return null;return{tag:'❓ क्या आप जानते हैं?',text:('“'+q.short+'” किसने कहा? → '+(q.speaker||q.book)+' · '+q.source).slice(0,160),href:'./saathi.html'};}
function build(feed,granth,n){feed=clean(feed);const g=(Array.isArray(granth)?granth:[]).filter(q=>q&&q.short&&q.source);if(!g.length)return feed;n=Math.max(0,n|0);const a=granthItem(g[(n*2)%g.length]),b=quizItem(g[(n*2+1)%g.length]),out=feed.slice(),mid=Math.ceil(out.length/2);out.splice(mid,0,a);out.push(b);return out.filter(Boolean);}
function next(i,n){return n?(i+1)%n:0;}
return{INTERVAL,API,clean,safeHref,fromChannels,next,granthItem,quizItem,build};});
