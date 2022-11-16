const gameSpace = document.querySelector(".game-container");
const rangeSlider = document.querySelector(".range-slider");

const target = document.querySelector(".target");

let hits = 0;
let misses = 0;
let shots = 0;

rangeSlider.onchange = () => {
  newGame(rangeSlider.value, trainAim);
};

rangeSlider.oninput = () => {
  document.querySelector(".slider-value").innerHTML = rangeSlider.value;
};

gameSpace.addEventListener("mousedown", (e) => {
  if (
    e.target.classList.contains("game-container") ||
    e.target.classList.contains("target")
  ) {
    shots++;
    updateAccuracy();
  }
  if (!e.target.classList.contains("target")) {
    misses++;
    updateMisses();
  }
});

function drawTarget(size, gamemode) {
  // Target Size
  target.style.width = `${size}px`;
  target.style.height = `${size}px`;
  // Target Starting Location
  target.style.top = "50vh";
  target.style.left = "50vw";

  target.addEventListener("mousedown", gamemode);
}

function getRandomAxis(min, max) {
  return Math.random() * (max - min) + min;
}

function RandomizeTargetLocation(minY, maxY, minX, maxX) {
  const randomY = getRandomAxis(minY, maxY);
  const randomX = getRandomAxis(minX, maxX);

  // Random Target Location
  target.style.top = `${randomY}px`;
  target.style.left = `${randomX}px`;
}

// Gammode 1
function trainAim() {
  // Viewport size minus Target size
  const maxX = gameSpace.getBoundingClientRect().width - rangeSlider.value;
  const maxY = gameSpace.getBoundingClientRect().height - rangeSlider.value;
  hits++;
  drawTarget();
  RandomizeTargetLocation(170, maxY, 170, maxX);
  updateHits();
  updateAccuracy();
}

// Gamemode 2
let isMid = true;

function trainShortFlicks() {
  // Viewport size
  const minY =
    target.getBoundingClientRect().y - target.getBoundingClientRect().y * 0.4;
  const maxY =
    target.getBoundingClientRect().y + target.getBoundingClientRect().y * 0.4;

  const minX =
    target.getBoundingClientRect().x - target.getBoundingClientRect().x * 0.4;
  const maxX =
    target.getBoundingClientRect().x + target.getBoundingClientRect().x * 0.4;

  if (isMid) {
    hits++;
    drawTarget();
    isMid = false;
    updateHits();
    updateAccuracy();
  } else {
    hits++;
    isMid = true;
    RandomizeTargetLocation(minY, minX, maxY, maxX);
    updateHits();
    updateAccuracy();
  }
}

function updateHits() {
  const hitsDisplay = document.querySelector(".hits");
  hitsDisplay.textContent = `Hits: ${hits}`;
}

function updateMisses() {
  const missesDisplay = document.querySelector(".misses");
  missesDisplay.textContent = `Misses: ${misses}`;
}

function updateAccuracy() {
  const accuracyDisplay = document.querySelector(".accuracy");
  let accuracy = Math.round((hits / shots) * 100 * 10) / 10;
  // Percentage Based Text color
  if (shots === 0) {
    accuracy = 0;
    accuracyDisplay.style.color = "hsl(0, 0%, 100%)";
  } else if (accuracy <= 33) {
    accuracyDisplay.style.color = "hsl(0, 100%, 50%)";
  } else if (accuracy > 33 && accuracy <= 75) {
    accuracyDisplay.style.color = "hsl(30, 100%, 50%)";
  } else if (accuracy > 76) {
    accuracyDisplay.style.color = "hsl(100, 100%, 50%)";
  }
  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
}

function newGame(size, gamemode) {
  drawTarget(size, gamemode);
  hits = 0;
  misses = 0;
  shots = 0;
  updateHits();
  updateMisses();
  updateAccuracy();
  document.querySelector(".slider-value").innerHTML = rangeSlider.value;
}

window.onload = () => {
  newGame(rangeSlider.value, trainAim);
};
