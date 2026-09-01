import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RectAreaLightUniformsLib, Sky } from "three/examples/jsm/Addons.js";

// Constants
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

const METRICS = {
  floorWidth: 20,
  floorHeight: 20,
  wallsWidth: 4,
  wallsHeight: 2.5,
  wallsDepth: 4,
  roofRadius: 3.5,
  roofHeight: 1.5,
  doorHeight: 2.2,
  doorWidth: 2,
  bushDefaultRadius: 1,
  graveWidth: 0.6,
  graveHeight: 0.8,
  graveDepth: 0.2,
  gravesCount: 30,
  deadZoneRadius: 5,
};

// Canvas
const canvas = document.getElementById("webgl");

canvas.style.position = "fixed";
canvas.style.top = "0";
canvas.style.left = "0";
canvas.style.outline = "none";

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100,
);

camera.position.set(4, 2, 8);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

// AxesHelper
const axesHelper = new THREE.AxesHelper();
axesHelper.material.depthTest = false;
axesHelper.renderOrder = 999;
axesHelper.visible = false;

// Lights
const ambientLight = new THREE.AmbientLight(0x86cdff, 1);
const directionalLight = new THREE.DirectionalLight(0x86cdff, 3);

directionalLight.position.set(3, 2, -8);

// Scene
const scene = new THREE.Scene();

scene.add(camera, axesHelper, ambientLight, directionalLight);

// Textures
const textureLoader = new THREE.TextureLoader();

// arm = a single packed texture combining ambientOcclusion (R), roughness (G) and
// metalness (B) channels - one file instead of three separate maps
const floorTextures = {
  alpha: textureLoader.load("./textures/floor/alpha.jpg"),
  arm: textureLoader.load("./textures/floor/arm.png"),
  diff: textureLoader.load("./textures/floor/diff.jpg"),
  disp: textureLoader.load("./textures/floor/disp.jpg"),
  nor: textureLoader.load("./textures/floor/nor.png"),
};

floorTextures.diff.colorSpace = THREE.SRGBColorSpace;

// repeat + RepeatWrapping on both axes: tiles the texture across the (large) floor
// instead of stretching one image over the whole 20x20 plane. The same pattern
// repeats below for walls/roof/bush at their own repeat counts
floorTextures.diff.repeat.set(4, 4);
floorTextures.diff.wrapS = THREE.RepeatWrapping;
floorTextures.diff.wrapT = THREE.RepeatWrapping;

floorTextures.arm.repeat.set(4, 4);
floorTextures.arm.wrapS = THREE.RepeatWrapping;
floorTextures.arm.wrapT = THREE.RepeatWrapping;

floorTextures.disp.repeat.set(4, 4);
floorTextures.disp.wrapS = THREE.RepeatWrapping;
floorTextures.disp.wrapT = THREE.RepeatWrapping;

floorTextures.nor.repeat.set(4, 4);
floorTextures.nor.wrapS = THREE.RepeatWrapping;
floorTextures.nor.wrapT = THREE.RepeatWrapping;

const wallsTextures = {
  arm: textureLoader.load("./textures/walls/arm.png"),
  diff: textureLoader.load("./textures/walls/diff.jpg"),
  nor: textureLoader.load("./textures/walls/nor.png"),
};

wallsTextures.diff.colorSpace = THREE.SRGBColorSpace;

wallsTextures.diff.repeat.set(2, 2);
wallsTextures.diff.wrapS = THREE.RepeatWrapping;
wallsTextures.diff.wrapT = THREE.RepeatWrapping;

wallsTextures.arm.repeat.set(2, 2);
wallsTextures.arm.wrapS = THREE.RepeatWrapping;
wallsTextures.arm.wrapT = THREE.RepeatWrapping;

wallsTextures.nor.repeat.set(2, 2);
wallsTextures.nor.wrapS = THREE.RepeatWrapping;
wallsTextures.nor.wrapT = THREE.RepeatWrapping;

// Roof texture is tilted to pne side, better to computeVertexNormals
const roofTextures = {
  arm: textureLoader.load("./textures/roof/arm.png"),
  diff: textureLoader.load("./textures/roof/diff.jpg"),
  nor: textureLoader.load("./textures/roof/nor.png"),
};

roofTextures.diff.colorSpace = THREE.SRGBColorSpace;

