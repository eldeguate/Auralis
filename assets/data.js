// AURALIS product + wood data

window.AURALIS_SPEAKERS = [
  {
    id: 'kuhul',
    name: "K'uhul",
    meaning: '"Sacred" in K\'iche\' Maya',
    type: 'Floor-Standing Tower',
    wood: 'Hormigo',
    woodId: 'hormigo',
    price: 5200,
    drivers: '2× 6.5" Kevlar Woofers · 1× 1" Beryllium Tweeter',
    freq: '28Hz – 40kHz',
    sensitivity: '91 dB',
    impedance: '4 Ohm',
    power: '20 – 300W',
    weight: '58 lbs each',
    finish: 'Hand-rubbed natural resin',
    description: 'The K\'uhul commands any room with authority and grace. Built from Hormigo — the same wood used to make the ancient marimba — its cabinet resonates with a warmth that synthetic materials cannot replicate. Deep, articulate bass meets crystalline highs.',
    ideal: 'Large living rooms · dedicated listening rooms · home theaters',
  },
  {
    id: 'ixchel',
    name: 'Ixchel',
    meaning: 'Mayan goddess of creativity',
    type: 'Bookshelf Monitor',
    wood: 'Granadillo',
    woodId: 'granadillo',
    price: 2400,
    drivers: '1× 5.25" Paper Cone Woofer · 1× 0.75" Silk Dome Tweeter',
    freq: '45Hz – 35kHz',
    sensitivity: '87 dB',
    impedance: '6 Ohm',
    power: '15 – 150W',
    weight: '19 lbs each',
    finish: 'Oiled and polished, satin grain',
    description: 'Intimate and revealing. Crafted from Granadillo — prized by Mayan artisans for its density and rich coloring. Its tight grain yields a naturally controlled midrange that brings vocals and acoustic instruments to life in close quarters.',
    ideal: 'Studies · bedrooms · small apartments · desktop setups',
  },
  {
    id: 'balam',
    name: 'Balam',
    meaning: '"Jaguar" — Mayan symbol of power',
    type: 'Open-Baffle Dipole',
    flagship: true,
    wood: 'Conacaste',
    woodId: 'conacaste',
    price: 7800,
    drivers: '2× 8" Alnico Full-Range · 1× Ribbon Super-Tweeter',
    freq: '32Hz – 45kHz',
    sensitivity: '94 dB',
    impedance: '8 Ohm',
    power: '8 – 200W',
    weight: '52 lbs each',
    finish: 'French-polished, high gloss',
    description: 'Our open-baffle flagship. The Balam breathes — its dipole design creates a three-dimensional soundstage that dissolves the speakers from the room entirely. Conacaste\'s broad grain and low density make it acoustically transparent.',
    ideal: 'Audiophile listening rooms · vinyl enthusiasts · jazz and classical lovers',
  },
  {
    id: 'tzikin',
    name: "Tz'ikin",
    meaning: 'Mayan day sign of vision and freedom',
    type: 'Powered Desktop Monitor',
    wood: 'Cocobolo',
    woodId: 'cocobolo',
    price: 1800,
    drivers: '1× 4" Aluminum Cone · 1× 0.75" AMT Tweeter',
    freq: '55Hz – 38kHz',
    sensitivity: 'Built-in 2× 50W Class D',
    impedance: '—',
    power: 'Self-powered (no amp)',
    weight: '13 lbs each',
    finish: 'Hand-rubbed tung oil',
    description: 'No amplifier required. The Tz\'ikin delivers reference-grade sound from a compact, self-powered body of Cocobolo — one of the densest and most beautiful tonewoods on Earth. Its natural oils provide built-in vibration dampening. No two pairs look alike.',
    ideal: 'Desktop workstations · small rooms · vinyl + digital hybrid setups',
  },
];

window.AURALIS_WOODS = [
  {
    id: 'hormigo',
    name: 'Hormigo',
    origin: 'Guatemalan Highlands',
    character: 'Warm, resonant lows with singing sustain',
    color: '#8B5A3C',
    story: 'Hormigo is the sacred tonewood of the marimba — Guatemala\'s national instrument. Its cellular structure creates natural resonance chambers that amplify warmth and sustain. Each slab is air-dried for 24 months in the highland climate before entering the workshop.',
    heritage: 'Used by the K\'iche\' Maya for ceremonial instruments for over 1,000 years.',
  },
  {
    id: 'granadillo',
    name: 'Granadillo',
    origin: 'Petén Lowlands',
    character: 'Tight, controlled, with precise imaging',
    color: '#5A2F28',
    story: 'Granadillo\'s density rivals ebony, but its grain tells a richer story — streaks of amber and chocolate through deep burgundy. Mayan woodworkers called it the "blood wood" for its color. Its rigidity makes the cabinet nearly inert — only the drivers move.',
    heritage: 'Traditionally carved into Mayan ceremonial masks and royal staffs.',
  },
  {
    id: 'conacaste',
    name: 'Conacaste',
    origin: 'Pacific Lowlands',
    character: 'Open, airy, with natural spaciousness',
    color: '#B88E5C',
    story: 'Guatemala\'s beloved Conacaste grows slowly into massive canopies. Its wood is light yet rigid — ideal for open-baffle designs where the cabinet must be acoustically transparent. Each slab carries the golden hue of Guatemalan sunlight.',
    heritage: 'Known as the "ear tree" — its seed pods were used as rattles in Mayan music.',
  },
  {
    id: 'cocobolo',
    name: 'Cocobolo',
    origin: 'Highland Cloud Forests',
    character: 'Bright, articulate, with harmonic complexity',
    color: '#6B3820',
    story: 'Cocobolo is among the world\'s most prized tonewoods — dense, oily, and shimmering with color. Its natural resins act as a vibration dampener, making it self-deadening. Each piece is unique — a living fingerprint of the forest.',
    heritage: 'Reserved for royal artisans; used in Mayan wind instruments.',
  },
];

// Real product imagery — prefer bundled resources when available
const R = (typeof window !== 'undefined' && window.__resources) || {};
const SPEAKER_IMAGES = {
  kuhul: R.spKuhul || 'assets/img/speaker-kuhul.jpg',
  ixchel: R.spIxchel || 'assets/img/speaker-ixchel.jpg',
  balam: R.spBalam || 'assets/img/speaker-balam.jpg',
  tzikin: R.spTzikin || 'assets/img/speaker-tzikin.png',
};

window.renderSpeakerVisual = function(speaker, opts = {}) {
  const img = SPEAKER_IMAGES[speaker.id];
  return `
    <div class="sp-visual" data-wood="${speaker.woodId}">
      <img class="sp-photo" src="${img}" alt="${speaker.name} — ${speaker.type}" />
      <div class="sp-tag mono">${speaker.woodId.toUpperCase()} · ${speaker.type.split(' ')[0].toUpperCase()}</div>
    </div>
  `;
};
