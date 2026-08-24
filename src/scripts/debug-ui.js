import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import gsap from "gsap";

// https://github.com/dataarts/dat.gui
// https://lil-gui.georgealways.com/
// https://github.com/freeman-lab/control-panel
// https://github.com/automat/controlkit.js
// https://github.com/lo-th/uil
// https://tweakpane.github.io/docs/
// https://github.com/colejd/guify
// https://github.com/wearekuva/oui

// https://threejs.org/docs/?q=color#Color
// https://threejs.org/docs/?q=boxgeo#BoxGeometry

// Constants
const sizes = {
  width: 800,
  height: 600,
};

// Values tweaked live through the debug UI below, rather than plain constants
const props = { color: 0x00ffff, segments: 2 };

const canvas = document.getElementById("webgl");

// Object
const geometry = new THREE.BoxGeometry(
  1,
  1,
  1,
  props.segments,
  props.segments,
  props.segments,
);
const material = new THREE.MeshBasicMaterial({
  color: props.color,
  wireframe: true,
});
const mesh = new THREE.Mesh(geometry, material);

// Debug UI - lil-gui panel for tweaking values at runtime
const gui = new GUI({ title: "Debug UI", width: 300, closeFolders: false });
// Starts the panel hidden
// gui.hide();

// gui._hidden reflects the panel's current visibility; show(gui._hidden) flips it,
// so pressing "h" toggles the panel open/closed
window.addEventListener("keydown", (e) => {
  if (e.key == "h") {
    gui.show(gui._hidden);
  }
});

// A GUI button just calls whatever function is assigned to the given property -
// here it animates one full rotation (2*PI) via GSAP each time it's clicked
props.spin = () => gsap.to(mesh.rotation, { y: mesh.rotation.y + Math.PI * 2 });

const folder = gui.addFolder("Cube");
folder.close();

// Number slider bound to the mesh's y position
folder.add(mesh.position, "y").min(-3).max(3).step(0.5).name("Position Y");
// Boolean bound directly to the material - toggles as a checkbox
folder.add(material, "wireframe");
// Color picker; onChange syncs the material since it doesn't read from props automatically
folder.addColor(props, "color").onChange(() => material.color.set(props.color));
// Button triggering props.spin defined above
folder.add(props, "spin");
// Segments can't be changed on an existing BoxGeometry - onFinishChange (fires once,
// after dragging stops, unlike onChange) disposes the old geometry and replaces it
folder
  .add(props, "segments")
  .min(1)
  .max(20)
  .step(1)
  .onFinishChange(() => {
    mesh.geometry.dispose();
    mesh.geometry = new THREE.BoxGeometry(
      1,
      1,
      1,
      props.segments,
      props.segments,
      props.segments,
    );
  });

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(0, 0, 3);

// Orbit Controls
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

const tick = () => {
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
