function getActiveOffset(nav, nameSlide) {
  const page = document.body.dataset.page;
  const activeLink = nav.querySelector(`[data-nav="${page}"]`);
  if (!activeLink) return 0;
  const linkRect = activeLink.getBoundingClientRect();
  const nameRect = nameSlide.closest('.site-header__name').getBoundingClientRect();
  return linkRect.top - nameRect.top;
}

export function initMenu() {
  const nav = document.querySelector('.site-header__nav');
  const nameSlide = document.querySelector('.site-header__name-slide');
  if (!nav || !nameSlide) return;

  // Link hover → ismi hizala
  const links = nav.querySelectorAll('a');
  links.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const linkRect = link.getBoundingClientRect();
      const nameRect = nameSlide.closest('.site-header__name').getBoundingClientRect();
      const offset = linkRect.top - nameRect.top;
      nameSlide.style.transform = `translateY(${offset}px)`;
    });
  });

  // Mouse nav'dan çıkınca → mevcut sayfanın pozisyonuna dön
  nav.addEventListener('mouseleave', () => {
    const offset = getActiveOffset(nav, nameSlide);
    nameSlide.style.transform = offset ? `translateY(${offset}px)` : '';
  });
}

export function resetMenu() {
  requestAnimationFrame(() => {
    const nav = document.querySelector('.site-header__nav');
    const nameSlide = document.querySelector('.site-header__name-slide');
    if (!nav || !nameSlide) return;
    const offset = getActiveOffset(nav, nameSlide);
    nameSlide.style.transform = offset ? `translateY(${offset}px)` : '';
  });
}
