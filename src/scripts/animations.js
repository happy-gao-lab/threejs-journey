import * as THREE from "three";
import gsap from "gsap";

// https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
// https://gsap.com/
// https://threejs.org/docs/#Timer
// https://threejs.org/docs/#Object3D

// Constants
const sizes = {
  width: 800,
  height: 600,
};

const canvas = document.getElementById("webgl");

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
// renderer.render(scene, camera);

// Animation
// Timer must be updated every frame (timer.update()) before getDelta()/getElapsed() return real values
const timer = new THREE.Timer();

// Alternative approach: drive the circular motion through GSAP instead of the manual sin/cos below.
// A plain object holds the angle since GSAP needs a property on an object to tween.
// const angle = { value: 0 };

// GSAP tweens angle.value from 0 to a full circle (2*PI) on an infinite loop (repeat: -1),
// linearly (ease: "none"), and onUpdate recalculates the position from the current angle on every tick.
// gsap.to(angle, {
//   value: Math.PI * 2,
//   duration: 2,
//   repeat: -1,
//   ease: "none",
//   onUpdate: () => {
//     mesh.position.x = Math.sin(angle.value);
//     mesh.position.y = Math.cos(angle.value);
//   },
// });

// Rotation can also be handed off to GSAP directly (one full revolution per second, looping forever),
// as an alternative to setting mesh.rotation.y from elapsed time below.
// gsap.to(mesh.rotation, {
//   y: Math.PI * 2,
//   duration: 1,
//   repeat: -1,
//   ease: "none",
// });

const tick = () => {
  timer.update();

  // getDelta() would return the time since the previous frame (unused here)
  //   const delta = timer.getDelta();
  // getElapsed() returns the total time since the timer started
  const elapsed = timer.getElapsed();

  // Move the mesh along a circular path based on elapsed time
  mesh.position.x = Math.sin(elapsed);
  mesh.position.y = Math.cos(elapsed);
  mesh.rotation.y = elapsed * Math.PI * 2; // One revolution per second

  // The scene must be re-rendered every frame to see any changes, GSAP included
  renderer.render(scene, camera);

  // Run callback on the next frame
  window.requestAnimationFrame(tick);
};

tick();
