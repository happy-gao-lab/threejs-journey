import * as THREE from "three";

// https://developer.mozilla.org/en-US/docs/Web/API/Element/dblclick_event

// Constants
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

// Capped at 2 to limit rendering cost on very high-DPI screens
const pixelRatio = Math.min(window.devicePixelRatio, 2);

const canvas = document.getElementById("webgl");

// Styles are set here directly so they don't clash with other scripts
canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.outline = "none";

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const mesh = new THREE.Mesh(geometry, material);

mesh.rotation.y = 1;

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

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(pixelRatio);

  // setSize() resizes (and clears) the canvas - without rendering again here,
  // it would stay blank until some other event happens to trigger a new frame
  renderer.render(scene, camera);
});

// Handle fullscreen
window.addEventListener("dblclick", () => {
  // webkitFullscreenElement is a fallback for older Safari versions that
  // don't support the unprefixed Fullscreen API
  const isFullscreen =
    document.fullscreenElement || document.webkitFullscreenElement;

  // Pick whichever method is available (unprefixed or webkit-prefixed), then call it
  // with .call() so `this` inside the method is still the correct element
  if (isFullscreen) {
    (document.exitFullscreen || document.webkitExitFullscreen).call(document);
  } else {
    (canvas.requestFullscreen || canvas.webkitRequestFullscreen).call(canvas);
  }
});

// Initial setup, run once before any resize happens - the "resize" listener above
// only fires on an actual window resize, not on page load
// Limit device pixel ratio
renderer.setPixelRatio(pixelRatio);

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
