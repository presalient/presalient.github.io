function generateCube() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshPhongMaterial({ color: 0xff8000 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 1.8;

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
  directionalLight.position.set(8, 15, 12);
  scene.add(directionalLight);

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(
    window.innerHeight / (4 * window.devicePixelRatio),
    window.innerHeight / (4 * window.devicePixelRatio)
  );

  renderer.domElement.display = "inline";
  renderer.domElement.style.background = "#0c0c0c";

  let container = document.getElementById("cube-container");
  container.appendChild(renderer.domElement);

  function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01 * Math.sin(cube.rotation.y);
    cube.rotation.y += 0.01 * Math.cos(cube.rotation.x);
    renderer.render(scene, camera);
  }
  animate();
}

generateCube();
