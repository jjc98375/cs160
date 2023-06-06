import * as THREE from "three";

const canvas = document.querySelector("#c");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });

const fov = 100;
const aspect = 4; // the canvas default
const near = 0.9;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);

camera.position.z = 2;

const scene = new THREE.Scene();

//box geometry
const boxWidth = 1;
const boxHeight = 1;
const boxDepth = 1;
const geometry = new THREE.BoxGeometry(boxWidth, boxHeight, boxDepth);

const color = 0xffffff;
const intensity = 1;
const light = new THREE.DirectionalLight(color, intensity);
light.position.set(-1, 2, 4);
scene.add(light);

const cubes = [
  makeInstance(geometry, 0x44aa88, -5),
  makeInstance(geometry, 0x8844aa, -3),
  makeInstance(geometry, 0xaa8844, -1),
];

const loadManager = new THREE.LoadingManager();
const loader = new THREE.TextureLoader(loadManager);

const loadingElem = document.querySelector("#loading");
const progressBarElem = loadingElem.querySelector(".progressbar");

const materials = [
  new THREE.MeshBasicMaterial({ map: loader.load("luffy.webp") }),
  new THREE.MeshBasicMaterial({ map: loader.load("chopper.webp") }),
  new THREE.MeshBasicMaterial({ map: loader.load("nami.webp") }),
  new THREE.MeshBasicMaterial({ map: loader.load("sanji.webp") }),
  new THREE.MeshBasicMaterial({ map: loader.load("usopp.webp") }),
  new THREE.MeshBasicMaterial({ map: loader.load("zoro.webp") }),
];

loadManager.onLoad = () => {
  loadingElem.style.display = "none";
  const cube = new THREE.Mesh(geometry, materials);
  cube.position.x = 3;
  scene.add(cube);
  cubes.push(cube); // add to our list of cubes to rotate
};

loadManager.onProgress = (urlOfLastItemLoaded, itemsLoaded, itemsTotal) => {
  const progress = itemsLoaded / itemsTotal;
  progressBarElem.style.transform = `scaleX(${progress})`;
};

function makeInstance(geometry, color, x) {
  const material = new THREE.MeshPhongMaterial({
    color,
  });

  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  cube.position.x = x;

  return cube;
}

function render(time) {
  time *= 0.001; // convert time to seconds

  cubes.forEach((cube, ndx) => {
    const speed = 1 + ndx * 0.1;
    const rot = time * speed;
    cube.rotation.x = rot;
    cube.rotation.y = rot;
  });

  renderer.render(scene, camera);
  requestAnimationFrame(render);
}
requestAnimationFrame(render);

// function main() {

// }

// function render(time) {
//     time *= 0.001;  // convert time to seconds

//     cube.rotation.x = time;
//     cube.rotation.y = time;

//     renderer.render(scene, camera);

//     requestAnimationFrame(render);
//   }
//   requestAnimationFrame(render);

// const camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 0.01, 10 );
// camera.position.z = 1;

// const scene = new THREE.Scene();

// const geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
// const material = new THREE.MeshNormalMaterial();

// const mesh = new THREE.Mesh( geometry, material );
// scene.add( mesh );

// const renderer = new THREE.WebGLRenderer( { antialias: true } );
// renderer.setSize( window.innerWidth, window.innerHeight );
// renderer.setAnimationLoop( animation );
// document.body.appendChild( renderer.domElement );

// // animation

// function animation( time ) {

// 	mesh.rotation.x = time / 2000;
// 	mesh.rotation.y = time / 1000;

// 	renderer.render( scene, camera );

// }
