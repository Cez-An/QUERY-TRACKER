import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

const canvas = document.getElementById("bgCanvas");
// const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });


renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = null;
console.log("✅ 3D scene initialized");

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.set(0, 2, 100);

const ambientLight = new THREE.AmbientLight(0xffffff, 5); // Was 1.2
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffe5b4, 5); // Was 1.5
directionalLight.position.set(10, 20, 10);
scene.add(directionalLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;
controls.autoRotate = false;
controls.autoRotateSpeed = 0.5;

let aircraft;
const loader = new GLTFLoader();
loader.load(
  "/models/boeing.glb",
  (gltf) => {
    aircraft = gltf.scene;
    aircraft.scale.set(1, 1, 1);
    aircraft.position.set(0, 0, 50);
    scene.add(aircraft);
    console.log("✅ Boeing model loaded successfully");
  },
  undefined,
  (err) => {
    console.error("❌ Error loading model:", err);
  }
);

// Smoke trails
const smokeMaterial = new THREE.MeshBasicMaterial({
  color: 0x888888,
  transparent: true,
  opacity: 0.3,
});
const smokeGeometry = new THREE.SphereGeometry(0.05, 8, 8);
let smokeParticles = [];

function createSmokeTrail(position) {
  const particle = new THREE.Mesh(smokeGeometry, smokeMaterial.clone());
  particle.position.copy(position);
  scene.add(particle);
  smokeParticles.push({ mesh: particle, velocityZ: -0.3 });
}

// Stars
function addStars() {
  for (let i = 0; i < 200; i++) {
    const star = new THREE.Mesh(
      new THREE.SphereGeometry(0.1, 6, 6),
      new THREE.MeshBasicMaterial({ color: 0xffffff })
    );
    star.position.set(
      (Math.random() - 0.5) * 300,
      (Math.random() - 0.5) * 100,
      -Math.random() * 500
    );
    scene.add(star);
  }
  console.log("✨ Stars added for night mode");
}

let isDay = true;
document.getElementById("toggleMode").addEventListener("click", () => {
  isDay = !isDay;
  if (isDay) {
    scene.background=null;
    ambientLight.intensity = 5;
    directionalLight.intensity = 5;
    document.getElementById("white-logo").style.display = "none";
    document.getElementById("black-logo").style.display = "block"; // Show black logo in day mode
    document.getElementById("toggleMode").innerText = "Switch to Night";
    console.log("☀️ Switched to Day mode");
  } else {
    scene.background = new THREE.Color(0x000011);
    ambientLight.intensity = 1;
    directionalLight.intensity = 0.5;
    document.getElementById("white-logo").style.display = "block"; // Show white logo in night mode
    document.getElementById("black-logo").style.display = "none"; // Hide logo in night mode
    document.getElementById("toggleMode").innerText = "Switch to Day";
    addStars();
    console.log("🌙 Switched to Night mode");
  }
});

window.addEventListener("resize", () => {
  camera.aspect =   .innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  console.log("📐 Window resized");
});

let smokeTimer = 0;
function animate() {
  requestAnimationFrame(animate);

  if (aircraft) {

    aircraft.position.y = Math.sin(Date.now() * 0.002) * 0.2;
    aircraft.rotation.x = Math.sin(Date.now() * 0.001) * 0.02;
    aircraft.rotation.z = Math.sin(Date.now() * 0.0001) * 0.02;
  }

  controls.update();
  renderer.render(scene, camera);
}
animate();
console.log("🚀 Animation loop started");
