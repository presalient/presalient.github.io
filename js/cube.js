function generateCube() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 1000);

  const geometry = new THREE.BoxGeometry();
  const material = new THREE.MeshBasicMaterial({ color: 0xff8000 });
  const cube = new THREE.Mesh(geometry, material);
  scene.add(cube);

  camera.position.z = 1.8;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(
    250 * window.devicePixelRatio,
    250 * window.devicePixelRatio
  );

  //   renderer.domElement.position = "aboslute";
  renderer.domElement.display = "inline";

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
