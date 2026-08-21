import * as THREE from "three";

// https://threejs.org/docs/index.html#Scene
// https://threejs.org/docs/index.html#BoxGeometry
// https://threejs.org/docs/index.html#MeshBasicMaterial
// https://threejs.org/docs/index.html#Color
// https://threejs.org/docs/#Mesh
// https://threejs.org/docs/#PerspectiveCamera
// https://threejs.org/docs/index.html#WebGLRenderer

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
renderer.render(scene, camera);

// Info text
const info = document.createElement("div");
info.style.maxWidth = "800px";
info.style.margin = "16px 0 0";
info.style.padding = "12px 16px";
info.style.fontFamily = "system-ui, sans-serif";
info.style.fontSize = "14px";
info.style.lineHeight = "1.5";
info.style.color = "#333";
info.style.background = "#f5f5f5";
info.style.borderRadius = "8px";

const infoItems = [
  "The canvas is the HTML element the scene gets drawn onto.",
  "The scene is a scene graph — a tree of objects that holds everything to be rendered.",
  "An object (mesh) combines a geometry (shape) with a material (appearance).",
  "The camera defines the point of view used to look at the scene.",
  "The renderer takes the scene and camera and draws the final image onto the canvas.",
];

for (const text of infoItems) {
  const p = document.createElement("p");
  p.textContent = text;
  p.style.margin = "0 0 8px";
  info.appendChild(p);
}

info.lastElementChild.style.marginBottom = "0";

canvas.insertAdjacentElement("afterend", info);
