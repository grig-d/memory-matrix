import colors from './js/colors.js';
import levels from './js/levels.js';
import randomize from './js/randomize.js';

// const arr = [];
// const min = 1;
// const max = 16;
// let n = 7;
// for (let k = 0; k < n; k++) {
//   let random = Math.floor(Math.random() * (max - min + 1) + min);
//   while (arr.includes(random)) {
//     random = Math.floor(Math.random() * (max - min + 1) + min);
//   }
//   arr.push(random);
// }

// const field = {
//   min: 1,
//   max: 16,
//   n: 7,
//   figure: arr,
// };

// console.log(arr);
// console.log(colors);

// const refs = {
//   card: document.querySelector('#matrixCard'),
// };

// const randomColor = '#111';
// randomize('fubar');
// randomize(colors);

// field.figure.forEach(el => {
//   document.getElementById(el).classList.add('checked');
//   document.getElementById(el).style.backgroundColor = randomColor;
// });

console.log(levels[0]);
console.log(randomize(colors));
