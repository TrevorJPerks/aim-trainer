const gameSpace = document.querySelector(".game-container");
const rangeSlider = document.querySelector(".range-slider");

const target = document.querySelector(".target");

let hits = 0;
let shots = 0;

rangeSlider.onchange = () => {
  newGame(rangeSlider.value, trainShortFlicks);
};

rangeSlider.oninput = () => {
  document.querySelector(".slider-value").innerHTML = rangeSlider.value;
};

gameSpace.addEventListener("mousedown", (e) => {
  if (e.target.classList.contains("range-slider")) {
    return;
  }
  shots++;
  updateAccuracy();
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

function RandomizeTargetLocation(minY, minX, maxYValue, maxXValue) {
  const randomY = getRandomAxis(minY, maxYValue);
  const randomX = getRandomAxis(minX, maxXValue);

  // Random Target Location
  target.style.top = `${randomY}px`;
  target.style.left = `${randomX}px`;
}

// Gammode 1
function trainAim() {
  // Viewport size minus Target size
  const maximumX = gameSpace.getBoundingClientRect().width - rangeSlider.value;
  const maximumY = gameSpace.getBoundingClientRect().height - rangeSlider.value;
  hits++;
  drawTarget();
  RandomizeTargetLocation(170, 170, maximumY, maximumX);
  updateHits();
  updateAccuracy();
}

let midNext = 0;

// Gamemode 2
function trainShortFlicks() {
  // Viewport size
  const minimumY =
    target.getBoundingClientRect().y - target.getBoundingClientRect().y * 0.4;
  const minimumX =
    target.getBoundingClientRect().x - target.getBoundingClientRect().x * 0.4;

  const maximumY =
    target.getBoundingClientRect().y + target.getBoundingClientRect().y * 0.4;
  const maximumX =
    target.getBoundingClientRect().x + target.getBoundingClientRect().x * 0.4;
  if (midNext === 1) {
    hits++;
    drawTarget();
    midNext = 0;
    updateHits();
    updateAccuracy();
  } else {
    hits++;
    midNext = 1;
    RandomizeTargetLocation(minimumY, minimumX, maximumY, maximumX);
    updateHits();
    updateAccuracy();
  }

  updateHits();
  updateAccuracy();
}

function updateHits() {
  const hitsDisplay = document.querySelector(".hits");
  hitsDisplay.textContent = `Hits: ${hits}`;
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
  shots = 0;
  updateHits();
  updateAccuracy();
  document.querySelector(".slider-value").innerHTML = rangeSlider.value;
}

window.onload = () => {
  newGame(rangeSlider.value, trainShortFlicks);
};
