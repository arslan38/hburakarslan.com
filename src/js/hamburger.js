export function initHamburger() {
  const btn = document.querySelector('.site-header__hamburger');
  if (!btn) return;
  btn.addEventListener('click', () => {
    const header = btn.closest('.site-header');
    const open = header.classList.toggle('site-header--menu-open');
    btn.setAttribute('aria-expanded', String(open));
  });
}

export function closeHamburger() {
  const header = document.querySelector('.site-header');
  if (header) header.classList.remove('site-header--menu-open');
  const btn = document.querySelector('.site-header__hamburger');
  if (btn) btn.setAttribute('aria-expanded', 'false');
}
