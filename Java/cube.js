// cube.js
const stage = document.getElementById("stage");
const cube = document.getElementById("cube");
const scene = document.querySelector(".scene");

const btnReset = document.getElementById("btnReset");
const sizeSlider = document.getElementById("size");
const perspSlider = document.getElementById("persp");

let rotX = -18;
let rotY = 28;

let dragging = false;
let lastX = 0;
let lastY = 0;

function applyTransform() {
  cube.style.transform = `rotateX(${rotX}deg) rotateY(${rotY}deg)`;
}

function setCubeSize(px) {
  cube.style.width = px + "px";
  cube.style.height = px + "px";
  const half = px / 2;

  // Update translateZ for each face
  cube.querySelector(".front").style.transform  = `translateZ(${half}px)`;
  cube.querySelector(".back").style.transform   = `rotateY(180deg) translateZ(${half}px)`;
  cube.querySelector(".right").style.transform  = `rotateY(90deg) translateZ(${half}px)`;
  cube.querySelector(".left").style.transform   = `rotateY(-90deg) translateZ(${half}px)`;
  cube.querySelector(".top").style.transform    = `rotateX(90deg) translateZ(${half}px)`;
  cube.querySelector(".bottom").style.transform = `rotateX(-90deg) translateZ(${half}px)`;
}

function setPerspective(px) {
  scene.style.perspective = px + "px";
}

function reset() {
  rotX = -18;
  rotY = 28;
  applyTransform();
}

function onDown(clientX, clientY) {
  dragging = true;
  lastX = clientX;
  lastY = clientY;
  stage.classList.add("dragging");
}

function onMove(clientX, clientY) {
  if (!dragging) return;
  const dx = clientX - lastX;
  const dy = clientY - lastY;
  lastX = clientX;
  lastY = clientY;

  // sensitivity
  rotY += dx * 0.35;
  rotX -= dy * 0.35;

  // clamp X so it doesn't flip too insanely
  rotX = Math.max(-85, Math.min(85, rotX));

  applyTransform();
}

function onUp() {
  dragging = false;
  stage.classList.remove("dragging");
}

// Mouse
stage.addEventListener("mousedown", (e) => onDown(e.clientX, e.clientY));
window.addEventListener("mousemove", (e) => onMove(e.clientX, e.clientY));
window.addEventListener("mouseup", onUp);

// Touch
stage.addEventListener("touchstart", (e) => {
  const t = e.touches[0];
  onDown(t.clientX, t.clientY);
}, { passive: true });

stage.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  onMove(t.clientX, t.clientY);
}, { passive: true });

stage.addEventListener("touchend", onUp);
stage.addEventListener("dblclick", reset);
btnReset.addEventListener("click", reset);

sizeSlider.addEventListener("input", () => setCubeSize(Number(sizeSlider.value)));
perspSlider.addEventListener("input", () => setPerspective(Number(perspSlider.value)));

setCubeSize(Number(sizeSlider.value));
setPerspective(Number(perspSlider.value));
applyTransform();