import { animate } from 'motion/mini';

const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

function renderBubbleContent(data) {
  switch (data.type) {
    case 'quote':
      return `<p class="bubble-quote">"${data.text}"</p>` +
        (data.attribution ? `<p class="bubble-attribution">— ${data.attribution}</p>` : '');
    case 'emoji':
      return `<p class="bubble-emoji">${data.text}</p>`;
    case 'note':
      return `<p class="bubble-note">${data.text}</p>`;
    case 'photo':
      return `<div class="bubble-photo"><img src="${data.src}" alt="" loading="lazy"></div>`;
    default:
      return '';
  }
}

export function triggerGlowHints() {
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  document.querySelectorAll('em[data-bubble]').forEach((em, i) => {
    setTimeout(() => em.classList.add('glow-hint'), i * 80);
  });
}

export function initSpeechBubbles(bubbleData, { enabled = false } = {}) {
  const bubble = document.getElementById('speech-bubble');
  if (!bubble) return;

  const content = bubble.querySelector('.speech-bubble__content');
  const arrow = bubble.querySelector('.speech-bubble__arrow');

  let currentTarget = null;
  let hideAnimation = null;
  let hideTimeout = null;

  function positionBubble(targetEl) {
    const rect = targetEl.getBoundingClientRect();
    const bRect = bubble.getBoundingClientRect();
    const gap = 10;
    const pad = 12;

    const centerX = rect.left + rect.width / 2;
    const spaceAbove = rect.top;
    const placeBelow = spaceAbove < bRect.height + gap + pad;

    let top;
    if (placeBelow) {
      top = rect.bottom + gap;
      bubble.classList.add('speech-bubble--below');
      arrow.className = 'speech-bubble__arrow speech-bubble__arrow--up';
    } else {
      top = rect.top - bRect.height - gap;
      bubble.classList.remove('speech-bubble--below');
      arrow.className = 'speech-bubble__arrow speech-bubble__arrow--down';
    }

    let left = centerX - bRect.width / 2;
    left = Math.max(pad, Math.min(left, window.innerWidth - bRect.width - pad));

    bubble.style.top = top + 'px';
    bubble.style.left = left + 'px';

    const arrowLeft = Math.max(12, Math.min(centerX - left, bRect.width - 12));
    arrow.style.left = arrowLeft + 'px';
    arrow.style.transform = 'translateX(-50%)';
  }

  function cancelPendingHide() {
    if (hideTimeout) {
      clearTimeout(hideTimeout);
      hideTimeout = null;
    }
  }

  function showBubble(targetEl) {
    const key = targetEl.dataset.bubble;
    const data = bubbleData[key];
    if (!data) return;

    cancelPendingHide();

    if (hideAnimation) {
      hideAnimation.stop();
      hideAnimation = null;
    }

    content.innerHTML = renderBubbleContent(data);
    bubble.classList.add('is-visible');
    bubble.setAttribute('aria-hidden', 'false');
    targetEl.setAttribute('aria-describedby', 'speech-bubble');

    requestAnimationFrame(() => {
      positionBubble(targetEl);

      if (reducedMotion) {
        bubble.style.opacity = '1';
        bubble.style.transform = 'scale(1)';
      } else {
        animate(bubble, { scale: [0.85, 1], opacity: [0, 1] }, {
          duration: 0.28,
          easing: [.34, 1.56, .64, 1],
        });
      }
    });

    currentTarget = targetEl;
  }

  function hideBubble(callback) {
    cancelPendingHide();
    if (!currentTarget) { if (callback) callback(); return; }

    const prev = currentTarget;
    prev.removeAttribute('aria-describedby');
    currentTarget = null;

    if (reducedMotion) {
      bubble.style.opacity = '0';
      bubble.style.transform = 'scale(0.85)';
      bubble.classList.remove('is-visible');
      bubble.setAttribute('aria-hidden', 'true');
      if (callback) callback();
      return;
    }

    hideAnimation = animate(bubble, { scale: [1, 0.85], opacity: [1, 0] }, {
      duration: 0.2,
      easing: [.36, 0, .66, -.56],
    });
    hideAnimation.finished.then(() => {
      hideAnimation = null;
      bubble.classList.remove('is-visible');
      bubble.setAttribute('aria-hidden', 'true');
      if (callback) callback();
    });
  }

  function scheduleHide() {
    cancelPendingHide();
    hideTimeout = setTimeout(() => {
      hideTimeout = null;
      hideBubble();
    }, 80);
  }

  // Glow hint — triggered externally via triggerGlowHints() after scroll reveal

  // Event binding (only when enabled)
  if (!enabled) return;

  let isTouchDevice = false;

  document.addEventListener('touchstart', () => { isTouchDevice = true; }, { once: true, passive: true });

  bubble.addEventListener('mouseenter', () => cancelPendingHide());
  bubble.addEventListener('mouseleave', () => {
    if (isTouchDevice) return;
    scheduleHide();
  });

  document.querySelectorAll('em[data-bubble]').forEach(em => {
    em.setAttribute('tabindex', '0');

    em.addEventListener('mouseenter', () => {
      if (isTouchDevice) return;
      cancelPendingHide();
      showBubble(em);
    });
    em.addEventListener('mouseleave', () => {
      if (isTouchDevice) return;
      scheduleHide();
    });

    em.addEventListener('click', (e) => {
      if (!isTouchDevice) return;
      e.preventDefault();
      e.stopPropagation();
      if (currentTarget === em) {
        hideBubble();
      } else {
        hideBubble(() => showBubble(em));
      }
    });

    em.addEventListener('focus', () => showBubble(em));
    em.addEventListener('blur', () => hideBubble());
  });

  document.addEventListener('click', (e) => {
    if (!currentTarget) return;
    if (!bubble.contains(e.target) && !e.target.closest('em[data-bubble]')) {
      hideBubble();
    }
  });

  document.addEventListener('scroll', () => hideBubble(), { passive: true });

  window.addEventListener('resize', () => {
    if (currentTarget) positionBubble(currentTarget);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && currentTarget) {
      const el = currentTarget;
      hideBubble();
      el.blur();
    }
  });
}
