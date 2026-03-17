import { BUBBLE_DATA } from '../data/bubbles.js';
import { initSpeechBubbles } from './speech-bubble.js';
import { resetCursorState } from './cursor.js';

const BUBBLES_ENABLED = false;

function isInternalLink(el) {
  if (!el || !el.href) return false;
  if (el.target === '_blank') return false;
  if (el.origin !== location.origin) return false;
  if (el.pathname === location.pathname) return false;
  return true;
}

async function navigateTo(url) {
  const res = await fetch(url);
  const html = await res.text();
  const doc = new DOMParser().parseFromString(html, 'text/html');

  const newContent = doc.getElementById('page-content');
  const newPage = doc.body.dataset.page;
  const newTitle = doc.title;

  if (!newContent) {
    location.href = url;
    return;
  }

  const container = document.getElementById('page-content');
  container.innerHTML = newContent.innerHTML;
  document.body.dataset.page = newPage;
  document.title = newTitle;

  history.pushState(null, '', url);

  resetCursorState();
  onPageLoad();
}

function onPageLoad() {
  initSpeechBubbles(BUBBLE_DATA, { enabled: BUBBLES_ENABLED });

  if (document.body.dataset.page === 'home') {
    import('./signature-animation.js').then(({ initSignatureAnimation }) => {
      initSignatureAnimation();
    });
  }
}

export function initRouter() {
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (!isInternalLink(link)) return;

    e.preventDefault();
    navigateTo(link.href);
  });

  window.addEventListener('popstate', () => {
    navigateTo(location.href);
  });
}