roofTextures.diff.repeat.set(3, 1);
roofTextures.diff.wrapS = THREE.RepeatWrapping;

roofTextures.arm.repeat.set(3, 1);
roofTextures.arm.wrapS = THREE.RepeatWrapping;

roofTextures.nor.repeat.set(3, 1);
roofTextures.nor.wrapS = THREE.RepeatWrapping;

const bushTextures = {
  arm: textureLoader.load("./textures/bush/arm.png"),
  diff: textureLoader.load("./textures/bush/diff.jpg"),
  nor: textureLoader.load("./textures/bush/nor.png"),
};

bushTextures.diff.colorSpace = THREE.SRGBColorSpace;

bushTextures.diff.repeat.set(3, 1);
bushTextures.diff.wrapS = THREE.RepeatWrapping;

bushTextures.arm.repeat.set(3, 1);
bushTextures.arm.wrapS = THREE.RepeatWrapping;

bushTextures.nor.repeat.set(3, 1);
bushTextures.nor.wrapS = THREE.RepeatWrapping;

const graveTextures = {
  arm: textureLoader.load("./textures/grave/arm.png"),
  diff: textureLoader.load("./textures/grave/diff.jpg"),
  nor: textureLoader.load("./textures/grave/nor.png"),
};

graveTextures.diff.colorSpace = THREE.SRGBColorSpace;

const doorTextures = {
  diff: textureLoader.load("./textures/door/color.jpg"),
  alpha: textureLoader.load("./textures/door/alpha.jpg"),
  ao: textureLoader.load("./textures/door/ambientOcclusion.jpg"),
  disp: textureLoader.load("./textures/door/height.jpg"),
  metal: textureLoader.load("./textures/door/metalness.jpg"),
  rough: textureLoader.load("./textures/door/roughness.jpg"),
  nor: textureLoader.load("./textures/door/normal.jpg"),
};

doorTextures.diff.colorSpace = THREE.SRGBColorSpace;

// FLOOR
const floorG = new THREE.PlaneGeometry(
  METRICS.floorWidth,
  METRICS.floorHeight,
  100,
  100,
);
const floorM = new THREE.MeshStandardMaterial({
  // alphaMap fades the floor out near its edges so it doesn't end in a hard visible
  // rectangle - lets the fog take over instead
  transparent: true,
  alphaMap: floorTextures.alpha,
  map: floorTextures.diff,
  // The same arm texture is reused for all three maps - aoMap reads its R channel,
  // roughnessMap its G channel, metalnessMap its B channel
  aoMap: floorTextures.arm,
  metalnessMap: floorTextures.arm,
  roughnessMap: floorTextures.arm,
  normalMap: floorTextures.nor,
  // displacementMap actually moves vertices (needs the extra subdivisions from
  // PlaneGeometry's 100x100 segments below to look smooth, not blocky). Bias shifts
  // the whole displaced surface down so it doesn't float above/clip through neighbors
  displacementMap: floorTextures.disp,
  displacementScale: 0.4,
  displacementBias: -0.2,
});
const floor = new THREE.Mesh(floorG, floorM);

floor.rotation.x = -Math.PI * 0.5;

scene.add(floor);

// HOUSE
const house = new THREE.Group();

scene.add(house);

// Walls
const wallsG = new THREE.BoxGeometry(
  METRICS.wallsWidth,
  METRICS.wallsHeight,
  METRICS.wallsDepth,
);
const wallsM = new THREE.MeshStandardMaterial({
  map: wallsTextures.diff,
  aoMap: wallsTextures.arm,
  metalnessMap: wallsTextures.arm,
  roughnessMap: wallsTextures.arm,
  normalMap: wallsTextures.nor,
});
const walls = new THREE.Mesh(wallsG, wallsM);

walls.position.y = METRICS.wallsHeight * 0.5;

house.add(walls);

// Roof
const roofG = new THREE.ConeGeometry(METRICS.roofRadius, METRICS.roofHeight, 4);
const roofM = new THREE.MeshStandardMaterial({
  map: roofTextures.diff,
  aoMap: roofTextures.arm,
  metalnessMap: roofTextures.arm,
  roughnessMap: roofTextures.arm,
  normalMap: roofTextures.nor,
});
const roof = new THREE.Mesh(roofG, roofM);

roof.position.y = METRICS.wallsHeight + METRICS.roofHeight * 0.5;
roof.rotation.y = Math.PI * 0.25;

