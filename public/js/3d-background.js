  import * as THREE from "three";
  import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
  import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

  const canvas = document.getElementById("bgCanvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: true,
  });

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

  const ambientLight = new THREE.AmbientLight(0xffffff, 5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffe5b4, 5);
  directionalLight.position.set(10, 20, 10);
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.enableZoom = false;
  controls.enablePan = false;
  controls.autoRotate = false;
  controls.autoRotateSpeed = 1;

  let aircraftFlying = false;
  let aircraft;

  function startFlight() {
    aircraftFlying = true;
    loopX = 190;
    aircraft.position.x = 190;
    targetPosition.x = 190;
  }

  let targetPosition = new THREE.Vector3(190, -15, 0);

  const loader = new GLTFLoader();
  loader.load(
    "/models/boeing.glb",
    (gltf) => {
      aircraft = gltf.scene;
      aircraft.scale.set(2.8, 2.8, 2.8);
      aircraft.position.copy(targetPosition);
      aircraft.rotation.set(0, 0, 0);
      scene.add(aircraft);
      startFlight();

      //  ✅ Clone and place another aircraft
      // secondAircraft = aircraft.clone(true);
      // secondAircraft.position.set(-100, -10, -200);
      // scene.add(secondAircraft);

      console.log("✅ Boeing model loaded successfully");
    },
    undefined,
    (err) => {
      console.error("❌ Error loading model:", err);
    }
  );

  let starMeshes = [];

  function addStars() {
    for (let i = 0; i < 2000; i++) {
      const star = new THREE.Mesh(
        new THREE.SphereGeometry(0.15, 6, 6),
        new THREE.MeshBasicMaterial({ color: 0xffffff })
      );
      star.position.set(
        (Math.random() - 0.5) * 300,
        (Math.random() - 0.5) * 100,
        -Math.random() * 500
      );
      scene.add(star);
      starMeshes.push(star); // Track stars
    }
    console.log("✨ Stars added for night mode");
  }

  function removeStars() {
    for (const star of starMeshes) {
      scene.remove(star);
      star.geometry.dispose();
      star.material.dispose();
    }
    starMeshes = []; // Clear array
    console.log("🌤️ Stars removed for day mode");
  }

  let isDay = true;
  document.getElementById("toggleMode").addEventListener("click", () => {
    isDay = !isDay;
    if (isDay) {
      scene.background = null;
      ambientLight.intensity = 5;
      directionalLight.intensity = 5;
      removeStars();
      document.getElementById("white-logo").style.display = "none";
      document.getElementById("black-logo").style.display = "block";
      document
        .getElementById("toggleMode")
        .classList.replace("btn-light", "btn-secondary");
      document
        .getElementById("togglebtn")
        .classList.replace("bi-sun", "bi-moon-fill");
      console.log("☀️ Switched to Day mode");
    } else {
      scene.background = new THREE.Color(0x000011);
      ambientLight.intensity = 1;
      directionalLight.intensity = 0.2;
      document.getElementById("white-logo").style.display = "block";
      document.getElementById("black-logo").style.display = "none";
      document
        .getElementById("toggleMode")
        .classList.replace("btn-secondary", "btn-light");
      document
        .getElementById("togglebtn")
        .classList.replace("bi-moon-fill", "bi-sun");
      addStars();
      console.log("🌙 Switched to Night mode");
    }
    startFlight();
  });

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    console.log("📐 Window resized");
  });


  let loopX = 190; // Start at rightmost position
  let secondAircraft; // Declare globally

  function animate() {
    requestAnimationFrame(animate);

    // Animate main aircraft flying from right to left
    if (aircraft && aircraftFlying) {
      loopX -= 10;

      if (loopX < -250) {
        aircraftFlying = false;
        aircraft.position.x = -270;

        const tracker = document.getElementById("query-tracker");
        tracker.classList.remove("d-none");
        tracker.offsetHeight;        
        tracker.classList.add("fade-inn");
      } else {
        targetPosition.x = loopX;
      }

      // Aircraft hover effect and movement
      aircraft.position.y += Math.sin(Date.now() * 0.002) * 0.1;
      aircraft.position.lerp(targetPosition, 0.05);
      aircraft.rotation.set(0, 0, 0);
    }

    // Animate second aircraft (independent movement)
  

    controls.update();
    renderer.render(scene, camera);
  }

  animate();
  console.log("🚀 Animation loop started");