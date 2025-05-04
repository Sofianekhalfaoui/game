
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';
import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/loaders/GLTFLoader.js';

const loader = document.getElementById('loader');
const ui = document.getElementById('ui');
const progressText = document.getElementById('progress');
let progress = 1;
const simulateLoading = setInterval(() => {
  progress += Math.random() * 4;
  if (progress >= 100) {
    progress = 100;
    clearInterval(simulateLoading);
    loader.style.display = 'none';
    ui.style.display = 'block';
  }
  if (progressText) progressText.textContent = `جار التحميل... ${Math.floor(progress)}%`;
}, 100);

let camera, scene, renderer;
let car, desertMap;
let isInternalView = false;
let speed = 0;
let engineSound, popBangSound;

init();
animate();

function init() {
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa0a0a0);
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.set(0, 2, -5);

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  const light = new THREE.HemisphereLight(0xffffff, 0x444444);
  light.position.set(0, 20, 0);
  scene.add(light);

  const listener = new THREE.AudioListener();
  camera.add(listener);
  const audioLoader = new THREE.AudioLoader();

  engineSound = new THREE.Audio(listener);
  audioLoader.load('assets/VW_Golf_GTI_Sound.mp3', (buffer) => {
    engineSound.setBuffer(buffer);
    engineSound.setLoop(true);
    engineSound.setVolume(0.5);
  });

  popBangSound = new THREE.Audio(listener);
  audioLoader.load('assets/pop_bang.mp3', (buffer) => {
    popBangSound.setBuffer(buffer);
    popBangSound.setVolume(0.6);
  });

  const gltfLoader = new GLTFLoader();
  gltfLoader.load('assets/volkswagen_golf_8._gti_a8.glb', (gltf) => {
    car = gltf.scene;
    car.scale.set(1, 1, 1);
    scene.add(car);
  });

  gltfLoader.load('assets/battlefield_1_-_desert_map.glb', (gltf) => {
    desertMap = gltf.scene;
    desertMap.scale.set(10, 10, 10);
    scene.add(desertMap);
  });

  document.getElementById('accelerate').addEventListener('touchstart', () => {
    if (!engineSound.isPlaying) engineSound.play();
    speed += 0.02;
  });

  document.getElementById('brake').addEventListener('touchstart', () => {
    speed = Math.max(0, speed - 0.05);
    if (speed === 0 && engineSound.isPlaying) engineSound.stop();
    else engineSound.setPlaybackRate(1 + speed / 5);
    popBangSound.play();
  });

  document.getElementById('cameraBtn').addEventListener('click', () => {
    isInternalView = !isInternalView;
  });

  let steering = document.getElementById('steering');
  let rotation = 0;
  steering.addEventListener('touchmove', (e) => {
    rotation = (e.touches[0].clientX - steering.offsetLeft - 50) / 2;
    rotation = Math.max(-45, Math.min(45, rotation));
    steering.style.transform = `rotate(${rotation}deg)`;
    if (car) car.rotation.y = -rotation * 0.02;
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (car) {
    car.position.z += speed;
    engineSound.setPlaybackRate(1 + speed / 5);
    if (isInternalView) {
      camera.position.copy(car.position).add(new THREE.Vector3(0, 1.2, 0));
      camera.lookAt(car.position.clone().add(new THREE.Vector3(0, 1.2, 5)));
    } else {
      camera.position.copy(car.position).add(new THREE.Vector3(0, 2, -5));
      camera.lookAt(car.position);
    }
  }
  renderer.render(scene, camera);
}
