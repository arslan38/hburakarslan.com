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

  // Mouse nav'dan çıkınca → ismi sıfırla
  nav.addEventListener('mouseleave', () => {
    nameSlide.style.transform = '';
  });
}

export function resetMenu() {
  const nameSlide = document.querySelector('.site-header__name-slide');
  if (nameSlide) nameSlide.style.transform = '';
}
