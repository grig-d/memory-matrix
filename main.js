import colors from './js/colors.js';
import levels from './js/levels.js';
import randomize from './js/randomize.js';
import figureBuild from './js/figureBuild.js';
import renderField from './js/renderField.js';

const ref = {
  main: document.getElementById('main'),
};
// default level is 1
// current level from UI or storage
let curLev = 1;

// Difficulty hard = 400, medium = 600, easy = 800
let msPerQuad = 400;

let clicksCount = 0;

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
  game.figure.forEach(el => {
    document.getElementById(el).classList.add('right');
    document.getElementById(el).style.backgroundColor = game.color;
  });
}

function clearFigure() {
  game.figure.forEach(el => {
    document.getElementById(el).style.backgroundColor = null;
  });
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
    console.log(clicksCount, 'id', curQuad.id, 'was clicked'); // don't need this
  }

  if (clicksCount === game.quads) {
    stopClicking();
    setTimeout(showResult, 500);
    return;
  }

  // // // //
  // someFunction();
  // if (curQuad.classList.contains('checked')) {
  //   console.log('checked');
  //   curQuad.classList.add('chosen');
  // } else {
  //   console.log('wrong'); // don't need this
  // }
}

function showResult() {
  console.log('RESULT');
}

// right - true quad
// clicked - any quad that was clicked once to prevent second click count on the same quad

// chosen - chosen by player
// wrong - wrong quad

// remove class 'marked'
// block buttons when clicking

// setTimeout 1sec - final
