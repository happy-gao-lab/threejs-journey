import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import {
  FontLoader,
  RectAreaLightUniformsLib,
  TextGeometry,
} from "three/examples/jsm/Addons.js";
import { LightProbeGenerator } from "three/addons/lights/LightProbeGenerator.js";
import GUI from "lil-gui";

// https://threejs.org/docs/#AmbientLight
// https://threejs.org/docs/#LightProbe
// https://threejs.org/docs/#DirectionalLight
// https://threejs.org/docs/#DirectionalLightHelper
// https://threejs.org/docs/#HemisphereLight
// https://threejs.org/docs/#HemisphereLightHelper
// https://threejs.org/docs/#PointLight
// https://threejs.org/docs/#PointLightHelper
// https://threejs.org/docs/#SpotLight
// https://threejs.org/docs/#SpotLightHelper
// https://threejs.org/docs/#RectAreaLight

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

const gui = new GUI();

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(-3, 0, 3);

//  OrbitControls
const controls = new OrbitControls(camera, canvas);

// Object
const geometry = new THREE.SphereGeometry(0.5);
const material = new THREE.MeshPhysicalMaterial({ color: 0xffffff });
const mesh = new THREE.Mesh(geometry, material);

// Scene
const scene = new THREE.Scene();

scene.add(camera, mesh);

// //! AmbientLight - globally illuminates all objects in the scene equally, from no particular direction.
// // Perf: cheapest light type - just adds a flat color, no direction/falloff math.
// // Cannot cast shadows (no direction to cast from).
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

const ambientLightFolder = gui.addFolder("AmbientLight");
ambientLightFolder.addColor(ambientLight, "color");
ambientLightFolder.add(ambientLight, "intensity").min(0).max(3).step(0.01);

// //! LightProbe - doesn't emit light itself, it encodes lighting from an environment map (via spherical harmonics) to approximate real-world lighting on objects.
// Perf: cheap to use at render time (just a few extra terms in the lighting math),
// but the probe itself has to be generated once from a real environment map, which
// is the actual cost. Works with both WebGLRenderer and WebGPURenderer. Cannot cast
// shadows.
const cubeTextureLoader = new THREE.CubeTextureLoader();

// Loading is asynchronous - LightProbeGenerator needs all 6 images already loaded,
// so it can only run inside the onLoad callback, not right after .load() returns
cubeTextureLoader.load(
  [
    "/textures/environment/px.jpg",
    "/textures/environment/nx.jpg",
    "/textures/environment/py.jpg",
    "/textures/environment/ny.jpg",
    "/textures/environment/pz.jpg",
    "/textures/environment/nz.jpg",
  ],
  (environmentMap) => {
    // The constructor isn't called directly - LightProbeGenerator analyzes the
    // actual environment map and produces the spherical harmonics data the probe needs
    const lightProbe = LightProbeGenerator.fromCubeTexture(environmentMap);
    scene.add(lightProbe);

    const lightProbeFolder = gui.addFolder("LightProbe");
    lightProbeFolder.add(lightProbe, "intensity").min(0).max(3).step(0.01);

    // The LightProbe above only affects lighting on objects - it doesn't make the
    // environment map itself visible. Uncommenting this shows the actual cube texture
    // as the scene's visible background, instead of the default black clear color
    // scene.background = environmentMap;
  },
);

// //! DirectionalLight - parallel rays from a single direction, like sunlight (infinitely far away).
// // Perf: moderate on its own, but shadow casting is expensive - a full extra render
// // pass into a shadow map. Gotcha: rotating the light itself has no effect - direction
// // is calculated from light.position toward light.target.position, so light.target
// // must also be added to the scene if its position is changed.
// const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
// const directionalLightHelper = new THREE.DirectionalLightHelper(
//   directionalLight,
//   1,
//   0xffff00,
// );
// scene.add(directionalLight, directionalLightHelper);

// const directionalLightFolder = gui.addFolder("DirectionalLight");
// directionalLightFolder.addColor(directionalLight, "color");
// directionalLightFolder
//   .add(directionalLight, "intensity")
//   .min(0)
//   .max(3)
//   .step(0.01);
// directionalLightFolder
//   .add(directionalLight.position, "x")
//   .min(-5)
//   .max(5)
//   .step(0.01);
// directionalLightFolder
//   .add(directionalLight.position, "y")
//   .min(-5)
//   .max(5)
//   .step(0.01);
// directionalLightFolder
//   .add(directionalLight.position, "z")
//   .min(-5)
//   .max(5)
//   .step(0.01);

