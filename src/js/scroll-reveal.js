import { triggerGlowHints } from './speech-bubble.js';
import { setClockInverted } from './clock.js';

export function initScrollReveal() {
  const els = document.querySelectorAll('main > h1, main > p, main > nav, main > footer');
  if (!els.length) return;

  let revealed = 0;
  const total = els.length;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const idx = Array.from(els).indexOf(entry.target);
        entry.target.style.animationDelay = `${idx * 0.1}s`;
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);

        revealed++;
        if (revealed === total) {
          // Wait for last animation to finish (delay + duration) then trigger glow
          const lastDelay = (total - 1) * 0.1;
          setTimeout(triggerGlowHints, (lastDelay + 0.5) * 1000);
        }
      });
    },
    { threshold: 0.1 }
  );

  els.forEach((el) => observer.observe(el));

  // Signature animation — trigger when signature element scrolls into view
  if (document.body.dataset.page === 'home') {
    const sig = document.querySelector('.signature-svg');
    if (sig) {
      const sigObserver = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          import('./signature-animation.js').then(({ initSignatureAnimation }) => {
            initSignatureAnimation();
          });
          sigObserver.disconnect();
        },
        { threshold: 0.1 }
      );
      sigObserver.observe(sig);
    }
  }
}

export function initHeroObserver() {
  const hero = document.querySelector('.hero');
  const header = document.querySelector('.site-header');
  if (!hero || !header) return;

  const observer = new IntersectionObserver(
    ([entry]) => {
      header.classList.toggle('site-header--hero-visible', entry.isIntersecting);
      setClockInverted(entry.isIntersecting);
    },
    { threshold: 0 }
  );
  observer.observe(hero);
}
