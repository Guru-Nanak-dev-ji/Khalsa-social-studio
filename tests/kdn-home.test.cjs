const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path');
const ROOT=path.join(__dirname,'..'),R=f=>fs.readFileSync(path.join(ROOT,f),'utf8');
test('every root page has a static KDN One home link + shared css',()=>{
 assert.ok(fs.existsSync(path.join(ROOT,'assets/home/kdn-home.css')));
 const pages=fs.readdirSync(ROOT).filter(f=>f.endsWith('.html'));assert.ok(pages.length>=130);
 for(const f of pages){const h=R(f);
  assert.match(h,/<a class="kdn-home" href="\.\/index\.html" aria-label="[^"]+"[^>]*>🏠/,'missing KDN One link: '+f);
  assert.ok(h.includes('href="./assets/home/kdn-home.css"'),'missing kdn-home.css: '+f);
  assert.equal((h.match(/class="kdn-home"/g)||[]).length,1,'duplicate link: '+f);}});
