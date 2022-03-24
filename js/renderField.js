export default function renderField({ width, height}) {
  let index = 1;
  let card = '<div class="card" id="matrixCard">';
  for (let i = 0; i < height; i++) {
    let row = '<div class="row">';
    for (let j = 0; j < width; j++) {
      let quad = `<div class="quad" id="${index}"></div>`;
      row += quad;
      index++;
    }
    row += '</div>';
    card += row;
  }
  card += '</div>';
  return card;
}
