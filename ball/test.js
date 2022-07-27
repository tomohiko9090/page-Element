var container, stats;

var camera, scene, renderer;

var mesh, geometry, material, texture;
var Ball1, Ball2, Ball3;
var Pivot1, Pivot2, Pivot3;

var cubeCamera1;
var cubeCamera2;
var cubeCamera3;

var sunLight, ambientLight;

var clock = new THREE.Clock();

init();
animate();

function init() {

  container = document.createElement('div');
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 2, 10000);
  camera.position.set(300, 300, 300);

  scene = new THREE.Scene();
  scene.fog = new THREE.Fog(0x33aaff, 1000, 10000);

  var cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter:THREE.LinearMipmapLinearFilter } );
   var cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter:THREE.LinearMipmapLinearFilter } );
   var cubeRenderTarget3 = new THREE.WebGLCubeRenderTarget( 128, { format: THREE.RGBFormat, generateMipmaps: true, minFilter:THREE.LinearMipmapLinearFilter } );
  cubeCamera1 = new THREE.CubeCamera(.1, 1000, cubeRenderTarget1);
  cubeCamera2 = new THREE.CubeCamera(.1, 1000, cubeRenderTarget2);
  cubeCamera3 = new THREE.CubeCamera(.1, 1000, cubeRenderTarget3);

  var texture = new THREE.Texture(document.getElementById('texture'));
  texture.minFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  var groundMaterial = new THREE.MeshPhongMaterial({
    shininess: 80,
    color: 0xffffff,
    specular: 0xffffff,
    map: texture
  });

  var planeGeometry = new THREE.PlaneBufferGeometry(100, 100);

  var ground = new THREE.Mesh(planeGeometry, groundMaterial);
  //ground.position.set(0, 0, 0);
  ground.rotation.x = -Math.PI / 2;
  ground.scale.set(20, 20, 20);
  ground.receiveShadow = true;
  scene.add(ground);

  pivot1 = new THREE.Object3D();
  scene.add(pivot1);
  pivot2 = new THREE.Object3D();
  scene.add(pivot2);
  pivot3 = new THREE.Object3D();
  scene.add(pivot3);

  material = new THREE.MeshPhongMaterial({
    shininess: 100,
    color: 0xffffff,
    specular: 0xffffff,
    envMap: cubeRenderTarget1.texture
  });
  geometry = new THREE.SphereGeometry(100, 16, 16);
  Ball1 = new THREE.Mesh(geometry, material);
  Ball1.position.set(100, 100, 0);
  Ball1.castShadow = true;
  Ball1.receiveShadow = true;
  Ball1.add(cubeCamera1);
  pivot1.add(Ball1);

  material = new THREE.MeshPhongMaterial({
    shininess: 100,
    color: 0xffffff,
    specular: 0xffffff,
    envMap: cubeRenderTarget2.texture
  });
  geometry = new THREE.SphereGeometry(100, 16, 16);
  Ball2 = new THREE.Mesh(geometry, material);
  Ball2.position.set(300, 100, 0);
  //Ball2.castShadow = true;
  //Ball2.receiveShadow = true;
  Ball2.add(cubeCamera2);
  pivot2.add(Ball2);

  material = new THREE.MeshPhongMaterial({
    shininess: 100,
    color: 0xffffff,
    specular: 0xffffff,
    envMap: cubeRenderTarget3.texture
  });
  geometry = new THREE.SphereGeometry(100, 16, 16);
  Ball3 = new THREE.Mesh(geometry, material);
  Ball3.position.set(500, 100, 0);
  Ball3.castShadow = true;
  Ball3.receiveShadow = true;
  Ball3.add(cubeCamera3);
  pivot3.add(Ball3);

  ambientLight = new THREE.AmbientLight(0xaaaaaa);
  scene.add(ambientLight);

  sunLight = new THREE.SpotLight(0xffaa00, 0.5, 0, Math.PI / 2);
  sunLight.position.set(1000, 2000, 1000);
  sunLight.castShadow = true;
  sunLight.shadow.bias = -0.0002;
  sunLight.shadow.camera.far = 4000;
  sunLight.shadow.camera.near = 750;
  sunLight.shadow.camera.fov = 30;
  scene.add(sunLight);

  renderer = new THREE.WebGLRenderer({
    antialias: true
  });
  //renderer.setClearColor(0xffffff);
  renderer.setClearColor(scene.fog.color);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);
  //renderer.shadowMap.enabled = true;
  //renderer.shadowMap.type = THREE.PCFSoftShadowMap;
//renderer.gammaInput = true;
            //renderer.gammaOutput = true;
  controls = new THREE.TrackballControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.rotateSpeed = 4.0;
  controls.zoomSpeed = 2.0;
  controls.panSpeed = 1.0;
  controls.noZoom = false;
  controls.noPan = false;
  controls.staticMoving = false;
  controls.dynamicDampingFactor = 0.5;
  controls.keys = [65, 83, 68];

  window.addEventListener('resize', onWindowResize, false);
}

function onWindowResize(event) {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
}

function animate() {
  requestAnimationFrame(animate);
  var delta = clock.getDelta();
  pivot1.rotateY(0.1 * delta);
  Ball1.rotateY(-0.1 * delta);
  pivot2.rotateY(-0.1 * delta);
  Ball2.rotateY(0.1 * delta);
  pivot3.rotateY(0.15 * delta);
  Ball3.rotateY(-0.15 * delta);
  controls.update();
  render();
}

function render() {
  cubeCamera1.update(renderer, scene);
  cubeCamera2.update(renderer, scene);
  cubeCamera3.update(renderer, scene);
  renderer.render(scene, camera);
}