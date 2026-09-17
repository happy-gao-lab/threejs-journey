import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// Constants
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const pixelRatio = Math.min(window.devicePixelRatio, 2);

const canvas = document.getElementById("webgl");

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.outline = "none";

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(0, 0, 3);

// Orbit controls
const controls = new OrbitControls(camera, canvas);

// Scene
const scene = new THREE.Scene();

scene.add(mesh);
scene.add(camera);

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
