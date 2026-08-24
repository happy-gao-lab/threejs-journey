import * as THREE from "three";

// https://threejs.org/docs/#BoxGeometry
// https://threejs.org/docs/#CapsuleGeometry
// https://threejs.org/docs/#CircleGeometry
// https://threejs.org/docs/#ConeGeometry
// https://threejs.org/docs/#CylinderGeometry
// https://threejs.org/docs/#DodecahedronGeometry
// https://threejs.org/docs/#EdgesGeometry
// http://threejs.org/docs/#ExtrudeGeometry
// https://threejs.org/docs/#IcosahedronGeometry
// https://threejs.org/docs/#LatheGeometry
// https://threejs.org/docs/#OctahedronGeometry
// https://threejs.org/docs/#PlaneGeometry
// https://threejs.org/docs/#PolyhedronGeometry
// https://threejs.org/docs/#RingGeometry
// https://threejs.org/docs/#ShapeGeometry
// https://threejs.org/docs/#SphereGeometry
// https://threejs.org/docs/#TetrahedronGeometry
// https://threejs.org/docs/#TorusGeometry
// https://threejs.org/docs/#TorusKnotGeometry
// https://threejs.org/docs/#TubeGeometry
// https://threejs.org/docs/#WireframeGeometry

// https://threejs.org/docs/#BufferGeometry

// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array

// Constants
const sizes = {
  width: 800,
  height: 600,
};

const canvas = document.getElementById("webgl");

//! BoxGeometry - a rectangular cuboid with a given width, height, and depth. On creation, the cuboid is centred on the origin, with each edge parallel to one of the axes.
// // new BoxGeometry( width : number, height : number, depth : number, widthSegments : number, heightSegments : number, depthSegments : number )
// const geometry = new THREE.BoxGeometry(1, 1, 1, 1, 1, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! CapsuleGeometry - a cylinder with a hemisphere at each end, like a pill.
// // new CapsuleGeometry( radius : number, height : number, capSegments : number, radialSegments : number, heightSegments : number )
// const geometry = new THREE.CapsuleGeometry(1, 1, 4, 8, 1);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! CircleGeometry - simple shape of Euclidean geometry. It is constructed from a number of triangular segments that are oriented around a central point and extend as far out as a given radius.
// // new CircleGeometry( radius : number, segments : number, thetaStart : number, thetaLength : number )
// const geometry = new THREE.CircleGeometry(1, 32, 0, Math.PI * 2);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   side: THREE.DoubleSide,
// });
// const mesh = new THREE.Mesh(geometry, material);

//! ConeGeometry - a cylinder with one end tapered to a point.
// // new ConeGeometry( radius : number, height : number, radialSegments : number, heightSegments : number, openEnded : boolean, thetaStart : number, thetaLength : number )
// const geometry = new THREE.ConeGeometry(1, 1, 32, 1, false, 0, Math.PI * 2);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! CylinderGeometry - a cylinder, optionally with different top and bottom radii.
// // new CylinderGeometry( radiusTop : number, radiusBottom : number, height : number, radialSegments : number, heightSegments : number, openEnded : boolean, thetaStart : number, thetaLength : number )
// const geometry = new THREE.CylinderGeometry(
//   1,
//   1,
//   1,
//   32,
//   1,
//   false,
//   0,
//   Math.PI * 2,
// );
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! DodecahedronGeometry - a polyhedron with 12 pentagonal faces.
// // new DodecahedronGeometry( radius : number, detail : number )
// const geometry = new THREE.DodecahedronGeometry(1, 0);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! EdgesGeometry - can be used as a helper object to view the edges of a geometry.
// // new EdgesGeometry( geometry : BufferGeometry, thresholdAngle : number )
// const edges = new THREE.EdgesGeometry(geometry, 1);
// const line = new THREE.LineSegments(edges);
// mesh.add(line);

