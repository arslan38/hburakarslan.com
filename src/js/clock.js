const CAPITALS = [
  { name: 'London', tz: 'Europe/London' },
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { name: 'Moskova', tz: 'Europe/Moscow' },
  { name: 'Pekin', tz: 'Asia/Shanghai' },
  { name: 'Sydney', tz: 'Australia/Sydney' },
  { name: 'São Paulo', tz: 'America/Sao_Paulo' },
];

function getHourInTz(date, tz) {
  return date.getTime() + date.getTimezoneOffset() * 60000 +
    new Date(date.toLocaleString('en-US', { timeZone: tz })).getTime() -
    new Date(date.toLocaleString('en-US')).getTime();
}

function diffLabel(date, tz) {
  const istMs = getHourInTz(date, 'Europe/Istanbul');
  const cityMs = getHourInTz(date, tz);
  const diffH = Math.round((cityMs - istMs) / 3600000);
  if (diffH === 0) return '0h';
  return diffH > 0 ? `+${diffH}h` : `${diffH}h`;
}

function renderZones() {
  const list = document.querySelector('.clock-zones');
  if (!list) return;

  const now = new Date();
  list.innerHTML = CAPITALS.map(c =>
    `<li><span>${c.name}</span><span class="clock-zones__diff">${diffLabel(now, c.tz)}</span></li>`
  ).join('');
}

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
    renderZones();
  }

  update();
  setInterval(update, 10000);
}
