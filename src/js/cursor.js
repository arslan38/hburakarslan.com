import { animate } from 'motion/mini';

let resetCursor = null;

export function resetCursorState() {
  if (resetCursor) resetCursor();
}

export function initCursor() {
  if (matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<span class="custom-cursor__icon"></span><span class="custom-cursor__label"></span>';
  document.body.appendChild(cursor);

  const icon = cursor.querySelector('.custom-cursor__icon');
  const label = cursor.querySelector('.custom-cursor__label');

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let dissolved = false;
  let labelActive = false;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    if (!cursor.classList.contains('is-visible')) {
      cursor.classList.add('is-visible');
    }
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

  // Nav link dissolve
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

  resetCursor = () => {
    dissolved = false;
    labelActive = false;
    cursor.classList.remove('has-label');

    // Immediately clear animation state
    animate(cursor, { scale: 1, x: 0, y: 0 }, { duration: 0.01 });
    animate(icon, { opacity: 1, scale: 1 }, { duration: 0.01 });
    animate(label, { opacity: 0 }, { duration: 0.01 });

    // Hide and reappear from outside like first visit
    cursor.classList.remove('is-visible');
    cursorX = -100;
    cursorY = -100;
    animate(cursor, { opacity: 1 }, { duration: 0.01 });
  };

  // Contact link label interaction
  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('[data-cursor-label]');
    if (!link || labelActive) return;
    labelActive = true;

    const text = link.dataset.cursorLabel;
    label.textContent = text;

    cursor.classList.add('has-label');

    animate(icon, {
      opacity: [1, 0],
      scale: [1, 0.5],
    }, {
      duration: 0.2,
      easing: [0.4, 0, 1, 1],
    });

    animate(label, {
      opacity: [0, 1],
    }, {
      duration: 0.25,
      easing: [0, 0, 0.2, 1],
      delay: 0.1,
    });
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.target.closest('[data-cursor-label]') || !labelActive) return;
    labelActive = false;

    // 1. Fade out label quickly
    animate(label, {
      opacity: [1, 0],
    }, {
      duration: 0.12,
      easing: [0.4, 0, 1, 1],
    }).then(() => {
      // 2. After label is invisible, shrink cursor
      cursor.classList.remove('has-label');

      // 3. Icon reappears as cursor shrinks
      animate(icon, {
        opacity: [0, 1],
        scale: [0.5, 1],
      }, {
        duration: 0.25,
        easing: [0, 0, 0.2, 1],
      });
    });
  });
}
