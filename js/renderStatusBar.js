export default function renderStatusBar({ quads }) {
  let statusBar = '';
  for (let i = 0; i < quads; i++) {
    const statusQuad = `<div id="sb${i + 1}" class="status-quad"></div>`;
    statusBar += statusQuad;
  }
  return statusBar;
}