// //! HemisphereLight - positioned above the scene, color fades from sky color to ground color.
// // Perf: cheap, similar cost to AmbientLight. Cannot cast shadows.
// const hemisphereLight = new THREE.HemisphereLight(0xffff00, 0x00ffff, 10);
// const hemisphereLightHelper = new THREE.HemisphereLightHelper(
//   hemisphereLight,
//   1,
// );
// scene.add(hemisphereLight, hemisphereLightHelper);

// const hemisphereLightFolder = gui.addFolder("HemisphereLight");
// hemisphereLightFolder.addColor(hemisphereLight, "color");
// hemisphereLightFolder.addColor(hemisphereLight, "groundColor");
// hemisphereLightFolder
//   .add(hemisphereLight, "intensity")
//   .min(0)
//   .max(10)
//   .step(0.01);

// //! PointLight - emits from a single point in all directions, like a bare lightbulb.
// // Perf: the most expensive of these lights to shadow-cast with - it renders the
// // scene 6 times into a cube map (one per direction) to build the shadow, versus a
// // single pass for DirectionalLight/SpotLight.
// const pointLight = new THREE.PointLight(0xffffff, 1, 0, 2);
// const pointLightHelper = new THREE.PointLightHelper(pointLight, 1);
// scene.add(pointLight, pointLightHelper);

// const pointLightFolder = gui.addFolder("PointLight");
// pointLightFolder.addColor(pointLight, "color");
// pointLightFolder.add(pointLight, "intensity").min(0).max(3).step(0.01);
// pointLightFolder.add(pointLight, "distance").min(0).max(20).step(0.1);
// pointLightFolder.add(pointLight, "decay").min(0).max(4).step(0.01);
// pointLightFolder.add(pointLight.position, "x").min(-5).max(5).step(0.01);
// pointLightFolder.add(pointLight.position, "y").min(-5).max(5).step(0.01);
// pointLightFolder.add(pointLight.position, "z").min(-5).max(5).step(0.01);

// //! SpotLight - emits from a single point in one direction, along a cone that grows with distance.
// // Perf: moderate - shadow casting needs only a single render pass (unlike
// // PointLight), since it only has to cover the light's cone, not all directions.
// const spotLight = new THREE.SpotLight(0xffffff, 1, 0, Math.PI / 3, 0, 2);
// const spotLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(spotLight, spotLightHelper);

// // SpotLightHelper doesn't auto-update every frame - it must be told to update
// // manually whenever the light's cone (angle/penumbra/distance/position) changes
// const updateSpotLightHelper = () => spotLightHelper.update();

// const spotLightFolder = gui.addFolder("SpotLight");
// spotLightFolder.addColor(spotLight, "color");
// spotLightFolder.add(spotLight, "intensity").min(0).max(3).step(0.01);
// spotLightFolder
//   .add(spotLight, "distance")
//   .min(0)
//   .max(20)
//   .step(0.1)
//   .onChange(updateSpotLightHelper);
// spotLightFolder
//   .add(spotLight, "angle")
//   .min(0)
//   .max(Math.PI / 2)
//   .step(0.01)
//   .onChange(updateSpotLightHelper);
// spotLightFolder
//   .add(spotLight, "penumbra")
//   .min(0)
//   .max(1)
//   .step(0.01)
//   .onChange(updateSpotLightHelper);
// spotLightFolder.add(spotLight, "decay").min(0).max(4).step(0.01);

// //! RectAreaLight - emits uniformly across the face of a rectangular plane, like a window or strip light.
// // Perf: no shadow support at all. Only works with PBR materials
// // (MeshStandardMaterial/MeshPhysicalMaterial) - the mesh here already uses
// // MeshPhysicalMaterial, so it's compatible.
// RectAreaLightUniformsLib.init(); // only relevant for WebGLRenderer
// const rectAreaLight = new THREE.RectAreaLight(0xff0000, 1, 10, 10);
// rectAreaLight.position.set(5, 5, 0);
// rectAreaLight.lookAt(0, 0, 0);
// scene.add(rectAreaLight);

// const rectAreaLightFolder = gui.addFolder("RectAreaLight");
// rectAreaLightFolder.addColor(rectAreaLight, "color");
// rectAreaLightFolder.add(rectAreaLight, "intensity").min(0).max(10).step(0.01);
// rectAreaLightFolder.add(rectAreaLight, "width").min(0).max(20).step(0.1);
// rectAreaLightFolder.add(rectAreaLight, "height").min(0).max(20).step(0.1);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

const timer = new THREE.Timer();

const tick = () => {
  timer.update();
  controls.update();
  const elapsed = timer.getElapsed();

  mesh.rotation.x = elapsed * Math.PI * 0.2;
  mesh.rotation.y = elapsed * Math.PI * 0.2;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
