import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  Line2NodeMaterial,
  WebGPURenderer,
  LineBasicNodeMaterial,
  LineDashedNodeMaterial,
} from "three/webgpu";
import { Line2 } from "three/addons/lines/webgpu/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";

// https://threejs.org/docs/#Line2NodeMaterial
// https://threejs.org/docs/#LineBasicMaterial
// https://threejs.org/docs/#LineBasicNodeMaterial
// https://threejs.org/docs/#LineDashedMaterial
// https://threejs.org/docs/#LineDashedNodeMaterial

// Material vs NodeMaterial:
// - Material (LineBasicMaterial, LineDashedMaterial) is the classic API - properties
//   compile down to a fixed, built-in GLSL shader under the hood. Works with WebGLRenderer.
// - NodeMaterial (LineBasicNodeMaterial, LineDashedNodeMaterial, Line2NodeMaterial) is
//   built on a node-based system - Three.js generates the shader itself (GLSL for
//   WebGLRenderer, WGSL for WebGPURenderer) from a composable JS-like API. If a plain
//   Material is used together with WebGPURenderer, Three.js automatically swaps it for
//   the matching NodeMaterial internally.

// WebGPURenderer vs WebGLRenderer performance:
// - WebGLRenderer uses WebGL - supported basically everywhere, mature, predictable.
// - WebGPURenderer uses the newer WebGPU API where the browser supports it (falls back
//   to WebGL otherwise). It can offer better performance in GPU-heavy scenes - compute
//   shaders, more efficient state/resource management, less driver overhead - but the
//   gain is most noticeable with complex scenes, not a single simple line like here.
//   WebGPURenderer also requires an async renderer.init() call before its first use,
//   unlike WebGLRenderer.

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

const points = [
  new THREE.Vector3(-1, 0, 0),
  new THREE.Vector3(0, 1, 0),
  new THREE.Vector3(1, 0, 0),
];
const linePoints = [-1, 0, 0, 0, 1, 0, 1, 0, 0];

// Each section below is fully self-contained (its own geometry/material/line/renderer
// with unique names, its own scene.add and render loop) - since sections differ in
// renderer type (WebGL vs WebGPU) and geometry class, they can't share a single
// "reassign one property" pattern the way plain mesh materials can. Select and
// uncomment exactly one section at a time.

// //! Line2NodeMaterial - can be used to render lines with a size larger than one by representing them as instanced meshes.
// // Perf: heavier than a plain Line - draws each segment as an instanced quad mesh
// // instead of a single GL_LINE primitive. Requires WebGPURenderer.
// const line2Geometry = new LineGeometry();
// line2Geometry.setPositions(linePoints);
// const line2Material = new Line2NodeMaterial({
//   color: 0xff0000,
//   linewidth: 5, // in pixels
// });
// const line2 = new Line2(line2Geometry, line2Material);
// scene.add(line2);
// const line2Renderer = new WebGPURenderer({ canvas });
// await line2Renderer.init();
// line2Renderer.setSize(sizes.width, sizes.height);
// const line2Tick = () => {
//   controls.update();
//   line2Renderer.render(scene, camera);
//   window.requestAnimationFrame(line2Tick);
// };
// line2Tick();

// //! LineBasicMaterial - a material for rendering line primitives. Materials define the appearance of renderable 3D objects.
// // Perf: cheapest option - a single native GL_LINE primitive. linewidth is ignored
// // on most platforms/GPUs (a WebGL limitation), lines always render ~1px wide.
// const lineBasicGeometry = new THREE.BufferGeometry().setFromPoints(points);
// const lineBasicMaterial = new THREE.LineBasicMaterial({ color: 0xff0000 });
// const lineBasic = new THREE.Line(lineBasicGeometry, lineBasicMaterial);
// scene.add(lineBasic);
// const lineBasicRenderer = new THREE.WebGLRenderer({ canvas });
// lineBasicRenderer.setSize(sizes.width, sizes.height);
// const lineBasicTick = () => {
//   controls.update();
//   lineBasicRenderer.render(scene, camera);
//   window.requestAnimationFrame(lineBasicTick);
// };
// lineBasicTick();

// //! LineBasicNodeMaterial - node material version of LineBasicMaterial.
// // Perf: same rendering cost as LineBasicMaterial, just compiled to WGSL and run
// // through WebGPURenderer instead of GLSL/WebGLRenderer.
// const lineBasicNodeGeometry = new THREE.BufferGeometry().setFromPoints(points);
// const lineBasicNodeMaterial = new LineBasicNodeMaterial({ color: 0xff0000 });
// const lineBasicNode = new THREE.Line(lineBasicNodeGeometry, lineBasicNodeMaterial);
// scene.add(lineBasicNode);
// const lineBasicNodeRenderer = new WebGPURenderer({ canvas });
// await lineBasicNodeRenderer.init();
// lineBasicNodeRenderer.setSize(sizes.width, sizes.height);
// const lineBasicNodeTick = () => {
//   controls.update();
//   lineBasicNodeRenderer.render(scene, camera);
//   window.requestAnimationFrame(lineBasicNodeTick);
// };
// lineBasicNodeTick();

// //! LineDashedMaterial - a material for rendering line primitives. Materials define the appearance of renderable 3D objects.
// // Perf: same base cost as LineBasicMaterial, plus a per-fragment discard check for
// // the dash pattern. Needs computeLineDistances() called once on the line object -
// // without it, the line renders solid instead of dashed.
// const lineDashedGeometry = new THREE.BufferGeometry().setFromPoints(points);
// const lineDashedMaterial = new THREE.LineDashedMaterial({
//   color: 0xff0000,
//   scale: 1,
//   dashSize: 0.1,
//   gapSize: 0.05,
// });
// const lineDashed = new THREE.Line(lineDashedGeometry, lineDashedMaterial);
// lineDashed.computeLineDistances();
// scene.add(lineDashed);
// const lineDashedRenderer = new THREE.WebGLRenderer({ canvas });
// lineDashedRenderer.setSize(sizes.width, sizes.height);
// const lineDashedTick = () => {
//   controls.update();
//   lineDashedRenderer.render(scene, camera);
//   window.requestAnimationFrame(lineDashedTick);
// };
// lineDashedTick();

// //! LineDashedNodeMaterial - node material version of LineDashedMaterial.
// Perf: same as LineDashedMaterial, just compiled to WGSL and run through
// WebGPURenderer. Same computeLineDistances() requirement.
const lineDashedNodeGeometry = new THREE.BufferGeometry().setFromPoints(points);
const lineDashedNodeMaterial = new LineDashedNodeMaterial({
  color: 0xff0000,
  dashSize: 0.1,
  gapSize: 0.05,
});
const lineDashedNode = new THREE.Line(
  lineDashedNodeGeometry,
  lineDashedNodeMaterial,
);
lineDashedNode.computeLineDistances();
scene.add(lineDashedNode);
const lineDashedNodeRenderer = new WebGPURenderer({ canvas });
await lineDashedNodeRenderer.init();
lineDashedNodeRenderer.setSize(sizes.width, sizes.height);
const tick = () => {
  controls.update();
  lineDashedNodeRenderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};
tick();