//! ExtrudeGeometry -  extruded geometry from a path shape.
// // new ExtrudeGeometry( shapes : Shape | Array.<Shape>, options : ExtrudeGeometry~Options )
// const length = 6,
//   width = 4;
// const shape = new THREE.Shape();
// shape.moveTo(0, 0);
// shape.lineTo(0, width);
// shape.lineTo(length, width);
// shape.lineTo(length, 0);
// shape.lineTo(0, 0);
// const geometry = new THREE.ExtrudeGeometry(shape);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);
// // The shape's points were drawn starting from a corner, not around the origin,
// // so the resulting geometry needs to be recentered explicitly
// geometry.center();
// mesh.scale.set(0.5, 0.5, 0.5);

//! IcosahedronGeometry - a polyhedron with 20 triangular faces.
// // new IcosahedronGeometry( radius : number, detail : number )
// const geometry = new THREE.IcosahedronGeometry(1, 0);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! LatheGeometry - creates meshes with axial symmetry like vases. The lathe rotates around the Y axis.
// // new LatheGeometry( points : Array.<(Vector2|Vector3)>, segments : number, phiStart : number, phiLength : number )
// const points = [];
// for (let i = 0; i < 10; i++) {
//   points.push(new THREE.Vector2(Math.sin(i * 0.2) * 10 + 5, (i - 5) * 2));
// }
// const geometry = new THREE.LatheGeometry(points, 12, 0, Math.PI * 2);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);
// // The lathe points span a radius of roughly 13-15 units, which would put the camera
// // (at z: 3) inside the shape - scaled down here so the whole thing is visible from outside
// mesh.scale.set(0.1, 0.1, 0.1);

//! OctahedronGeometry - a polyhedron with 8 triangular faces.
// // new OctahedronGeometry( radius : number, detail : number )
// const geometry = new THREE.OctahedronGeometry(1, 0);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! PlaneGeometry - a flat, two-dimensional rectangle.
// // new PlaneGeometry( width : number, height : number, widthSegments : number, heightSegments : number )
// const geometry = new THREE.PlaneGeometry(1, 1);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   side: THREE.DoubleSide,
// });
// const mesh = new THREE.Mesh(geometry, material);

//! PolyhedronGeometry - a solid in three dimensions with flat faces. This class will take an array of vertices, project them onto a sphere, and then divide them up to the desired level of detail.
// // new PolyhedronGeometry( vertices : Array.<number>, indices : Array.<number>, radius : number, detail : number )
// const vertices = [1, 1, 1, -1, -1, 1, -1, 1, -1, 1, -1, -1];
// const indices = [2, 1, 0, 0, 3, 2, 1, 3, 0, 2, 3, 1];
// const geometry = new THREE.PolyhedronGeometry(vertices, indices, 1, 0);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! RingGeometry - two-dimensional ring geometry.
// // new RingGeometry( innerRadius : number, outerRadius : number, thetaSegments : number, phiSegments : number, thetaStart : number, thetaLength : number )
// const geometry = new THREE.RingGeometry(0.5, 1, 32);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   side: THREE.DoubleSide,
// });
// const mesh = new THREE.Mesh(geometry, material);

//! ShapeGeometry - creates an one-sided polygonal geometry from one or more path shapes.
// // new ShapeGeometry( shapes : Shape | Array.<Shape>, curveSegments : number )
// const arcShape = new THREE.Shape()
//   .moveTo(5, 1)
//   .absarc(1, 1, 4, 0, Math.PI * 2, false);
// const geometry = new THREE.ShapeGeometry(arcShape, 12);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   side: THREE.DoubleSide,
// });
// const mesh = new THREE.Mesh(geometry, material);
// // The arc's radius (4) makes the shape larger than the default camera framing, hence the scale-down
// mesh.scale.set(0.3, 0.3, 0.3);

