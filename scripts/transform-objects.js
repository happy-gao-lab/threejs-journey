import * as THREE from "three";

// https://threejs.org/docs/#Object3D
// https://threejs.org/docs/#PerspectiveCamera
// https://threejs.org/docs/#Mesh
// https://threejs.org/docs/#Vector3
// https://threejs.org/docs/#AxesHelper
// https://threejs.org/docs/index.html#Euler
// https://threejs.org/docs/#Quaternion
// http://threejs.org/docs/#Group

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

// Position: move the mesh away from the origin along each axis
mesh.position.x = 0.7;
mesh.position.y = -0.6;
mesh.position.z = 1;

// normalize() scales the position vector so its length (distance to center) becomes 1
// mesh.position.normalize();

console.log("Distance from position to center:", mesh.position.length());

// Scale: setting each axis individually (equivalent to scale.set below)
// mesh.scale.x = 2;
// mesh.scale.y = 0.5;
// mesh.scale.z = 0.5;

// Scale: set all three axes at once
mesh.scale.set(2, 0.5, 0.5);

// Math.PI is half a full turn (180 degrees)
mesh.rotation.x = Math.PI * 0.25;
mesh.rotation.y = Math.PI * 0.25;

// Rotation order affects the result when rotating on multiple axes and helps avoid gimbal lock
mesh.rotation.reorder("YXZ");

// Cubes
const cube1 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0xff0000 }),
);

const cube2 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
);

cube2.position.x = -2;

const cube3 = new THREE.Mesh(
  new THREE.BoxGeometry(1, 1, 1),
  new THREE.MeshBasicMaterial({ color: 0x0000ff }),
);

cube3.position.x = 2;

// Group: lets multiple objects be transformed together as one unit
const group = new THREE.Group();

// Adding cubes one by one has the same effect as passing them all at once below
// group.add(cube1);
// group.add(cube2);
// group.add(cube3);
group.add(cube1, cube2, cube3);

// Transforms applied to the group affect all children together
group.position.y = 1;
group.scale.y = 2;
group.rotation.y = 1;

// Camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height);

camera.position.set(0, 0, 3);

// lookAt() rotates the camera to face a given point or vector
// camera.lookAt(new THREE.Vector3(1, 1, 1));
// camera.lookAt(mesh.position);

console.log(
  "Distance from cube to camera:",
  mesh.position.distanceTo(camera.position),
);

// Axes helper: draws colored lines for the x, y, z axes to visualize orientation
const axesHelper = new THREE.AxesHelper();
// Optional argument sets the length of the axes lines
// const axesHelper = new THREE.AxesHelper(3);

// Scene
const scene = new THREE.Scene();

// The single mesh is not added since the group (with the three cubes) is used instead
// scene.add(mesh);
scene.add(group);
scene.add(camera);
scene.add(axesHelper);

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});

renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
