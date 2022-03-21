import colors from './js/colors.js';
import levels from './js/levels.js';
import randomize from './js/randomize.js';
import figureBuild from './js/figureBuild.js';
import renderField from './js/renderField.js';

// current level
let curLev = 5; // take this from UI

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
// renderField(game);

const ref = {
  main: document.getElementById('main'),
};

ref.main.insertAdjacentHTML('beforeend', renderField(game));

// ref.main.innerHTML = ''; // переписывает всю разметку
// element.insertAdjacentHTML('beforeend', string); // добавляет разметку

game.figure.forEach(el => {
  document.getElementById(el).classList.add('checked');
  document.getElementById(el).style.backgroundColor = game.color;
});

