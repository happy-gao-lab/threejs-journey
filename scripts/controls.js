import * as THREE from "three";
import { FlyControls } from "three/addons/controls/FlyControls.js";
import { FirstPersonControls } from "three/addons/controls/FirstPersonControls.js";
import { PointerLockControls } from "three/addons/controls/PointerLockControls.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { TrackballControls } from "three/addons/controls/TrackballControls.js";
import { TransformControls } from "three/addons/controls/TransformControls.js";
import { DragControls } from "three/addons/controls/DragControls.js";

// https://threejs.org/docs/#FlyControls
// https://threejs.org/docs/#FirstPersonControls
// https://threejs.org/docs/#PointerLockControls
// https://threejs.org/docs/#OrbitControls
// https://threejs.org/docs/#TrackballControls
// https://threejs.org/docs/#TransformControls
// https://threejs.org/docs/#DragControls

// https://threejs.org/docs/index.html#Euler
// https://threejs.org/docs/#Vector3
// https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API

// Constants
const canvas = document.getElementById("webgl");

const fullRotation = Math.PI * 2;

const distance = 3;

const sizes = {
  width: 800,
  height: 600,
};

// const cursor = {
//   x: 0,
//   y: 0,
// };

// window.addEventListener("mousemove", (e) => {
//   // Scale down values closer to 1 and make them positive and negative
//   cursor.x = e.clientX / sizes.width - 0.5;
//   cursor.y = -(e.clientY / sizes.height - 0.5);
// });

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(0, 0, 3);

// Scene
const scene = new THREE.Scene();

scene.add(mesh);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

const timer = new THREE.Timer();

// const tick = () => {
//   timer.update();

//   const elapsed = timer.getElapsed();

//     // Update camera
//     camera.position.x = Math.sin(cursor.x * fullRotation) * distance;
//     camera.position.z = Math.cos(cursor.x * fullRotation) * distance;
//     camera.position.y = cursor.y * distance;

//     camera.lookAt(mesh.position);

//   renderer.render(scene, camera);

//   window.requestAnimationFrame(tick);
// };

// tick();

//! FlyControls
// const flyControls = new FlyControls(camera, canvas);

// flyControls.movementSpeed = 2;
// flyControls.rollSpeed = 0.5;

// const tick = () => {
//   timer.update();

//   const delta = timer.getDelta();

//   flyControls.update(delta);

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// tick();

//! FirstPersonControls
// const firstPersonControls = new FirstPersonControls(
//   camera,
//   canvas,
// );

// const tick = () => {
//   timer.update();

//   const delta = timer.getDelta();

//   firstPersonControls.update(delta);

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// tick();

//! PointerLockControls is a perfect choice for first person 3D games.
const controls = new PointerLockControls(camera, canvas);

// blocker/instructions are created dynamically instead of hardcoded in index.html,
// since their visibility needs to be toggled from this script on lock/unlock
const blocker = document.createElement("div");
blocker.id = "blocker";
blocker.style.maxWidth = "800px";
blocker.style.maxHeight = "600px";
blocker.style.margin = "10px 10px 0";
blocker.style.position = "fixed";
blocker.style.top = "0px";
blocker.style.left = "0px";
blocker.style.zIndex = "9999";

const instructions = document.createElement("div");
instructions.id = "instructions";

const instructionsText = document.createElement("p");
instructionsText.textContent = "Click to play";
instructions.appendChild(instructionsText);

blocker.appendChild(instructions);
document.body.appendChild(blocker);

instructions.addEventListener("click", () => {
  controls.lock();
});

controls.addEventListener("lock", () => {
  instructions.style.display = "none";
  blocker.style.display = "none";
});

controls.addEventListener("unlock", () => {
  blocker.style.display = "block";
  instructions.style.display = "";
});

const tick = () => {
  timer.update();

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();

//! OrbitControls - allow the camera to orbit around a target.
// const controls = new OrbitControls(camera, canvas);
// // controls.update() must be called after any manual changes to the camera's transform
// camera.position.set(0, 0, 3);
// controls.update();

// const tick = () => {
//   timer.update();

//   // required if controls.enableDamping or controls.autoRotate are set to true
//   controls.update();
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// tick();

//! TrackballControls - is similar to OrbitControls. However, it does not maintain a constant camera up vector. That means if the camera orbits over the “north” and “south” poles, it does not flip to stay "right side up".
// const controls = new TrackballControls(camera, canvas);

// // Unlike OrbitControls, update() here takes no arguments and must be called every
// // frame unconditionally - there is no separate damping/autoRotate flag to check
// const tick = () => {
//   timer.update();

//   controls.update();
//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// tick();

//! TransformControls - can be used to transform objects in 3D space by adapting a similar interaction model of DCC tools like Blender. Unlike other controls, it is not intended to transform the scene's camera.
// const controls = new TransformControls(camera, canvas);
// controls.attach(mesh);

// controls itself is not an Object3D (same as StereoCamera) - the visual gizmo
// returned by getHelper() is what actually needs to be added to the scene
// scene.add(controls.getHelper());

// const tick = () => {
//   timer.update();

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// tick();

//! DragControls - can be used to provide a drag'n'drop interaction.
// // No update() call is needed - it moves the dragged object directly through its own
// // internal pointer event listeners. Highlighting the dragged object via
// // material.emissive would require a material that supports it (e.g. MeshStandardMaterial),
// // not the MeshBasicMaterial used here.
// new DragControls([mesh], camera, canvas);

// const tick = () => {
//   timer.update();

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// tick();
