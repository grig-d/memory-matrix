console.log('ukr.js');

const arr = [];
const min = 1;
const max = 9;
let n = 5;
for (let k = 0; k < n; k++) {
  let random = Math.floor(Math.random() * (max - min + 1) + min);
  while (arr.includes(random)) {
    random = Math.floor(Math.random() * (max - min + 1) + min);
  }
  arr.push(random);
}

const field = {
  min: 1,
  max: 9,
  n: 5,
  figure: arr,
};

console.log(field.figure);

const refs = {
  card: document.querySelector('#matrixCard'),
};

field.figure.forEach(el => document.getElementById(el).classList.add('checked'));

// type module random color generator
// color - file
// random fn - file