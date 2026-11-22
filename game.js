import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const mount = document.getElementById('game-container');
const status = document.getElementById('status');
if (!mount) throw new Error('Game container was not found.');

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x9ac4d7);
scene.fog = new THREE.Fog(0x9ac4d7, 65, 250);
const camera = new THREE.PerspectiveCamera(68, innerWidth / innerHeight, 0.1, 500);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(innerWidth, innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
mount.appendChild(renderer.domElement);

scene.add(new THREE.HemisphereLight(0xd9efff, 0x46533f, 2));
const sun = new THREE.DirectionalLight(0xfff0d5, 2);
sun.position.set(-35, 65, 30); sun.castShadow = true; scene.add(sun);
const mat = (color, roughness=.85) => new THREE.MeshStandardMaterial({color, roughness});
const groundMat=mat(0x647d67), roadMat=mat(0x30383d), lineMat=mat(0xf4f1df), centreLineMat=mat(0xe5c65b), curbMat=mat(0xb8b9ad), sidewalkMat=mat(0x788477);
const buildingMats=[0x9babb4,0xd4b69b,0x718c91,0xb8b8ad,0x8c9baf,0xc6a77c].map(c=>mat(c));
function box(w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
// Clean city grid: roads run through the gaps between building blocks.
const roadCoords=[];
for(let n=-5;n<=4;n++)roadCoords.push(18+n*36);
roadCoords.push(0);
const roadWidthAt=c=>c===0?20:14;
for(const c of roadCoords){
  const width=roadWidthAt(c);
  // Main asphalt strips.
  box(width,.12,500,roadMat,c,0,0);
  box(500,.12,width,roadMat,0,0,c);
  // Sidewalk strips sit outside each road edge.
  for(const side of [-1,1]){
    const offset=width/2+1.35;
    box(500,.16,2.7,sidewalkMat,0,.02,c+side*offset);
    box(2.7,.16,500,sidewalkMat,c+side*offset,.02,0);
  }
}
// Curbs are split into block-length pieces so they don't cross intersections.
for(const c of roadCoords){
  const width=roadWidthAt(c), edge=width/2+0.08;
  for(let segment=-7;segment<=7;segment++){
    const mid=segment*36+18;
    for(const side of [-1,1]){
      box(36,.22,.34,curbMat,mid,.12,c+side*edge);
      box(.34,.22,36,curbMat,c+side*edge,.12,mid);
    }
  }
}
// Road markings: paired white edge lines and a dashed yellow centre line.
// Markings stop before junctions, leaving intersections visually open.
function roadMark(w,h,d,m,x,z){const o=box(w,.035,d,m,x,.09,z);o.castShadow=false;o.receiveShadow=false;}
for(const c of roadCoords){
  const width=roadWidthAt(c);
  for(const side of [-1,1]){
    const offset=width/2-1.05;
    roadMark(.18,0,500,lineMat,c+side*offset,0);
    roadMark(500,0,.18,lineMat,0,c+side*offset);
  }
  for(let p=-240;p<=240;p+=12){
    if(roadCoords.some(other=>Math.abs(p-other)<11))continue;
    roadMark(.22,0,5,centreLineMat,c,p);
    roadMark(5,0,.22,centreLineMat,p,c);
  }
}
// Simple zebra crossings at the main junction, aligned to the road edges.
for(const offset of [-7,-5,-3,-1,1,3,5,7]){
  roadMark(1.2,0,5,lineMat,offset,11);
  roadMark(1.2,0,5,lineMat,offset,-11);
  roadMark(5,0,1.2,lineMat,11,offset);
  roadMark(5,0,1.2,lineMat,-11,offset);
}
for(let x=-150;x<=150;x+=36)for(let z=-150;z<=150;z+=36){if(Math.abs(x)<20||Math.abs(z)<20)continue;const w=19+Math.random()*8,d=19+Math.random()*8,h=9+Math.random()*28;box(w,h,d,buildingMats[Math.floor(Math.random()*buildingMats.length)],x,h/2,z);}

const trunkMat=mat(0x6b4a31),leafMat=mat(0x347b50);
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
