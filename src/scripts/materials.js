import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import GUI from "lil-gui";
import {
  WebGPURenderer,
  MeshBasicNodeMaterial,
  MeshLambertNodeMaterial,
  MeshMatcapNodeMaterial,
  MeshNormalNodeMaterial,
} from "three/webgpu";
import { Line2 } from "three/addons/lines/webgpu/Line2.js";
import { LineGeometry } from "three/addons/lines/LineGeometry.js";

// https://threejs.org/docs/#MeshBasicMaterial
// https://threejs.org/docs/#MeshDepthMaterial
// https://threejs.org/docs/#MeshLambertMaterial
// https://threejs.org/docs/#MeshMatcapMaterial
// https://threejs.org/docs/#MeshNormalMaterial
// https://threejs.org/docs/#MeshPhysicalMaterial
// https://threejs.org/docs/#MeshStandardMaterial
// https://threejs.org/docs/#MeshToonMaterial
// https://threejs.org/docs/#PointsMaterial

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

// Light
const light = new THREE.DirectionalLight(0xffffff, 3);
light.position.set(2, 2, 2);

scene.add(light);

// Debug UI
const gui = new GUI({ title: "Materials", width: 300 });

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);

// Created once with a placeholder material - each section below reassigns
// mesh.material instead of declaring its own const material/const mesh, so any
// single section can be selected and uncommented independently without colliding
// with this shared declaration
const mesh = new THREE.Mesh(geometry, new THREE.MeshBasicMaterial());
scene.add(mesh);

// //! MeshBasicMaterial - a material for drawing geometries in a simple shaded (flat or wireframe) way. This material is not affected by lights.
// // Perf: cheapest material available. Light: ignored entirely. Shadows: can cast/receive,
// // but a received shadow shows as a flat, unlit dark patch since there's no lighting calculation.
// mesh.material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const meshBasicFolder = gui.addFolder("MeshBasicMaterial");
// meshBasicFolder.addColor(mesh.material, "color");
// meshBasicFolder.add(mesh.material, "wireframe");

// //! MeshDepthMaterial - a material for drawing geometry by depth. Depth is based off of the camera near and far plane. White is nearest, black is farthest.
// // Perf: cheap, no lighting calculations. Light: ignored - color comes purely from
// // depth, not from any light source. Shadows: not meaningful to cast/receive - this
// // is essentially what Three.js renders internally to build shadow maps in the first place.
// mesh.material = new THREE.MeshDepthMaterial();
// const meshDepthFolder = gui.addFolder("MeshDepthMaterial");
// meshDepthFolder.add(mesh.material, "wireframe");

// //! MeshLambertMaterial - a material for non-shiny surfaces, without specular highlights.
// // The material uses a non-physically based Lambertian model for calculating reflectance. This can simulate some surfaces (such as untreated wood or stone) well, but cannot simulate shiny surfaces with specular highlights (such as varnished wood). MeshLambertMaterial uses per-fragment shading.]
// // Due to the simplicity of the reflectance and illumination models, performance will be greater when using this material over the MeshPhongMaterial, MeshStandardMaterial or MeshPhysicalMaterial, at the cost of some graphical accuracy.
// // Perf: cheap, one of the fastest lit materials. Light: required - renders black
// // without one. Shadows: casts and receives normally.
// mesh.material = new THREE.MeshLambertMaterial({ color: 0xff0000 });
// const meshLambertFolder = gui.addFolder("MeshLambertMaterial");
// meshLambertFolder.addColor(mesh.material, "color");
// meshLambertFolder.add(mesh.material, "wireframe");

// //! MeshMatcapMaterial - is defined by a MatCap (or Lit Sphere) texture, which encodes the material color and shading.
// // does not respond to lights since the matcap image file encodes baked lighting. It will cast a shadow onto an object that receives shadows (and shadow clipping works), but it will not self-shadow or receive shadows.
// // Perf: cheap - no real-time lighting math, just a texture lookup. Light: ignored
// // (baked into the matcap texture itself). Shadows: can cast shadows onto other
// // objects, but does not receive or self-shadow.
// const textureLoader = new THREE.TextureLoader();
// const matcapTexture = textureLoader.load("/textures/matcaps/3.png");
// mesh.material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
// const meshMatcapFolder = gui.addFolder("MeshMatcapMaterial");
// meshMatcapFolder.addColor(mesh.material, "color");
// meshMatcapFolder.add(mesh.material, "wireframe");

// //! MeshNormalMaterial - a material that maps the normal vectors to RGB colors.
// // Perf: cheap, no lighting calculations. Light: ignored - color comes from the
// // surface normal direction, not illumination. Shadows: not meaningful, since color
// // isn't tied to real lighting.
// mesh.material = new THREE.MeshNormalMaterial();
// const meshNormalFolder = gui.addFolder("MeshNormalMaterial");
// meshNormalFolder.add(mesh.material, "flatShading");
// meshNormalFolder.add(mesh.material, "wireframe");

