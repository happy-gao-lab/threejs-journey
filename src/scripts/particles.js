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
// const particlesG = new THREE.SphereGeometry(1, 32, 32);
// const particlesM = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });
// const particles = new THREE.Points(particlesG, particlesM);

// scene.add(particles);

//
const count = 5000;

const particlesG = new THREE.BufferGeometry();

const positions = new Float32Array(count * 3);

for (let i = 0; i < count; i++) {
  positions[i] = (Math.random() - 0.5) * 10;
}

particlesG.setAttribute("position", new THREE.BufferAttribute(positions, 3));

const particlesM = new THREE.PointsMaterial({
  size: 0.1,
  sizeAttenuation: true,
});
const particles = new THREE.Points(particlesG, particlesM);

scene.add(particles);

particlesM.color = new THREE.Color(0xff88cc);

const textureLoader = new THREE.TextureLoader();

const particleTexture = textureLoader.load("./textures/particles/2.png");

particlesM.map = particleTexture;

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

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
