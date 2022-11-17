const gameSpace = document.querySelector(".game-container");
const rangeSlider = document.querySelector(".range-slider");

const target = document.querySelector(".target");

let Stats = {
  hits: 0,
  misses: 0,
  shots: 0,
};

rangeSlider.onchange = () => {
  newGame(rangeSlider.value, trainAim);
};

rangeSlider.oninput = () => {
  updateRangeSliderText();
};

// Track misses and shots taken
gameSpace.addEventListener("mousedown", (e) => {
  if (
    e.target.classList.contains("game-container") ||
    e.target.classList.contains("target")
  ) {
    Stats.shots++;
    updateAccuracy();
  }
  if (
    !e.target.classList.contains("target") &&
    e.target.classList.contains("game-container")
  ) {
    Stats.misses++;
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

function randomizeTargetLocation(minY, maxY, minX, maxX) {
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
  Stats.hits++;
  drawTarget();
  randomizeTargetLocation(170, maxY, 170, maxX);
  updateHits();
}

// Gamemode 2
let isMid = false;

function trainShortFlicks() {
  // Plus and Minus 40% of target
  const minY =
    target.getBoundingClientRect().y - target.getBoundingClientRect().y * 0.4;
  const maxY =
    target.getBoundingClientRect().y + target.getBoundingClientRect().y * 0.4;

  const minX =
    target.getBoundingClientRect().x - target.getBoundingClientRect().x * 0.4;
  const maxX =
    target.getBoundingClientRect().x + target.getBoundingClientRect().x * 0.4;

  if (isMid) {
    Stats.hits++;
    drawTarget();
    isMid = false;
    updateHits();
  } else {
    Stats.hits++;
    isMid = true;
    randomizeTargetLocation(minY, minX, maxY, maxX);
    updateHits();
  }
}

function updateRangeSliderText() {
  document.querySelector(".slider-value").innerHTML = rangeSlider.value + "px";
}

function updateHits() {
  const hitsDisplay = document.querySelector(".hits");
  hitsDisplay.textContent = `Hits: ${Stats.hits}`;
}

function updateMisses() {
  const missesDisplay = document.querySelector(".misses");
  missesDisplay.textContent = `Misses: ${Stats.misses}`;
}

function updateAccuracy() {
  const accuracyDisplay = document.querySelector(".accuracy");
  let accuracy = Math.round((Stats.hits / Stats.shots) * 100 * 10) / 10;
  // Percentage Based Text color
  if (Stats.shots === 0) {
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
  Stats.hits = 0;
  Stats.misses = 0;
  Stats.shots = 0;
  updateHits();
  updateMisses();
  updateAccuracy();
  updateRangeSliderText();
}

window.onload = () => {
  newGame(rangeSlider.value, trainAim);
};
