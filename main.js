import colors from './js/colors.js';
import levels from './js/levels.js';
import sizes from './js/sizes.js';

const ref = {
  status: document.getElementById('status-bar'),
  matrix: document.getElementById('matrix'),
  next: document.getElementById('next'),
  level: document.getElementById('displayLevel'),
  decrease: document.getElementById('decreaseLevel'),
  increase: document.getElementById('increaseLevel'),
  min: document.getElementById('min'),
  max: document.getElementById('max'),
};

let curLev = localStorage.getItem('level')
  ? JSON.parse(localStorage.getItem('level'))
  : 1;

storageLevel();

ref.level.innerHTML = curLev;

ref.min.addEventListener('click', levelMin);
ref.max.addEventListener('click', levelMax);
ref.decrease.addEventListener('click', levelDecrease);
ref.increase.addEventListener('click', levelIncrease);
ref.next.addEventListener('click', newGame);

// Difficulty hard = 400, medium = 600, easy = 800
// FROM SETTINGS default easy
let msPerQuad = 400;

// FROM SETTINGS default medium
let quadSize = sizes[0];

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
  curLev = 1;
  game.level = curLev;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
}

function levelMax() {
  curLev = levels.length;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
}

function levelDecrease() {
  if (curLev === 1) {
    console.log('return; need to disable decrease and min buttons');
    // FIXME: need to disable decrease and min buttons - decreaseButtonsOff()
    return;
  }
  // FIXME: check increase button to enable
  console.log('LEVEL DECREASE');
  curLev -= 1;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
}

function levelIncrease() {
  if (curLev === levels.length) {
    console.log('return; need to disable increase and max buttons');
    // FIXME: need to disable increase and max buttons - increaseButtonsOff()
    return;
  }
  // FIXME: check decrease button to enable
  curLev += 1;
  console.log('LEVEL INCREASE');
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
}

function storageLevel() {
  localStorage.setItem('level', curLev);
}

function updateLevelDisplay() {
  ref.level.innerHTML = curLev;
}

function newGame() {
  ref.next.style.fontSize = '16px';
  ref.next.innerHTML = 'Ready';
  clicksCount = 0;
  arrayClicked = [];
  game.color = randomize(colors);
  game.figure = figureBuild(levels[curLev - 1]);
  console.log('NEW GAME');
  drawEmptyField();
  drawFigure();
  setTimeout(clearFigure, game.quads * msPerQuad);
}

function drawEmptyField() {
  ref.matrix.innerHTML = '';
  ref.status.innerHTML = '';
  ref.status.insertAdjacentHTML('beforeend', renderStatusBar(game));
  ref.matrix.insertAdjacentHTML('beforeend', renderField(game));
}

function drawFigure() {
  buttonsOff();
  cursorToggle();
  game.figure.forEach((el, ind) => {
    document.getElementById(el).dataset.type = 'marked';
    document.getElementById(el).style.backgroundColor = game.color;
    arrayStatus.push(document.getElementById(`${parseInt(++ind)}-status`));
  });
}

function clearFigure() {
  game.figure.forEach((el, ind) => {
    document.getElementById(el).style.backgroundColor = null;
    arrayStatus[ind].style.backgroundColor = game.color;
  });
  cursorToggle();
  ref.next.style.fontSize = '18px';
  ref.next.innerHTML = 'Go!';
  startClicking();
}

function startClicking() {
  console.log('START CLICKING');
  ref.matrix.addEventListener('click', quadMarking);
}

function stopClicking() {
  console.log('STOP CLICKING');
  ref.matrix.removeEventListener('click', quadMarking);
}

function quadMarking(event) {
  const curQuad = event.target;
  if (curQuad.classList.contains('quad') && !curQuad.dataset.state) {
    clicksCount++;
    curQuad.dataset.state = 'clicked';
    curQuad.style.backgroundColor = game.color;
    arrayClicked.push(curQuad.id);
    cleanStatusQuad();
  }

  if (clicksCount === game.quads) {
    stopClicking();
    showResult();
    return;
  }
}

function showResult() {
  console.log('SHOW RESULT');
  const arrayWrong = arrayClicked.filter(
    el => document.getElementById(el).dataset.type === 'empty',
  );
  if (arrayWrong.length) {
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
    ref.matrix.classList.add('result-wrong');
  } else {
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
  ref.next.innerHTML = 'Start';
}

function cursorToggle() {
  console.log('ANTI-CHEAT CURSOR TOGGLE');
  // if (!ref.matrix.style.cursor) {
  //   ref.matrix.style.cursor = 'none';
  // } else {
  //   ref.matrix.style.cursor = null;
  // }
}

function buttonsOn() {
  ref.min.disabled = false;
  ref.decrease.disabled = false;
  ref.increase.disabled = false;
  ref.max.disabled = false;
  ref.next.disabled = false;
}

function buttonsOff() {
  ref.min.disabled = true;
  ref.decrease.disabled = true;
  ref.increase.disabled = true;
  ref.max.disabled = true;
  ref.next.disabled = true;
}

function increaseButtonsOff() {
  // FIXME:
}

function decreaseButtonsOff() {
  // FIXME:
}

function cleanStatusQuad() {
  arrayStatus.pop().style.backgroundColor = null;
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
