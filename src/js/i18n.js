import { translations } from '../data/i18n.js';

const STORAGE_KEY = 'lang';

export function getLang() {
  return localStorage.getItem(STORAGE_KEY) || 'tr';
}

export function setLang(lang) {
  localStorage.setItem(STORAGE_KEY, lang);
  document.documentElement.lang = lang;
}

export function t(key) {
  const entry = translations[key];
  if (!entry) return key;
  return entry[getLang()] ?? entry.tr;
}

export function applyTranslations() {
  const lang = getLang();
  document.documentElement.lang = lang;

  // textContent
  document.querySelectorAll('[data-i18n]').forEach(el => {
    el.textContent = t(el.dataset.i18n);
  });

  // innerHTML
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    el.innerHTML = t(el.dataset.i18nHtml);
  });

  // attributes (format: "attrName:key")
  document.querySelectorAll('[data-i18n-attr]').forEach(el => {
    const [attr, key] = el.dataset.i18nAttr.split(':');
    el.setAttribute(attr, t(key));
  });

  // Page title
  const page = document.body.dataset.page;
  const titleKey = `title.${page}`;
  if (translations[titleKey]) {
    document.title = t(titleKey);
  }

  // Notify other modules (clock, etc.)
  document.dispatchEvent(new CustomEvent('langchange'));
}

export function initI18n() {
  const lang = getLang();
  setLang(lang);

  const btn = document.querySelector('.site-header__lang');
  if (btn) {
    btn.addEventListener('click', () => {
      const newLang = getLang() === 'tr' ? 'en' : 'tr';
      setLang(newLang);
      applyTranslations();
      // innerHTML replacement destroys em[data-bubble] elements;
      // re-apply glow-hint class to the newly created ones
      document.querySelectorAll('em[data-bubble]').forEach(em => {
        em.classList.add('glow-hint');
      });
    });
  }

  applyTranslations();
}
