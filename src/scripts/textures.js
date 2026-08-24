import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// https://marmoset.co/posts/basic-theory-of-physically-based-rendering/
// http://marmoset.co/posts/physically-based-rendering-and-you-can-too/
// https://en.wikipedia.org/wiki/Moir%C3%A9_pattern

// https://threejs.org/docs/index.html#Texture
// https://threejs.org/docs/index.html#TextureLoader
// https://threejs.org/docs/index.html#LoadingManager
// https://threejs.org/docs/index.html#Vector2

// Constants
const sizes = {
  width: 800,
  height: 600,
};

const canvas = document.getElementById("webgl");

const textureSrc = "/textures/door/color.jpg";

// Textures
// Performance tips for texture formats/sizes:
// - Prefer .jpg for textures without transparency (lossy, much smaller file size);
//   use .png only when an alpha channel is actually needed (larger file size)
// - Keep dimensions as powers of two (256, 512, 1024, ...) - required for mipmaps
//   and more efficient GPU memory usage
// - Don't use a higher resolution than the object will actually need on screen
// - For large/production projects, consider GPU-compressed formats (KTX2/Basis via
//   KTX2Loader) instead of plain jpg/png - they're both smaller and faster to upload

//! Via image - manual approach using the native Image + THREE.Texture.
// Texture data isn't uploaded to the GPU until needsUpdate is set - loading the image
// is asynchronous, so this only happens once it's actually finished loading
// const image = new Image();
// const texture = new THREE.Texture(image);

// texture.colorSpace = THREE.SRGBColorSpace;

// image.onload = () => {
//   texture.needsUpdate = true;
// };

// image.src = textureSrc;

//! TextureLoader - handles loading and the needsUpdate/re-render internally, unlike the manual Image approach above.
// load( url, onLoad, onProgress, onError ) - all three callbacks are optional
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(
//   textureSrc,
//   () => {
//     console.log("==========>>>", "LOAD");
//   },
//   () => {
//     console.log("==========>>>", "PROGRESS");
//   },
//   () => {
//     console.log("==========>>>", "ERROR");
//   },
// );

// texture.colorSpace = THREE.SRGBColorSpace;

//! LoadingManager - tracks progress across multiple loaders/resources at once (not just one),
// passed into a loader's constructor so that loader reports to it
// const loadingManager = new THREE.LoadingManager();

// loadingManager.onStart = () => {
//   console.log("==========>>>", "START");
// };
// loadingManager.onLoad = () => {
//   console.log("==========>>>", "LOADED");
// };
// loadingManager.onProgress = () => {
//   console.log("==========>>>", "PROGRESS");
// };
// loadingManager.onError = () => {
//   console.log("==========>>>", "ERROR");
// };

// const textureLoader = new THREE.TextureLoader(loadingManager);
// const texture = textureLoader.load(textureSrc);
// texture.colorSpace = THREE.SRGBColorSpace;

//! A typical set of PBR texture maps for a single material (color, transparency,
// displacement, surface detail, shading, reflectivity, and shininess respectively)
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load("/textures/door/color.jpg");
// const alphaTexture = textureLoader.load("/textures/door/alpha.jpg");
// const heightTexture = textureLoader.load("/textures/door/height.jpg");
// const normalTexture = textureLoader.load("/textures/door/normal.jpg");
// const ambientOcclusionTexture = textureLoader.load(
//   "/textures/door/ambientOcclusion.jpg",
// );
// const metalnessTexture = textureLoader.load("/textures/door/metalness.jpg"); // about reflection
// const roughnessTexture = textureLoader.load("/textures/door/roughness.jpg");

// texture.colorSpace = THREE.SRGBColorSpace;

//! UV unwrapping and other properties
const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(textureSrc);

// How many times the texture repeats along each axis
// texture.repeat.x = 2;
// texture.repeat.y = 3;

// wrapS/wrapT control what happens past UV 0-1 on each axis - required for repeat to have
// an effect at all, since the default (ClampToEdgeWrapping) just stretches the edge pixels
// texture.wrapS = THREE.RepeatWrapping;
// texture.wrapT = THREE.RepeatWrapping;
// texture.wrapS = THREE.MirroredRepeatWrapping;
// texture.wrapT = THREE.MirroredRepeatWrapping;

// Shifts the texture along each axis (0-1 range)
// texture.offset.x = 0.5;
// texture.offset.y = 0.5;

// Rotates the texture; center defines the pivot point for that rotation (default is the corner)
// texture.rotation = Math.PI * 0.25;
// texture.center.x = 0.5;
// texture.center.y = 0.5;

// const texture = textureLoader.load("/textures/checkerboard-1024x1024.png");
// const texture = textureLoader.load("/textures/checkerboard-8x8.png");
const texture = textureLoader.load("/textures/minecraft.png");

// Disabling mipmaps and using NearestFilter keeps sharp, pixelated edges when the texture
// is minified - useful for low-res pixel-art textures like this one, where the default
// (mipmapped, linearly filtered) result would look blurry instead
texture.generateMipmaps = false;
texture.minFilter = THREE.NearestFilter;
texture.magFilter = THREE.NearestFilter;

// Other available minFilter options (LinearMipMapLinearFilter is the default) - only
// relevant when generateMipmaps is true
// THREE.LinearFilter;
// THREE.NearestMipMapNearestFilter;
// THREE.NearestMipMapLinearFilter;
// THREE.LinearMipMapNearestFilter;
// THREE.LinearMipMapLinearFilter; // default

texture.colorSpace = THREE.SRGBColorSpace;
// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
// console.log("==========>>>", geometry.attributes.uv);
const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);

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
