import { animate } from 'motion/mini';
import { t } from './i18n.js';

const CAPITALS = [
  { name: 'London', tz: 'Europe/London' },
  { name: 'New York', tz: 'America/New_York' },
  { name: 'Tokyo', tz: 'Asia/Tokyo' },
  { name: 'Dubai', tz: 'Asia/Dubai' },
  { nameKey: 'city.moscow', tz: 'Europe/Moscow' },
  { nameKey: 'city.beijing', tz: 'Asia/Shanghai' },
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

function getDiff(date, tz) {
  const istMs = getHourInTz(date, 'Europe/Istanbul');
  const cityMs = getHourInTz(date, tz);
  return Math.round((cityMs - istMs) / 3600000);
}

function renderZones() {
  const list = document.querySelector('.clock-zones');
  if (!list) return;

  const now = new Date();
  const sorted = CAPITALS.map(c => ({
    ...c,
    displayName: c.nameKey ? t(c.nameKey) : c.name,
    diff: getDiff(now, c.tz),
  })).sort((a, b) => a.diff - b.diff);

  list.innerHTML = sorted.map(c =>
    `<li><span class="clock-zones__city">${c.displayName}</span><span class="clock-zones__diff">${diffLabel(now, c.tz)}</span></li>`
  ).join('');
}

let hideAnimation = null;
let zonesVisible = false;

function showZones() {
  zonesVisible = true;
  if (hideAnimation) { hideAnimation.cancel(); hideAnimation = null; }
  const items = document.querySelectorAll('.clock-zones li');
  if (!items.length) return;
  items.forEach((li, i) => {
    animate(li, { opacity: [0, 1], transform: ['translateY(6px)', 'translateY(0)'] }, {
      duration: 0.3,
      delay: i * 0.04,
      easing: [0, 0, 0.2, 1],
    });
  });
}

function hideZones() {
  zonesVisible = false;
  const items = document.querySelectorAll('.clock-zones li');
  if (!items.length) return;
  const last = items.length - 1;
  items.forEach((li, i) => {
    const anim = animate(li, { opacity: [1, 0], transform: ['translateY(0)', 'translateY(6px)'] }, {
      duration: 0.2,
      delay: (last - i) * 0.03,
      easing: [0.4, 0, 1, 1],
    });
    if (i === 0) hideAnimation = anim;
  });
}

let inverted = false;

function hideZonesImmediate() {
  zonesVisible = false;
  if (hideAnimation) { hideAnimation.cancel(); hideAnimation = null; }
  const items = document.querySelectorAll('.clock-zones li');
  items.forEach((li) => {
    li.style.opacity = '0';
    li.style.transform = 'translateY(6px)';
  });
}

export function setClockInverted(value) {
  const wasInverted = inverted;
  inverted = value;
  if (value && !wasInverted) showZones();
  if (!value && wasInverted) hideZonesImmediate();
}

export function initClock() {
  const el = document.getElementById('site-clock');
  if (!el) return;

  const wrapper = el.closest('.site-header__clock-wrapper');

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
    if (zonesVisible) {
      document.querySelectorAll('.clock-zones li').forEach((li) => {
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
      });
    }
  }

  update();
  setInterval(update, 10000);

  // Re-render zones on language change
  document.addEventListener('langchange', () => {
    renderZones();
    if (zonesVisible) {
      document.querySelectorAll('.clock-zones li').forEach((li) => {
        li.style.opacity = '1';
        li.style.transform = 'translateY(0)';
      });
    }
  });

  if (wrapper) {
    wrapper.addEventListener('mouseenter', () => {
      if (inverted) hideZones(); else showZones();
    });
    wrapper.addEventListener('mouseleave', () => {
      if (inverted) showZones(); else hideZones();
    });
  }
}
