import { BUBBLE_DATA } from '../data/bubbles.js';
import { initSpeechBubbles } from './speech-bubble.js';
import { initCursor } from './cursor.js';
import { initClock } from './clock.js';

const BUBBLES_ENABLED = false;

// Init speech bubbles on all pages
initSpeechBubbles(BUBBLE_DATA, { enabled: BUBBLES_ENABLED });

// Custom cursor
initCursor();

// Live clock
initClock();

// Page-specific logic
const page = document.body.dataset.page;

if (page === 'home') {
  import('./signature-animation.js').then(({ initSignatureAnimation }) => {
    initSignatureAnimation();
  });
}