house.add(roof);

// Door
const doorG = new THREE.PlaneGeometry(
  METRICS.doorWidth,
  METRICS.doorHeight,
  100,
  100,
);
const doorM = new THREE.MeshStandardMaterial({
  transparent: true,
  map: doorTextures.diff,
  alphaMap: doorTextures.alpha,
  aoMap: doorTextures.ao,
  displacementMap: doorTextures.disp,
  metalnessMap: doorTextures.metal,
  roughnessMap: doorTextures.rough,
  normalMap: doorTextures.nor,
  displacementScale: 0.15,
  displacementBias: -0.04,
});
const door = new THREE.Mesh(doorG, doorM);

door.position.y = METRICS.doorHeight * 0.5 - 0.1; // 0.1 - because of door alpha texture
door.position.z = METRICS.wallsWidth * 0.5 + 0.01; // 0.01 - because of z-fighting

const doorLight = new THREE.Group();
doorLight.position.set(0, 2.4, 2.2);

house.add(door);

// Door light - a small glass "bulb" mesh plus a real PointLight together, since
// neither alone gives the full effect: emissive makes the glass itself look lit from
// within, while the PointLight is what actually casts light/shadows onto the scene
const doorLightBulbG = new THREE.SphereGeometry(0.1);
const doorLightBulbM = new THREE.MeshStandardMaterial({
  color: "yellow",
  transparent: true,
  opacity: 0.5,
  emissive: 0xff7d46,
  emissiveIntensity: 2,
});
const bulbShine = new THREE.PointLight(0xff7d46, 5);
bulbShine.position.set(0, -0.01, 0);
const doorLightBulb = new THREE.Mesh(doorLightBulbG, doorLightBulbM);
doorLight.add(doorLightBulb, bulbShine);

house.add(doorLight);

// Bushes
const bushG = new THREE.SphereGeometry(METRICS.bushDefaultRadius, 16, 16);
const bushM = new THREE.MeshStandardMaterial({
  map: bushTextures.diff,
  aoMap: bushTextures.arm,
  metalnessMap: bushTextures.arm,
  roughnessMap: bushTextures.arm,
  normalMap: bushTextures.nor,
  color: 0xccffcc,
});

const bush1 = new THREE.Mesh(bushG, bushM);
bush1.scale.setScalar(0.5);
bush1.position.set(1.2, 0.2, 2.2);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushG, bushM);
bush2.scale.setScalar(0.25);
bush2.position.set(1.8, 0.1, 2.1);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushG, bushM);
bush3.scale.setScalar(0.4);
bush3.position.set(-1, 0.1, 2.2);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushG, bushM);
bush4.scale.setScalar(0.15);
bush4.position.set(-1, 0.05, 2.6);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

// Graves
const graveG = new THREE.BoxGeometry(
  METRICS.graveWidth,
  METRICS.graveHeight,
  METRICS.graveDepth,
);
const graveM = new THREE.MeshStandardMaterial({
  map: graveTextures.diff,
  aoMap: graveTextures.arm,
  metalnessMap: graveTextures.arm,
  roughnessMap: graveTextures.arm,
  normalMap: graveTextures.nor,
  color: "gray",
});

const graveyard = new THREE.Group();
scene.add(graveyard);

// Placed at a random angle around the house, at a random radius between
// deadZoneRadius and deadZoneRadius + 4 - the deadZoneRadius gap keeps graves from
// spawning inside/too close to the house itself
for (let i = 0; i < METRICS.gravesCount; i++) {
  const grave = new THREE.Mesh(graveG, graveM);
  graveyard.add(grave);

  const angle = Math.random() * Math.PI * 2;
  const radius = METRICS.deadZoneRadius + Math.random() * 4;
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  grave.position.x = x;
  grave.position.y = Math.random() * 0.4;
  grave.position.z = z;

  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
}

// Ghosts - colored PointLights that fly around the house (moved in the tick loop
// below), rather than visible meshes; each one both lights and casts a shadow
const ghost1 = new THREE.PointLight(0x8800ff, 6);
const ghost2 = new THREE.PointLight(0xff0088, 6);
const ghost3 = new THREE.PointLight(0xff0000, 6);

scene.add(ghost1, ghost2, ghost3);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

// Resize
window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const timer = new THREE.Timer();

