import colors from './js/colors.js';
import levels from './js/levels.js';
import randomize from './js/randomize.js';
import figureBuild from './js/figureBuild.js';
import renderField from './js/renderField.js';

const ref = {
  main: document.getElementById('main'),
  next: document.getElementById('next'),
};
// default level is 1
// current level from UI or storage
let curLev = 4;

// Difficulty hard = 400, medium = 600, easy = 800
let msPerQuad = 400;

let clicksCount = 0;
let arrayClicked = [];

const game = {
  level: curLev,
  width: levels[curLev - 1].width,
  height: levels[curLev - 1].height,
  quads: levels[curLev - 1].quads,
  size: levels[curLev - 1].width * levels[curLev - 1].height,
  color: randomize(colors),
  figure: figureBuild(levels[curLev - 1]),
};

drawEmptyField();
drawFigure();
setTimeout(clearFigure, game.quads * msPerQuad);

function drawEmptyField() {
  ref.main.insertAdjacentHTML('beforeend', renderField(game));
}

function drawFigure() {
  nextOff();
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

// ref.main.innerHTML = ''; // переписывает всю разметку
// element.insertAdjacentHTML('beforeend', string); // добавляет разметку

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
    document.querySelector('.card').classList.add('result-wrong');
  } else {
    document.querySelector('.card').classList.add('result-right');
  }
  arrayClicked = [];
  nextOn(); // maybe place it not here
}

function cursorToggle() {
  const element = document.getElementById('matrixCard');
  if (!element.style.cursor) {
    element.style.cursor = 'none';
  } else {
    element.style.cursor = null;
  }
}

function nextOn() {
  ref.next.disabled = false;
}

function nextOff() {
  ref.next.disabled = true;
}

function newGame() {
  // body
}

// remove classes 'clicked' and 'right' and 'wrong' but maybe don't need this
// block buttons when clicking

/*
DOCS:

right - true quad
clicked - any quad that was clicked once to prevent second click count on the same quad
wrong - clicked wrong quad
*/
