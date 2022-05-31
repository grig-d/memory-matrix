import colors from './js/colors.js';
import levels from './js/levels.js';
import difficulty from './js/difficulty.js';
import sizes from './js/sizes.js';

const consoleLog = '1'; // console.log messages NO ('') or YES ('1')

const refs = {
  page: document.querySelector('.page'),
  status: document.getElementById('status-bar'),
  matrix: document.getElementById('matrix'),
  next: document.getElementById('next'),
  level: document.getElementById('displayLevel'),
  decrease: document.getElementById('decreaseLevel'),
  increase: document.getElementById('increaseLevel'),
  min: document.getElementById('min'),
  max: document.getElementById('max'),
  about: document.querySelector('.logo'),
  settings: document.getElementById('settings'),
  backdropAbout: document.querySelector('[data-backdrop-about]'),
  backdropSettings: document.querySelector('[data-backdrop-settings]'),
  closeAbout: document.querySelector('[data-close-about]'),
  closeSettings: document.querySelector('[data-close-settings]'),
  aboutOkBtn: document.getElementById('about-ok'),
  saveSettingsBtn: document.getElementById('save-settings'),
  antiCheatBox: document.getElementById('anti-cheat'),
  quadSizePreview: document.querySelector('.quad-size-preview'),
  themeToggle: document.getElementById('theme-toggle'),
  difficultyRange: document.getElementById('difficulty-range'),
  difficultyLabel: document.getElementById('difficulty-label'),
  sizeRange: document.getElementById('size-range'),
  sizeLabel: document.getElementById('size-label'),
};

refs.about.addEventListener('click', openModalAbout);
refs.settings.addEventListener('click', openModalSettings);
refs.min.addEventListener('click', levelMin);
refs.max.addEventListener('click', levelMax);
refs.decrease.addEventListener('click', levelDecrease);
refs.increase.addEventListener('click', levelIncrease);
refs.next.addEventListener('click', newGame);

//
const userSettings = JSON.parse(localStorage.getItem('MeMtrx'));
console.log(userSettings);

let curLev = userSettings ? userSettings.level : 1;
let antiCheat = userSettings ? userSettings.antiCheat : 0;
let theme = userSettings ? userSettings.theme : 0;
let curDif = userSettings ? userSettings.curDif : difficulty[0];
let quadSize = userSettings ? userSettings.quadSize : sizes[0];
storage();

// console.log(userSettings.hasOwnProperty('level'));
// console.log(userSettings.hasOwnProperty('antiCheat'));
// console.log(userSettings.hasOwnProperty('theme'));
// console.log(userSettings.hasOwnProperty('curDif'));
// console.log(userSettings.hasOwnProperty('quadSize'));
//

difficultyRangeUpdate(curDif);
quadSizePreviewUpdate(quadSize);

refs.level.innerHTML = curLev;

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
  storage();
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
  storage();
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
  storage();
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
  storage();
  updateGameObj();
  drawEmptyField();
}

function storage() {
  localStorage.setItem(
    'MeMtrx',
    JSON.stringify({
      level: curLev,
      antiCheat: antiCheat,
      theme: theme,
      curDif: curDif,
      quadSize: quadSize,
    }),
  );
  console.table(JSON.parse(localStorage.getItem('MeMtrx'))); //DELETE
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
  setTimeout(clearFigure, game.quads * curDif.ms); //
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
    if (!refs.page.style.cursor) {
      refs.page.style.cursor = 'wait';
    } else {
      refs.page.style.cursor = null;
    }
    if (!refs.matrix.style.cursor) {
      refs.matrix.style.cursor = 'none';
    } else {
      refs.matrix.style.cursor = null;
    }
  }
}

function buttonsOn() {
  refs.about.classList.remove('unclickable');
  refs.settings.classList.remove('unclickable');
  refs.min.disabled = false;
  refs.decrease.disabled = false;
  refs.increase.disabled = false;
  refs.max.disabled = false;
  refs.next.disabled = false;
}

