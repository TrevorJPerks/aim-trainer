const gameSpace = document.querySelector(".game-container");
const rangeSlider = document.querySelector(".range-slider");

const target = document.querySelector(".target");

let hits = 0;
let shots = 0;

rangeSlider.onchange = () => {
  newGame();
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

function getRandomAxis(min, max) {
  return Math.random() * (max - min) + min;
}

function drawTarget(size) {
  const randomY = getRandomAxis(1, 90);
  const randomX = getRandomAxis(6, 90);

  // Target Location
  target.style.position = "absolute";
  target.style.top = `${randomY}vh`;
  target.style.left = `${randomX}vw`;
  // Target Size
  target.style.width = `${size}px`;
  target.style.height = `${size}px`;

  target.addEventListener("mousedown", killTarget);
}

function killTarget() {
  hits++;
  drawTarget();
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

function newGame() {
  drawTarget(rangeSlider.value);
  hits = 0;
  shots = 0;
  updateHits();
  updateAccuracy();
  document.querySelector(".slider-value").innerHTML = rangeSlider.value;
}

window.onload = () => {
  newGame();
};
