(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNWhiteMirror=m;})(this,function(){'use strict';
// 🤍🪞 White Mirror badge — सिर्फ़ इसी phone का localStorage. Game koins only, असली पैसा नहीं.
const KEY='kdn-whitemirror-v1',BADGE='सफ़ेद शीशा';
function fresh(){return{v:1,badge:false};}
function validate(s){return s&&s.v===1?{v:1,badge:s.badge===true}:fresh();}
function finish(s){s=validate(s);return{state:{v:1,badge:true},badgeNew:!s.badge};}
return{KEY,BADGE,fresh,validate,finish};});
