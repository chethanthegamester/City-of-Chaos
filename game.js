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
const groundMat=mat(0x647d67), roadMat=mat(0x30383d), lineMat=mat(0xf4f1df);
const buildingMats=[0x9babb4,0xd4b69b,0x718c91,0xb8b8ad,0x8c9baf,0xc6a77c].map(c=>mat(c));
function box(w,h,d,m,x,y,z){const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.castShadow=true;o.receiveShadow=true;scene.add(o);return o;}
const ground=new THREE.Mesh(new THREE.PlaneGeometry(500,500),groundMat);ground.rotation.x=-Math.PI/2;ground.position.y=-.08;ground.receiveShadow=true;scene.add(ground);
box(500,.12,18,roadMat,0,0,0);box(18,.12,500,roadMat,0,0,0);
for(let i=-180;i<=180;i+=18){if(i===0)continue;box(500,.1,8,roadMat,0,.01,i);box(8,.1,500,roadMat,i,.01,0);}
for(let i=-180;i<=180;i+=18){box(500,.05,.16,lineMat,0,.09,i-3.3);box(.16,.05,500,lineMat,i-3.3,.09,0);}
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
const keys={};let driving=false,carSpeed=0,cameraYaw=0,pitch=.22,pointerLocked=false;
addEventListener('keydown',e=>{keys[e.code]=true;if(e.code==='KeyE')toggleVehicle();});
addEventListener('keyup',e=>keys[e.code]=false);
renderer.domElement.addEventListener('click',()=>renderer.domElement.requestPointerLock?.());
document.addEventListener('pointerlockchange',()=>pointerLocked=document.pointerLockElement===renderer.domElement);
document.addEventListener('mousemove',e=>{if(!pointerLocked)return;cameraYaw-=e.movementX*.0025;pitch=THREE.MathUtils.clamp(pitch-e.movementY*.0018,-.05,.75);});
function toggleVehicle(){if(!driving&&player.position.distanceTo(car.position)<4.2){driving=true;player.visible=false;status.textContent='Driving — WASD to steer and accelerate. Press E to exit.';}else if(driving){driving=false;player.visible=true;player.position.copy(car.position).add(new THREE.Vector3(2.2,0,0));status.textContent='On foot — explore the city.';}}
const clock=new THREE.Clock();
function update(dt){if(driving){const accel=(keys.KeyW?1:0)-(keys.KeyS?1:0);carSpeed=THREE.MathUtils.clamp((carSpeed+accel*18*dt)*Math.pow(.985,dt*60),-9,27);const steer=(keys.KeyA?1:0)-(keys.KeyD?1:0);if(Math.abs(carSpeed)>.4)car.rotation.y+=steer*1.65*dt*Math.sign(carSpeed);car.position.x+=Math.sin(car.rotation.y)*carSpeed*dt;car.position.z+=Math.cos(car.rotation.y)*carSpeed*dt;wheels.forEach(w=>w.rotation.x+=carSpeed*dt*1.5);status.textContent='DRIVING · '+Math.round(Math.abs(carSpeed)*3.6)+' km/h · Press E to exit';}else{const move=new THREE.Vector3((keys.KeyD?1:0)-(keys.KeyA?1:0),0,(keys.KeyS?1:0)-(keys.KeyW?1:0));if(move.lengthSq()){move.normalize().applyAxisAngle(new THREE.Vector3(0,1,0),cameraYaw);player.position.addScaledVector(move,(keys.ShiftLeft||keys.ShiftRight?9:5.2)*dt);player.rotation.y=Math.atan2(move.x,move.z);}status.textContent='ON FOOT · Walk to the blue car and press E to drive';}
const active=driving?car:player;active.position.x=THREE.MathUtils.clamp(active.position.x,-225,225);active.position.z=THREE.MathUtils.clamp(active.position.z,-225,225);
const target=active.position;const desired=new THREE.Vector3(target.x+Math.sin(cameraYaw)*12,target.y+5+pitch*8,target.z+Math.cos(cameraYaw)*12);camera.position.lerp(desired,1-Math.pow(.001,dt));camera.lookAt(target.x,target.y+1.1,target.z);}
function animate(){requestAnimationFrame(animate);update(Math.min(clock.getDelta(),.04));renderer.render(scene,camera);}camera.position.set(0,7,13);animate();
addEventListener('resize',()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);});
status.textContent='Walk to the blue car and press E to drive. Click the game to look around.';
