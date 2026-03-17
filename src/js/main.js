import { getBubbleData } from '../data/bubbles.js';
import { initSpeechBubbles } from './speech-bubble.js';
import { initCursor } from './cursor.js';
import { initClock } from './clock.js';
import { initRouter } from './router.js';
import { initSmoothScroll } from './smooth-scroll.js';
import { initScrollReveal, initHeroObserver } from './scroll-reveal.js';
import { initMenu } from './menu.js';
import { initTransition } from './transition.js';
import { initI18n } from './i18n.js';

const BUBBLES_ENABLED = false;

// Global (run once, persist across navigations)
initI18n();
initCursor();
initClock();
initRouter();
initSmoothScroll();
initMenu();
initTransition();

// Page-specific (run on initial load)
initSpeechBubbles(getBubbleData(), { enabled: BUBBLES_ENABLED });
initScrollReveal();
initHeroObserver();
