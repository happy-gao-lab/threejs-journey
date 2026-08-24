import * as THREE from "three";

// https://threejs.org/docs/#Camera
// https://threejs.org/docs/#ArrayCamera
// https://threejs.org/docs/#StereoCamera
// https://threejs.org/docs/#CubeCamera
// https://threejs.org/docs/#PerspectiveCamera
// https://threejs.org/docs/#OrthographicCamera

// Constants
const sizes = {
  width: 800,
  height: 600,
};

const canvas = document.getElementById("webgl");

const fov = 75;
const aspectRatio = sizes.width / sizes.height;
const near = 0.1;
const far = 100;

// Object
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const wireframeMaterial = new THREE.MeshBasicMaterial({
  color: 0x000000,
  wireframe: true,
});

const mesh = new THREE.Mesh(geometry, material);
// A second mesh reusing the same geometry, rendered as wireframe and nested inside
// the colored mesh so it follows its transforms and appears as an outline on top of it
const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);

mesh.add(wireframeMesh);

// Scene
const scene = new THREE.Scene();

scene.add(mesh);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);

//! ArrayCamera - to render the scene from multiple cameras on specific areas of the render
// // 2x2 grid layout - each sub-camera renders into a quarter of the canvas
// const subCameraWidth = sizes.width / 2;
// const subCameraHeight = sizes.height / 2;
// const subCameraAspect = subCameraWidth / subCameraHeight;

// // Each sub-camera needs its own viewport in pixel coordinates: (x, y, width, height)
// const camera1 = new THREE.PerspectiveCamera(fov, subCameraAspect, near, far);
// const camera2 = new THREE.PerspectiveCamera(fov, subCameraAspect, near, far);
// const camera3 = new THREE.PerspectiveCamera(fov, subCameraAspect, near, far);
// const camera4 = new THREE.PerspectiveCamera(fov, subCameraAspect, near, far);

// camera1.position.set(1, -1, 1);
// camera2.position.set(-1, 1, 1);
// camera3.position.set(1, 1, -1);
// camera4.position.set(-1, -1, -1);

// camera1.viewport = new THREE.Vector4(
//   0,
//   subCameraHeight,
//   subCameraWidth,
//   subCameraHeight,
// );
// camera2.viewport = new THREE.Vector4(
//   subCameraWidth,
//   subCameraHeight,
//   subCameraWidth,
//   subCameraHeight,
// );
// camera3.viewport = new THREE.Vector4(0, 0, subCameraWidth, subCameraHeight);
// camera4.viewport = new THREE.Vector4(
//   subCameraWidth,
//   0,
//   subCameraWidth,
//   subCameraHeight,
// );

// // ArrayCamera takes an array of cameras, each drawn into its own viewport.
// // This "cameras" array only tells the renderer what/where to draw - it is unrelated
// // to the scene graph, which is why .add() below is still needed separately
// const arrayCamera = new THREE.ArrayCamera([camera1, camera2, camera3, camera4]);

// // Sub-cameras must also be added as children so they're part of the scene graph -
// // otherwise their matrixWorld never updates and the position set above is ignored
// arrayCamera.add(camera1, camera2, camera3, camera4);
// arrayCamera.position.set(0, 0, 5);

// scene.add(arrayCamera);
// renderer.render(scene, arrayCamera);

//! StereoCamera - render the scene through two cameras that mimic the eyes to create a parallax effect

// // A single regular camera drives both eyes
// const stereoCamera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
// stereoCamera.position.set(0, 0, 3);

// // StereoCamera itself is not an Object3D (no position/matrixWorld), so it can never be
// // added to the scene - only the regular camera driving it needs to be added above
// const stereo = new THREE.StereoCamera();

// // eyeSep controls the distance between the two eyes (default 0.064)
// stereo.eyeSep = 0.064;

// scene.add(stereoCamera);

// const tick = () => {
//   // Recalculates cameraL/cameraR from the current position/rotation of the main camera
//   stereo.update(stereoCamera);

//   // Left eye - left half of the canvas
//   renderer.setViewport(0, 0, sizes.width / 2, sizes.height);
//   renderer.setScissor(0, 0, sizes.width / 2, sizes.height);
//   renderer.setScissorTest(true);
//   renderer.render(scene, stereo.cameraL);

//   // Right eye - right half of the canvas
//   renderer.setViewport(sizes.width / 2, 0, sizes.width / 2, sizes.height);
//   renderer.setScissor(sizes.width / 2, 0, sizes.width / 2, sizes.height);
//   renderer.setScissorTest(true);

//   renderer.render(scene, stereo.cameraR);

//   window.requestAnimationFrame(tick);
// };

// tick();

//! CubeCamera
// // A regular camera is still needed to actually view the scene - CubeCamera only feeds the envMap
// const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);
// camera.position.set(0, 1, 4);
// scene.add(camera);

// // CubeCamera - renders the scene into a cube texture, used for real-time reflections.
// // It works on its own regardless of whether anything uses the resulting texture -
// // a reflective object (e.g. a sphere with envMap: cubeRenderTarget.texture) is only
// // needed to visualize the effect, not for the CubeCamera itself to function
// const cubeRenderTarget = new THREE.WebGLCubeRenderTarget(256);
// const cubeCamera = new THREE.CubeCamera(near, far, cubeRenderTarget);

// const tick = () => {
//   cubeCamera.update(renderer, scene);

//   renderer.render(scene, camera);
//   window.requestAnimationFrame(tick);
// };

// tick();

//! OrthographicCamera - renders without perspective, parallel lines stay parallel
// const frustumSize = 4; // height of the visible area in scene units

// left/right are multiplied by aspectRatio (top/bottom are not) so the frustum matches
// the canvas proportions - otherwise the image comes out stretched or squished
// const left = (-frustumSize * aspectRatio) / 2;
// const right = (frustumSize * aspectRatio) / 2;
// const top = frustumSize / 2;
// const bottom = -frustumSize / 2;

// const camera = new THREE.OrthographicCamera(
//   left,
//   right,
//   top,
//   bottom,
//   near,
//   far,
// );

// Viewing the cube from a diagonal corner shows three faces at once; with no perspective
// foreshortening their combined outline forms a regular hexagon
// camera.position.set(2, 2, 2);
// camera.lookAt(mesh.position);

// scene.add(camera);

// renderer.render(scene, camera);

//! PerspectiveCamera - the default camera type, mimics human vision with foreshortening
// (objects appear smaller the farther they are from the camera)
// Do not use extreme values for near/far like 0.0001 and 9999999 to prevent z-fighting

const camera = new THREE.PerspectiveCamera(fov, aspectRatio, near, far);

camera.position.set(0, 0, 3);

scene.add(camera);

renderer.render(scene, camera);
