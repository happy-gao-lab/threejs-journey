import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// https://threejs.org/examples/webgl_shadowmap_viewer.html

// This file demonstrates "fake" shadow techniques as cheaper alternatives to real-time
// shadow maps (see shadows.js) - renderer.shadowMap stays disabled below, so none of
// the actual shadow-casting/receiving machinery runs at all; shadows are faked with
// ordinary textured planes instead

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

const timer = new THREE.Timer();

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(1, 3, 7);

//  OrbitControls
const controls = new OrbitControls(camera, canvas);

// Objects
const material = new THREE.MeshStandardMaterial();
let planeMaterial = material;

const object = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);

// Perf note: with renderer.shadowMap.enabled = false below, castShadow/receiveShadow
// flags like this one have no effect at all - real shadow mapping never runs, so
// these are effectively inert here (kept for reference/comparison with shadows.js)
object.castShadow = true;

const textureLoader = new THREE.TextureLoader();

// //! Baked Shadow - a pre-rendered shadow "baked" directly into the plane's texture.
// // Perf: essentially free at runtime - it's just an ordinary texture on a plane, no
// // shadow map render pass at all. Tradeoff: completely static - doesn't move, resize,
// // or react to the object at all, and has to be custom-made (in a 3D tool, or
// // pre-rendered) for this exact object shape and lighting setup.
// const bakedShadowTexture = textureLoader.load(
//   "./textures/shadows/baked-shadow.jpg",
// );
// bakedShadowTexture.colorSpace = THREE.SRGBColorSpace;
// planeMaterial = new THREE.MeshBasicMaterial({ map: bakedShadowTexture });

const plane = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), planeMaterial);

plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.5;

// Same as object.castShadow above - inert while renderer.shadowMap is disabled
plane.receiveShadow = true;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
const light = new THREE.DirectionalLight(0xffffff, 1.5);
light.position.set(1, 3, 2);

const helper = new THREE.DirectionalLightHelper(light, 1);

// Scene
const scene = new THREE.Scene();

scene.add(camera, object, plane, ambientLight, light, helper);

// Simple Shadow - a small dark, soft-edged blob (via alphaMap) manually kept under
// the object as it moves, instead of a real computed shadow.
// Perf: just as cheap as the baked shadow above (a small transparent plane), but
// unlike it, this one can follow a moving object - the tradeoff is that it has to be
// driven by hand in the render loop below (position, opacity), and it's only a rough
// approximation, not an accurate shadow of the object's actual silhouette
const simpleShadowTexture = textureLoader.load(
  "./textures/shadows/simple-shadow.jpg",
);
simpleShadowTexture.colorSpace = THREE.SRGBColorSpace;

const objectShadow = new THREE.Mesh(
  new THREE.PlaneGeometry(1.5, 1.5),
  new THREE.MeshBasicMaterial({
    alphaMap: simpleShadowTexture,
    transparent: true,
    color: 0x000000,
  }),
);

objectShadow.rotation.x = -Math.PI * 0.5;
// Offset slightly above the floor plane to avoid two coplanar surfaces fighting for
// which one renders on top (z-fighting)
objectShadow.position.y = plane.position.y + 0.01;

scene.add(objectShadow);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.shadowMap.enabled = false;

const tick = () => {
  controls.update();
  timer.update();

  const elapsed = timer.getElapsed();

  //   Animate simpleShadow object
  object.position.x = Math.cos(elapsed) * 1.5;
  object.position.z = Math.sin(elapsed) * 1.5;

  // Bouncing motion (always >= 0, since Math.abs) - used below to fade the shadow
  // out as the object gets higher off the ground
  object.position.y = Math.abs(Math.sin(elapsed * 3));

  //   Update simpleShadow - this manual sync is the actual cost/tradeoff of this
  // technique, versus a real shadow map that updates itself automatically
  objectShadow.position.x = object.position.x;
  objectShadow.position.z = object.position.z;

  // Fake the effect of the object being farther from the ground: shadow gets fainter
  // as position.y grows (opacity ranges roughly from 0.1 up to 0.6 at y = 0)
  objectShadow.material.opacity = (1 - object.position.y) * 0.5 + 0.1;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
