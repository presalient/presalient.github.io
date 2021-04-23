// Heavily adapted from
// https://codepen.io/asdfmario/pen/MBpVJJ?editors=0010

// Constants & variables
const textureFraction = 1 * window.devicePixelRatio;

let texture, scene, camera, renderer;
let fragmentShader, vertexShader, uniforms;

load(); // Will call init() when shaders loaded
setTimeout(() => {
  animate();
}, 1000);

window.onresize = () => {
  onResize();
};

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

  // (2, 2) size bc normalised device coordinates
  let geometry = new THREE.PlaneBufferGeometry(2, 2);

  // Let's render a texture
  renderTarget1 = new THREE.WebGLRenderTarget(
    window.innerWidth * textureFraction,
    window.innerHeight * textureFraction
  );

  // renderTarget1.texture = texture;

  renderTarget2 = new THREE.WebGLRenderTarget(
    window.innerWidth * textureFraction,
    window.innerHeight * textureFraction
  );

  // renderTarget2.texture = texture;

  uniforms = {
    u_texture: {
      type: "t",
      value: texture,
    },
    u_resolution: {
      type: "v2",
      value: new THREE.Vector2(),
    },
    u_renderpass: { type: "b", value: false },
    u_frame: { type: "f", value: 0.0 },
  };

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });
  material.extensions.derivatives = true; // ?

  let mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;

  container.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);

  // Render to target1
  uniforms.u_renderpass.value = true;
  renderer.setRenderTarget(renderTarget1);
  renderer.render(scene, camera);

  // Set texture to be target1's texture
  uniforms.u_texture.value = renderTarget1.texture;
  uniforms.u_frame.value += 1;

  // Swap buffers
  [renderTarget1, renderTarget2] = [renderTarget2, renderTarget1];

  // Draw to canvas
  uniforms.u_renderpass.value = false;
  renderer.setRenderTarget(null);
  renderer.render(scene, camera);
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;

  renderTarget1 = new THREE.WebGLRenderTarget(
    window.innerWidth * textureFraction,
    window.innerHeight * textureFraction
  );

  renderTarget2 = new THREE.WebGLRenderTarget(
    window.innerWidth * textureFraction,
    window.innerHeight * textureFraction
  );

  uniforms.u_texture.value = texture;
  uniforms.u_frame.value = 0;
}
