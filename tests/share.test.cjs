const fs=require("fs"),assert=require("assert");
const h=fs.readFileSync(__dirname+"/../studio.html","utf8"),j=fs.readFileSync(__dirname+"/../assets/share.js","utf8");
assert(h.includes('id="kdn-share"')&&h.includes("assets/share.js"));
for(const s of["https://wa.me/?text=","facebook.com/sharer/sharer.php?u=","x.com/intent/post?text=","t.me/share/url?url=","instagram.com","navigator.share","One click and change your life","ਕਿਰਤ ਕਰੋ"])assert(j.includes(s),s);
assert(!/khanda|☬/i.test(j+fs.readFileSync(__dirname+"/../assets/share.css","utf8")));
console.log("share ok");
