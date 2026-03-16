import { animate } from 'motion/mini';

export function initSignatureAnimation() {
  const paths = document.querySelectorAll('.signature-svg path');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (paths.length && !reducedMotion) {
    paths.forEach(path => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = length;
      path.style.strokeDashoffset = length;
    });
    animate(paths, { strokeDashoffset: 0 }, { duration: 1.4, delay: 1.3, easing: 'ease-in-out' });
  }
}
