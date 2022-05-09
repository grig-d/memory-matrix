import colors from './js/colors.js';
import levels from './js/levels.js';
import sizes from './js/sizes.js';

const consoleLog = '1'; // console.log messages NO ('') or YES ('1')

const refs = {
  status: document.getElementById('status-bar'),
  matrix: document.getElementById('matrix'),
  next: document.getElementById('next'),
  level: document.getElementById('displayLevel'),
  decrease: document.getElementById('decreaseLevel'),
  increase: document.getElementById('increaseLevel'),
  min: document.getElementById('min'),
  max: document.getElementById('max'),
  settings: document.getElementById('settings'),
  backdrop: document.querySelector('[data-backdrop]'),
  closeModal: document.querySelector('[data-close-modal]'),
};

let curLev = localStorage.getItem('level')
  ? JSON.parse(localStorage.getItem('level'))
  : 1;

storageLevel();

refs.level.innerHTML = curLev;

refs.min.addEventListener('click', levelMin);
refs.max.addEventListener('click', levelMax);
refs.decrease.addEventListener('click', levelDecrease);
refs.increase.addEventListener('click', levelIncrease);
refs.next.addEventListener('click', newGame);

// Difficulty hard = 400, medium = 600, easy = 800
// FROM SETTINGS default easy
const msPerQuad = 400;

// FROM SETTINGS default medium
const quadSize = sizes[2];

// FROM SETTINGS default 0
const antiCheat = 0;

let game,
  clicksCount,
  arrayClicked,
  arrayStatus = [];
updateGameObj();

buttonsOn();
drawEmptyField();

function randomize(array) {
  return array[Math.floor(Math.floor(Math.random() * array.length))];
}

function figureBuild({ width, height, quads }) {
  const arraySet = [];
  const max = width * height;
  for (let i = 0; i < quads; i++) {
    let random = Math.floor(Math.random() * max + 1);
    while (arraySet.includes(random)) {
      random = Math.floor(Math.random() * max + 1);
    }
    arraySet.push(random);
  }
  return arraySet;
}

function renderField({ width, height }) {
  let index = 1;
  let cardContent = '';
  for (let i = 0; i < height; i++) {
    let row = '<div class="row">';
    for (let j = 0; j < width; j++) {
      let quad = `<div class="quad ${quadSize.class}" id="${index}" data-type="empty"></div>`;
      row += quad;
      index++;
    }
    row += '</div>';
    cardContent += row;
  }
  return cardContent;
}

function renderStatusBar({ quads }) {
  let statusBar = '';
  for (let i = 0; i < quads; i++) {
    const statusQuad = `<div id="${i + 1}-status" class="status-quad"></div>`;
    statusBar += statusQuad;
  }
  return statusBar;
}

function updateGameObj() {
  game = {
    level: curLev,
    width: levels[curLev - 1].width,
    height: levels[curLev - 1].height,
    quads: levels[curLev - 1].quads,
    size: levels[curLev - 1].width * levels[curLev - 1].height,
    color: randomize(colors),
    figure: figureBuild(levels[curLev - 1]),
  };
}

function levelMin() {
  if (curLev === 1) {
    return;
  }
  if (consoleLog) {
    console.log('LEVEL MIN');
  }
  curLev = 1;
  game.level = curLev;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
}

function levelMax() {
  if (curLev === levels.length) {
    return;
  }
  if (consoleLog) {
    console.log('LEVEL MAX');
  }
  curLev = levels.length;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
}

function levelDecrease() {
  if (curLev === 1) {
    return;
  }
  if (consoleLog) {
    console.log('LEVEL DECREASE');
  }
  curLev -= 1;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
}

function levelIncrease() {
  if (curLev === levels.length) {
    return;
  }
  if (consoleLog) {
    console.log('LEVEL INCREASE');
  }
  curLev += 1;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
}

function storageLevel() {
  localStorage.setItem('level', curLev);
}

function updateLevelDisplay() {
  refs.level.innerHTML = curLev;
}

function newGame() {
  refs.next.style.fontSize = '16px';
  refs.next.innerHTML = 'Ready';
  clicksCount = 0;
  arrayClicked = [];
  game.color = randomize(colors);
  game.figure = figureBuild(levels[curLev - 1]);
  if (consoleLog) {
    console.log('NEW GAME * * *');
  }
  drawEmptyField();
  drawFigure();
  setTimeout(clearFigure, game.quads * msPerQuad);
}

function drawEmptyField() {
  refs.matrix.innerHTML = '';
  refs.status.innerHTML = '';
  refs.status.insertAdjacentHTML('beforeend', renderStatusBar(game));
  refs.matrix.insertAdjacentHTML('beforeend', renderField(game));
}

function drawFigure() {
  buttonsOff();
  cursorToggle();
  game.figure.forEach((el, ind) => {
    document.getElementById(el).dataset.type = 'marked';
    document.getElementById(el).style.backgroundColor = game.color;
    arrayStatus.push(document.getElementById(`${++ind}-status`));
  });
}

function clearFigure() {
  game.figure.forEach((el, ind) => {
    document.getElementById(el).style.backgroundColor = null;
    arrayStatus[ind].style.backgroundColor = game.color;
  });
  cursorToggle();
  refs.next.style.fontSize = '18px';
  refs.next.innerHTML = 'Go!';
  startClicking();
}

