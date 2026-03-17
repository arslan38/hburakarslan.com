import { animate } from 'motion/mini';

let overlay;

export function initTransition() {
  overlay = document.createElement('div');
  overlay.classList.add('page-transition');
  document.body.appendChild(overlay);
}

export function wipeIn() {
  return animate(
    overlay,
    { transform: ['translateY(-100%)', 'translateY(0)'] },
    { duration: 0.3, easing: 'ease-in' }
  ).finished;
}

export function wipeOut() {
  return animate(
    overlay,
    { transform: ['translateY(0)', 'translateY(100%)'] },
    { duration: 0.4, easing: 'ease-out' }
  ).finished.then(() => {
    overlay.style.transform = 'translateY(-100%)';
  });
}
