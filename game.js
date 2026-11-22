import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const mount = document.getElementById('game-container');
const status = document.getElementById('status');
if (!mount) throw new Error('Game container was not found.');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9b6b91);
scene.fog = new THREE.Fog(0x665c78, 95, 360);
const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xd8c9e8, 0x303641, 1.45));
const sun = new THREE.DirectionalLight(0xffb58e, 1.35);
sun.position.set(-35, 65, 30); sun.castShadow = true; scene.add(sun);
const cityGlow = new THREE.PointLight(0xff6e9c, 38, 180); cityGlow.position.set(0, 32, -145); scene.add(cityGlow);
const mat = (color, roughness=.85) => new THREE.MeshStandardMaterial({color, roughness});
const groundMat=mat(0x465d55), roadMat=mat(0x30383d), lineMat=mat(0xe8e3d6), curbMat=mat(0x8d9295);
const buildingMats=[0x596875,0x6e7182,0x827486,0x526a70,0x777b86,0x8a7778].map(c=>mat(c));
function box(w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
box(500,.12,18,roadMat,0,0,0);box(18,.12,500,roadMat,0,0,0);
for(let i=-180;i<=180;i+=18){if(i===0)continue;box(500,.1,8,roadMat,0,.01,i);box(8,.1,500,roadMat,i,.01,0);}
// Raised concrete curbs and dashed lane dividers: an early road-detail pass.
for(let i=-180;i<=180;i+=18){
  const roadWidth=i===0?18:8;
  for(const side of [-1,1]){
    box(500,.18,.42,curbMat,0,.08,i+side*(roadWidth/2+.22));
    box(.42,.18,500,curbMat,i+side*(roadWidth/2+.22),.08,0);
  }
}
function dash(x,z,alongX){const mark=box(alongX?3.2:.16,.035,alongX?.16:3.2,lineMat,x,.105,z);mark.castShadow=false;}
for(let z=-240;z<=240;z+=9){if(Math.abs(z%18)<4)continue;dash(0,z,true);}
for(let x=-240;x<=240;x+=9){if(Math.abs(x%18)<4)continue;dash(x,0,false);}
for(let road=-180;road<=180;road+=18){if(road===0)continue;
  for(let z=-240;z<=240;z+=9){if(Math.abs(z%18)<4)continue;dash(road,z,false);}
  for(let x=-240;x<=240;x+=9){if(Math.abs(x%18)<4)continue;dash(x,road,true);}
}
for(let x=-150;x<=150;x+=36)for(let z=-150;z<=150;z+=36){if(Math.abs(x)<20||Math.abs(z)<20)continue;const w=19+Math.random()*8,d=19+Math.random()*8,h=9+Math.random()*28;box(w,h,d,buildingMats[Math.floor(Math.random()*buildingMats.length)],x,h/2,z);}

// Waterfront skyline: an original dusk-city district inspired by the supplied reference.
const waterMat = new THREE.MeshStandardMaterial({color:0x263d56, roughness:.28, metalness:.35});
const water = new THREE.Mesh(new THREE.PlaneGeometry(520,105),waterMat);
water.rotation.x=-Math.PI/2; water.position.set(0,-.02,-225); scene.add(water);
const skylineMats=[0x3b4c62,0x48566d,0x354b5b,0x65566b,0x4c5b68].map(c=>mat(c,.65));
const windowMats=[0xffd58a,0x9de8ff,0xff8ac4,0xe8f0ff].map(c=>new THREE.MeshStandardMaterial({color:c,emissive:c,emissiveIntensity:1.25}));
for(let i=0;i<24;i++){
  const x=-150+i*13+Math.random()*5, w=8+Math.random()*7, d=10+Math.random()*9, h=32+Math.random()*65;
  const tower=box(w,h,d,skylineMats[i%skylineMats.length],x,h/2,-165-Math.random()*18);
  tower.material=skylineMats[i%skylineMats.length];
  const rows=Math.floor(h/4.5), cols=Math.max(2,Math.floor(w/2.2));
  for(let row=1;row<rows;row++)for(let col=0;col<cols;col++){
    if(Math.random()<.32)continue;
    const wx=x-w/2+.9+col*(w-1.8)/cols, wy=row*4.1;
    const win=new THREE.Mesh(new THREE.BoxGeometry(.75,1.35,.08),windowMats[Math.floor(Math.random()*windowMats.length)]);
    win.position.set(wx,wy,-165-d/2-.06); scene.add(win);
  }
}
// Low waterfront convention centre and glowing roof rim.
const arena=box(42,9,27,mat(0x343e55),-34,4.5,-142);
const arenaRoof=box(44,.65,29,mat(0x9a557e),-34,9.2,-142);
const arenaGlow=new THREE.PointLight(0xff4eae,55,75); arenaGlow.position.set(-34,12,-142); scene.add(arenaGlow);
// Distant bridge across the water.
box(270,1.2,5,mat(0x7d8792),0,7,-205);
for(let x=-125;x<=125;x+=18)box(.45,7,.45,mat(0x9ca8b1),x,3.5,-205);
// Ferris wheel silhouette on the waterfront.
const wheelMat2=new THREE.MeshStandardMaterial({color:0x9ca9b7,metalness:.6,roughness:.35});
const wheel=new THREE.Mesh(new THREE.TorusGeometry(15,.42,8,64),wheelMat2);
wheel.position.set(-112,19,-185); scene.add(wheel);
for(let a=0;a<Math.PI*2;a+=Math.PI/8){
  const spoke=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,15,6),wheelMat2);
  spoke.position.set(-112+Math.cos(a)*7.5,19+Math.sin(a)*7.5,-185);
  spoke.rotation.z=-a; scene.add(spoke);
}
for(let x=-160;x<=160;x+=24){
  const lamp=new THREE.PointLight(0xffa66d,9,24); lamp.position.set(x,5,-135); scene.add(lamp);
}