function startClicking() {
  if (consoleLog) {
    console.log('START CLICKING');
  }
  refs.matrix.addEventListener('click', quadMarking);
}

function stopClicking() {
  if (consoleLog) {
    console.log('STOP CLICKING');
  }
  refs.matrix.removeEventListener('click', quadMarking);
}

function quadMarking(event) {
  const currentQuad = event.target;
  if (currentQuad.classList.contains('quad') && !currentQuad.dataset.state) {
    clicksCount++;
    currentQuad.dataset.state = 'clicked';
    currentQuad.style.backgroundColor = game.color;
    arrayClicked.push(currentQuad.id);
    cleanStatusQuad();
  } else if (
    currentQuad.classList.contains('quad') &&
    currentQuad.dataset.state
  ) {
    // UNDO
    clicksCount--;
    currentQuad.removeAttribute('data-state');
    currentQuad.style.backgroundColor = null;
    const indexToRemove = arrayClicked.indexOf(currentQuad.id);
    arrayClicked.splice(indexToRemove, 1);
    undoStatusQuad();
  }
  if (clicksCount === game.quads) {
    stopClicking();
    showResult();
  }
}

function showResult() {
  if (consoleLog) {
    console.log('SHOW RESULT');
  }
  const arrayWrong = arrayClicked.filter(
    el => document.getElementById(el).dataset.type === 'empty',
  );
  if (arrayWrong.length) {
    if (consoleLog) {
      console.log('WRONG');
    }
    const wrongIconMarkup = `<svg style="width: ${quadSize.px - 2}px; height: ${
      quadSize.px - 2
    }px" viewBox="0 0 24 24"><path fill="#999999" d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
</svg>`;
    arrayWrong.forEach(el => {
      const currentQuad = document.getElementById(el);
      currentQuad.style.backgroundColor = null;
      currentQuad.insertAdjacentHTML('beforeend', wrongIconMarkup);
    });
    const missedIconMarkup = `<svg class="missed" style="width: ${
      quadSize.px - 2
    }px; height: ${quadSize.px - 2}px" viewBox="0 0 24 24"><path fill="${
      game.color
    }" d="m 8.625,21 h 4.5 L 21,13.125 v -4.5 M 21,21 V 16.5 L 16.5,21 M 3,3 V 7.5 L 7.5,3 M 10.875,3 3,10.875 v 4.5 L 15.375,3 M 18.75,3 3,18.75 V 21 H 5.25 L 21,5.25 V 3 Z" /></svg>`;
    game.figure.forEach(el => {
      if (!document.getElementById(el).dataset.state) {
        document
          .getElementById(el)
          .insertAdjacentHTML('beforeend', missedIconMarkup);
      }
    });
    refs.matrix.classList.add('result-wrong');
  } else {
    if (consoleLog) {
      console.log('RIGHT');
    }
    const checkIconMarkup = `<svg style="width: ${quadSize.px - 2}px; height: ${
      quadSize.px - 2
    }px" viewBox="0 0 24 24"><path fill="rgba(255,255,255,0.4)" d="M9,20.42L2.79,14.21L5.62,11.38L9,14.77L18.88,4.88L21.71,7.71L9,20.42Z" /></svg>`;
    arrayClicked.forEach(el => {
      document
        .getElementById(el)
        .insertAdjacentHTML('beforeend', checkIconMarkup);
    });
  }
  buttonsOn();
  refs.next.innerHTML = 'Start';
}

function cursorToggle() {
  if (antiCheat) {
    if (consoleLog) {
      console.log('ANTI-CHEAT CURSOR TOGGLE');
    }
    if (!refs.matrix.style.cursor) {
      refs.matrix.style.cursor = 'none';
    } else {
      refs.matrix.style.cursor = null;
    }
  }
}

function buttonsOn() {
  refs.min.disabled = false;
  refs.decrease.disabled = false;
  refs.increase.disabled = false;
  refs.max.disabled = false;
  refs.next.disabled = false;
}

function buttonsOff() {
  refs.min.disabled = true;
  refs.decrease.disabled = true;
  refs.increase.disabled = true;
  refs.max.disabled = true;
  refs.next.disabled = true;
}

function cleanStatusQuad() {
  arrayStatus.pop().style.backgroundColor = null;
}

function undoStatusQuad() {
  const index = arrayStatus.length + 1;
  const currentStatusQuad = document.getElementById(`${index}-status`);
  arrayStatus.push(currentStatusQuad);
  currentStatusQuad.style.backgroundColor = game.color;
}

/*
DOCS:

data-type="empty" - empty quad
data-type="marked" - filled quad
data-clicked="clicked" - any quad that was clicked
missed - class with styles

newGame() > drawEmptyField() > renderField(game) > drawFigure() > clearFigure() > startClicking() > quadMarking() >
cleanStatusQuad() > stopClicking() > showResult()
*/

refs.settings.addEventListener('click', toggleModal);
refs.closeModal.addEventListener('click', toggleModal);

function toggleModal() {
  if (consoleLog) {
    console.log(`SETTINGS`);
  }
  refs.backdrop.classList.toggle('is-hidden');
}
