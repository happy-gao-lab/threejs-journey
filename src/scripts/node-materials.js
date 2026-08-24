import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  WebGPURenderer,
  MeshBasicNodeMaterial,
  MeshLambertNodeMaterial,
  MeshMatcapNodeMaterial,
  MeshNormalNodeMaterial,
  MeshPhongNodeMaterial,
  MeshPhysicalNodeMaterial,
  MeshSSSNodeMaterial,
  MeshStandardNodeMaterial,
  MeshToonNodeMaterial,
} from "three/webgpu";
import { color } from "three/tsl";

// https://threejs.org/docs/#MeshBasicNodeMaterial
// https://threejs.org/docs/#MeshLambertNodeMaterial
// https://threejs.org/docs/#MeshMatcapNodeMaterial
// https://threejs.org/docs/#MeshNormalNodeMaterial
// https://threejs.org/docs/#MeshPhongNodeMaterial
// https://threejs.org/docs/#MeshPhysicalNodeMaterial
// https://threejs.org/docs/#MeshSSSNodeMaterial
// https://threejs.org/docs/#MeshStandardNodeMaterial
// https://threejs.org/docs/#MeshToonNodeMaterial

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

// Scene
const scene = new THREE.Scene();

scene.add(camera);

// Orbit Controls
const controls = new OrbitControls(camera, canvas);

// Light
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(2, 2, 2);

scene.add(light);

// Debug UI
const gui = new GUI({ title: "Node Materials", width: 300 });

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Created once with a placeholder material - each section below reassigns
// mesh.material instead of declaring its own const material/const mesh, so any
// single section can be selected and uncommented independently without colliding
// with this shared declaration
const mesh = new THREE.Mesh(geometry, new MeshBasicNodeMaterial());
scene.add(mesh);

// //! MeshBasicNodeMaterial - node material version of MeshBasicMaterial.
// Perf: cheapest node material available. Light: ignored entirely. Shadows: can
// cast/receive, but a received shadow shows as a flat, unlit dark patch.
mesh.material = new MeshBasicNodeMaterial({ color: 0xff0000 });
const meshBasicNodeFolder = gui.addFolder("MeshBasicNodeMaterial");
meshBasicNodeFolder.addColor(mesh.material, "color");
meshBasicNodeFolder.add(mesh.material, "wireframe");

// //! MeshLambertNodeMaterial - node material version of MeshLambertMaterial.
// // Perf: cheap, one of the fastest lit node materials. Light: required - renders
// // black without one. Shadows: casts and receives normally.
// mesh.material = new MeshLambertNodeMaterial({ color: 0xff0000 });
// const meshLambertNodeFolder = gui.addFolder("MeshLambertNodeMaterial");
// meshLambertNodeFolder.addColor(mesh.material, "color");
// meshLambertNodeFolder.add(mesh.material, "wireframe");

// //! MeshMatcapNodeMaterial - node material version of MeshMatcapMaterial.
// // Perf: cheap - no real-time lighting math, just a texture lookup. Light: ignored
// // (baked into the matcap texture itself). Shadows: can cast shadows onto other
// // objects, but does not receive or self-shadow.
// const textureLoader = new THREE.TextureLoader();
// const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
// mesh.material = new MeshMatcapNodeMaterial({ matcap: matcapTexture });
// const meshMatcapNodeFolder = gui.addFolder("MeshMatcapNodeMaterial");
// meshMatcapNodeFolder.addColor(mesh.material, "color");
// meshMatcapNodeFolder.add(mesh.material, "wireframe");

// //! MeshNormalNodeMaterial - node material version of MeshNormalMaterial.
// // Perf: cheap, no lighting calculations. Light: ignored - color comes from the
// // surface normal direction. Shadows: not meaningful, since color isn't tied to
// // real lighting.
// mesh.material = new MeshNormalNodeMaterial();
// const meshNormalNodeFolder = gui.addFolder("MeshNormalNodeMaterial");
// meshNormalNodeFolder.add(mesh.material, "flatShading");
// meshNormalNodeFolder.add(mesh.material, "wireframe");

// //! MeshPhongNodeMaterial - node material version of MeshPhongMaterial.
// // Perf: moderate - more expensive than Lambert due to the specular term, cheaper
// // than Standard/Physical. Light: required. Shadows: casts and receives normally.
// mesh.material = new MeshPhongNodeMaterial({
//   color: 0xff0000,
//   shininess: 100,
//   specular: 0x1188ff,
// });
// const meshPhongNodeFolder = gui.addFolder("MeshPhongNodeMaterial");
// meshPhongNodeFolder.addColor(mesh.material, "color");
// meshPhongNodeFolder.addColor(mesh.material, "specular");
// meshPhongNodeFolder.add(mesh.material, "shininess").min(0).max(200).step(1);
// meshPhongNodeFolder.add(mesh.material, "wireframe");

