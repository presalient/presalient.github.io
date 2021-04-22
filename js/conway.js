// Heavily adapted from
// https://codepen.io/asdfmario/pen/MBpVJJ?editors=0010

// Constants & variables
const textureFraction = 1 * window.devicePixelRatio;

let texture, scene, camera, renderer;
let fragmentShader, vertexShader;

load(); // Will call init() when shaders loaded
animate();

function load() {
  let numFilesLeft = 3;

  // There's probably a better way to do this with Promises?
  function checkLoadComplete() {
    numFilesLeft--;
    if (numFilesLeft === 0) {
      init();
    }
  }

  let textureLoader = new THREE.TextureLoader();
  texture = textureLoader.load("texture/noise.png", function (data) {
    texture = data;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.NearestFilter;
    checkLoadComplete();
  });

  let fileLoader = new THREE.FileLoader();
  fileLoader.load("shader/frag.frag", function (data) {
    fragmentShader = data;
    checkLoadComplete();
  });
  fileLoader.load("shader/vert.vert", function (data) {
    vertexShader = data;
    checkLoadComplete();
  });
}

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

  let uniforms = {
    u_texture: {
      type: "t",
      value: texture,
    },
    u_resolution: {
      type: "v2",
      value: new THREE.Vector2(window.innerWidth, window.innerHeight),
    },
  };

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
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
