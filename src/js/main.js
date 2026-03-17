import { BUBBLE_DATA } from '../data/bubbles.js';
import { initSpeechBubbles } from './speech-bubble.js';
import { initCursor } from './cursor.js';
import { initClock } from './clock.js';
import { initRouter } from './router.js';

const BUBBLES_ENABLED = false;

// Global (run once, persist across navigations)
initCursor();
initClock();
initRouter();

// Page-specific (run on initial load)
initSpeechBubbles(BUBBLE_DATA, { enabled: BUBBLES_ENABLED });

if (document.body.dataset.page === 'home') {
  import('./signature-animation.js').then(({ initSignatureAnimation }) => {
    initSignatureAnimation();
  });
}
