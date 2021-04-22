// Heavily adapted from
// https://codepen.io/asdfmario/pen/MBpVJJ?editors=0010

// Constants & variables
const textureFraction = 1 * window.devicePixelRatio;

let texture, scene, camera;

// Loading
// const loader = new THREE.TextureLoader();
// loader.setCrossOrigin("anonymous");
// loader.load("texture/seed.png", function (t) {
//   texture = t;
//   texture.wrapS = THREE.RepeatWrapping;
//   texture.wrapT = THREE.RepeatWrapping;
//   texture.minFilter = THREE.LinearFilter;
// });

var loader = new THREE.TextureLoader();
texture = loader.load("texture/seed.png");

init();
animate();

// Setting up
function init() {
  const container = document.getElementById("container");

  camera = new THREE.Camera();
  camera.position.z = 1;

  scene = new THREE.Scene();

  let geometry = new THREE.PlaneBufferGeometry(2, 2);

  // Let's render a texture
  seedTexture = new THREE.WebGLRenderTarget(
    window.innerWidth * textureFraction,
    window.innerHeight * textureFraction
  );

  let material = new THREE.MeshBasicMaterial({
    map: texture,
    opacity: 0.8,
    transparent: true,
  });

  let mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  container.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
