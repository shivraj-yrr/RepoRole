const frontendUrl = process.env.FRONTEND_URL || 'https://repo-role.vercel.app';

const analyzerHref = `${frontendUrl.replace(/\/$/, '')}/analyze`;
document.querySelector('#analyzerLink').href = analyzerHref;
document.querySelector('#startAnalyzerLink').href = analyzerHref;

const canvas = document.querySelector('#lightTrailsCanvas');
const context = canvas.getContext('2d');
let width = 0;
let height = 0;
let frame = 0;

function resizeCanvas() {
  const scale = Math.min(window.devicePixelRatio || 1, 2);
  width = window.innerWidth;
  height = window.innerHeight;
  canvas.width = width * scale;
  canvas.height = height * scale;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  context.setTransform(scale, 0, 0, scale, 0, 0);
}

function drawTrails() {
  context.clearRect(0, 0, width, height);
  const centerX = width * 0.72;
  const centerY = height * 0.53;
  for (let trail = 0; trail < 5; trail += 1) {
    context.beginPath();
    for (let point = 0; point <= 90; point += 1) {
      const progress = point / 90;
      const angle = progress * Math.PI * 1.7 + trail * 0.8;
      const x = centerX + Math.cos(angle + frame * 0.00035 + trail) * (120 + progress * 330);
      const y = centerY + Math.sin(angle * 0.9 + frame * 0.00022) * (45 + trail * 22) + progress * 90;
      if (point === 0) context.moveTo(x, y);
      else context.lineTo(x, y);
    }
    context.strokeStyle = trail % 2 ? 'rgba(116,226,203,.12)' : 'rgba(255,147,111,.10)';
    context.lineWidth = trail === 0 ? 2 : 1;
    context.stroke();
  }
  frame += 1;
  requestAnimationFrame(drawTrails);
}

resizeCanvas();
drawTrails();
window.addEventListener('resize', resizeCanvas);

const particles = document.querySelector('#particles');
for (let index = 0; index < 32; index += 1) {
  const particle = document.createElement('span');
  particle.className = 'particle';
  particle.style.left = `${Math.random() * 100}%`;
  particle.style.top = `${35 + Math.random() * 55}%`;
  particle.style.animationDelay = `${Math.random() * 4}s`;
  particles.appendChild(particle);
}

const menuButton = document.querySelector('#mobileToggle');
const navigation = document.querySelector('#navLinks');
menuButton.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('active');
  menuButton.setAttribute('aria-expanded', String(isOpen));
  menuButton.textContent = isOpen ? 'Close' : 'Menu';
});

navigation.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  navigation.classList.remove('active');
  menuButton.setAttribute('aria-expanded', 'false');
  menuButton.textContent = 'Menu';
}));

window.addEventListener('scroll', () => {
  document.querySelector('#navbar').classList.toggle('scrolled', window.scrollY > 30);
});
