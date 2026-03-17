import { getBubbleData } from '../data/bubbles.js';
import { initSpeechBubbles } from './speech-bubble.js';
import { resetCursorState } from './cursor.js';
import { resetScroll } from './smooth-scroll.js';
import { resetMenu } from './menu.js';
import { initScrollReveal, initHeroObserver } from './scroll-reveal.js';
import { wipeIn, wipeOut } from './transition.js';
import { applyTranslations } from './i18n.js';

const BUBBLES_ENABLED = false;

function isHomePage(url) {
  const { pathname } = new URL(url, location.origin);
  return pathname === '/' || pathname === '/index.html';
}

async function navigateTo(url, { pushState = true } = {}) {
  const useWipe = isHomePage(url);
  const fetchPromise = fetch(url).then((r) => r.text());

  if (useWipe) await wipeIn();

  const html = await fetchPromise;
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const newContent = doc.getElementById('page-content');
  const newPage = doc.body.dataset.page;

  if (!newContent) {
    location.href = url;
    return;
  }

  const container = document.getElementById('page-content');
  container.innerHTML = newContent.innerHTML;
  document.body.dataset.page = newPage;

  if (pushState) history.pushState(null, '', url);

  applyTranslations();
  resetCursorState();
  resetScroll();
  resetMenu();
  onPageLoad();

  if (useWipe) await wipeOut();
}

function onPageLoad() {
  initSpeechBubbles(getBubbleData(), { enabled: BUBBLES_ENABLED });
  initScrollReveal();
  initHeroObserver();
}

export function initRouter() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!link || !link.href || link.target === '_blank') return;
    if (link.origin !== location.origin) return;

    if (link.pathname === location.pathname || (isHomePage(link.href) && isHomePage(location.href))) {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    e.preventDefault();
    navigateTo(link.href);
  });

  window.addEventListener('popstate', () => {
    navigateTo(location.href, { pushState: false });
  });
}
