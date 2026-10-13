const test=require('node:test'),assert=require('node:assert'),fs=require('fs'),path=require('path');const R=f=>fs.readFileSync(path.join(__dirname,'..',f),'utf8');
test('3D diorama page: css 3d, drag, reduced motion, no libs, no Khanda, linked, cached',()=>{const h=R('takht3d.html'),js=R('assets/takht3d/takht3d.js'),css=R('assets/takht3d/takht3d.css');
 assert.ok(h.includes('lang="hi"')&&h.includes('hindi-fonts.css')&&h.includes('assets/jaan.js'));assert.ok(css.includes('preserve-3d')&&css.includes('perspective')&&css.includes('prefers-reduced-motion'));
 assert.ok(js.includes('pointermove')&&js.includes('prefers-reduced-motion'));assert.ok(!/☬|khanda|three|innerHTML|fetch\(|<script src="http/i.test(h+js+css));
 assert.ok(R('takht.html').includes('./takht3d.html'));const sw=R('sw.js');assert.match(sw,/const CACHE=PREFIX\+'v0\.(5[7-9]|[6-9]\d)\./);assert.ok(sw.includes('./takht3d.html')&&sw.includes('./assets/takht3d/takht3d.js')&&sw.includes('./assets/takht3d/takht3d.css'));});
