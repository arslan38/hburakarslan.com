import { animate } from 'motion/mini';

export function initCursor() {
  if (matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<span class="custom-cursor__icon"></span>';
  document.body.appendChild(cursor);

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let dissolved = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function tick() {
    cursorX += (mouseX - cursorX) * 0.08;
    cursorY += (mouseY - cursorY) * 0.08;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(tick);
  }

  requestAnimationFrame(tick);

  document.addEventListener('mouseenter', () => cursor.classList.add('is-visible'), true);
  document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));

  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('.links a');
    if (!link || dissolved) return;
    dissolved = true;

    const linkRect = link.getBoundingClientRect();
    const targetX = linkRect.left + linkRect.width / 2 - cursorX;
    const targetY = linkRect.top + linkRect.height / 2 - cursorY;

    animate(cursor, {
      scale: [1, 1.15, 0],
      opacity: [1, 0.8, 0],
      x: [0, targetX * 0.3],
      y: [0, targetY * 0.3],
    }, {
      duration: 0.35,
      easing: [0.4, 0, 1, 1],
    });
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.target.closest('.links a') || !dissolved) return;
    dissolved = false;

    animate(cursor, {
      scale: [0, 0.6, 1],
      opacity: [0, 0.5, 1],
      x: 0,
      y: 0,
    }, {
      duration: 0.4,
      easing: [0, 0, 0.2, 1],
    });
  });
}
