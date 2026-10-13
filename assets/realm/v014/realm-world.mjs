/* SPDX-License-Identifier: MIT. Original procedural KDN architecture; Three.js MIT. */
import * as T from './vendor/three.module.min.js';

export function createWorld(host){
 const renderer=new T.WebGLRenderer({alpha:true,antialias:false,powerPreference:'low-power'});
 renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
 renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.35;
 renderer.domElement.setAttribute('aria-hidden','true');host.append(renderer.domElement);
 const scene=new T.Scene();scene.fog=new T.FogExp2(0x08141b,.015);
 const camera=new T.PerspectiveCamera(37,1,.1,180),city=new T.Group();scene.add(city);
 const mats={gold:new T.MeshStandardMaterial({color:0xcc9b48,metalness:.82,roughness:.26}),edge:new T.MeshStandardMaterial({color:0xf5d696,metalness:.65,roughness:.32}),stone:new T.MeshStandardMaterial({color:0x25393e,metalness:.45,roughness:.55}),black:new T.MeshStandardMaterial({color:0x0c1821,metalness:.52,roughness:.29}),light:new T.MeshBasicMaterial({color:0xffd795}),water:new T.MeshStandardMaterial({color:0x143b42,metalness:.85,roughness:.17}),blue:new T.MeshBasicMaterial({color:0x80bacd,transparent:true,opacity:.42})};
 scene.add(new T.HemisphereLight(0xb9d9ef,0x443214,2.1));const sun=new T.DirectionalLight(0xffd18c,4.6);sun.position.set(-8,17,11);scene.add(sun);const rim=new T.DirectionalLight(0x9ab8ed,2.8);rim.position.set(9,8,-10);scene.add(rim);
 const pools=new Map(),instances=[],buildings=[],rings=[],geometries=new Set(),materials=new Set(Object.values(mats));
 const geos={box:new T.BoxGeometry(1,1,1),cyl:new T.CylinderGeometry(1,1,1,16),sphere:new T.SphereGeometry(1,18,12),cone:new T.ConeGeometry(1,1,12)};Object.values(geos).forEach(g=>geometries.add(g));
 const arch=new T.Shape();arch.moveTo(-.5,0);arch.lineTo(-.5,.65);arch.bezierCurveTo(-.5,.88,-.18,1,.0,1.18);arch.bezierCurveTo(.18,1,.5,.88,.5,.65);arch.lineTo(.5,0);arch.closePath();geos.arch=new T.ShapeGeometry(arch);geometries.add(geos.arch);
 function stamp(type,mat,x,y,z,sx,sy,sz=1,rotation=0){const key=type+':'+mat;if(!pools.has(key))pools.set(key,[]);pools.get(key).push({x,y,z,sx,sy,sz,rotation});}
 function box(x,y,z,w,h,d,m='stone'){stamp('box',m,x,y,z,w,h,d);}
 function disk(x,y,z,r,h,m='gold'){stamp('cyl',m,x,y,z,r,h,r);}
 function sphere(x,y,z,r,m='gold'){stamp('sphere',m,x,y,z,r,r,r);}
 function torus(radius,tube,parent,x,y,z,rx=Math.PI/2,rz=0,mat='gold'){const g=new T.TorusGeometry(radius,tube,6,90);geometries.add(g);const mesh=new T.Mesh(g,mats[mat]);mesh.position.set(x,y,z);mesh.rotation.set(rx,0,rz);parent.add(mesh);return mesh;}
 function dome(x,y,z,r){disk(x,y,z,r*1.02,.13,'edge');stamp('sphere','gold',x,y+r*.38,z,r,r*.84,r);disk(x,y+r*1.12,z,.08,.5,'edge');stamp('cone','edge',x,y+r*1.48,z,.18,.3,.18);}
 function tower(x,z,h=5,r=.32){disk(x,h/2,z,r,h);for(const y of [.35,h*.42,h*.7,h])disk(x,y,z,r*1.28,.13,'edge');disk(x,h+.2,z,r*1.36,.23,'black');dome(x,h+.35,z,r*1.4);}
 function palace(x,z,w,h,d){box(x,h/2,z,w,h,d);box(x,.14,z,w+1,.28,d+1,'black');box(x,.32,z,w+.65,.12,d+.65,'edge');box(x,h,z,w+.25,.14,d+.25,'gold');box(x,h+.15,z,w+.4,.08,d+.4,'edge');
  const count=Math.max(3,Math.floor(w/.72));for(let i=0;i<count;i++){const xx=x-w/2+(i+.5)*w/count;stamp('arch','black',xx,.42,z+d/2+.014,.52,h*.62);stamp('arch','light',xx,.56,z+d/2+.021,.23,h*.39);}
  for(let i=0;i<Math.floor(w/.35);i++)box(x-w/2+i*.35,h+.25,z+d/2,.18,.18,.18,'edge');
  for(const side of [-1,1]){box(x+side*w*.42,h*.5,z+d*.53,.14,h,.14,'gold');dome(x+side*w*.39,h+.28,z,.53);}
  dome(x,h+.25,z,w*.18);buildings.push({x,z,h});
 }
 // A miniature court on a polished circular map: no downloaded models or textures.
 disk(0,-.9,0,12,.8,'black');disk(0,-.46,0,11.7,.09,'gold');disk(0,-.38,0,11.45,.1,'black');
 for(const r of [11.2,10.95,9.5,8.6])torus(r,.024,city,0,-.27,0);
 for(let i=0;i<72;i++){const a=i*Math.PI/36;box(Math.cos(a)*10.65,-.19,Math.sin(a)*10.65,.045,.07,i%6===0?.65:.2,'edge');}
 box(0,-.1,5.4,2.5,.07,8,'water');for(const side of [-1,1]){box(side*1.38,-.04,5.4,.045,.08,8,'edge');box(side*2.6,-.13,5.3,1.8,.06,8,'black');}
 for(let i=0;i<9;i++){box(0,-.02,2+i*.7,2.4,.03,.018,'edge');for(const side of [-1,1]){disk(side*3.6,.08,2+i*.78,.28,.14,'gold');sphere(side*3.6,.55,2+i*.78,.34,'stone');}}
 palace(0,-1.5,6,2.7,3.4);dome(0,3.0,-1.5,1.7);for(const x of [-4,4])for(const z of [-3.3,.65])tower(x,z,5.2,.29);
 for(const side of [-1,1]){palace(side*6.65,.5,3.1,1.65,2);palace(side*5.4,-5,3.4,2.2,2.3);palace(side*2.3,-6.5,3,1.45,2);tower(side*8.4,2.4,3.3,.24);}
 palace(0,9,3.1,1.45,1.2);
 // Inlaid chess pieces and floating mechanisms, kept away from readable UI.
 for(const side of [-1,1]){const x=side*6,z=5.6;disk(x,.12,z,.58,.2,'edge');disk(x,.26,z,.44,.13);stamp('cone','gold',x,.8,z,.4,1.1,.4);disk(x,1.28,z,.27,.13);sphere(x,1.59,z,.31,'edge');}
 const orb=new T.Group();orb.position.set(0,7,-3);city.add(orb);rings.push(torus(2.35,.026,orb,0,0,0,.6,.3,'edge'),torus(2.7,.014,orb,0,0,0,1.2,-.4,'blue'),torus(3.15,.018,orb,0,0,0,.9,.2));
 const globe=new T.Mesh(new T.SphereGeometry(.38,16,12),mats.edge);geometries.add(globe.geometry);orb.add(globe);
 const dummy=new T.Object3D();for(const [key,list]of pools){const [type,mat]=key.split(':');const mesh=new T.InstancedMesh(geos[type],mats[mat],list.length);list.forEach((o,i)=>{dummy.position.set(o.x,o.y,o.z);dummy.scale.set(o.sx,o.sy,o.sz);dummy.rotation.set(0,o.rotation,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);});mesh.instanceMatrix.needsUpdate=true;city.add(mesh);instances.push(mesh);}
 const stars=new Float32Array(240*3);let seed=4321;const rand=()=>{seed=(seed*1664525+1013904223)>>>0;return seed/4294967296;};for(let i=0;i<240;i++){stars[i*3]=(rand()-.5)*100;stars[i*3+1]=rand()*32+7;stars[i*3+2]=(rand()-.5)*65-20;}
 const particlesGeo=new T.BufferGeometry();particlesGeo.setAttribute('position',new T.BufferAttribute(stars,3));geometries.add(particlesGeo);const particlesMat=new T.PointsMaterial({color:0xffd991,size:.045,transparent:true,opacity:.65});materials.add(particlesMat);const particles=new T.Points(particlesGeo,particlesMat);scene.add(particles);
 let mode='welcome',progress=0,paused=false,dead=false,raf=0,last=0,elapsed=0,angle=0,drag=0,down=null;
 function size(){if(dead)return;const rect=host.getBoundingClientRect(),w=Math.max(1,rect.width),h=Math.max(1,rect.height);renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();draw();}
 function setCamera(){const mobile=camera.aspect<.85,dist=mobile?37:30;let x=Math.sin(angle*.18+drag)*dist*.33,y=mobile?16:15,z=dist;
  if(mode==='tour'){const s=progress*progress*(3-2*progress);x=(1-s)*16+Math.sin(s*Math.PI)*7;y=23-s*15;z=27-s*10;city.position.y=-3*(1-Math.min(1,s*5));city.rotation.y=(1-s)*-.28;}
  else if(mode==='flight'){const s=progress*progress*(3-2*progress);x=3*(1-s);y=12-s*6;z=(mobile?34:27)-s*14;city.position.y=0;city.rotation.y=0;}
  else{city.position.y=-.15+Math.sin(elapsed*.2)*.08;city.rotation.y=0;if(mode==='gates'){y=10;z=mobile?40:31;}}
  camera.position.set(x,y,z);camera.lookAt(0,mode==='tour'?1.5:mode==='flight'?2:1.6,0);
 }
 function draw(){if(dead)return;setCamera();try{renderer.render(scene,camera);}catch(_){lost();}}
 function frame(now){raf=0;if(dead||paused||document.hidden)return;if(now-last<30){raf=requestAnimationFrame(frame);return;}const delta=Math.min(.05,Math.max(0,(now-last)/1000));last=now;elapsed+=delta;angle=elapsed*.07;orb.rotation.y=elapsed*.09;rings.forEach((r,i)=>{r.rotation.z=elapsed*(.035+i*.013);});particles.rotation.y=elapsed*.007;draw();if(!dead)raf=requestAnimationFrame(frame);}
 function setPaused(value){paused=value;cancelAnimationFrame(raf);raf=0;if(!paused&&!dead){last=performance.now();raf=requestAnimationFrame(frame);}else draw();}
 function lost(){dead=true;cancelAnimationFrame(raf);host.dataset.render='light';renderer.domElement.remove();}
 renderer.domElement.addEventListener('webglcontextlost',e=>{e.preventDefault();lost();});
 const resize=new ResizeObserver(size);resize.observe(host);
 const onDown=e=>{if(mode!=='welcome')return;down=e.clientX;};const onMove=e=>{if(down===null)return;drag+=(e.clientX-down)*.006;down=e.clientX;draw();};const onUp=()=>down=null;
 host.addEventListener('pointerdown',onDown);host.addEventListener('pointermove',onMove);host.addEventListener('pointerup',onUp);host.addEventListener('pointercancel',onUp);host.addEventListener('pointerleave',onUp);
 size();last=performance.now();raf=requestAnimationFrame(frame);
 return {resize:size,setMode(value,tone){mode=value;progress=0;sun.color.set(tone==='jade'?0xb6e6be:tone==='rose'?0xf4cba6:0xffd18c);size();},setProgress(p){progress=p;if(paused)draw();},setPaused,dispose(){dead=true;cancelAnimationFrame(raf);resize.disconnect();host.removeEventListener('pointerdown',onDown);host.removeEventListener('pointermove',onMove);host.removeEventListener('pointerup',onUp);host.removeEventListener('pointercancel',onUp);host.removeEventListener('pointerleave',onUp);for(const g of geometries)g.dispose();for(const m of materials)m.dispose();instances.forEach(m=>m.dispose());renderer.dispose();renderer.domElement.remove();}};
}
