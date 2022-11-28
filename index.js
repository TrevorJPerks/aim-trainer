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

const highlightSelectedGamemode = (e) => {
  const gamemodeIcon = document.querySelectorAll('.gamemode-img');
  if (e.target.classList.contains('gamemode-img')) {
    gamemodeIcon.forEach((icon) => {
      icon.classList.remove('selected-gamemode');
    });
    e.target.classList.add('selected-gamemode');
  }
};

// Gamemode Selection
document.querySelector('.freetrain-img').onclick = (e) => {
  newGame(rangeSlider.value, (selectedGameMode = 'trainAim'));
  document.querySelector('.current-gamemode').innerHTML = 'Train Aim';
  highlightSelectedGamemode(e);
};

document.querySelector('.shortflicks-img').onclick = (e) => {
  newGame(rangeSlider.value, (selectedGameMode = 'shortFlicks'));
  document.querySelector('.current-gamemode').innerHTML = 'Short Flicks';
  highlightSelectedGamemode(e);
};

document.querySelector('.mediumflicks-img').onclick = (e) => {
  newGame(rangeSlider.value, (selectedGameMode = 'mediumFlicks'));
  document.querySelector('.current-gamemode').innerHTML = 'Medium Flicks';
  highlightSelectedGamemode(e);
};

document.querySelector('.flicks-img').onclick = (e) => {
  newGame(rangeSlider.value, (selectedGameMode = 'flicks'));
  document.querySelector('.current-gamemode').innerHTML = 'Flicks';
  highlightSelectedGamemode(e);
};

const playSound = (audioElementId, volume) => {
  const SFX = document.getElementById(audioElementId);
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

const backgroundToggle = () =>
  document.querySelector('.game-container').classList.toggle('bg');

// Option Toggles
document.querySelector('.audio-toggle').onclick = () => {
  if (document.querySelector('.audio-toggle').checked) {
    muteSound(true);
  } else muteSound(false);
};

document.querySelector('.instantmode-toggle').onclick = () => {
  instantModeToggle();
};

document.querySelector('.background-toggle').onclick = () => {
  backgroundToggle();
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
  // Press B to toggle background image
  if (event.keyCode == 66) {
    if (document.querySelector('.background-toggle').checked == false) {
      document.querySelector('.background-toggle').checked = true;
      backgroundToggle();
    } else {
      document.querySelector('.background-toggle').checked = false;
      backgroundToggle();
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
  switch (selectedGameMode) {
    case 'trainAim':
      trainAim();
      break;
    case 'shortFlicks':
      shortFlicks();
      break;
    case 'mediumFlicks':
      mediumFlicks();
      break;
    case 'flicks':
      flicks();
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
  } else if (accuracy > 33 && accuracy <= 66) {
    accuracyDisplay.style.color = 'hsl(30, 100%, 50%)';
  } else if (accuracy >= 66 && accuracy <= 89) {
    accuracyDisplay.style.color = 'hsl(50, 100%, 50%)';
  } else if (accuracy >= 90) {
    accuracyDisplay.style.color = 'hsl(100, 100%, 50%)';
  }
  accuracyDisplay.textContent = `Accuracy: ${accuracy}%`;
};

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
const shortFlicks = () => {
  // Plus and Minus 40% of target
  const minY =
    target.getBoundingClientRect().y - target.getBoundingClientRect().y * 0.2;
  const maxY =
    target.getBoundingClientRect().y + target.getBoundingClientRect().y * 0.2;

  const minX =
    target.getBoundingClientRect().x - target.getBoundingClientRect().x * 0.2;
  const maxX =
    target.getBoundingClientRect().x + target.getBoundingClientRect().x * 0.2;

  if (target.value == 'notCenter') {
    centerTarget();
    target.value = 'center';
  } else {
    randomizeTargetLocation(minY, maxY, minX, maxX);
    target.value = 'notCenter';
  }
};

// Gamemode 3
const mediumFlicks = () => {
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

// Gamemode 4
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
