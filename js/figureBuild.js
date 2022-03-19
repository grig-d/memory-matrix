export default function figureBuild({ width, height, quads }) {
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
