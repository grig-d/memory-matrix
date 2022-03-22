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
let msPerQuad = 600;

const game = {
  level: curLev,
  width: levels[curLev - 1].width,
  height: levels[curLev - 1].height,
  quads: levels[curLev - 1].quads,
  size: levels[curLev - 1].width * levels[curLev - 1].height,
  color: randomize(colors),
  figure: figureBuild(levels[curLev - 1]),
};

// console.log(game);

drawEmptyField();
drawFigure();

const timeout = setTimeout(clearFigure, game.quads * msPerQuad);

// clearFigure();

function drawEmptyField() {
  ref.main.insertAdjacentHTML('beforeend', renderField(game));
}

function drawFigure() {
  game.figure.forEach(el => {
    document.getElementById(el).classList.add('checked');
    document.getElementById(el).style.backgroundColor = game.color;
  });
}

function clearFigure() {
  game.figure.forEach(el => {
    document.getElementById(el).style.backgroundColor = null;
  });
  stopTimeout();
  startClicking();
}

// ref.main.innerHTML = ''; // переписывает всю разметку
// element.insertAdjacentHTML('beforeend', string); // добавляет разметку

function stopTimeout() {
  clearTimeout(timeout);
}

function startClicking() {
  console.log('start clicking');
}

// // // //

let clicksCount = 0;
ref.main.addEventListener('click', function (e) {
  clicksCount++;
  if (clicksCount === game.quads) {
    console.log('STOP');
  }
  console.log(
    clicksCount,
    e.target.id,
    e.target.classList.contains('matrix--quad'),
  );
  if (e.target.classList.contains('checked')) {
    console.log('checked');
    e.target.classList.add('marked');
  } else {
    console.log('wrong');
  }
});

// removeEventListener
// remove class 'marked'
