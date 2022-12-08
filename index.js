const gameSpace = document.querySelector('.game-container');

const target = gameSpace.querySelector('.target');

let selectedGameMode = 'trainAim';

let Stats = {
  hits: 0,
  misses: 0,
};

const rangeSlider = gameSpace.querySelector('.range-slider');

const updateRangeSliderText = () =>
  (gameSpace.querySelector('.slider-value').innerHTML =
    rangeSlider.value + 'px');

rangeSlider.onchange = () => {
  newGame(rangeSlider.value, selectedGameMode);
};

rangeSlider.oninput = () => {
  updateRangeSliderText();
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
  switch (selectedGameMode) {
    case 'trainAim':
      moveTargetRandomXY();
      break;
    case 'flicks':
      flicks();
      break;
    case 'randomRange':
      randomRange();
      break;
  }
};

// Random Coord Gen
const getRandomNumberBetween = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const randomizeTargetLocation = (minY, maxY, minX, maxX) => {
  const randomY = getRandomNumberBetween(minY, maxY);
  const randomX = getRandomNumberBetween(minX, maxX);

  // Random Target Location
  target.style.top = `${randomY}px`;
  target.style.left = `${randomX}px`;
};

// Gammode 1 *Default*
const moveTargetRandomXY = () => {
  // Viewport size minus Target size
  const maxX = gameSpace.getBoundingClientRect().width - rangeSlider.value;
  const maxY = gameSpace.getBoundingClientRect().height - rangeSlider.value;
  randomizeTargetLocation(75, maxY, 75, maxX);
};

// Gamemode 2
const flicks = () => {
  if (target.value == 'notCenter') {
    centerTarget();
    target.value = 'center';
  } else {
    moveTargetRandomXY();
    target.value = 'notCenter';
  }
};

// Gamemode 3
const randomRange = () => {
  randomTargetSize();
  const y = gameSpace.getBoundingClientRect().height / 2;
  randomizeTargetLocation(
    y,
    y,
    75,
    gameSpace.getBoundingClientRect().width - rangeSlider.value
  );
};

const randomTargetSize = () => {
  const size = getRandomNumberBetween(25, 150);
  target.style.width = `${size}px`;
  target.style.height = `${size}px`;
};

const newGame = (size, gamemode) => {
  selectedGameMode = gamemode;
  target.value = 'center';
  drawTarget(size);
  Stats.hits = 0;
  Stats.misses = 0;
  updateHits();
  updateMisses();
  updateAccuracy();
  updateRangeSliderText();
};

// Track hits, misses, and update accuracy
gameSpace.addEventListener('mousedown', (e) => {
  if (e.target.classList.contains('target')) {
    Stats.hits++;
    updateHits();
    // Play Hit SFX
    playSound('hitSFX', 0.1);
  }
  if (e.target.classList.contains('hit-scan')) {
    Stats.misses++;
    updateMisses();
    // Play Miss SFX
    playSound('missSFX', 0.1);
  }
  updateAccuracy();
});

const playSound = (audioElementId, volume) => {
  const SFX = document.getElementById(audioElementId);
  SFX.volume = volume;
  SFX.play();
};

const updateHits = () =>
  (gameSpace.querySelector('.hits').textContent = `Hits: ${Stats.hits}`);

const updateMisses = () =>
  (gameSpace.querySelector('.misses').textContent = `Misses: ${Stats.misses}`);

const updateAccuracy = () => {
  const accuracyDisplay = gameSpace.querySelector('.accuracy');
  if (Stats.hits + Stats.misses > 0) {
    let accuracy = Math.round((Stats.hits / (Stats.hits + Stats.misses)) * 100);
    // Percentage Based Text color
    accuracyDisplay.style.color = `hsl(${accuracy}, 100%, 70%)`;
    accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
    return;
  }
  // Stats.shots = 0
  accuracyDisplay.style.color = 'hsl(100, 100%, 70%)';
  accuracyDisplay.textContent = `Accuracy: 0`;
};

// Option Toggles
const muteSound = (boolean) => {
  document.querySelectorAll('audio').forEach((audio) => {
    audio.muted = boolean;
  });
  gameSpace.querySelector('.mute-icon').classList.toggle('hide-element');
};

