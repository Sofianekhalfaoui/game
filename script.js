
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const carImg = new Image();
carImg.src = 'https://i.imgur.com/DY6gND0.png'; // مود Golf 8

const desertBg = new Image();
desertBg.src = 'https://i.imgur.com/LNwJ4RX.jpg'; // خريطة صحراء مع طريق وسماء

let car = {
  x: canvas.width / 2 - 30,
  y: canvas.height - 100,
  width: 60,
  height: 40
};

const keys = { left: false, right: false, up: false, down: false };

function drawMap() {
  ctx.drawImage(desertBg, 0, 0, canvas.width, canvas.height);
}

function drawCar() {
  ctx.drawImage(carImg, car.x, car.y, car.width, car.height);
}

function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawMap();

  if (keys.left && car.x > 0) car.x -= 5;
  if (keys.right && car.x < canvas.width - car.width) car.x += 5;
  if (keys.up && car.y > 0) car.y -= 5;
  if (keys.down && car.y < canvas.height - car.height) car.y += 5;

  drawCar();
  requestAnimationFrame(update);
}

carImg.onload = () => {
  // ينتظر الضغط على "ابدأ"
};

// تشغيل الأصوات
function playSound(id) {
  const sound = document.getElementById(id);
  if (sound) sound.play();
}

function showGarage() {
  playSound("garageSound");
  document.getElementById("main-menu").style.display = "none";
  document.getElementById("garage").style.display = "block";
  playSound("engineSound");
}

function backToMenu() {
  document.getElementById("garage").style.display = "none";
  document.getElementById("main-menu").style.display = "block";
}

function startGame() {
  document.getElementById("garage").style.display = "none";
  document.getElementById("gameCanvas").style.display = "block";
  document.querySelector(".controls").style.display = "flex";
  playSound("driveSound");
  update();
}
