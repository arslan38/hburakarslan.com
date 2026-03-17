export function initCursor() {
  if (matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.createElement('div');
  cursor.className = 'custom-cursor';
  cursor.innerHTML = '<span class="custom-cursor__icon">+</span>';
  document.body.appendChild(cursor);

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });

  function animate() {
    cursorX += (mouseX - cursorX) * 0.08;
    cursorY += (mouseY - cursorY) * 0.08;
    cursor.style.transform = `translate(${cursorX}px, ${cursorY}px)`;
    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);

  document.addEventListener('mouseenter', () => cursor.classList.add('is-visible'), true);
  document.addEventListener('mouseleave', () => cursor.classList.remove('is-visible'));
}
