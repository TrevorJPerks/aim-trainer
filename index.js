const gameSpace = document.querySelector('.game-container');
const rangeSlider = document.querySelector('.range-slider');

const target = document.querySelector('.target');

let selectedGameMode = 'trainAim';

let Stats = {
  hits: 0,
  misses: 0,
  shots: 0,
};

function updateRangeSliderText() {
  document.querySelector('.slider-value').innerHTML = rangeSlider.value + 'px';
}

rangeSlider.onchange = () => {
  newGame(rangeSlider.value, selectedGameMode);
};

rangeSlider.oninput = () => {
  updateRangeSliderText();
};

// Gamemode Selection
document.querySelector('.free-train').onclick = () => {
  newGame(rangeSlider.value, (selectedGameMode = 'trainAim'));
};

document.querySelector('.short-flicks').onclick = () => {
  newGame(rangeSlider.value, (selectedGameMode = 'trainShortFlicks'));
};

function playSound(selector, volume) {
  const SFX = document.getElementById(selector);
  SFX.volume = volume;
  SFX.play();
}

function muteSound(boolean) {
  document.querySelectorAll('audio').forEach((audio) => {
    audio.muted = boolean;
  });
}

document.querySelector('.audio-toggle').onclick = () => {
  if (document.querySelector('.audio-toggle').checked) {
    muteSound(true);
  } else muteSound(false);
};

let isSidebarHidden = false;
// Sidebar Toggle
function toggleSidebar() {
  isSidebarHidden = !isSidebarHidden;
  const sidebar = document.querySelector('.sidebar');
  const sidebarButton = document.querySelector('.toggle-sidebar');
  if (isSidebarHidden) {
    sidebar.style.width = '0';
    sidebarButton.textContent = '>';
    sidebarButton.style.left = '0';
    sidebarButton.style.height = '200px';
    sidebarButton.style.width = '20px';
    sidebarButton.style.opacity = '0.4';
  } else {
    sidebar.style.width = '170px';
    sidebarButton.textContent = '<';
    sidebarButton.style.left = '170px';
    sidebarButton.style.height = '150px';
    sidebarButton.style.opacity = '0.6';
    sidebarButton.style.width = '25px';
  }
}

document.querySelector('.toggle-sidebar').onclick = () => {
  toggleSidebar();
};

function centerTarget() {
  target.style.top = '50%';
  target.style.left = '50%';
  target.style.transform = 'translate(-50%, -50%)';
}

function drawTarget(size) {
  // Target Size
  target.style.width = `${size}px`;
  target.style.height = `${size}px`;
  // Target Starting Location
  centerTarget();

  target.addEventListener('mousedown', doGameMode);
}

function doGameMode() {
  // invoke gamemode
  switch (selectedGameMode) {
    case 'trainAim':
      trainAim();
      break;
    case 'trainShortFlicks':
      trainShortFlicks();
      break;
  }
}

// Track hits, misses, and shots taken
gameSpace.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('target')) {
    Stats.hits++;
    updateHits();
    // Play Hit SFX
    playSound('hitSFX', 0.1);
  }
  if (
    e.target.classList.contains('game-container') ||
    e.target.classList.contains('target')
  ) {
    Stats.shots++;
    updateAccuracy();
  }
  if (
    !e.target.classList.contains('target') &&
    e.target.classList.contains('game-container')
  ) {
    Stats.misses++;
    updateMisses();
    // Play Miss SFX
    playSound('missSFX', 0.1);
  }
});

function updateHits() {
  const hitsDisplay = document.querySelector('.hits');
  hitsDisplay.textContent = `Hits: ${Stats.hits}`;
}

function updateMisses() {
  const missesDisplay = document.querySelector('.misses');
  missesDisplay.textContent = `Misses: ${Stats.misses}`;
}

function updateAccuracy() {
  const accuracyDisplay = document.querySelector('.accuracy');
  let accuracy = Math.round((Stats.hits / Stats.shots) * 100 * 10) / 10;
  // Percentage Based Text color
  if (Stats.shots === 0) {
    accuracy = 0;
    accuracyDisplay.style.color = 'hsl(180, 100%, 50%)';
  } else if (accuracy <= 33) {
    accuracyDisplay.style.color = 'hsl(0, 100%, 50%)';
  } else if (accuracy > 33 && accuracy <= 75) {
    accuracyDisplay.style.color = 'hsl(30, 100%, 50%)';
  } else if (accuracy > 76) {
    accuracyDisplay.style.color = 'hsl(100, 100%, 50%)';
  }
  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
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

// Gammode 1 *Default*
function trainAim() {
  // Viewport size minus Target size
  const maxX = gameSpace.getBoundingClientRect().width - rangeSlider.value;
  const maxY = gameSpace.getBoundingClientRect().height - rangeSlider.value;
  randomizeTargetLocation(30, maxY, 30, maxX);
}

// Gamemode 2
let isMid = false;

function trainShortFlicks() {
  isMid = !isMid;
  // Plus and Minus 40% of target
  const minY =
    target.getBoundingClientRect().y - target.getBoundingClientRect().y * 0.2;
  const maxY =
    target.getBoundingClientRect().y + target.getBoundingClientRect().y * 0.2;

  const minX =
    target.getBoundingClientRect().x - target.getBoundingClientRect().x * 0.2;
  const maxX =
    target.getBoundingClientRect().x + target.getBoundingClientRect().x * 0.2;

  if (isMid) {
    centerTarget();
  } else {
    randomizeTargetLocation(minY, maxY, minX, maxX);
  }
}

function newGame(size, gamemode) {
  selectedGameMode = gamemode;
  drawTarget(size);
  Stats.hits = 0;
  Stats.misses = 0;
  Stats.shots = 0;
  updateHits();
  updateMisses();
  updateAccuracy();
  updateRangeSliderText();
}

window.onload = () => {
  newGame(rangeSlider.value, 'trainAim');
  document.querySelector('.audio-toggle').checked = false;
  toggleSidebar();
};
