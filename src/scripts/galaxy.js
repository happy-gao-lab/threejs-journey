import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";

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

const gui = new GUI();

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(2, 4, 6);

// Orbit controls
const controls = new OrbitControls(camera, canvas);

// Scene
const scene = new THREE.Scene();

scene.add(camera);

// Galaxy
const parameters = {
  count: 100_000,
  size: 0.01,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.2,
  randomnessPower: 3,
  innerColor: "#ff6030",
  outerColor: "#1b3984",
};

// Kept outside generateGalaxy so the function can dispose of the previous galaxy's
// geometry/material before building a new one, instead of leaking them every time a
// GUI control triggers a regeneration
let geometry = null;
let material = null;
let points = null;

const generateGalaxy = () => {
  // dispose() frees the GPU buffers - without it, every regeneration would leave the
  // old geometry/material's GPU memory allocated with nothing left to render them
  if (points !== null) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);

  const innerColor = new THREE.Color(parameters.innerColor);
  const outerColor = new THREE.Color(parameters.outerColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;
    const radius = Math.random() * parameters.radius;

    // Position
    // Splits particles evenly across N branches by their index (i % branches groups
    // consecutive particles into the same branch), then spaces those branches evenly
    // around a full circle
    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;
    // Twists each branch progressively more the farther out its particles are,
    // producing the characteristic curved/spiral look instead of straight branches
    const spinAngle = radius * parameters.spin;

    // pow(random, randomnessPower) biases results toward 0 (higher power = more
    // particles close to the branch line, fewer far-flung outliers), then the random
    // sign spreads that offset to either side of the branch
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;

    positions[i3 + 0] = Math.cos(branchAngle + spinAngle) * radius + randomX; // x
    positions[i3 + 1] = randomY; // y
    positions[i3 + 2] = Math.sin(branchAngle + spinAngle) * radius + randomZ; // z

    // Color
    // Blends from innerColor to outerColor based on how far out this particle is
    // (radius / parameters.radius normalizes that distance to a 0-1 range)
    const mixedColor = innerColor.clone();
    mixedColor.lerp(outerColor, radius / parameters.radius);

    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  material = new THREE.PointsMaterial({
    size: parameters.size,
    sizeAttenuation: true,
    // depthWrite: false avoids particles' transparent-looking edges hiding particles
    // behind them; AdditiveBlending makes overlapping particles brighten each other,
    // giving the bright galaxy-core look (both are more expensive than the defaults)
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    // Reads the geometry's own "color" attribute per particle instead of one flat color
    vertexColors: true,
  });

  points = new THREE.Points(geometry, material);

  scene.add(points);
};

generateGalaxy();

// Debug
// onFinishChange (fires once, after dragging stops) is used everywhere here instead
// of onChange (fires continuously while dragging) - regenerating means rebuilding
// and re-uploading the whole position/color buffers (up to 1,000,000 particles per
// the count slider below), which would be far too expensive to redo on every
// intermediate drag value
gui
  .add(parameters, "count")
  .min(100)
  .max(1_000_000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "size")
  .min(0.001)
  .max(0.1)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(1)
  .max(10)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "spin")
  .min(-5)
  .max(5)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui.addColor(parameters, "innerColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outerColor").onFinishChange(generateGalaxy);

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
