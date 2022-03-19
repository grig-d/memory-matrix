export default function randomize(array) {
  return array[Math.floor(Math.floor(Math.random() * array.length))];
}
