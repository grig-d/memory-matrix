import colors from './js/colors.js';
import levels from './js/levels.js';
import randomize from './js/randomize.js';
import figureBuild from './js/figureBuild.js';
import renderField from './js/renderField.js';

const ref = {
  main: document.getElementById('main'),
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
let msPerQuad = 400;

let game;
updateGameObj();

////////////////////////////////////

let clicksCount;
let arrayClicked;

newGame();

// FUNCTIONS //

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
  console.log(game);
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
  // appeal next button
}

function levelMax() {
  curLev = levels.length;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
  // appeal next button
}

function levelDecrease() {
  if (curLev === 1) {
    console.log('return');
    return;
  }
  console.log('level Decrease');
  curLev -= 1;
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
  // appeal next button
}

function levelIncrease() {
  if (curLev === levels.length) {
    console.log('return');
    return;
  }
  curLev += 1;
  console.log('level Increase');
  updateLevelDisplay();
  storageLevel();
  updateGameObj();
  drawEmptyField();
  // appeal next button
}

/////////////////////////////////////////////////////////////////////////////////////////////

function storageLevel() {
  localStorage.setItem('level', curLev);
}

function updateLevelDisplay() {
  ref.level.innerHTML = curLev;
}

function newGame() {
  clicksCount = 0;
  arrayClicked = [];
  game.color = randomize(colors);
  game.figure = figureBuild(levels[curLev - 1]);
  console.log('start new game');
  drawEmptyField();
  drawFigure();
  setTimeout(clearFigure, game.quads * msPerQuad);
}

function drawEmptyField() {
  ref.main.innerHTML = '';
  ref.main.insertAdjacentHTML('beforeend', renderField(game));
}

function drawFigure() {
  buttonsOff();
  cursorToggle();
  game.figure.forEach(el => {
    document.getElementById(el).classList.add('right');
    document.getElementById(el).style.backgroundColor = game.color;
  });
}

function clearFigure() {
  game.figure.forEach(el => {
    document.getElementById(el).style.backgroundColor = null;
  });
  cursorToggle();
  startClicking();
}

function startClicking() {
  console.log('START clicking'); // don't need this
  ref.main.addEventListener('click', quadMarking);
}

function stopClicking() {
  console.log('STOP clicking'); // don't need this
  ref.main.removeEventListener('click', quadMarking);
}

function quadMarking(event) {
  const curQuad = event.target;
  if (
    curQuad.classList.contains('quad') &&
    !curQuad.classList.contains('clicked')
  ) {
    clicksCount++;
    curQuad.classList.add('clicked');
    curQuad.style.backgroundColor = game.color;
    arrayClicked.push(curQuad.id);
  }

  if (clicksCount === game.quads) {
    stopClicking();
    showResult();
    return;
  }
}

function showResult() {
  console.log('RESULT'); // don't need this
  const arrayWrong = arrayClicked.filter(
    el => !document.getElementById(el).classList.contains('right'),
  );
  if (arrayWrong.length) {
    arrayWrong.forEach(el => {
      const currentQuad = document.getElementById(el);
      currentQuad.style.backgroundColor = null;
      currentQuad.classList.add('wrong');
    });
    const missedIconMarkup = `<svg class="missed" style="width: 38px; height: 38px" viewBox="0 0 24 24"><path fill="${game.color}" d="M9.29,21H12.12L21,12.12V9.29M19,21C19.55,21 20.05,20.78 20.41,20.41C20.78,20.05 21,19.55 21,19V17L17,21M5,3A2,2 0 0,0 3,5V7L7,3M11.88,3L3,11.88V14.71L14.71,3M19.5,3.08L3.08,19.5C3.17,19.85 3.35,20.16 3.59,20.41C3.84,20.65 4.15,20.83 4.5,20.92L20.93,4.5C20.74,3.8 20.2,3.26 19.5,3.08Z" /></svg>`;
    game.figure.forEach(el => {
      if (!document.getElementById(el).classList.contains('clicked')) {
        document
          .getElementById(el)
          .insertAdjacentHTML('beforeend', missedIconMarkup);
      }
    });
    document.querySelector('.card').classList.add('result-wrong');
  } else {
    document.querySelector('.card').classList.add('result-right');
  }
  buttonsOn();
}

function cursorToggle() {
  console.log('cursor anti-cheat toggle');
  // const element = document.getElementById('matrixCard');
  // if (!element.style.cursor) {
  //   element.style.cursor = 'none';
  // } else {
  //   element.style.cursor = null;
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

function resetRound() {
  // body
}

// next button at start screen need to be start btn

/*
DOCS:

right - true quad
clicked - any quad that was clicked once to prevent second click count on the same quad
wrong - clicked wrong quad
*/