function buttonsOff() {
  refs.about.classList.add('unclickable');
  refs.settings.classList.add('unclickable');
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

Quad Size default medium (40px, 50px, 60px, 70px, 80px)
Difficulty default easy (wild = 200ms, hard = 400ms, medium = 600ms, easy = 800ms)

newGame() > drawEmptyField() > renderField(game) > drawFigure() > clearFigure() > startClicking() > quadMarking() >
cleanStatusQuad() > stopClicking() > showResult()
*/

function openModalAbout() {
  refs.backdropAbout.classList.remove('is-hidden');
  refs.closeAbout.addEventListener('click', closeModalAbout);
  refs.aboutOkBtn.addEventListener('click', closeModalAbout);
  refs.backdropAbout.addEventListener('click', closeModalAboutByBackdrop);
  window.addEventListener('keydown', closeModalAboutByEscape);
}

function closeModalAbout() {
  refs.closeAbout.removeEventListener('click', closeModalAbout);
  refs.aboutOkBtn.removeEventListener('click', closeModalAbout);
  refs.backdropAbout.removeEventListener('click', closeModalAboutByBackdrop);
  window.removeEventListener('keydown', closeModalAboutByEscape);
  refs.backdropAbout.classList.add('is-hidden');
}

function closeModalAboutByBackdrop(event) {
  console.log(event.target); //DELETE
  if (event.target === refs.backdropAbout) {
    closeModalAbout();
  }
}

function closeModalAboutByEscape(event) {
  console.log(event.code); //DELETE
  if (event.code === 'Escape') {
    closeModalAbout();
  }
}

//=======================================================================================
// refs.antiCheatBox.removeEventListener
// refs.themeToggle.removeEventListener
// refs.difficultyRange.removeEventListener
// refs.sizeRange.removeEventListener

function openModalSettings() {
  refs.backdropSettings.classList.remove('is-hidden');
  refs.closeSettings.addEventListener('click', closeModalSettings);
  refs.saveSettingsBtn.addEventListener('click', saveSettings);
  refs.backdropSettings.addEventListener('click', closeModalSettingsByBackdrop);
  window.addEventListener('keydown', closeModalSettingsByEscape);
  // refs.antiCheatBox.addEventListener
  // refs.themeToggle.addEventListener
  // refs.difficultyRange.addEventListener
  // refs.sizeRange.addEventListener
  // update from local
}

function closeModalSettings() {
  refs.closeSettings.removeEventListener('click', closeModalSettings);
  refs.saveSettingsBtn.removeEventListener('click', saveSettings);
  refs.backdropSettings.removeEventListener(
    'click',
    closeModalSettingsByBackdrop,
  );
  window.removeEventListener('keydown', closeModalSettingsByEscape);
  // remove listeners
  refs.backdropSettings.classList.add('is-hidden');
  // restore? from local if not saving
}

function closeModalSettingsByBackdrop(event) {
  console.log(event.target); //DELETE
  if (event.target === refs.backdropSettings) {
    closeModalSettings();
  }
}

function closeModalSettingsByEscape(event) {
  console.log(event.code); //DELETE
  if (event.code === 'Escape') {
    closeModalSettings();
  }
}

function saveSettings() {
  console.log('SAVE SETTINGS');
  // TODO: save settings in json and update all
  // take info from all fields in modal and then storage();
  // level: curLev,
  // antiCheat: antiCheat,
  // theme: theme,
  // curDif: curDif,
  // quadSize: quadSize,
  closeModalSettings();
}

// difficultyRangeUpdate(fromLocal)
// quadSizePreviewUpdate(fromLocal)

//////////////////////////////////////////////////////////////////////////////////////////////////

refs.antiCheatBox.addEventListener('click', antiCheatChange);
function antiCheatChange() {
  console.log(refs.antiCheatBox.checked, 'ANTI-CHEAT TOGGLE');
  console.log(this);
}

refs.themeToggle.addEventListener('click', themeToggleChange);
function themeToggleChange() {
  console.log(refs.themeToggle.checked, 'THEME TOGGLE');
  console.log(this);
}

refs.difficultyRange.addEventListener('change', difficultyRangeOnChange);

function difficultyRangeOnChange() {
  const index = this.value;
  const newDifficulty = difficulty[index];
  difficultyRangeUpdate(newDifficulty);
}

function difficultyRangeUpdate(newDifficulty) {
  refs.difficultyLabel.textContent = capitalize(newDifficulty.name);
  const index = difficulty.findIndex(object => {
    return object.name === newDifficulty.name;
  });
  refs.difficultyRange.value = index;
}

refs.sizeRange.addEventListener('change', sizeRangeOnChange);

function sizeRangeOnChange() {
  const index = this.value;
  const newSize = sizes[index];
  quadSizePreviewUpdate(newSize);
}

function quadSizePreviewUpdate(newSize) {
  refs.sizeLabel.textContent = capitalize(newSize.class);
  const index = sizes.findIndex(object => {
    return object.class === newSize.class;
  });
  refs.sizeRange.value = index;
  const oldDataSize = refs.quadSizePreview.dataset.size;
  refs.quadSizePreview.classList.remove(oldDataSize);
  refs.quadSizePreview.dataset.size = newSize.class;
  refs.quadSizePreview.classList.add(newSize.class);
}

// fn closeSettingNoSave - ESC X and clickOnBackdrop
// update all settings from storage
//=====================================================================================

function capitalize(string) {
  const array = string.split('');
  return array.shift().toUpperCase() + array.join('');
}

/*

Anti-Cheat Cursor (checkbox) (change color of prop-name)
Difficulty (range) Easy Medium Hard Wild
Theme (toggle) Light Dark
Color: (pallette) Random Fixed
Size (range with preview) Tiny Small Standart Large Giant
---------------------------------------------------------

модальное окно	1:10:14	[HTML22] М5-9. Позиционированные элементы
бургер	1:41:00	[HTML22] М8-15. Адаптивная вёрстка. Часть 1
скроллинг модалки	0:07:00	[HTML22] М8-15. Адаптивная вёрстка. Часть 2
скроллинг модалки	1:00:10	[HTML22] М8-15. Адаптивная вёрстка. Часть 2

// ESC, clickBackdrop, close button
// global ESC - quit game

// Settings
Difficulty(curDif): wild 200ms; hard 400ms; medium 600ms; easy 800ms;
Cursor(antiCheat): anti-cheat;
Color:  random (default)
Size(quadSize):   tiny 40x40
        small 50x50
        medium 60x60
        large 70x70
        giant 80x80
Theme:  default light, dark, cyber

preview quad size

https://www.youtube.com/watch?v=D90Y7TFsuZ4&list=PLdM4CqvCBocZjoYdCGTyPAvBj1NSHd646&index=129&t=14s

https://www.youtube.com/watch?v=b_Ph0Yzatk4&list=PLdM4CqvCBocZjoYdCGTyPAvBj1NSHd646&index=176&t=208s

// Theme:  default light, dark, cyber
https://www.youtube.com/watch?v=0etPzM0bl4E&list=PLdM4CqvCBocZjoYdCGTyPAvBj1NSHd646&index=159&t=8s

// Alternative field:
random field rotate 90 (3x8 or 8x3)
object properties enable-disable and true-false
game.rotate: {enable, true}

// SCORE: 0
// SERIES: 4

// Extra levels
more than 20
enabled-disabled in settings

Choose level and click on the Start Game button to start!

// Drop Menu https://www.youtube.com/watch?v=bC6vOWWNoas

// css vendor prefixes
// Mobile Tab Desktop

// Сервер бэкапов

preloader and theme
https://www.youtube.com/watch?v=kyoTYFTLm8A
*/
