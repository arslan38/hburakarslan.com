import Lenis from 'lenis';

let lenis = null;

export function initSmoothScroll() {
  lenis = new Lenis({
    lerp: 0.08,
    smoothWheel: true,
  });

  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}

export function resetScroll() {
  if (lenis) lenis.scrollTo(0, { immediate: true });
}