// //! MeshPhysicalNodeMaterial - node material version of MeshPhysicalMaterial.
// // Perf: the most expensive built-in node material - each enabled feature (clearcoat,
// // sheen, transmission, iridescence...) adds further per-pixel cost. Light: required.
// // Shadows: casts and receives normally.
// mesh.material = new MeshPhysicalNodeMaterial({
//   color: 0xff0000,
//   roughness: 0.3,
//   metalness: 0,
//   clearcoat: 1,
//   clearcoatRoughness: 0.1,
// });
// const meshPhysicalNodeFolder = gui.addFolder("MeshPhysicalNodeMaterial");
// meshPhysicalNodeFolder.addColor(mesh.material, "color");
// meshPhysicalNodeFolder.add(mesh.material, "roughness").min(0).max(1).step(0.01);
// meshPhysicalNodeFolder.add(mesh.material, "metalness").min(0).max(1).step(0.01);
// meshPhysicalNodeFolder.add(mesh.material, "clearcoat").min(0).max(1).step(0.01);
// meshPhysicalNodeFolder
//   .add(mesh.material, "clearcoatRoughness")
//   .min(0)
//   .max(1)
//   .step(0.01);
// meshPhysicalNodeFolder.add(mesh.material, "wireframe");

// //! MeshSSSNodeMaterial - experimental extension of MeshPhysicalNodeMaterial implementing a subsurface scattering (SSS) term.
// // Perf: same as MeshPhysicalNodeMaterial, plus the extra SSS light-scattering term.
// // Light: required. Shadows: casts and receives normally. thicknessColorNode is null
// // by default - SSS has no visible effect at all until it's explicitly assigned.
// mesh.material = new MeshSSSNodeMaterial({
//   color: 0xff0000,
//   roughness: 0.5,
//   metalness: 0,
// });
// mesh.material.thicknessColorNode = color(0xff8866);
// const meshSSSNodeFolder = gui.addFolder("MeshSSSNodeMaterial");
// meshSSSNodeFolder.addColor(mesh.material, "color");
// meshSSSNodeFolder.add(mesh.material, "roughness").min(0).max(1).step(0.01);
// meshSSSNodeFolder.add(mesh.material, "metalness").min(0).max(1).step(0.01);
// // thicknessColorNode is a TSL node, not a plain property - lil-gui can't bind to it
// // directly, so it isn't tweakable here without extra wiring
// meshSSSNodeFolder.add(mesh.material, "wireframe");

// //! MeshStandardNodeMaterial - node material version of MeshStandardMaterial.
// // Perf: moderate-to-expensive PBR calculations, cheaper than Physical since the
// // advanced features (clearcoat, sheen, etc.) aren't available at all here. Light:
// // required. Shadows: casts and receives normally.
// mesh.material = new MeshStandardNodeMaterial({
//   color: 0xff0000,
//   roughness: 0.5,
//   metalness: 0,
// });
// const meshStandardNodeFolder = gui.addFolder("MeshStandardNodeMaterial");
// meshStandardNodeFolder.addColor(mesh.material, "color");
// meshStandardNodeFolder.add(mesh.material, "roughness").min(0).max(1).step(0.01);
// meshStandardNodeFolder.add(mesh.material, "metalness").min(0).max(1).step(0.01);
// meshStandardNodeFolder.add(mesh.material, "wireframe");

// //! MeshToonNodeMaterial - node material version of MeshToonMaterial.
// // Perf: cheap-to-moderate - simple step-based shading. Light: required. Shadows:
// // casts and receives normally. A custom gradientMap needs
// // gradientMap.minFilter/magFilter set to THREE.NearestFilter, otherwise linear
// // texture filtering blurs the discrete shading bands that define the toon look.
// mesh.material = new MeshToonNodeMaterial({ color: 0xff0000 });
// const meshToonNodeFolder = gui.addFolder("MeshToonNodeMaterial");
// meshToonNodeFolder.addColor(mesh.material, "color");
// meshToonNodeFolder.add(mesh.material, "wireframe");

const renderer = new WebGPURenderer({ canvas });
await renderer.init();

renderer.setSize(sizes.width, sizes.height);

const timer = new THREE.Timer();

const tick = () => {
  timer.update();
  const elapsed = timer.getElapsed();
  controls.update();

  mesh.rotation.x = elapsed * Math.PI * 0.1;
  mesh.rotation.y = elapsed * Math.PI * 0.1;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
