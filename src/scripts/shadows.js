import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

// https://threejs.org/examples/webgl_shadowmap_viewer.html

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

const object = new THREE.Mesh(new THREE.TorusKnotGeometry(0.4, 0.2), material);

// castShadow: this object can cast a shadow onto other objects (perf cost: it gets
// rendered an extra time, from the light's point of view, into the shadow map)
object.castShadow = true;

const plane = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -1.5;

// receiveShadow: this object can have shadows rendered onto its own surface. Perf
// cost is much smaller than castShadow - it's just an extra shadow-map lookup per
// fragment, not a whole extra render pass
plane.receiveShadow = true;

// Ambient light
const ambientLight = new THREE.AmbientLight(0xffffff, 1);

// Scene
const scene = new THREE.Scene();

scene.add(camera, object, plane, ambientLight);

// //! Directional light - parallel rays, like sunlight.
// // Perf: cheapest of these three to shadow-cast with - a single render pass, same
// // as SpotLight, but with no perspective/distance falloff math on top.
// const light = new THREE.DirectionalLight(0xffffff, 1.5);

// // Uses OrthographicCamera - top/right/bottom/left define the box of world space
// // captured in the shadow map (parallel rays have no field of view to speak of)
// light.shadow.camera.top = 2;
// light.shadow.camera.right = 2;
// light.shadow.camera.bottom = -2;
// light.shadow.camera.left = -2;

// //! Spot light - single point, cone of light.
// // Perf: moderate - a single render pass (like DirectionalLight), but the camera is
// // a PerspectiveCamera so it also carries the usual perspective projection cost.
const light = new THREE.SpotLight(0xffffff, 20, 10, Math.PI * 0.2);

// Uses PerspectiveCamera - fov here is independent of the light's own cone angle
// (Math.PI * 0.2 above); a mismatch means the shadow camera captures more or less
// area than the visible light cone actually covers
light.shadow.camera.fov = 30;

// //! Point light - single point, all directions.
// // Perf: the most expensive of the three - internally renders the scene 6 times
// // (once per cube face direction) to build the shadow, instead of a single pass.
// // Uses PerspectiveCamera in all 6 directions, but fov isn't configurable (fixed at 90°,
// // since each face must cover exactly a sixth of the surrounding sphere)
// const light = new THREE.PointLight(0xffffff, 10, 10);

const lightCameraHelper = new THREE.CameraHelper(light.shadow.camera);
// lightCameraHelper.visible = false;

light.position.set(2, 2, -1);
light.castShadow = true;

light.shadow.mapSize.width = 1024;
light.shadow.mapSize.height = 1024;

// radius blurs shadow edges, but only has an effect with PCFShadowMap/VSMShadowMap -
// PCFSoftShadowMap already does its own (fixed) softening internally, so radius is ignored
// // Doesn't work with THREE.PCFSoftShadowMap
// // light.shadow.radius = 10;

light.shadow.camera.near = 2;
light.shadow.camera.far = 7;

light.shadow.camera.updateProjectionMatrix();
lightCameraHelper.update();

scene.add(light, lightCameraHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// THREE.BasicShadowMap - cheapest, hard-edged, aliased shadows
// THREE.PCFShadowMap - default; samples neighboring texels for softer edges, moderate cost
// THREE.PCFSoftShadowMap - similar to PCFShadowMap but with better-looking, slightly
// more expensive softening; radius has no effect with this type
// THREE.VSMShadowMap - supports light.shadow.radius for adjustable blur, most
// expensive of the four, can show light-bleeding artifacts in some scenes

const tick = () => {
  controls.update();
  timer.update();

  const elapsed = timer.getElapsed();

  object.rotation.x = elapsed * Math.PI * 0.2;
  object.rotation.z = elapsed * Math.PI * 0.2;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
