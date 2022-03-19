import colors from './js/colors.js';
import levels from './js/levels.js';
import randomize from './js/randomize.js';
import figureBuild from './js/figureBuild.js';

let curLev = 4;
let randomColor = randomize(colors);
let randomSet = figureBuild(levels[curLev - 1]);

randomSet.forEach(el => {
  document.getElementById(el).classList.add('checked');
  document.getElementById(el).style.backgroundColor = randomColor;
});
