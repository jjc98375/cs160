//import * as THREE from './three.js-master/build/three.module.js';
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { OBJLoader } from "three/addons/loaders/OBJLoader.js";
import { MTLLoader } from "three/addons/loaders/MTLLoader.js";
import { GUI } from "three/addons/libs/lil-gui.module.min.js";

class ColorGUIHelper {
  constructor(object, prop) {
    this.object = object;
    this.prop = prop;
  }
  get value() {
    return `#${this.object[this.prop].getHexString()}`;
  }
  set value(hexString) {
    this.object[this.prop].set(hexString);
  }
}


function main() {
  const canvas = document.querySelector("#c");
  const view1Elem = document.querySelector("#view1");
  const view2Elem = document.querySelector("#view2");

  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas,
    logarithmicDepthBuffer: true,
  });

  //setup camera
  const fov = 70;
  const aspect = 2;
  const near = 2;
  const far = 1000;

  const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
  camera.position.set(15, 10, 20);

  const cameraHelper = new THREE.CameraHelper(camera);

  const controls = new OrbitControls(camera, view1Elem);
  controls.target.set(3, 3, 3);
  controls.update();

  const camera2 = new THREE.PerspectiveCamera(
    66, // fov
    5, // aspect
    0.001,
    300 // far
  );
  camera2.position.set(40, 10, 30);
  camera2.lookAt(0, 5, 0);

  const scene = new THREE.Scene();
  scene.add(cameraHelper);
  const loader = new THREE.TextureLoader();

  //Cube
  const width = 3; // ui: width
  const height = 3; // ui: height
  const depth = 3; // ui: depth

  const geometry0 = new THREE.BoxGeometry(width, height, depth);
  const material0 = new THREE.MeshPhongMaterial({
    map: loader.load("resources/images/luffy.webp"),
  });
  const cube0 = new THREE.Mesh(geometry0, material0);
  cube0.position.set(2, 2.5, 0);
  scene.add(cube0);

  const geometry1 = new THREE.BoxGeometry(width, height, depth);
  const material1 = new THREE.MeshPhongMaterial({
    map: loader.load("resources/images/chopper.webp"),
  });
  const cube1 = new THREE.Mesh(geometry1, material1);
  cube1.position.set(5, 2.5, 1);
  scene.add(cube1);

  const geometry2 = new THREE.BoxGeometry(width, height, depth);
  const material2 = new THREE.MeshPhongMaterial({
    map: loader.load("resources/images/nami.webp"),
  });
  const cube2 = new THREE.Mesh(geometry2, material2);
  cube2.position.set(8, 2.5, 2);
  scene.add(cube2);

  //material render camera scene light
  const targetWidth = 100;
  const targetHeight = 100;
  const renderTarget = new THREE.WebGLRenderTarget(targetWidth, targetHeight);

  const material = new THREE.MeshPhongMaterial({
    map: loader.load("resources/images/daijin2.png"),
  });

  const targetFov = 10;
  const targetAspect = targetWidth / targetHeight;
  const targetNear = 0.1;
  const targetFar = 10;
  const targetCamera = new THREE.PerspectiveCamera(
    targetFov,
    targetAspect,
    targetNear,
    targetFar
  );
  targetCamera.position.z = 3;

  const targetScene = new THREE.Scene();
  targetScene.background = new THREE.Color("green");

  {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);
    targetScene.add(light);
  }

  //fog
  {
    const color = 0xffffff; // white
    const near = 0;
    const far = 100;
    scene.fog = new THREE.Fog(color, near, far);
  }

  //set up floor
  {
    const planeSize = 100;

    const loader = new THREE.TextureLoader();
    const texture = loader.load("resources/images/grass.png");
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.magFilter = THREE.NearestFilter;
    const repeats = planeSize / 2;
    texture.repeat.set(repeats, repeats);

    const planeGeo = new THREE.PlaneGeometry(planeSize, planeSize);
    const planeMat = new THREE.MeshPhongMaterial({
      map: texture,
      side: THREE.DoubleSide,
    });
    const mesh = new THREE.Mesh(planeGeo, planeMat);
    mesh.rotation.x = Math.PI * -0.5;
    mesh.position.y = -0.5;
    scene.add(mesh);
  }
  //set up skybox
  {
    const loader = new THREE.TextureLoader();
    const texture = loader.load("resources/images/ucscmchenry.jpg", () => {
      const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
      rt.fromEquirectangularTexture(renderer, texture);
      scene.background = rt.texture;
    });
    console.log("sky");
  }

  //spheres
  {
    const sphereRadius = 3;
    const sphereWidthDivisions = 16;
    const sphereHeightDivisions = 8;
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions
    );

    const loader = new THREE.TextureLoader();
    const sphereMat = new THREE.MeshPhongMaterial({
      map: loader.load("resources/images/earth.jpeg"),
    });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-8, 1, 4);
    scene.add(mesh);
  }
  {
    const sphereRadius = 2;
    const sphereWidthDivisions = 16;
    const sphereHeightDivisions = 8;
    const sphereGeo = new THREE.SphereGeometry(
      sphereRadius,
      sphereWidthDivisions,
      sphereHeightDivisions
    );

    const loader = new THREE.TextureLoader();
    const sphereMat = new THREE.MeshPhongMaterial({
      map: loader.load("resources/images/earth.jpeg"),
    });
    const mesh = new THREE.Mesh(sphereGeo, sphereMat);
    mesh.position.set(-3, 2, 4);
    scene.add(mesh);
  }

  {
    const radius = 4; // ui: radius
    const height = 8; // ui: height
    const radialSegments = 16; // ui: radialSegments
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 5, -20);
    scene.add(mesh);
  }
  {
    const radius = 4; // ui: radius
    const height = 8; // ui: height
    const radialSegments = 16; // ui: radialSegments
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(10, 5, -20);
    scene.add(mesh);
  }
  {
    const radius = 4; // ui: radius
    const height = 8; // ui: height
    const radialSegments = 16; // ui: radialSegments
    const geometry = new THREE.ConeGeometry(radius, height, radialSegments);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(20, 5, -20);
    scene.add(mesh);
  }
  {
    const radiusTop = 4; // ui: radiusTop
    const radiusBottom = 4; // ui: radiusBottom
    const height = 8; // ui: height
    const radialSegments = 12; // ui: radialSegments
    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 5, 20);
    scene.add(mesh);
  }
  {
    const radiusTop = 4; // ui: radiusTop
    const radiusBottom = 4; // ui: radiusBottom
    const height = 8; // ui: height
    const radialSegments = 12; // ui: radialSegments
    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(10, 5, 20);
    scene.add(mesh);
  }
  {
    const radiusTop = 4; // ui: radiusTop
    const radiusBottom = 4; // ui: radiusBottom
    const height = 8; // ui: height
    const radialSegments = 12; // ui: radialSegments
    const geometry = new THREE.CylinderGeometry(
      radiusTop,
      radiusBottom,
      height,
      radialSegments
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-10, 5, 20);
    scene.add(mesh);
  }

  {
    const radius = 7; // ui: radius
    const widthSegments = 12; // ui: widthSegments
    const heightSegments = 8; // ui: heightSegments
    const geometry = new THREE.SphereGeometry(
      radius,
      widthSegments,
      heightSegments
    );
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(30, 30, 30);
    scene.add(mesh);
  }
  {
    const radius = 7; // ui: radius
    const geometry = new THREE.OctahedronGeometry(radius);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(30, 30, -30);
    scene.add(mesh);
  }
  {
    const radius = 7; // ui: radius
    const geometry = new THREE.DodecahedronGeometry(radius);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-30, 30, -30);
    scene.add(mesh);
  }
  {
    const radius = 7;
    const detail = 2;
    const geometry = new THREE.DodecahedronGeometry(radius, detail);
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(-30, 30, 30);
    scene.add(mesh);
  }

  {
    const radius = 3.5;  

    const tubeRadius = 1.5;  
    
    const radialSegments = 8;  
    
    const tubularSegments = 64;  
    
    const p = 2;  
    
    const q = 3;  
    
    const geometry = new THREE.TorusKnotGeometry(
      radius, tubeRadius, tubularSegments, radialSegments, p, q);
      const material = new THREE.MeshPhongMaterial({
        map: loader.load("resources/images/daijin2.png"),
      });
    
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 20, 0);
    scene.add(mesh);
  }

  /*************
   * Obj *
   *************/

  //palmtrees
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./resources/palmtree/palmtree.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./resources/palmtree/palmtree.obj", (root) => {
        scene.add(root);

        // Scale the palm tree object
        root.scale.set(10, 10, 10);

        // Position the palm tree object
        root.position.set(0, 0, 0);

        // Rotate the palm tree object
        root.rotation.set(0, Math.PI / 2, 0);
      });
    });
  }
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./resources/palmtree/palmtree.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./resources/palmtree/palmtree.obj", (root) => {
        scene.add(root);

        // Scale the palm tree object
        root.scale.set(10, 10, 10);

        // Position the palm tree object
        root.position.set(5, 5, 5);

        // Rotate the palm tree object
        root.rotation.set(0, Math.PI / 2, 0);
      });
    });
  }
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./resources/palmtree/palmtree.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./resources/palmtree/palmtree.obj", (root) => {
        scene.add(root);

        // Scale the palm tree object
        root.scale.set(10, 10, 10);

        // Position the palm tree object
        root.position.set(-5, -5, -5);

        // Rotate the palm tree object
        root.rotation.set(0, Math.PI / 2, 0);
      });
    });
  }

  // couch
  {
    const mtlLoader = new MTLLoader();
    mtlLoader.load("./resources/Campfire/Campfire.mtl", (mtl) => {
      mtl.preload();
      const objLoader = new OBJLoader();
      objLoader.setMaterials(mtl);
      objLoader.load("./resources/Campfire/Campfire.obj", (root) => {
        scene.add(root);
        // Scale the palm tree object
        root.scale.set(10, 10, 10);

        // Position the palm tree object
        root.position.set(30, 3, 10);

        // Rotate the palm tree object
        root.rotation.set(0, Math.PI / 2, 0);
      });
    });
  }

  // {
  //   const color = 0xffffff;
  //   const intensity = 1;
  //   const light = new THREE.AmbientLight(color, intensity);
  //   scene.add(light);

  //   const gui = new GUI();
  //   gui.addColor(new ColorGUIHelper(light, "color"), "value").name("color");
  //   gui.add(light, "intensity", 0, 2, 0.01);
  //   gui.add(light.target.position, "x", -10, 10);
  //   gui.add(light.target.position, "z", -10, 10);
  //   gui.add(light.target.position, "y", 0, 10);
  // }

  // //ambient
  {
    const color = 0xffffff;
    const intensity = 0.7;
    const light = new THREE.AmbientLight(color, intensity);
    scene.add(light);
  }
  //direct
  {
    const color = 0xffffff;
    const intensity = 0.5;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(80, 80, 80);
    light.target.position.set(60, 60, 60);
    scene.add(light);
    scene.add(light.target);
  }
  //spot
  {
    const color = 0xffffff;
    const intensity = 0.5;
    const light = new THREE.SpotLight(color, intensity);
    light.position.set(30, 30, 30);
    light.target.position.set(-5, -5, -5);
    scene.add(light);
    scene.add(light.target);
  }

  function resizeRendererToDisplaySize(renderer) {
    const canvas = renderer.domElement;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
      renderer.setSize(width, height, false);
    }
    return needResize;
  }
  //camera
  function setScissorForElement(elem) {
    const canvasRect = canvas.getBoundingClientRect();
    const elemRect = elem.getBoundingClientRect();

    const right = Math.min(elemRect.right, canvasRect.right) - canvasRect.left;
    const left = Math.max(0, elemRect.left - canvasRect.left);
    const bottom =
      Math.min(elemRect.bottom, canvasRect.bottom) - canvasRect.top;
    const top = Math.max(0, elemRect.top - canvasRect.top);

    const width = Math.min(canvasRect.width, right - left);
    const height = Math.min(canvasRect.height, bottom - top);

    const positiveYUpBottom = canvasRect.height - bottom;
    renderer.setScissor(left, positiveYUpBottom, width, height);
    renderer.setViewport(left, positiveYUpBottom, width, height);

    return (width / height) * 2;
  }

  function render(time) {
    time *= 0.001;

    cube0.rotation.x = time;
    cube0.rotation.y = time;

    cube1.rotation.x = time;
    cube1.rotation.y = time;

    cube2.rotation.x = time;
    cube2.rotation.y = time;

    // cube.rotation.x = time;
    // cube.rotation.y = time;

    renderer.setRenderTarget(renderTarget);
    renderer.render(targetScene, targetCamera);
    renderer.setRenderTarget(null);

    resizeRendererToDisplaySize(renderer);

    // turn on the scissor
    renderer.setScissorTest(true);
    // render the original view
    {
      const aspect = setScissorForElement(view1Elem);

      // adjust the camera for this aspect
      camera.left = -aspect;
      camera.right = aspect;

      camera.updateProjectionMatrix();
      cameraHelper.update();

      // don't draw the camera helper in the original view
      cameraHelper.visible = false;

      // render
      renderer.render(scene, camera);
    }

    // render from the 2nd camera
    {
      const aspect = setScissorForElement(view2Elem);

      // adjust the camera for this aspect
      camera2.aspect = aspect;
      camera2.updateProjectionMatrix();

      // draw the camera helper in the 2nd view
      cameraHelper.visible = true;

      renderer.render(scene, camera2);
    }

    requestAnimationFrame(render);
  }

  requestAnimationFrame(render);
}

main();
