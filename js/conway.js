// Heavily adapted from
// https://codepen.io/asdfmario/pen/MBpVJJ?editors=0010

// Constants & variables
const textureFraction = 1 * window.devicePixelRatio;

let texture, scene, camera, renderer;
let fragmentShader, vertexShader, uniforms;

window.onresize = onResize;

main();

async function main() {
  await load();
  init();
  animate();
}
async function load() {
  let textureLoader = new THREE.TextureLoader();
  texture = await textureLoader.loadAsync("texture/noise2.png");
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.NearestFilter;

  let fileLoader = new THREE.FileLoader();
  fragmentShader = await fileLoader.loadAsync("shader/frag.frag");
  vertexShader = await fileLoader.loadAsync("shader/vert.vert");
}

function init() {
  const container = document.getElementById("container");

  camera = new THREE.Camera();
  camera.position.z = 1;

  scene = new THREE.Scene();

  // (2, 2) size bc normalised device coordinates
  let geometry = new THREE.PlaneBufferGeometry(2, 2);

  renderTarget1 = new THREE.WebGLRenderTarget(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
  );

  renderTarget2 = new THREE.WebGLRenderTarget(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
  );

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
    u_mouse_position: { type: "v2", value: new THREE.Vector2() },
    u_click: { type: "b", value: false },
  };

  let material = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
  });

  let mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio);

  // Styling the renderer
  renderer.domElement.style.position = "absolute";
  renderer.domElement.style.zIndex = -1;
  renderer.domElement.style.background = "#0c0c0c";

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
  renderer.setPixelRatio(window.devicePixelRatio);

  uniforms.u_resolution.value.x = renderer.domElement.width;
  uniforms.u_resolution.value.y = renderer.domElement.height;

  renderTarget1 = new THREE.WebGLRenderTarget(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
  );

  renderTarget2 = new THREE.WebGLRenderTarget(
    window.innerWidth * window.devicePixelRatio,
    window.innerHeight * window.devicePixelRatio
  );

  uniforms.u_texture.value = texture;
  uniforms.u_frame.value = 0;
}

document.addEventListener("pointermove", (e) => {
  uniforms.u_mouse_position.value.x = e.clientX * window.devicePixelRatio;

  // Gotta do this because gl_FragCoord is (0, 0) in bottom left of screen
  uniforms.u_mouse_position.value.y =
    (-e.clientY + window.innerHeight) * window.devicePixelRatio;
});

document.addEventListener("mousedown", (e) => {
  console.log("test");
  uniforms.u_click.value = true;
});

document.addEventListener("mouseup", (e) => {
  uniforms.u_click.value = false;
});
