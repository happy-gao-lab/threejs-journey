import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { FontLoader, TextGeometry } from "three/examples/jsm/Addons.js";

// https://gero3.github.io/facetype.js/
// https://github.com/nidorx/matcaps

// https://threejs.org/docs/?q=textge#TextGeometry
// https://threejs.org/docs/#FontLoader
// https://threejs.org/docs/index.html#TextureLoader
// https://threejs.org/docs/index.html#Box3
// https://threejs.org/docs/index.html#MeshMatcapMaterial
// https://threejs.org/docs/index.html#MeshBasicMaterial
// https://threejs.org/docs/#TorusGeometry

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

camera.position.set(-3, 0, 3);

//  OrbitControls
const controls = new OrbitControls(camera, canvas);

// Scene
const scene = new THREE.Scene();

scene.add(camera);

// Text
// FontLoader loads a typeface converted to Three.js's own JSON format (via facetype.js,
// linked above) - regular font files (.ttf/.otf) can't be used directly
const fontLoader = new FontLoader();
const textureLoader = new THREE.TextureLoader();

const donutTexture = textureLoader.load("./textures/matcaps/9.png");
const TextTexture = textureLoader.load("./textures/matcaps/10.png");

donutTexture.colorSpace = THREE.SRGBColorSpace;
TextTexture.colorSpace = THREE.SRGBColorSpace;

// Font loading is asynchronous - everything that depends on the font (the geometry,
// material, mesh) has to be created inside this callback
fontLoader.load("./fonts/matemasie-regular.json", (font) => {
  const textGeometry = new TextGeometry("Hello World!", {
    font,
    size: 0.5,
    depth: 0.01, // extrusion thickness along the z-axis
    curveSegments: 2, // how many segments make up each curve of a letter
    bevelEnabled: true, // rounds off the extruded edges instead of leaving them sharp
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 2,
  });

  // By default the text geometry is positioned so it starts at the origin (not
  // centered on it) - center() recalculates and shifts it to be centered instead
  textGeometry.center();
  textGeometry.computeBoundingBox();

  // Logged once to check the resulting size/centering of the text geometry, kept here
  // as a reference for what computeBoundingBox() produces
  // console.log("==========>>>", textGeometry.boundingBox);
  // isBox3: true,
  // max: Vector3 {x: 2.241548538208008, y: 0.3081258237361908, z: 0.03500000014901161},
  // min: Vector3 {x: -2.241548538208008, y: -0.3081258237361908, z: -0.03500000014901161}

  const textMaterial = new THREE.MeshMatcapMaterial({
    matcap: TextTexture,
  });
  const textMesh = new THREE.Mesh(textGeometry, textMaterial);

  scene.add(textMesh);
});

// Slower approach kept for comparison: creates a brand new geometry and material
// instance inside the loop for every single donut - see the timing note at the end
// console.time("donuts");
// for (let i = 0; i < 300; i++) {
//   const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
//   const donutMaterial = new THREE.MeshMatcapMaterial({
//     matcap: donutTexture,
//   });
//   const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial);

//   donutMesh.position.x = (Math.random() - 0.5) * 10;
//   donutMesh.position.y = (Math.random() - 0.5) * 10;
//   donutMesh.position.z = (Math.random() - 0.5) * 10;

//   donutMesh.rotation.x = Math.random() * Math.PI;
//   donutMesh.rotation.y = Math.random() * Math.PI;

//   const scale = Math.random();
//   donutMesh.scale.set(scale, scale, scale);

//   scene.add(donutMesh);
// }
// console.timeEnd("donuts"); // donuts: 70.05419921875 ms

// Faster approach: geometry and material are created once, outside the loop, and
// every donut Mesh reuses the same two instances - only position/rotation/scale
// differ per mesh. Same donut count as above (300), yet roughly 28x faster, since
// it skips reallocating geometry/material data on every iteration
const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
const donutMaterial = new THREE.MeshMatcapMaterial({
  matcap: donutTexture,
});

console.time("donuts");
for (let i = 0; i < 300; i++) {
  const donutMesh = new THREE.Mesh(donutGeometry, donutMaterial);

  donutMesh.position.x = (Math.random() - 0.5) * 10;
  donutMesh.position.y = (Math.random() - 0.5) * 10;
  donutMesh.position.z = (Math.random() - 0.5) * 10;

  donutMesh.rotation.x = Math.random() * Math.PI;
  donutMesh.rotation.y = Math.random() * Math.PI;

  const scale = Math.random();
  donutMesh.scale.set(scale, scale, scale);

  scene.add(donutMesh);
}
console.timeEnd("donuts"); // donuts: 2.47900390625 ms

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
