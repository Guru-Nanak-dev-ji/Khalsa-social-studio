(function(){'use strict';
window.KDNLocal={load:function(C){try{return C.validate(JSON.parse(localStorage.getItem(C.KEY)))}catch(e){return C.fresh()}},save:function(C,s){try{localStorage.setItem(C.KEY,JSON.stringify(s))}catch(e){}},
 koins:function(id){var K=window.KDNKoins;if(!K)return 0;try{var s=K.validate(JSON.parse(localStorage.getItem(K.KEY)||'null'));var r=K.claimSpot(s,id);localStorage.setItem(K.KEY,JSON.stringify(r.state));return r.added}catch(e){return 0}},
 el:function(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!=null)e.textContent=x;return e},
 copy:function(t,btn){var done=function(){if(btn){var o=btn.textContent;btn.textContent='✅ लिंक copy हुआ';setTimeout(function(){btn.textContent=o},1800)}};if(navigator.share){navigator.share({url:t}).catch(function(){})}if(navigator.clipboard)navigator.clipboard.writeText(t).then(done,done);else done()}};
})();
