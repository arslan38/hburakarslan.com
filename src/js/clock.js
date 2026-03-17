export function initClock() {
  const el = document.getElementById('site-clock');
  if (!el) return;

  function update() {
    const now = new Date();
    const time = now.toLocaleTimeString('tr-TR', {
      timeZone: 'Europe/Istanbul',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
    el.textContent = `IST ${time}`;
  }

  update();
  setInterval(update, 10000);
}
