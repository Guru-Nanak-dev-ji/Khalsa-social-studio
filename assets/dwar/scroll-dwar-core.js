(function(root,f){const m=f();if(typeof module==='object'&&module.exports)module.exports=m;else root.KDNDwar=m;})(this,function(){'use strict';
const STAGES=5,SPOT_ID='dwar:open';
function progress(top,max){if(!(max>0))return 1;return Math.min(1,Math.max(0,top/max));}
function layer(p,i){const s=STAGES-1;return Math.min(1,Math.max(0,p*s*1.15-(i-1)));}
function award(K,state){if(progress(1,1)<1)return{state,added:0};return K.claimSpot(state,SPOT_ID);}
return{STAGES,SPOT_ID,progress,layer,award};});
