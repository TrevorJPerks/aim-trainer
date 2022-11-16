const gameSpace = document.querySelector(".game-container");
const rangeSlider = document.querySelector(".range-slider");

const target = document.querySelector(".target");

let hits = 0;
let shots = 0;

rangeSlider.onchange = () => {
  newGame(rangeSlider.value, killTarget);
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

function RandomizeTargetLocation() {
  // Viewport size minus Target size
  const maximumY = gameSpace.getBoundingClientRect().height - rangeSlider.value;
  const maximumX = gameSpace.getBoundingClientRect().width - rangeSlider.value;

  // Min value keeps the target from overlapping the side bar
  // Max value keeps the target from going off screen
  const randomY = getRandomAxis(170, maximumY);
  const randomX = getRandomAxis(170, maximumX);

  // Random Target Location
  target.style.top = `${randomY}px`;
  target.style.left = `${randomX}px`;
}

function killTarget() {
  hits++;
  drawTarget();
  RandomizeTargetLocation();
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
  newGame(rangeSlider.value, killTarget);
};
