const gameSpace = document.querySelector('.game-container');
const rangeSlider = document.querySelector('.range-slider');

const target = document.querySelector('.target');

let selectedGameMode = 'trainAim';

let Stats = {
  hits: 0,
  misses: 0,
  shots: 0,
};

const updateRangeSliderText = () =>
  (document.querySelector('.slider-value').innerHTML =
    rangeSlider.value + 'px');

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

const playSound = (selector, volume) => {
  const SFX = document.getElementById(selector);
  SFX.volume = volume;
  SFX.play();
};

const muteSound = (boolean) => {
  document.querySelectorAll('audio').forEach((audio) => {
    audio.muted = boolean;
  });
};

const instantModeToggle = () =>
  document.querySelector('.target').classList.toggle('animate-target');

// Option Toggles
document.querySelector('.audio-toggle').onclick = () => {
  if (document.querySelector('.audio-toggle').checked) {
    muteSound(true);
  } else muteSound(false);
};

document.querySelector('.instantmode-toggle').onclick = () => {
  instantModeToggle();
};

// Keybinds
window.onkeydown = (event) => {
  // Press M to mute/unmute
  if (event.keyCode == 77) {
    if (document.querySelector('.audio-toggle').checked == false) {
      document.querySelector('.audio-toggle').checked = true;
      muteSound(true);
    } else {
      document.querySelector('.audio-toggle').checked = false;
      muteSound(false);
    }
  }
  // Press R to reset game
  if (event.keyCode == 82) {
    newGame(rangeSlider.value, selectedGameMode);
  }
  // Press I to toggle instantMode
  if (event.keyCode == 73) {
    if (document.querySelector('.instantmode-toggle').checked == false) {
      document.querySelector('.instantmode-toggle').checked = true;
      instantModeToggle();
    } else {
      document.querySelector('.instantmode-toggle').checked = false;
      instantModeToggle();
    }
  }
};

// Menu Toggle
const toggleMenu = (menuElementId, buttonElementId) => {
  const menu = document.getElementById(menuElementId);
  const menuButton = document.getElementById(buttonElementId);
  if (menuButton.value == 'OFF') {
    menuButton.value = 'ON';
    menuButton.style.transitionDelay = '0s';
    menu.style.maxHeight = '500px';
    menuButton.style.opacity = '0.6';
    menuButton.style.borderBottom = '1px solid hsl(180, 100%, 50%)';
    menuButton.style.boxShadow = ' 0px 7px 6px 0px hsla(180, 100%, 50%, 0.06)';
    menuButton.style.width = menu.getBoundingClientRect().width + 'px';
  } else {
    menuButton.value = 'OFF';
    menuButton.style.transitionDelay = '0.3s';
    menu.style.maxHeight = '0px';
    menuButton.style.opacity = '0.4';
    menuButton.style.width = '100px';
    menuButton.style.borderBottom = '1px solid hsl(0, 0%, 0%';
  }
};

document.getElementById('gamemode-tab').onclick = () => {
  toggleMenu('gmMenu', 'gamemode-tab');
};

document.getElementById('option-tab').onclick = () => {
  toggleMenu('optionMenu', 'option-tab');
};

const centerTarget = () => {
  target.style.top = '50%';
  target.style.left = '50%';
  target.style.transform = 'translate(-50%, -50%)';
};

const drawTarget = (size) => {
  // Target Size
  target.style.width = `${size}px`;
  target.style.height = `${size}px`;
  // Target Starting Location
  centerTarget();

  target.addEventListener('mousedown', doGameMode);
};

const doGameMode = () => {
  // invoke gamemode
  switch (selectedGameMode) {
    case 'trainAim':
      trainAim();
      break;
    case 'trainShortFlicks':
      trainShortFlicks();
      break;
  }
};

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

const updateHits = () => {
  const hitsDisplay = document.querySelector('.hits');
  hitsDisplay.textContent = `Hits: ${Stats.hits}`;
};

const updateMisses = () => {
  const missesDisplay = document.querySelector('.misses');
  missesDisplay.textContent = `Misses: ${Stats.misses}`;
};

const updateAccuracy = () => {
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
};

const getRandomAxis = (min, max) => {
  return Math.random() * (max - min) + min;
};

const randomizeTargetLocation = (minY, maxY, minX, maxX) => {
  const randomY = getRandomAxis(minY, maxY);
  const randomX = getRandomAxis(minX, maxX);

  // Random Target Location
  target.style.top = `${randomY}px`;
  target.style.left = `${randomX}px`;
};

// Gammode 1 *Default*
const trainAim = () => {
  // Viewport size minus Target size
  const maxX = gameSpace.getBoundingClientRect().width - rangeSlider.value;
  const maxY = gameSpace.getBoundingClientRect().height - rangeSlider.value;
  randomizeTargetLocation(75, maxY, 75, maxX);
};

// Gamemode 2

const trainShortFlicks = () => {
  // Plus and Minus 40% of target
  const minY =
    target.getBoundingClientRect().y - target.getBoundingClientRect().y * 0.4;
  const maxY =
    target.getBoundingClientRect().y + target.getBoundingClientRect().y * 0.4;

  const minX =
    target.getBoundingClientRect().x - target.getBoundingClientRect().x * 0.4;
  const maxX =
    target.getBoundingClientRect().x + target.getBoundingClientRect().x * 0.4;

  if (target.value == 'notCenter') {
    centerTarget();
    target.value = 'center';
  } else {
    randomizeTargetLocation(minY, maxY, minX, maxX);
    target.value = 'notCenter';
  }
};

const newGame = (size, gamemode) => {
  selectedGameMode = gamemode;
  target.value = 'center';
  drawTarget(size);
  Stats.hits = 0;
  Stats.misses = 0;
  Stats.shots = 0;
  updateHits();
  updateMisses();
  updateAccuracy();
  updateRangeSliderText();
};

window.onload = () => {
  newGame(rangeSlider.value, 'trainAim');
  document.querySelector('.audio-toggle').checked = false;
  document.querySelector('.instantmode-toggle').checked = false;
  toggleMenu('gmMenu', 'gamemode-tab');
  toggleMenu('optionMenu', 'option-tab');
};
