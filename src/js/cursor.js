import { animate } from 'motion/mini';

let resetCursor = null;

export function resetCursorState() {
  if (resetCursor) resetCursor();
}

export function initCursor() {
  if (matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<span class="custom-cursor__icon"></span><img class="custom-cursor__sorbi" src="/assets/svg/sorbi.svg" alt=""><span class="custom-cursor__label"></span>';
  document.body.appendChild(cursor);

  const icon = cursor.querySelector('.custom-cursor__icon');
  const sorbiImg = cursor.querySelector('.custom-cursor__sorbi');
  const label = cursor.querySelector('.custom-cursor__label');

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let dissolved = false;
  let labelActive = false;
  let bubbleHover = false;

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

  // Hide cursor while selecting text
  document.addEventListener('mousedown', () => {
    cursor.classList.add('is-selecting');
  });
  document.addEventListener('mouseup', () => {
    cursor.classList.remove('is-selecting');
  });

  // Hide cursor on header name, clock, and nav
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('.site-header__name') || e.target.closest('.site-header__clock-wrapper') || e.target.closest('.site-header__nav')) {
      animate(cursor, { opacity: 0, scale: 0.8 }, { duration: 0.2, easing: [0.4, 0, 1, 1] });
    }
  });

  document.addEventListener('mouseout', (e) => {
    if (e.target.closest('.site-header__name') || e.target.closest('.site-header__clock-wrapper') || e.target.closest('.site-header__nav')) {
      animate(cursor, { opacity: 1, scale: 1 }, { duration: 0.25, easing: [0, 0, 0.2, 1] });
    }
  });

  // Handwritten word hide
  document.addEventListener('mouseover', (e) => {
    if (!e.target.closest('[data-bubble]') || bubbleHover) return;
    bubbleHover = true;
    animate(cursor, {
      scale: [1, 1.15, 0],
      opacity: [1, 0.8, 0],
    }, {
      duration: 0.35,
      easing: [0.4, 0, 1, 1],
    });
  });

  document.addEventListener('mouseout', (e) => {
    if (!e.target.closest('[data-bubble]') || !bubbleHover) return;
    bubbleHover = false;
    animate(cursor, {
      scale: [0, 0.6, 1],
      opacity: [0, 0.5, 1],
    }, {
      duration: 0.4,
      easing: [0, 0, 0.2, 1],
    });
  });

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
    bubbleHover = false;
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

  // Contact link / Sorbi link label interaction
  document.addEventListener('mouseover', (e) => {
    const link = e.target.closest('[data-cursor-label]') || e.target.closest('.sorbi-link');
    if (!link || labelActive) return;
    labelActive = true;

    const isSorbi = link.classList.contains('sorbi-link');
    const text = isSorbi ? 'siteye git ↗' : link.dataset.cursorLabel;
    label.textContent = text;

    cursor.classList.add('has-label');
    if (isSorbi) cursor.classList.add('is-sorbi');

    animate(icon, {
      opacity: [1, 0],
      scale: [1, 0.85],
      filter: ['blur(0px)', 'blur(2px)'],
    }, {
      duration: 0.12,
      easing: [0.4, 0, 1, 1],
    });

    if (isSorbi) {
      animate(sorbiImg, {
        opacity: [0, 1],
        scale: [0.85, 1],
        filter: ['blur(2px)', 'blur(0px)'],
      }, {
        duration: 0.15,
        easing: [0, 0, 0.2, 1],
        delay: 0.04,
      });
    }

    animate(label, {
      opacity: [0, 1],
      filter: ['blur(2px)', 'blur(0px)'],
    }, {
      duration: 0.15,
      easing: [0, 0, 0.2, 1],
      delay: 0.06,
    });
  });

  document.addEventListener('mouseout', (e) => {
    const link = e.target.closest('[data-cursor-label]') || e.target.closest('.sorbi-link');
    if (!link || !labelActive) return;
    labelActive = false;

    const isSorbi = cursor.classList.contains('is-sorbi');

    // Capture expanded size, then remove classes and animate shrink
    const fromW = cursor.offsetWidth + 'px';
    const fromH = cursor.offsetHeight + 'px';
    const fromP = getComputedStyle(cursor).padding;
    cursor.classList.remove('has-label');
    if (isSorbi) cursor.classList.remove('is-sorbi');

    animate(cursor, {
      width: [fromW, '22px'],
      height: [fromH, '22px'],
      padding: [fromP, '0px'],
    }, {
      duration: 0.15,
      easing: [0.4, 0, 0.2, 1],
    }).then(() => {
      cursor.style.width = '';
      cursor.style.height = '';
      cursor.style.padding = '';
    });

    animate(label, {
      opacity: [1, 0],
      filter: ['blur(0px)', 'blur(2px)'],
    }, {
      duration: 0.1,
      easing: [0.4, 0, 1, 1],
    });

    if (isSorbi) {
      animate(sorbiImg, {
        opacity: [1, 0],
        scale: [1, 0.85],
        filter: ['blur(0px)', 'blur(2px)'],
      }, {
        duration: 0.1,
        easing: [0.4, 0, 1, 1],
      });
    }

    animate(icon, {
      opacity: [0, 1],
      scale: [0.85, 1],
      filter: ['blur(2px)', 'blur(0px)'],
    }, {
      duration: 0.12,
      easing: [0, 0, 0.2, 1],
      delay: 0.04,
    });
  });
}
