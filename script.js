const paletteEl = document.getElementById('palette');
const generateBtn = document.getElementById('generate-btn');

const NUM_COLORS = 5;

let colors = [];
let locked = [];

function randomHexPart() {
  const value = Math.floor(Math.random() * 256);
  return value.toString(16).padStart(2, '0');
}

function randomColor() {
  return `#${randomHexPart()}${randomHexPart()}${randomHexPart()}`;
}

function getTextColor(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;
  return brightness > 150 ? '#201f1b' : '#f3f1ec';
}

function copyToClipboard(color, hexLabel) {
  navigator.clipboard.writeText(color.toUpperCase()).then(() => {
    const originalText = hexLabel.textContent;
    hexLabel.textContent = 'Copiado!';
    setTimeout(() => {
      hexLabel.textContent = originalText;
    }, 800);
  });
}

function renderPalette() {
  paletteEl.innerHTML = '';

  colors.forEach((color, index) => {
    const swatch = document.createElement('div');
    swatch.className = 'swatch';
    swatch.style.backgroundColor = color;
    swatch.style.color = getTextColor(color);
    swatch.tabIndex = 0;
    swatch.setAttribute('role', 'button');
    swatch.setAttribute('aria-label', `Copiar ${color.toUpperCase()}`);

    const lockBtn = document.createElement('button');
    lockBtn.className = 'lock-btn';
    lockBtn.textContent = locked[index] ? '🔒' : '🔓';
    lockBtn.setAttribute('aria-label', locked[index] ? 'Destravar cor' : 'Travar cor');
    lockBtn.addEventListener('click', (event) => {
      event.stopPropagation();
      locked[index] = !locked[index];
      renderPalette();
    });

    const hexLabel = document.createElement('span');
    hexLabel.className = 'hex-code';
    hexLabel.textContent = color.toUpperCase();

    swatch.appendChild(lockBtn);
    swatch.appendChild(hexLabel);

    swatch.addEventListener('click', () => copyToClipboard(color, hexLabel));
    swatch.addEventListener('keydown', (event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        copyToClipboard(color, hexLabel);
      }
    });

    paletteEl.appendChild(swatch);
  });
}

function generatePalette() {
  colors = colors.map((color, index) => (locked[index] ? color : randomColor()));
  renderPalette();
}

function init() {
  colors = Array.from({ length: NUM_COLORS }, randomColor);
  locked = Array(NUM_COLORS).fill(false);
  renderPalette();
}

generateBtn.addEventListener('click', generatePalette);
document.addEventListener('keydown', (event) => {
  if (event.code === 'Space') {
    event.preventDefault();
    generatePalette();
  }
});

init();
