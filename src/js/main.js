import { BUBBLE_DATA } from '../data/bubbles.js';
import { initSpeechBubbles } from './speech-bubble.js';
import { initCursor } from './cursor.js';
import { initClock } from './clock.js';
import { initRouter } from './router.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initScrollReveal, initHeroObserver } from './scroll-reveal.js';

const BUBBLES_ENABLED = false;

// Global (run once, persist across navigations)
initCursor();
initClock();
initRouter();
initSmoothScroll();

// Page-specific (run on initial load)
initSpeechBubbles(BUBBLE_DATA, { enabled: BUBBLES_ENABLED });
initScrollReveal();
initHeroObserver();