//! SphereGeometry - a sphere built from a given number of width and height segments.
// // new SphereGeometry( radius : number, widthSegments : number, heightSegments : number, phiStart : number, phiLength : number, thetaStart : number, thetaLength : number )
// const geometry = new THREE.SphereGeometry(
//   1,
//   32,
//   16,
//   0,
//   Math.PI * 2,
//   0,
//   Math.PI * 2,
// );
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! TetrahedronGeometry - a polyhedron with 4 triangular faces.
// // new TetrahedronGeometry( radius : number, detail : number )
// const geometry = new THREE.TetrahedronGeometry(1, 0);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! TorusGeometry - a donut shape.
// // new TorusGeometry( radius : number, tube : number, radialSegments : number, tubularSegments : number, arc : number, thetaStart : number, thetaLength : number )
// const geometry = new THREE.TorusGeometry(
//   1,
//   0.4,
//   12,
//   48,
//   Math.PI * 2,
//   0,
//   Math.PI * 2,
// );
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! TorusKnotGeometry - the particular shape of which is defined by a pair of coprime integers, p and q. If p and q are not coprime, the result will be a torus link.
// // new TorusKnotGeometry( radius : number, tube : number, tubularSegments : number, radialSegments : number, p : number, q : number )
// const geometry = new THREE.TorusKnotGeometry(1, 0.4, 64, 8, 2, 3);
// const material = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// const mesh = new THREE.Mesh(geometry, material);

//! TubeGeometry - creates a tube that extrudes along a 3D curve.
// // new TubeGeometry( path : Curve, tubularSegments : number, radius : number, radialSegments : number, closed : boolean )
// // Custom curve defining the path the tube is extruded along - THREE.Curve subclasses
// // must implement getPoint(t), where t ranges from 0 to 1 along the curve's length
// class CustomSinCurve extends THREE.Curve {
//   getPoint(t, optionalTarget = new THREE.Vector3()) {
//     const tx = t * 3 - 1.5;
//     const ty = Math.sin(2 * Math.PI * t);
//     const tz = 0;
//     return optionalTarget.set(tx, ty, tz);
//   }
// }
// const path = new CustomSinCurve(10);
// const geometry = new THREE.TubeGeometry(path, 64, 1, 8, false);
// const material = new THREE.MeshBasicMaterial({
//   color: 0xffff00,
//   side: THREE.DoubleSide,
// });
// const mesh = new THREE.Mesh(geometry, material);
// // CustomSinCurve spans roughly 3 units wide and 1 unit tall - scaled down to fit the framing better
// mesh.scale.set(0.6, 0.6, 0.6);

//! Wireframe - can be used as a helper object to visualize a geometry as a wireframe.
// // new WireframeGeometry( geometry : BufferGeometry )
// const wireframeMaterial = new THREE.MeshBasicMaterial({
//   color: 0x000000,
//   wireframe: true,
// });
// const wireframeMesh = new THREE.Mesh(geometry, wireframeMaterial);
// mesh.add(wireframeMesh);

//! BufferGeometry - a representation of mesh, line, or point geometry. Includes vertex positions, face indices, normals, colors, UVs, and custom attributes within buffers, reducing the cost of passing all this data to the GPU.
// new BufferGeometry()
const geometry = new THREE.BufferGeometry();
// count triangles, each with 3 vertices, each vertex with 3 coordinates (x, y, z)
const count = 50;

// .fill(Math.random() - 0.5) would NOT work here - Math.random() only runs once,
// and .fill() copies that single value into every slot, collapsing every vertex
// onto the same point. Each value must be generated individually in a loop instead.
// const positionsArray = new Float32Array(count * 3 * 3).fill(
//   Math.random() - 0.5,
// );
const positionsArray = new Float32Array(count * 3 * 3);

for (let i = 0; i < positionsArray.length; i++) {
  positionsArray[i] = Math.random() - 0.5;
}

// itemSize: 3 tells Three.js to group every 3 numbers in the array into one Vector3
const positionsAttribute = new THREE.BufferAttribute(positionsArray, 3);
geometry.setAttribute("position", positionsAttribute);
const material = new THREE.MeshBasicMaterial({
  color: 0xffff00,
  side: THREE.DoubleSide,
});
const mesh = new THREE.Mesh(geometry, material);

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

renderer.setSize(sizes.width, sizes.height);

const timer = new THREE.Timer();

const tick = () => {
  timer.update();

  const elapsed = timer.getElapsed();

  mesh.rotation.y = elapsed * Math.PI * 0.2;

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