const trunkMat=mat(0x493c3b),leafMat=mat(0x24634c);
for(let x=-160;x<=160;x+=18){if(Math.abs(x)<16)continue;for(const z of [-12,12]){const t=new THREE.Mesh(new THREE.CylinderGeometry(.22,.3,2.2,7),trunkMat);t.position.set(x,1.05,z);scene.add(t);const c=new THREE.Mesh(new THREE.SphereGeometry(1.35,9,7),leafMat);c.position.set(x,2.8,z);scene.add(c);}}
const player=new THREE.Group();
const body=new THREE.Mesh(new THREE.CapsuleGeometry(.48,.9,4,8),mat(0x1d3448));body.position.y=1;player.add(body);
const head=new THREE.Mesh(new THREE.SphereGeometry(.32,12,10),mat(0xe0ad82));head.position.y=1.85;player.add(head);player.position.set(3,0,5);scene.add(player);
const car=new THREE.Group();
const carBody=new THREE.Mesh(new THREE.BoxGeometry(2.25,.72,4.1),mat(0x168bd0,.4));carBody.position.y=.72;car.add(carBody);
const cabin=new THREE.Mesh(new THREE.BoxGeometry(1.65,.78,1.95),mat(0x263d4c,.25));cabin.position.set(0,1.42,-.15);car.add(cabin);
const wheelMat=mat(0x15191c),wheels=[];
for(const x of [-1.08,1.08])for(const z of [-1.35,1.35]){const w=new THREE.Mesh(new THREE.CylinderGeometry(.43,.43,.28,16),wheelMat);w.rotation.z=Math.PI/2;w.position.set(x,.42,z);car.add(w);wheels.push(w);}
car.position.set(7,0,0);scene.add(car);
const keys=Object.create(null);let driving=false,carSpeed=0,cameraYaw=0,pitch=.22,pointerLocked=false;
function setKey(e,value){const code=e.code||'';const key=(e.key||'').toLowerCase();if(['ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Space'].includes(code))e.preventDefault();if(code)keys[code]=value;if(key)keys[key]=value;}
addEventListener('keydown',e=>{setKey(e,true);if((e.code==='KeyE'||e.key?.toLowerCase()==='e')&&!e.repeat)toggleVehicle();},{passive:false});
addEventListener('keyup',e=>setKey(e,false),{passive:false});
addEventListener('blur',()=>{for(const k of Object.keys(keys))keys[k]=false;});
const pressed=(...codes)=>codes.some(code=>keys[code]||keys[code.toLowerCase()]);
renderer.domElement.addEventListener('click',()=>renderer.domElement.requestPointerLock?.());
document.addEventListener('pointerlockchange',()=>pointerLocked=document.pointerLockElement===renderer.domElement);
document.addEventListener('mousemove',e=>{if(!pointerLocked)return;cameraYaw-=e.movementX*.0025;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.0018,-.05,.75);});
function toggleVehicle(){if(!driving&&player.position.distanceTo(car.position)<4.2){driving=true;player.visible=false;status.textContent='Driving — WASD to steer and accelerate. Press E to exit.';}else if(driving){driving=false;player.visible=true;player.position.copy(car.position).add(new THREE.Vector3(2.2,0,0));status.textContent='On foot — explore the city.';}}
const clock=new THREE.Clock();
const walkVelocity=new THREE.Vector3();let verticalVelocity=0,grounded=true;
function update(dt){if(driving){const accel=(pressed('KeyW','ArrowUp')?1:0)-(pressed('KeyS','ArrowDown')?1:0);carSpeed=THREE.MathUtils.clamp((carSpeed+accel*18*dt)*Math.pow(.985,dt*60),-9,27);const steer=(pressed('KeyA','ArrowLeft')?1:0)-(pressed('KeyD','ArrowRight')?1:0);if(Math.abs(carSpeed)>.4)car.rotation.y+=steer*1.65*dt;car.position.x-=Math.sin(car.rotation.y)*carSpeed*dt;car.position.z-=Math.cos(car.rotation.y)*carSpeed*dt;wheels.forEach(w=>w.rotation.x+=carSpeed*dt*1.5);status.textContent='DRIVING · '+Math.round(Math.abs(carSpeed)*3.6)+' km/h · Press E to exit';}else{
const forward=(pressed('KeyW','ArrowUp','w','arrowup')?1:0)-(pressed('KeyS','ArrowDown','s','arrowdown')?1:0);
const sideways=(pressed('KeyD','ArrowRight','d','arrowright')?1:0)-(pressed('KeyA','ArrowLeft','a','arrowleft')?1:0);
const input=new THREE.Vector3(sideways,0,forward);if(input.lengthSq()>1)input.normalize();
const desiredVelocity=new THREE.Vector3(input.x*Math.cos(cameraYaw)-input.z*Math.sin(cameraYaw),0,-input.z*Math.cos(cameraYaw)-input.x*Math.sin(cameraYaw)).multiplyScalar(pressed('ShiftLeft','ShiftRight','shift')?8.2:4.6);
walkVelocity.lerp(desiredVelocity,1-Math.exp(-10*dt));player.position.addScaledVector(walkVelocity,dt);
if(walkVelocity.lengthSq()>.05)player.rotation.y=Math.atan2(-walkVelocity.x,-walkVelocity.z);
if(pressed('Space',' ')&&grounded){verticalVelocity=6.2;grounded=false;}
verticalVelocity-=18*dt;player.position.y+=verticalVelocity*dt;
if(player.position.y<=0){player.position.y=0;verticalVelocity=0;grounded=true;}
status.textContent='ON FOOT · Walk to the blue car and press E to drive';
}
const active=driving?car:player;active.position.x=THREE.MathUtils.clamp(active.position.x,-225,225);active.position.z=THREE.MathUtils.clamp(active.position.z,-225,225);
const target=active.position;const desired=new THREE.Vector3(target.x+Math.sin(cameraYaw)*12,target.y+5+pitch*8,target.z+Math.cos(cameraYaw)*12);camera.position.lerp(desired,1-Math.pow(.001,dt));camera.lookAt(target.x,target.y+1.1,target.z);}
function animate(){requestAnimationFrame(animate);update(Math.min(clock.getDelta(),.04));renderer.render(scene,camera);}camera.position.set(0,7,13);animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
status.textContent='Walk to the blue car and press E to drive. Click the game to look around.';