// Shadows
// Perf: 4 shadow-casting lights at once here (1 directional + 3 point). Each point
// light shadow alone costs 6 render passes (cube map), so this scene already renders
// the shadow-casting geometry 1 + 3*6 = 19 extra times per frame on top of the
// normal camera pass - this is why mapSize is kept small (256) below
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

walls.castShadow = true;
walls.receiveShadow = true;
roof.castShadow = true;
floor.receiveShadow = true;

for (const grave of graveyard.children) {
  grave.castShadow = true;
  grave.receiveShadow = true;
}

// Shadow mapping
// DirectionalLightShadow uses an OrthographicCamera - top/right/bottom/left define
// the box (in world units, centered on the light) that the shadow map covers; sized
// to roughly cover where the graves/house actually are
directionalLight.shadow.mapSize.width = 256;
directionalLight.shadow.mapSize.height = 256;
directionalLight.shadow.camera.top = 8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;

// PointLightShadow uses a PerspectiveCamera internally (one per cube face) - only
// far is tuned here since fov/aspect are auto-managed by Three.js for point lights
ghost1.shadow.mapSize.width = 256;
ghost1.shadow.mapSize.height = 256;
ghost1.shadow.camera.far = 10;

ghost2.shadow.mapSize.width = 256;
ghost2.shadow.mapSize.height = 256;
ghost2.shadow.camera.far = 10;

ghost3.shadow.mapSize.width = 256;
ghost3.shadow.mapSize.height = 256;
ghost3.shadow.camera.far = 10;

// Sky - physically-based atmospheric scattering skydome (see threejs.org/docs/#Sky)
const sky = new Sky();
// turbidity: haziness of the atmosphere (higher = more scattering/haze)
sky.material.uniforms["turbidity"].value = 10;
// rayleigh: strength of blue-sky scattering
sky.material.uniforms["rayleigh"].value = 1;
// mieCoefficient/mieDirectionalG: strength and directionality of the glow/haze
// around the sun itself, separate from the general sky color
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.9999;
// sunPosition.y controls the sun's elevation above the horizon - low positive
// values (like 0.1 here) give a dusk/evening look; near 0 or negative is too dark,
// higher values (0.3+) look like full daylight
sky.material.uniforms["sunPosition"].value.set(0.3, 0.1, -0.95);
// Hides the bright sun disc itself, which otherwise stays very visible/harsh even
// when the rest of the sky is dim (it's boosted separately in the shader, unrelated
// to the overall scattering brightness)
sky.material.uniforms["showSunDisc"].value = 0;

sky.scale.setScalar(100);

scene.add(sky);

// Fog - fades distant objects into the fog color, hiding the floor's edges and the
// point where the sky sphere meets the ground
// scene.fog = new THREE.Fog(0x0b1017, 10, 13); // linear: fades evenly between near/far distances
// FogExp2: density-based (exponential) falloff instead of a linear near/far range -
// thickens gradually rather than a hard start distance
scene.fog = new THREE.FogExp2(0x0b1017, 0.1);

// Animate
const tick = () => {
  timer.update();
  controls.update();

  const elapsed = timer.getElapsed();

  // Ghosts animation - each ghost orbits the house (x/z via cos/sin at its own
  // radius and speed), while y bobs erratically using a product of three sines at
  // different frequencies, instead of a single smooth sine wave
  const ghost1Angle = elapsed * 0.5;
  ghost1.position.x = Math.cos(ghost1Angle) * METRICS.deadZoneRadius;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * 2.34) *
    Math.sin(ghost1Angle * 3.45);
  ghost1.position.z = Math.sin(ghost1Angle) * METRICS.deadZoneRadius;

  const ghost2Angle = -elapsed * 0.38;
  ghost2.position.x = Math.cos(ghost2Angle) * (METRICS.deadZoneRadius + 1);
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * 2.34) *
    Math.sin(ghost2Angle * 3.45);
  ghost2.position.z = Math.sin(ghost2Angle) * (METRICS.deadZoneRadius + 1);

  const ghost3Angle = elapsed * 0.23;
  ghost3.position.x = Math.cos(ghost3Angle) * (METRICS.deadZoneRadius + 2);
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * 2.34) *
    Math.sin(ghost3Angle * 3.45);
  ghost3.position.z = Math.sin(ghost3Angle) * (METRICS.deadZoneRadius + 3);

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
