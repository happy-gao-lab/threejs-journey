import * as THREE from "three";
import { WebGPURenderer, IESSpotLight, ProjectorLight } from "three/webgpu";
import { IESLoader } from "three/addons/loaders/IESLoader.js";

// https://threejs.org/docs/#IESSpotLight
// https://threejs.org/docs/#ProjectorLight

// Both lights below are WebGPU-only (SpotLight variants) and share the exact same
// camera framing, canvas, renderer and base object - so that shared setup is created
// once here, instead of being duplicated identically in each section
const sizes = {
  width: 800,
  height: 600,
};

const canvas = document.getElementById("webgl");
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.outline = "none";

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);
camera.position.set(0, 3, 5);
camera.lookAt(0, 0, 0);

// Scene
const scene = new THREE.Scene();
scene.add(camera);

// Object - geometry is reassigned per section below (plane for IES, box for
// ProjectorLight), material is identical in both so it's only created once here
const material = new THREE.MeshStandardMaterial({ color: 0xffffff });
const mesh = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
mesh.rotation.x = -Math.PI * 0.5;
scene.add(mesh);

// Renderer
const renderer = new WebGPURenderer({ canvas });
await renderer.init();
renderer.setSize(sizes.width, sizes.height);

const tick = () => {
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

// //! IESSpotLight - a IES version of SpotLight.
// // Perf: same cost as a regular SpotLight, plus a texture lookup for the iesMap
// // attenuation profile. Works only with WebGPURenderer.
// mesh.geometry = new THREE.PlaneGeometry(5, 5);

// // iesMap is not a regular image - it's an attenuation profile parsed from a real
// // .ies photometric file via IESLoader, not TextureLoader
// const iesLoader = new IESLoader();
// const iesTexture = await iesLoader.loadAsync("/textures/ies/profile1.ies");

// const iesLight = new IESSpotLight(0xffffff, 500, 10, Math.PI / 6, 0.3, 2);
// iesLight.position.set(0, 3, 0);
// iesLight.iesMap = iesTexture;
// scene.add(iesLight);

// tick();

// //! ProjectorLight - a projector light version of SpotLight.
// Perf: same cost as a regular SpotLight, plus a texture sample for the projected
// map within the light's cone. Works only with WebGPURenderer.
mesh.geometry = new THREE.PlaneGeometry(5, 5);

const textureLoader = new THREE.TextureLoader();
const projectedTexture = textureLoader.load("/textures/bricks.png");

const projectorLight = new ProjectorLight(0xffffff, 50, 10, Math.PI / 6, 0, 2);
projectorLight.position.set(0, 3, 0);
projectorLight.map = projectedTexture;
// null (default) uses the texture's own aspect ratio instead of a fixed value
projectorLight.aspect = null;
scene.add(projectorLight);

// Ambient light so the rest of the object isn't left completely black outside
// the ProjectorLight's narrow cone
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

tick();