const instantModeToggle = () => {
  target.classList.toggle('animate-target');
  gameSpace.querySelector('.instantmode-icon').classList.toggle('hide-element');
};

const keybindTextToggle = () =>
  document.querySelector('.keybinds').classList.toggle('hide-element');

const backgroundToggle = () => gameSpace.classList.toggle('bg');

gameSpace.querySelector('.audio-toggle').onclick = () => {
  if (gameSpace.querySelector('.audio-toggle').checked) {
    muteSound(true);
    return;
  }
  muteSound(false);
};

gameSpace.querySelector('.instantmode-toggle').onclick = () => {
  instantModeToggle();
};

gameSpace.querySelector('.background-toggle').onclick = () => {
  backgroundToggle();
};

// Keydown Events
window.onkeydown = (event) => {
  // Press M to mute/unmute
  if (event.keyCode == 77) {
    if (gameSpace.querySelector('.audio-toggle').checked == false) {
      gameSpace.querySelector('.audio-toggle').checked = true;
      muteSound(true);
    } else {
      gameSpace.querySelector('.audio-toggle').checked = false;
      muteSound(false);
    }
  }
  // Press R to reset game
  if (event.keyCode == 82) {
    newGame(rangeSlider.value, selectedGameMode);
  }
  // Press I to toggle instantMode
  if (event.keyCode == 73) {
    if (gameSpace.querySelector('.instantmode-toggle').checked == false) {
      gameSpace.querySelector('.instantmode-toggle').checked = true;
      instantModeToggle();
    } else {
      gameSpace.querySelector('.instantmode-toggle').checked = false;
      instantModeToggle();
    }
  }
  // Press B to toggle background image
  if (event.keyCode == 66) {
    if (gameSpace.querySelector('.background-toggle').checked == false) {
      gameSpace.querySelector('.background-toggle').checked = true;
      backgroundToggle();
    } else {
      gameSpace.querySelector('.background-toggle').checked = false;
      backgroundToggle();
    }
  }
  // Press K to toggle Keybind text
  if (event.keyCode == 75) {
    keybindTextToggle();
  }
};

// Menu Toggle
const toggleMenu = (menuElementId, buttonElementId) => {
  const menu = document.getElementById(menuElementId);
  const menuButton = document.getElementById(buttonElementId);
  if (menuButton.value == 'OFF') {
    menuButton.value = 'ON';
    menu.classList.toggle('menu-expand');
    menuButton.classList.toggle('button-on');
  } else {
    menuButton.value = 'OFF';
    menu.classList.toggle('menu-expand');
    menuButton.classList.toggle('button-on');
  }
};

document.getElementById('gamemode-tab').onclick = () => {
  toggleMenu('gmMenu', 'gamemode-tab');
};

document.getElementById('option-tab').onclick = () => {
  toggleMenu('optionMenu', 'option-tab');
};

const highlightSelectedGamemode = (e) => {
  const gamemodeIcon = gameSpace.querySelectorAll('.gamemode-img');
  if (e.target.classList.contains('gamemode-img')) {
    gamemodeIcon.forEach((icon) => {
      icon.classList.remove('selected-gamemode');
    });
    e.target.classList.add('selected-gamemode');
  }
};

// Gamemode Selection
gameSpace.querySelector('.freetrain-img').onclick = (e) => {
  newGame(rangeSlider.value, 'trainAim');
  gameSpace.querySelector('.current-gamemode').innerHTML = 'Train Aim';
  highlightSelectedGamemode(e);
};

gameSpace.querySelector('.flicks-img').onclick = (e) => {
  newGame(rangeSlider.value, 'flicks');
  gameSpace.querySelector('.current-gamemode').innerHTML = 'Flicks';
  highlightSelectedGamemode(e);
};

gameSpace.querySelector('.randomrange-img').onclick = (e) => {
  newGame(rangeSlider.value, 'randomRange');
  gameSpace.querySelector('.current-gamemode').innerHTML = 'Random Range';
  highlightSelectedGamemode(e);
};

// Initialization
window.onload = () => {
  newGame(rangeSlider.value, 'trainAim');
  gameSpace.querySelector('.audio-toggle').checked = false;
  gameSpace.querySelector('.instantmode-toggle').checked = false;
};
