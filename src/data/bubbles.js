import { t } from '../js/i18n.js';

export function getBubbleData() {
  return {
    // Home
    hikaye:     { type: 'quote', text: t('bubble.hikaye'), attribution: 'Braveheart' },
    problem:    { type: 'quote', text: 'Fall in love with the problem, not the solution.', attribution: 'Uri Levine' },
    urun:       { type: 'note',  text: t('bubble.urun') },
    samimi:     { type: 'emoji', text: '🫶' },
    demokratik: { type: 'quote', text: 'Education is the most powerful weapon which you can use to change the world.', attribution: 'Nelson Mandela' },

    // Projeler
    uretmek:     { type: 'quote', text: 'The best way to predict the future is to create it.', attribution: 'Peter Drucker' },
    yansimasi:   { type: 'emoji', text: '🪞✨' },
    baskaseyler: { type: 'emoji', text: '🤫' },

    // İletişim
    merhaba: { type: 'emoji', text: '👋' },
  };
}
