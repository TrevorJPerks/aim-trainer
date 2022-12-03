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
      trainAim();
      break;
    case 'flicks':
      flicks();
      break;
  }
};

// Random Coord Gen
const getRandomAxis = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
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
const flicks = () => {
  if (target.value == 'notCenter') {
    centerTarget();
    target.value = 'center';
  } else {
    const maxX = gameSpace.getBoundingClientRect().width - rangeSlider.value;
    const maxY = gameSpace.getBoundingClientRect().height - rangeSlider.value;
    randomizeTargetLocation(75, maxY, 75, maxX);
    target.value = 'notCenter';
  }
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
  if (
    (!e.target.classList.contains('target') &&
      e.target.classList.contains('game-container')) ||
    (!e.target.classList.contains('target') &&
      e.target.classList.contains('no-hit'))
  ) {
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
    let accuracy =
      Math.round((Stats.hits / (Stats.hits + Stats.misses)) * 100 * 10) / 10;
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

const instantModeToggle = () => target.classList.toggle('animate-target');

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
    menuButton.style.transitionDelay = '0s';
    menu.style.maxHeight = '100vh';
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

// Initialization
window.onload = () => {
  newGame(rangeSlider.value, 'trainAim');
  toggleMenu('gmMenu', 'gamemode-tab');
  toggleMenu('optionMenu', 'option-tab');
};
