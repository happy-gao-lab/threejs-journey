import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Constants
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const canvas = document.getElementById("webgl");

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.outline = "none";

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(0, 0, 3);

// Orbit controls
const controls = new OrbitControls(camera, canvas);

// Scene
const scene = new THREE.Scene();

scene.add(camera);

// Particles
// Simple approach: a built-in geometry (e.g. sphere) sampled as points instead of a
// solid mesh - every vertex of the shape becomes one particle
// const particlesG = new THREE.SphereGeometry(1, 32, 32);
// const particlesM = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });
// const particles = new THREE.Points(particlesG, particlesM);

// scene.add(particles);

// Custom approach: a raw BufferGeometry with manually generated positions/colors,
// giving full control over how many particles there are and where each one goes
const count = 5000;

const particlesG = new THREE.BufferGeometry();

// 3 values per particle (x, y, z for position; r, g, b for color)
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
  colors[i] = Math.random();
}

// itemSize: 3 tells Three.js to group every 3 consecutive numbers into one vertex
particlesG.setAttribute("position", new THREE.BufferAttribute(positions, 3));
particlesG.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particlesM = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particlesG, particlesM);

scene.add(particles);

// Overridden below by vertexColors instead - color would apply a single flat tint
// particlesM.color = new THREE.Color(0xff88cc);

const textureLoader = new THREE.TextureLoader();

const particleTexture = textureLoader.load("./textures/particles/2.png");

particlesM.transparent = true;
particlesM.alphaMap = particleTexture;
// alphaTest discards fully-transparent pixels below this threshold instead of
// blending them - avoids the dark square artifact where overlapping particles'
// transparent corners darken each other, at some performance cost
// particlesM.alphaTest = 0.001;

// Particles could be visible despite object is in front of them
// particlesM.depthTest = false;

// Without this, a particle's transparent pixels still write to the depth buffer,
// which can make particles behind it wrongly appear hidden
particlesM.depthWrite = false;
// AdditiveBlending makes overlapping particles' colors add up (brighter where they
// overlap) instead of normal alpha blending - looks nice for glowing particles, but
// costs more to render (blending can't use early depth rejection the same way)
// Impact performance
particlesM.blending = THREE.AdditiveBlending;
// Tells the material to read the geometry's own "color" attribute per vertex,
// instead of using a single uniform color for every particle
particlesM.vertexColors = true;

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(pixelRatio);

  renderer.render(scene, camera);
});

const timer = new THREE.Timer();

const tick = () => {
  timer.update();
  controls.update();

  const elapsed = timer.getElapsed();

  // Update particles
  // Simple alternative: spin the whole particle system as one rigid object, instead
  // of animating individual particles below
  // particles.rotation.y = elapsed * 0.2;

  // Per-particle animation: each particle's y position follows a sine wave over time,
  // offset by its own x position so particles don't all move in perfect unison (creates
  // a wave-like ripple across the particle field instead of uniform bobbing).
  // Perf: this loops over every particle on the CPU each frame and re-uploads the
  // whole position buffer (needsUpdate) - fine for 5000 particles, but this kind of
  // animation is usually done in a vertex shader instead for large counts
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particlesG.attributes.position.array[i3 + 0];

    particlesG.attributes.position.array[i3 + 1] = Math.sin(elapsed + x);
  }
  particlesG.attributes.position.needsUpdate = true;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