// //! MeshPhongMaterial - a material for shiny surfaces with specular highlights.
// // The material uses a non-physically based Blinn-Phong model for calculating reflectance. Unlike the Lambertian model used in the MeshLambertMaterial this can simulate shiny surfaces with specular highlights (such as varnished wood). MeshPhongMaterial uses per-fragment shading.
// // Performance will generally be greater when using this material over the MeshStandardMaterial or MeshPhysicalMaterial, at the cost of some graphical accuracy.
// // Perf: moderate - more expensive than Lambert due to the specular term, cheaper
// // than Standard/Physical. Light: required. Shadows: casts and receives normally.
// mesh.material = new THREE.MeshPhongMaterial({
//   color: 0xff0000,
//   shininess: 100,
//   specular: 0x1188ff,
// });
// const meshPhongFolder = gui.addFolder("MeshPhongMaterial");
// meshPhongFolder.addColor(mesh.material, "color");
// meshPhongFolder.addColor(mesh.material, "specular");
// meshPhongFolder.add(mesh.material, "shininess").min(0).max(200).step(1);
// meshPhongFolder.add(mesh.material, "wireframe");

// //! MeshPhysicalMaterial - an extension of the MeshStandardMaterial, providing more advanced physically-based rendering properties:
// // Anisotropy: Ability to represent the anisotropic property of materials as observable with brushed metals.
// // Clearcoat: Some materials — like car paints, carbon fiber, and wet surfaces — require a clear, reflective layer on top of another layer that may be irregular or rough. Clearcoat approximates this effect, without the need for a separate transparent surface.
// // Iridescence: Allows to render the effect where hue varies depending on the viewing angle and illumination angle. This can be seen on soap bubbles, oil films, or on the wings of many insects.
// // Physically-based transparency: One limitation of Material#opacity is that highly transparent materials are less reflective. Physically-based transmission provides a more realistic option for thin, transparent surfaces like glass.
// // Advanced reflectivity: More flexible reflectivity for non-metallic materials.
// // Sheen: Can be used for representing cloth and fabric materials.
// // As a result of these complex shading features, MeshPhysicalMaterial has a higher performance cost, per pixel, than other three.js materials. Most effects are disabled by default, and add cost as they are enabled. For best results, always specify an environment map when using this material.
// // Perf: the most expensive built-in material - each enabled feature (clearcoat,
// // sheen, transmission, iridescence...) adds further per-pixel cost on top of the base
// // PBR calculation. Light: required. Shadows: casts and receives normally.
// mesh.material = new THREE.MeshPhysicalMaterial({
//   color: 0xff0000,
//   roughness: 0.3,
//   metalness: 0,
//   clearcoat: 1,
//   clearcoatRoughness: 0.1,
// });
// const meshPhysicalFolder = gui.addFolder("MeshPhysicalMaterial");
// meshPhysicalFolder.addColor(mesh.material, "color");
// meshPhysicalFolder.add(mesh.material, "roughness").min(0).max(1).step(0.01);
// meshPhysicalFolder.add(mesh.material, "metalness").min(0).max(1).step(0.01);
// meshPhysicalFolder.add(mesh.material, "clearcoat").min(0).max(1).step(0.01);
// meshPhysicalFolder
//   .add(mesh.material, "clearcoatRoughness")
//   .min(0)
//   .max(1)
//   .step(0.01);
// meshPhysicalFolder.add(mesh.material, "wireframe");

// //! MeshStandardMaterial - a standard physically based material, using Metallic-Roughness workflow.
// // Physically based rendering (PBR) has recently become the standard in many 3D applications, such as Unity, Unreal and 3D Studio Max.
// // This approach differs from older approaches in that instead of using approximations for the way in which light interacts with a surface, a physically correct model is used. The idea is that, instead of tweaking materials to look good under specific lighting, a material can be created that will react 'correctly' under all lighting scenarios.
// // In practice this gives a more accurate and realistic looking result than the MeshLambertMaterial or MeshPhongMaterial, at the cost of being somewhat more computationally expensive. MeshStandardMaterial uses per-fragment shading.
// // Note that for best results you should always specify an environment map when using this material.
// // Perf: moderate-to-expensive PBR calculations, but cheaper than Physical since the
// // advanced features (clearcoat, sheen, etc.) aren't available at all here. Light:
// // required. Shadows: casts and receives normally.
// mesh.material = new THREE.MeshStandardMaterial({
//   color: 0xff0000,
//   roughness: 0.5,
//   metalness: 0,
// });
// const meshStandardFolder = gui.addFolder("MeshStandardMaterial");
// meshStandardFolder.addColor(mesh.material, "color");
// meshStandardFolder.add(mesh.material, "roughness").min(0).max(1).step(0.01);
// meshStandardFolder.add(mesh.material, "metalness").min(0).max(1).step(0.01);
// meshStandardFolder.add(mesh.material, "wireframe");

// //! MeshToonMaterial - a material implementing toon shading.
// // Perf: cheap-to-moderate - simple step-based shading. Light: required. Shadows:
// // casts and receives normally. A custom gradientMap needs
// // gradientMap.minFilter/magFilter set to THREE.NearestFilter, otherwise linear
// // texture filtering blurs the discrete shading bands that define the toon look.
// mesh.material = new THREE.MeshToonMaterial({ color: 0xff0000 });
// const meshToonFolder = gui.addFolder("MeshToonMaterial");
// meshToonFolder.addColor(mesh.material, "color");
// meshToonFolder.add(mesh.material, "wireframe");

const renderer = new THREE.WebGLRenderer({ canvas });

renderer.setSize(sizes.width, sizes.height);

const timer = new THREE.Timer();

const tick = () => {
  timer.update();
  const elapsed = timer.getElapsed();
  controls.update();

  mesh.rotation.x = elapsed * Math.PI * 0.1;
  mesh.rotation.y = elapsed * Math.PI * 0.1;

  renderer.render(scene, camera);
  window.requestAnimationFrame(tick);
};

tick();
