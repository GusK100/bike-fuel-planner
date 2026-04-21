import './style.css';

/* ============ TWEAKS ============ */
const TWEAKS = {
  accent: 'ink', density: 'comfortable', iconBg: 'tinted',
  units: 'metric', currency: 'EUR', showCost: true,
};
const ACCENT_MAP = { ink: '#1a1a1a', forest: '#2E8A6B', rust: '#C44A3E' };
const CURRENCY_MAP = { GBP: '£', USD: '$', EUR: '€' };
const CURRENCY_RATE = { GBP: 1, USD: 1.27, EUR: 1.17 };

function applyTweaks() {
  const root = document.documentElement;
  root.style.setProperty('--accent', ACCENT_MAP[TWEAKS.accent] || ACCENT_MAP.ink);
  document.body.classList.toggle('compact', TWEAKS.density === 'compact');
  document.body.classList.toggle('icons-white', TWEAKS.iconBg === 'white');
  document.body.classList.toggle('cost-off', !TWEAKS.showCost);
  const curEl = document.getElementById('r-cost-cur');
  if (curEl) curEl.textContent = CURRENCY_MAP[TWEAKS.currency] || '€';
  document.querySelectorAll('.seg').forEach(seg => {
    const key = seg.dataset.tweak;
    seg.querySelectorAll('button').forEach(b => b.classList.toggle('is-on', b.dataset.val === String(TWEAKS[key])));
  });
  const tgl = document.getElementById('tgl-cost');
  if (tgl) tgl.classList.toggle('is-on', !!TWEAKS.showCost);
  if (typeof render === 'function') render();
}
function setTweak(key, val) { TWEAKS[key] = val; applyTweaks(); }
function wireTweaks() {
  document.querySelectorAll('.seg').forEach(seg => {
    const key = seg.dataset.tweak;
    seg.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setTweak(key, b.dataset.val)));
  });
  document.getElementById('tgl-cost')?.addEventListener('click', () => setTweak('showCost', !TWEAKS.showCost));
  document.getElementById('tweaks-close').addEventListener('click', () => document.getElementById('tweaks').classList.remove('is-open'));
  document.getElementById('tweaks-btn').addEventListener('click', () => document.getElementById('tweaks').classList.toggle('is-open'));
}

/* ============ WORKOUT TYPES ============ */
const WORKOUT_TYPES = [
  { id: 'recovery',  label: 'Recovery',   intensity: '<55% FTP',    carbs: '0–20g/hr',   defaultCarbs: 10,  desc: 'Active recovery. Promotes blood flow without adding training stress. Perfect after a hard day.' },
  { id: 'endurance', label: 'Endurance',  intensity: '56–75% FTP',  carbs: '30–90g/hr',  defaultCarbs: 60,  desc: 'The foundation. Builds mitochondrial density and fat-burning efficiency. 60–70% of your training lives here.' },
  { id: 'tempo',     label: 'Tempo',      intensity: '76–87% FTP',  carbs: '60g/hr',     defaultCarbs: 60,  desc: 'Builds muscular endurance and glycogen storage. Less fatiguing than threshold, great for time-crunched riders.' },
  { id: 'sweetspot', label: 'Sweet Spot', intensity: '88–93% FTP',  carbs: '60–80g/hr',  defaultCarbs: 70,  desc: '~90% of threshold benefit with ~70% of the fatigue. The money zone for FTP gains per hour trained.' },
  { id: 'threshold', label: 'Threshold',  intensity: '94–105% FTP', carbs: '80–90g/hr',  defaultCarbs: 80,  desc: 'The most direct FTP-builder. Heavily glycolytic — under-fuelling here kills the session quality.' },
  { id: 'vo2max',    label: 'VO2max',     intensity: '106–120% FTP',carbs: '80–100g/hr', defaultCarbs: 90,  desc: 'Raises your aerobic ceiling. Only do when fully rested — fatigue blunts the stimulus completely.' },
  { id: 'sprint',    label: 'Sprint',     intensity: '>120% FTP',   carbs: '60–80g/hr',  defaultCarbs: 70,  desc: 'Builds neuromuscular power and anaerobic capacity. Pre-loaded carbs matter more than in-session intake.' },
];

/* ============ FUELS ============ */
const FUELS = [
  { id: 'gel40',   name: 'Energy gel, 40g',   sub: 'e.g. Maurten Gel 100',          type: 'fast',      carbs: 25, cals: 100, weight: 40,  cost: 2.50 },
  { id: 'gel60',   name: 'Energy gel, 60g',   sub: 'e.g. SiS Beta Fuel',            type: 'fast',      carbs: 40, cals: 160, weight: 60,  cost: 3.20 },
  { id: 'drink',   name: 'Drink mix, 500ml',  sub: 'e.g. Maurten 320',              type: 'fast',      carbs: 80, cals: 320, weight: 520, cost: 3.50 },
  { id: 'haribo',  name: 'Haribo',            sub: 'small handful, ~25g',           type: 'fast',      carbs: 20, cals: 85,  weight: 25,  cost: 0.50 },
  { id: 'chews',   name: 'Energy chews',      sub: '3 cubes, ~30g',                 type: 'fast',      carbs: 24, cals: 100, weight: 33,  cost: 2.20 },
  { id: 'cola',    name: 'Soda with sugar',   sub: '1 small can, 330ml',            type: 'fast',      carbs: 35, cals: 140, weight: 350, cost: 1.00 },
  { id: 'caf75',   name: 'Caffeine gel, 75mg',sub: 'e.g. SiS GO Caffeine',          type: 'fast',      carbs: 22, cals: 90,  weight: 60,  cost: 2.80, caffeine: 75  },
  { id: 'caf100',  name: 'Caffeine gel, 100mg',sub:'e.g. Maurten Caf 100',          type: 'fast',      carbs: 25, cals: 100, weight: 40,  cost: 3.80, caffeine: 100 },
  { id: 'banana',  name: 'Banana',            sub: 'medium, ~120g',                 type: 'mixed',     carbs: 27, cals: 105, weight: 120, cost: 0.30 },
  { id: 'mango',   name: 'Dried mango',       sub: '~30g portion',                  type: 'mixed',     carbs: 19, cals: 95,  weight: 30,  cost: 1.20 },
  { id: 'raisins', name: 'Raisins',           sub: 'mini box, ~30g',                type: 'mixed',     carbs: 23, cals: 90,  weight: 30,  cost: 0.40 },
  { id: 'oatbar',  name: 'Oat bar',           sub: 'shop-bought, ~60g',             type: 'slow',      carbs: 35, cals: 240, weight: 60,  cost: 1.50 },
  { id: 'giff',    name: 'Pågen Gifflar',     sub: 'cinnamon, 1 roll ~26g',         type: 'slow',      carbs: 13, cals: 93,  weight: 26,  cost: 0.40 },
  { id: 'rice',    name: 'Rice cake + honey', sub: 'homemade, ~60g',                type: 'slow',      carbs: 35, cals: 180, weight: 60,  cost: 0.50 },
  { id: 'water',   name: 'Water',             sub: '500ml bottle',                   type: 'hydration', carbs: 0,  cals: 0,   weight: 520, cost: 0.00 },
  { id: 'electro', name: 'Electrolyte drink', sub: 'e.g. Precision Hydration',      type: 'hydration', carbs: 3,  cals: 15,  weight: 520, cost: 1.50 },
];

/* ============ ICONS ============ */
const ICONS = {
  gel40:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><rect x="28" y="12" width="44" height="76" rx="6" fill="#D85A30"/><rect x="28" y="12" width="44" height="14" rx="6" fill="#993C1D"/><path d="M32 26 L68 26 L68 30 L32 30 Z" fill="#712B13"/><text x="50" y="58" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="11" font-weight="600">GEL</text><text x="50" y="72" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="9">40g</text></svg>`,
  gel60:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="8" width="56" height="84" rx="6" fill="#378ADD"/><rect x="22" y="8" width="56" height="16" rx="6" fill="#185FA5"/><path d="M26 24 L74 24 L74 28 L26 28 Z" fill="#0C447C"/><text x="50" y="54" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="11" font-weight="600">GEL</text><text x="50" y="68" text-anchor="middle" fill="#fff" font-family="sans-serif" font-size="9">60g</text></svg>`,
  drink:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><path d="M40 12 L60 12 L60 22 L62 26 L62 88 Q62 92 58 92 L42 92 Q38 92 38 88 L38 26 L40 22 Z" fill="#7F77DD"/><rect x="42" y="14" width="16" height="6" fill="#534AB7"/><path d="M38 50 Q38 48 42 48 L58 48 Q62 48 62 50 L62 80 Q62 82 58 82 L42 82 Q38 82 38 80 Z" fill="#AFA9EC" opacity="0.4"/><rect x="42" y="58" width="16" height="18" rx="1" fill="#fff"/><text x="50" y="70" text-anchor="middle" fill="#3C3489" font-family="sans-serif" font-size="8" font-weight="600">320</text></svg>`,
  haribo:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><circle cx="30" cy="40" r="14" fill="#E24B4A"/><circle cx="62" cy="32" r="13" fill="#EF9F27"/><circle cx="72" cy="60" r="14" fill="#97C459"/><circle cx="40" cy="68" r="12" fill="#D4537E"/><circle cx="56" cy="76" r="10" fill="#F0997B"/><circle cx="24" cy="64" r="9" fill="#BA7517"/></svg>`,
  chews:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><path d="M22 16 L78 16 Q82 16 82 20 L82 88 Q82 92 78 92 L22 92 Q18 92 18 88 L18 20 Q18 16 22 16 Z" fill="#2F7D4F"/><rect x="18" y="16" width="64" height="10" fill="#215A38"/><path d="M22 20 L78 20" stroke="#1A4128" stroke-width="1.2" stroke-dasharray="2 2"/><rect x="26" y="34" width="48" height="44" rx="2" fill="#F5E6C8" opacity="0.9"/><rect x="30" y="38" width="16" height="14" rx="2" fill="#C44A3E"/><rect x="54" y="38" width="16" height="14" rx="2" fill="#C44A3E"/><rect x="30" y="56" width="16" height="14" rx="2" fill="#C44A3E"/><rect x="54" y="56" width="16" height="14" rx="2" fill="#C44A3E"/><rect x="26" y="26" width="48" height="5" fill="#FFFFFF" opacity="0.25"/></svg>`,
  cola:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><rect x="30" y="14" width="40" height="72" rx="3" fill="#B42A24"/><rect x="30" y="14" width="40" height="5" fill="#8A1E1A"/><ellipse cx="50" cy="14" rx="20" ry="3" fill="#C9C6BF"/><rect x="44" y="10" width="12" height="6" rx="1" fill="#9D9A93"/><rect x="30" y="82" width="40" height="4" fill="#8A1E1A"/><rect x="33" y="20" width="4" height="60" fill="#FFFFFF" opacity="0.18"/><rect x="30" y="44" width="40" height="14" fill="#A01E18"/><text x="50" y="54" text-anchor="middle" fill="#FFFFFF" font-family="sans-serif" font-size="9" font-weight="700" letter-spacing="1">COLA</text></svg>`,
  caf75:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><rect x="28" y="12" width="44" height="76" rx="6" fill="#E8971E"/><rect x="28" y="12" width="44" height="14" rx="6" fill="#B36E0C"/><path d="M32 26 L68 26 L68 30 L32 30 Z" fill="#8A5208"/><polygon points="53,34 44,52 51,52 43,70 58,48 51,48" fill="#FFE07A" opacity="0.95"/><text x="50" y="80" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="8">75 mg</text></svg>`,
  caf100:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><rect x="22" y="8" width="56" height="84" rx="6" fill="#5B3A8C"/><rect x="22" y="8" width="56" height="16" rx="6" fill="#3D2468"/><path d="M26 24 L74 24 L74 28 L26 28 Z" fill="#2C1850"/><polygon points="54,32 44,52 52,52 42,72 60,48 52,48" fill="#D4AAFF" opacity="0.95"/><text x="50" y="82" text-anchor="middle" fill="rgba(255,255,255,0.85)" font-family="sans-serif" font-size="8">100 mg</text></svg>`,
  banana:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><path d="M70 18 Q88 34 84 60 Q78 86 50 90 Q40 92 34 86 Q40 86 48 82 Q68 74 74 56 Q78 38 66 24 Z" fill="#F4C542"/><path d="M72 26 Q80 42 76 58 Q72 72 58 80 Q66 72 70 58 Q74 42 68 30 Z" fill="#FFD96A" opacity="0.7"/><path d="M66 16 L72 12 L76 18 L70 22 Z" fill="#7A5A22"/><path d="M34 86 Q30 90 28 86 Q32 84 36 84 Z" fill="#7A5A22"/><path d="M70 18 Q88 34 84 60 Q80 78 66 86 Q78 74 80 58 Q82 38 68 22 Z" fill="#C88A1E" opacity="0.35"/></svg>`,
  mango:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><ellipse cx="32" cy="42" rx="14" ry="10" fill="#EF9F27" transform="rotate(-20 32 42)"/><ellipse cx="62" cy="38" rx="15" ry="10" fill="#BA7517" transform="rotate(15 62 38)"/><ellipse cx="48" cy="62" rx="16" ry="10" fill="#FAC775" transform="rotate(-5 48 62)"/><ellipse cx="70" cy="70" rx="12" ry="8" fill="#EF9F27" transform="rotate(25 70 70)"/><ellipse cx="28" cy="70" rx="11" ry="8" fill="#BA7517" transform="rotate(-30 28 70)"/></svg>`,
  raisins:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><path d="M26 22 L74 22 L78 30 L78 86 Q78 90 74 90 L26 90 Q22 90 22 86 L22 30 Z" fill="#B22E2A"/><path d="M26 22 L74 22 L78 30 L22 30 Z" fill="#8A1E1C"/><path d="M70 30 L78 30 L78 86 Q78 90 74 90 L70 90 Z" fill="#000" opacity="0.15"/><rect x="30" y="40" width="40" height="22" rx="2" fill="#F3E6C4"/><text x="50" y="54" text-anchor="middle" fill="#6B2B16" font-family="sans-serif" font-size="8" font-weight="700" letter-spacing="0.5">RAISINS</text><ellipse cx="36" cy="72" rx="4" ry="3" fill="#3E1818"/><ellipse cx="44" cy="76" rx="4" ry="3" fill="#4A1E1E"/><ellipse cx="52" cy="72" rx="4" ry="3" fill="#3E1818"/><ellipse cx="60" cy="76" rx="4" ry="3" fill="#4A1E1E"/><ellipse cx="40" cy="80" rx="3.5" ry="2.8" fill="#2E1010"/><ellipse cx="56" cy="80" rx="3.5" ry="2.8" fill="#2E1010"/></svg>`,
  oatbar:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><rect x="14" y="36" width="72" height="28" rx="3" fill="#BA7517"/><rect x="14" y="36" width="72" height="28" rx="3" fill="#854F0B" opacity="0.3"/><circle cx="24" cy="44" r="2" fill="#F5E6C8"/><circle cx="38" cy="50" r="2" fill="#F5E6C8"/><circle cx="52" cy="44" r="2" fill="#F5E6C8"/><circle cx="64" cy="52" r="2" fill="#F5E6C8"/><circle cx="76" cy="46" r="2" fill="#F5E6C8"/><circle cx="30" cy="56" r="2" fill="#F5E6C8"/><circle cx="46" cy="58" r="2" fill="#F5E6C8"/><circle cx="70" cy="58" r="2" fill="#F5E6C8"/><path d="M14 40 L86 40" stroke="#633806" stroke-width="0.5" opacity="0.4"/></svg>`,
  giff:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><path d="M20 42 Q20 22 50 22 Q80 22 80 42 Q80 50 74 56 L74 74 Q74 80 68 80 L32 80 Q26 80 26 74 L26 56 Q20 50 20 42 Z" fill="#EF9F27"/><path d="M28 38 Q28 28 50 28 Q72 28 72 38" stroke="#854F0B" stroke-width="1.5" fill="none"/><path d="M34 44 Q34 36 50 36 Q66 36 66 44" stroke="#854F0B" stroke-width="1.5" fill="none"/><path d="M38 52 Q38 46 50 46 Q62 46 62 52" stroke="#854F0B" stroke-width="1.5" fill="none"/><path d="M30 62 Q50 58 70 62" stroke="#633806" stroke-width="1" fill="none" opacity="0.6"/></svg>`,
  rice:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><ellipse cx="50" cy="56" rx="32" ry="22" fill="#F5E6C8"/><ellipse cx="50" cy="52" rx="32" ry="22" fill="#FAEEDA"/><circle cx="36" cy="48" r="3" fill="#D3D1C7"/><circle cx="50" cy="44" r="2.5" fill="#D3D1C7"/><circle cx="62" cy="50" r="3" fill="#D3D1C7"/><circle cx="44" cy="56" r="2" fill="#D3D1C7"/><circle cx="58" cy="58" r="2.5" fill="#D3D1C7"/><path d="M30 38 Q40 28 50 32 Q60 28 70 38 Q72 42 68 44 Q60 38 50 42 Q40 38 32 44 Q28 42 30 38 Z" fill="#EF9F27" opacity="0.8"/><path d="M35 40 Q50 36 65 40" stroke="#BA7517" stroke-width="1" fill="none" opacity="0.5"/></svg>`,
  water:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><rect x="42" y="12" width="16" height="10" rx="3" fill="#2E6FAD"/><path d="M38 22 L62 22 L64 30 L64 88 Q64 92 60 92 L40 92 Q36 92 36 88 L36 30 Z" fill="#5B9BD5"/><path d="M36 60 L64 60 L64 88 Q64 92 60 92 L40 92 Q36 92 36 88 Z" fill="#7BBEE8" opacity="0.45"/><rect x="39" y="32" width="4" height="36" fill="#fff" opacity="0.22" rx="2"/><path d="M38 60 Q46 56 50 60 Q54 64 62 60" stroke="#fff" stroke-width="1.2" fill="none" opacity="0.4"/></svg>`,
  electro:`<svg viewBox="0 0 100 100" class="illus" xmlns="http://www.w3.org/2000/svg"><rect x="42" y="12" width="16" height="10" rx="3" fill="#1A5A45"/><path d="M38 22 L62 22 L64 30 L64 88 Q64 92 60 92 L40 92 Q36 92 36 88 L36 30 Z" fill="#2E8A6B"/><path d="M36 62 L64 62 L64 88 Q64 92 60 92 L40 92 Q36 92 36 88 Z" fill="#4AAD87" opacity="0.4"/><rect x="39" y="32" width="4" height="40" fill="#fff" opacity="0.2" rx="2"/><ellipse cx="50" cy="46" rx="11" ry="5" fill="#fff" opacity="0.85"/><text x="50" y="49.5" text-anchor="middle" fill="#2E8A6B" font-family="sans-serif" font-size="7" font-weight="700">Na+</text><circle cx="43" cy="58" r="2" fill="#fff" opacity="0.35"/><circle cx="52" cy="55" r="1.5" fill="#fff" opacity="0.35"/><circle cx="59" cy="59" r="1.2" fill="#fff" opacity="0.35"/></svg>`,
};

/* ============ PRE-RIDE TIPS ============ */
const PRE_RIDE_TIPS = {
  tempo:     { timing: '2–3 hrs before', tip: '80–100g carbs: oats, rice, or toast. Avoid high fat and fibre on the day.' },
  sweetspot: { timing: '2–3 hrs before', tip: '100g carbs: rice or banana bread. Top up with a banana 30 min before your first block.' },
  threshold: { timing: '2–3 hrs before', tip: '100–120g carbs: rice or pasta. Take a gel 15 min before your first interval.' },
  vo2max:    { timing: '3 hrs before',   tip: 'Carb-load the day before. 100–120g for breakfast. This session lives or dies on glycogen.' },
  sprint:    { timing: '2–3 hrs before', tip: 'Normal carb meal. Caffeine (3–6 mg/kg) 60 min before the session helps significantly.' },
};
function getPreRideTip(wt, dur) {
  if (wt === 'recovery') return null;
  if (wt === 'endurance') {
    if (dur < 1.5) return { timing: null, tip: 'No special prep needed — water is fine for a short ride.' };
    if (dur < 3)   return { timing: '1–2 hrs before', tip: 'Light meal: banana, toast, or oats. Fasted is fine for easy rides under 2 hours.' };
    return             { timing: '2–3 hrs before', tip: '80–100g carbs: rice, oats, or pasta. Don\'t start a long ride hungry.' };
  }
  return PRE_RIDE_TIPS[wt] || null;
}

/* ============ HYDRATION & BURN RATE ============ */
const HYDRATION_TARGETS = { recovery: 350, endurance: 500, tempo: 600, sweetspot: 650, threshold: 750, vo2max: 800, sprint: 600 };
const WT_INTENSITY = { recovery: 0.50, endurance: 0.65, tempo: 0.82, sweetspot: 0.91, threshold: 1.00, vo2max: 1.13, sprint: 1.30 };
const WT_CARB_PCT  = { recovery: 0.40, endurance: 0.55, tempo: 0.72, sweetspot: 0.82, threshold: 0.90, vo2max: 0.97, sprint: 1.00 };
function calcBurnRate(ftp, wt) {
  if (!ftp || ftp <= 0) return null;
  const watts = ftp * (WT_INTENSITY[wt] || 0.65);
  return { kcalPerHr: Math.round(watts * 3.9 / 10) * 10, carbPct: Math.round((WT_CARB_PCT[wt] || 0.55) * 100) };
}

/* ============ BANDS ============ */
const BANDS = [
  { max: 1.5, name: 'Under 90 min',  target: [0, 0],   mid: 0,  mix: { slow: 0,  mixed: 0,  fast: 0   }, tip: 'A bottle of water is fine — your glycogen has it covered. Eating here is habit, not physiology.' },
  { max: 2,   name: '90 min – 2 h', target: [30, 40], mid: 35, mix: { slow: 0,  mixed: 0,  fast: 100 }, tip: 'Fast carbs only. Start around the 45-min mark — you\'ll finish before slow carbs would kick in.' },
  { max: 4,   name: '2 – 4 h',      target: [60, 60], mid: 60, mix: { slow: 50, mixed: 25, fast: 25  }, tip: 'Slow first, fast last. Oat bar or Gifflar in the first 45 min → banana ~1:30 → gels from hour 2.' },
  { max: 6,   name: '4 – 6 h',      target: [60, 90], mid: 75, mix: { slow: 30, mixed: 30, fast: 40  }, tip: 'All three types earn their place. Drink mix is the backbone (~40g/hr from liquid alone).' },
  { max: 9,   name: '6 – 9 h',      target: [70, 90], mid: 80, mix: { slow: 25, mixed: 35, fast: 40  }, tip: 'Add savoury — rice cakes with cheese, pretzels. A real cafe stop at hour 4–5 resets your palate.' },
  { max: 99,  name: '9 – 12 h',     target: [60, 80], mid: 70, mix: { slow: 20, mixed: 30, fast: 35  }, tip: 'Eating contest. Start from minute 15, rotate flavours, plan two real meals. Salt matters more than carbs past hour 8.' },
];
function bandFor(dur) { return BANDS.find(b => dur <= b.max) || BANDS[BANDS.length - 1]; }

/* ============ STATE ============ */
const STATE_KEY = 'bike-fuel-planner-v1';
const SAVED_KEY = 'bike-fuel-planner-saved-v1';

const state = {
  name: '',
  duration: 3,
  target: 60,
  autoTarget: true,
  workoutType: 'endurance',
  ftp: 0,
  qty: {},
  customTimes: {},
};

function loadState() {
  try {
    const s = JSON.parse(localStorage.getItem(STATE_KEY) || '{}');
    Object.assign(state, s);
    state.qty         = s.qty         || {};
    state.customTimes = s.customTimes || {};
  } catch (e) {}
}
function saveState() {
  try { localStorage.setItem(STATE_KEY, JSON.stringify(state)); } catch (e) {}
}
function getSaved() { try { return JSON.parse(localStorage.getItem(SAVED_KEY) || '[]'); } catch (e) { return []; } }
function setSaved(list) { try { localStorage.setItem(SAVED_KEY, JSON.stringify(list)); } catch (e) {} }

/* ============ STEP NAVIGATION ============ */
function goTo(step) {
  document.body.dataset.step = step;
  if (step === 'catalog') { renderGrids(); render(); renderSetupBar(); }
  if (step === 'setup')   { populateSetup(); }
  if (step === 'saved')   { renderSavedStep(); }
  if (step === 'save')    { renderSaveSummary(); }
}

function renderSetupBar() {
  const wt = WORKOUT_TYPES.find(w => w.id === state.workoutType);
  document.getElementById('bar-name').textContent = state.name || 'Untitled ride';
  document.getElementById('bar-meta').textContent = `${state.duration}hr · ${wt?.label || 'Endurance'} · ${state.target}g/hr`;
  document.getElementById('plan-head-name').textContent = state.name || 'Untitled ride';
}

/* ============ WORKOUT TYPE PILLS ============ */
function renderWorkoutPills() {
  const container = document.getElementById('wt-pills');
  container.innerHTML = WORKOUT_TYPES.map(wt =>
    `<button class="wt-pill${state.workoutType === wt.id ? ' is-active' : ''}" data-wt="${wt.id}">${wt.label}</button>`
  ).join('');
  container.querySelectorAll('.wt-pill').forEach(btn => {
    btn.addEventListener('click', () => {
      state.workoutType = btn.dataset.wt;
      container.querySelectorAll('.wt-pill').forEach(b => b.classList.toggle('is-active', b.dataset.wt === state.workoutType));
      updateWtDesc();
      if (state.autoTarget) applyAutoTarget();
    });
  });
  updateWtDesc();
}

function updateWtDesc() {
  const wt = WORKOUT_TYPES.find(w => w.id === state.workoutType);
  if (!wt) return;
  document.getElementById('wt-desc-name').textContent = wt.label;
  document.getElementById('wt-desc-text').textContent = wt.desc;
  document.getElementById('wt-desc-meta').textContent = `${wt.carbs} · ${wt.intensity}`;
}

function applyAutoTarget() {
  const wt = WORKOUT_TYPES.find(w => w.id === state.workoutType);
  const wtCarbs = wt ? wt.defaultCarbs : 60;
  // Under 90 min: glycogen covers it — no exogenous carbs needed regardless of intensity
  // 90 min+: workout type is the sole driver
  const target = state.duration <= 1.5 ? 0 : wtCarbs;
  state.target = Math.round(target / 5) * 5;
  const el = document.getElementById('setup-target');
  if (el) el.value = state.target;
}

/* ============ SETUP SCREEN ============ */
function populateSetup() {
  document.getElementById('setup-name').value   = state.name || '';
  document.getElementById('setup-dur').value    = state.duration;
  document.getElementById('setup-target').value = state.target;
  if (state.ftp) document.getElementById('setup-ftp').value = state.ftp;
  document.getElementById('setup-auto-target').setAttribute('aria-pressed', state.autoTarget ? 'true' : 'false');
  renderWorkoutPills();
}

function wireSetup() {
  document.getElementById('setup-back').addEventListener('click', () => goTo('landing'));

  document.getElementById('setup-name').addEventListener('input', e => { state.name = e.target.value.trim() || ''; });

  document.getElementById('setup-dur').addEventListener('input', e => {
    state.duration = Math.max(0.5, Math.min(12, Number(e.target.value) || 0.5));
    if (state.autoTarget) applyAutoTarget();
  });

  document.getElementById('setup-target').addEventListener('input', e => {
    state.target     = Math.max(0, Math.min(150, Number(e.target.value) || 0));
    state.autoTarget = false;
    document.getElementById('setup-auto-target').setAttribute('aria-pressed', 'false');
  });

  document.getElementById('setup-auto-target').addEventListener('click', () => {
    state.autoTarget = !state.autoTarget;
    document.getElementById('setup-auto-target').setAttribute('aria-pressed', state.autoTarget ? 'true' : 'false');
    if (state.autoTarget) applyAutoTarget();
  });

  document.getElementById('setup-ftp').addEventListener('input', e => {
    state.ftp = Math.max(0, Math.min(600, Number(e.target.value) || 0));
  });

  document.getElementById('btn-build').addEventListener('click', () => {
    if (!state.name) state.name = document.getElementById('setup-name').value.trim() || 'Untitled ride';
    saveState();
    goTo('catalog');
  });
}

/* ============ LANDING ============ */
function wireLanding() {
  document.getElementById('btn-plan').addEventListener('click', () => goTo('setup'));
  document.getElementById('btn-load').addEventListener('click', () => goTo('saved'));
}

/* ============ SAVED PLANS STEP ============ */
function renderSavedStep() {
  const list   = getSaved();
  const wrap   = document.getElementById('saved-list-main');
  const empty  = document.getElementById('saved-empty-main');
  empty.style.display = list.length ? 'none' : 'block';
  wrap.innerHTML = list.map((p, i) => {
    const d = new Date(p.savedAt);
    return `<div class="saved-item" data-i="${i}">
      <div><div class="nm">${escapeHtml(p.name)}</div>
      <div class="dt">${p.duration}h · ${p.totalCarbs}g carbs · saved ${d.getMonth()+1}/${d.getDate()}</div></div>
      <div class="actions"><button class="load">Load</button><button class="danger remove">×</button></div>
    </div>`;
  }).join('');
  wrap.querySelectorAll('.saved-item').forEach(el => {
    const i = Number(el.dataset.i);
    el.querySelector('.load').addEventListener('click', () => { loadSaved(i); goTo('catalog'); });
    el.querySelector('.remove').addEventListener('click', () => { deleteSaved(i); renderSavedStep(); });
  });
  document.getElementById('saved-new').addEventListener('click', () => goTo('setup'));
}

/* ============ SAVE STEP ============ */
function renderSaveSummary() {
  const t  = totals();
  const wt = WORKOUT_TYPES.find(w => w.id === state.workoutType);
  const dur = Math.max(0.5, Number(state.duration) || 0.5);
  document.getElementById('save-sum-name').textContent  = state.name || 'Untitled ride';
  document.getElementById('save-sum-meta').textContent  = `${dur}hr · ${wt?.label || 'Endurance'} · ${Math.round(t.carbs / dur)}g/hr`;
  document.getElementById('save-sum-stats').textContent = `${Math.round(t.carbs)}g carbs · ${Math.round(t.cals)} kcal · ${t.count} items`;
}

/* ============ CATALOG: RENDER GRIDS ============ */
let gridsRendered = false;
function renderGrids() {
  if (gridsRendered) return;
  gridsRendered = true;
  const groups = { fast: [], mixed: [], slow: [], hydration: [] };
  FUELS.forEach(f => groups[f.type]?.push(f));
  document.getElementById('grid-fast').innerHTML      = groups.fast.map(fuelCard).join('');
  document.getElementById('grid-mixed').innerHTML     = groups.mixed.map(fuelCard).join('');
  document.getElementById('grid-slow').innerHTML      = groups.slow.map(fuelCard).join('');
  document.getElementById('grid-hydration').innerHTML = groups.hydration.map(fuelCard).join('');

  document.querySelectorAll('.card').forEach(card => {
    const id = card.dataset.id;
    card.addEventListener('click', e => { if (!e.target.closest('.stepper')) addOne(id, card); });
    card.querySelector('.plus').addEventListener('click',  e => { e.stopPropagation(); addOne(id, card); });
    card.querySelector('.minus').addEventListener('click', e => { e.stopPropagation(); removeOne(id); });
  });
}

function fuelCard(f) {
  const tagClass  = `tag-${f.type}`;
  const typeLabel = f.type === 'hydration' ? 'Hydration' : f.type[0].toUpperCase() + f.type.slice(1);
  const cafBadge  = f.caffeine ? `<span class="caf-badge">${f.caffeine}mg</span>` : '';
  const carbsVal  = f.type === 'hydration' && f.carbs === 0 ? '—' : `${f.carbs} g`;
  const calsVal   = f.type === 'hydration' && f.cals  === 0 ? '—' : `${f.cals}`;
  return `
    <div class="card" data-id="${f.id}" data-type="${f.type}">
      <div class="icon-wrap">${ICONS[f.id]}${cafBadge}</div>
      <p class="name">${f.name}</p>
      <p class="sub">${f.sub}</p>
      <div class="bottom">
        <div class="type-col"><span class="stat-label">type</span><span class="tag ${tagClass}">${typeLabel}</span></div>
        <div class="stat"><span class="stat-label">carbs</span><span class="stat-value">${carbsVal}</span></div>
        <div class="stat"><span class="stat-label">cals</span><span class="stat-value">${calsVal}</span></div>
      </div>
      <div class="stepper" aria-label="Quantity">
        <button class="minus" aria-label="Remove one">−</button>
        <span class="qty">0</span>
        <button class="plus" aria-label="Add one">+</button>
      </div>
    </div>`;
}

function addOne(id, cardEl) {
  state.qty[id] = (state.qty[id] || 0) + 1;
  if (cardEl) {
    const pulse = document.createElement('div');
    pulse.className = 'pulse';
    cardEl.appendChild(pulse);
    setTimeout(() => pulse.remove(), 500);
  }
  saveState(); render();
}

function removeOne(id) {
  if (!state.qty[id]) return;
  state.qty[id]--;
  if (state.qty[id] <= 0) delete state.qty[id];
  Object.keys(state.customTimes).forEach(k => {
    const [kid, idx] = k.split('#');
    if (kid === id && Number(idx) >= (state.qty[id] || 0)) delete state.customTimes[k];
  });
  saveState(); render();
}

function clearAll() { state.qty = {}; state.customTimes = {}; saveState(); render(); toast('Plan cleared'); }

function renderCardStates() {
  document.querySelectorAll('.card').forEach(card => {
    const q = state.qty[card.dataset.id] || 0;
    card.classList.toggle('is-active', q > 0);
    card.querySelector('.qty').textContent = q;
  });
}

/* ============ TOTALS ============ */
function totals() {
  let carbs = 0, cals = 0, wt = 0, cost = 0;
  const byType = { fast: 0, mixed: 0, slow: 0 };
  let count = 0;
  for (const id in state.qty) {
    const f = FUELS.find(x => x.id === id); if (!f) continue;
    const n = state.qty[id];
    carbs += f.carbs * n; cals += f.cals * n;
    wt    += f.weight * n; cost += f.cost * n;
    if (f.type !== 'hydration') byType[f.type] = (byType[f.type] || 0) + f.carbs * n;
    count += n;
  }
  return { carbs, cals, wt, cost, byType, count };
}

/* ============ RENDER ============ */
function render() {
  renderCardStates();
  const t    = totals();
  const dur  = Math.max(0.5, Number(state.duration) || 0.5);
  const band = bandFor(dur);

  // Auto-target sync (mirrors applyAutoTarget logic)
  if (state.autoTarget) {
    const wt = WORKOUT_TYPES.find(w => w.id === state.workoutType);
    const wtCarbs = wt ? wt.defaultCarbs : 60;
    state.target = Math.round((dur <= 1.5 ? 0 : wtCarbs) / 5) * 5;
  }

  const target = Math.max(1, Number(state.target) || 1);
  const cph    = t.carbs / dur;

  // Coach strip
  document.getElementById('coach-band').textContent = band.name;
  const tgtLabel = band.target[0] === band.target[1]
    ? (band.target[0] === 0 ? '0 g/hr' : `${band.target[0]} g/hr`)
    : `${band.target[0]}–${band.target[1]} g/hr`;
  document.getElementById('coach-target-range').textContent = 'Target ' + tgtLabel;
  document.getElementById('coach-tip').textContent = band.tip;

  // Readouts
  document.getElementById('r-carbs').textContent    = Math.round(t.carbs);
  document.getElementById('r-cal').textContent      = Math.round(t.cals);
  const isImp = TWEAKS.units === 'imperial';
  document.getElementById('r-wt').textContent       = isImp ? (t.wt / 28.3495).toFixed(1) : Math.round(t.wt);
  document.getElementById('r-wt-u').textContent     = isImp ? 'oz' : 'g';
  const rate = CURRENCY_RATE[TWEAKS.currency] || 1;
  document.getElementById('r-cost').textContent     = (t.cost * rate).toFixed(2);
  document.getElementById('r-carbs-hr').textContent = Math.round(cph);

  // Target bar + hint
  const bar = document.getElementById('r-bar');
  const hint = document.getElementById('r-hint');
  const hintText = document.getElementById('r-hint-text');
  bar.classList.remove('warn', 'bad');
  hint.classList.remove('good', 'warn', 'bad');
  const [lo, hi] = band.target;

  let hintMsg = '';
  if (t.count === 0) {
    bar.style.width = '0%'; hint.classList.add('warn');
    hintMsg = dur < 1.5 ? 'Water is fine for a ride this short' : 'Add items to start';
  } else if (lo === 0 && hi === 0) {
    bar.style.width = Math.min(140, (cph / 30) * 100) + '%'; hint.classList.add('good');
    hintMsg = 'No fuel needed — anything you add is a bonus';
  } else {
    bar.style.width = Math.min(140, (cph / band.mid) * 100) + '%';
    if      (cph < lo * 0.7) { hint.classList.add('bad');  bar.classList.add('bad');  hintMsg = `${Math.round(lo - cph)} g/hr short of ${lo} g/hr floor`; }
    else if (cph < lo)       { hint.classList.add('warn'); bar.classList.add('warn'); hintMsg = `A bit light — ${Math.round(lo - cph)} g/hr under`; }
    else if (cph <= hi)      { hint.classList.add('good');                             hintMsg = `In the ${lo}–${hi} g/hr sweet spot`; }
    else if (cph <= 120)     { hint.classList.add('warn'); bar.classList.add('warn'); hintMsg = `${Math.round(cph - hi)} g/hr over — only if gut is trained`; }
    else                     { hint.classList.add('bad');  bar.classList.add('bad');  hintMsg = 'Over 120 g/hr — GI distress territory'; }
  }
  hintText.textContent = hintMsg;

  // Mix bar
  const totalC = t.byType.fast + t.byType.mixed + t.byType.slow;
  const pct = v => totalC ? (v / totalC * 100) : 0;
  const aF = pct(t.byType.fast), aM = pct(t.byType.mixed), aS = pct(t.byType.slow);
  document.getElementById('mix-fast').style.flexBasis  = aF + '%';
  document.getElementById('mix-mixed').style.flexBasis = aM + '%';
  document.getElementById('mix-slow').style.flexBasis  = aS + '%';
  document.getElementById('leg-fast').textContent  = Math.round(aF)  + '%';
  document.getElementById('leg-mixed').textContent = Math.round(aM) + '%';
  document.getElementById('leg-slow').textContent  = Math.round(aS)  + '%';
  document.getElementById('mix-meta').textContent  = totalC ? `${Math.round(t.carbs)} g total` : '';
  const rec = band.mix; const recTotal = rec.fast + rec.mixed + rec.slow;
  const recEl = document.getElementById('mix-rec');
  if (recTotal > 0) {
    recEl.innerHTML = `<span class="tick" style="left:${rec.fast}%"></span><span class="tick" style="left:${rec.fast + rec.mixed}%"></span>`;
    document.getElementById('rec-fast').textContent  = 'rec ' + rec.fast  + '%';
    document.getElementById('rec-mixed').textContent = 'rec ' + rec.mixed + '%';
    document.getElementById('rec-slow').textContent  = 'rec ' + rec.slow  + '%';
  } else {
    recEl.innerHTML = '';
    ['rec-fast','rec-mixed','rec-slow'].forEach(id => document.getElementById(id).textContent = '');
  }

  // Pre-ride tip
  const preTip = getPreRideTip(state.workoutType, dur);
  const preEl  = document.getElementById('preride');
  if (preTip) {
    preEl.style.display = 'block';
    document.getElementById('preride-timing').textContent = preTip.timing || '';
    document.getElementById('preride-tip').textContent    = preTip.tip;
  } else { preEl.style.display = 'none'; }

  // Hydration + burn rate
  document.getElementById('r-hydration').textContent = HYDRATION_TARGETS[state.workoutType] || 500;
  const burn = calcBurnRate(state.ftp, state.workoutType);
  const burnCell = document.getElementById('r-burn-cell');
  if (burn) { burnCell.style.display = ''; document.getElementById('r-burn').textContent = `${burn.kcalPerHr} kcal/hr · ${burn.carbPct}% carbs`; }
  else        burnCell.style.display = 'none';

  // Sticky bar (mobile mirror)
  document.getElementById('sb-carbs-hr').textContent = Math.round(cph);
  const sbFill = document.getElementById('sb-fill');
  const sbFillClass = bar.classList.contains('bad') ? 'bad' : bar.classList.contains('warn') ? 'warn' : '';
  sbFill.className = 'sb-fill' + (sbFillClass ? ' ' + sbFillClass : '');
  sbFill.style.width = bar.style.width;
  document.getElementById('sb-hint').textContent = hintMsg;

  renderTimeline(dur);
  renderSaved();
}

/* ============ TIMELINE ============ */
function buildInstances() {
  const items = []; const order = ['fast', 'mixed', 'slow', 'hydration'];
  const byType = { fast: [], mixed: [], slow: [], hydration: [] };
  FUELS.forEach(f => { const n = state.qty[f.id] || 0; for (let i = 0; i < n; i++) byType[f.type]?.push({ id: f.id, index: i, f }); });
  let i = 0;
  while (order.some(t => byType[t].length)) { for (const t of order) { if (byType[t].length) items.push(byType[t].shift()); } if (++i > 200) break; }
  return items;
}
function defaultTime(idx, n, dur) {
  if (n <= 0) return 0; if (n === 1) return dur * 0.5;
  const pad = Math.min(0.5, dur * 0.15);
  return pad + (Math.max(0.1, dur - 2 * pad) * idx / (n - 1));
}
function fmtTime(h) { const hr = Math.floor(h); const min = Math.round((h - hr) * 60); return min === 60 ? `${hr+1}:00` : `${hr}:${String(min).padStart(2,'0')}`; }

let dragCtx = null;

function renderTimeline(dur) {
  const ticksEl = document.getElementById('tl-ticks');
  const itemsEl = document.getElementById('tl-items');
  const emptyEl = document.getElementById('tl-empty');
  const metaEl  = document.getElementById('tl-meta');

  const tickStep = dur <= 2 ? 0.5 : dur <= 5 ? 1 : 2;
  let tickHtml = '';
  for (let t = 0; t <= dur + 0.001; t += tickStep) {
    const p = (t / dur) * 100;
    tickHtml += `<span class="tick" style="left:${p}%"></span><span class="tick-label" style="left:${p}%">${Number.isInteger(t) ? t+'h' : t.toFixed(1)+'h'}</span>`;
  }
  ticksEl.innerHTML = tickHtml;

  const cafEl = document.getElementById('caf-window');
  if (dur >= 2) {
    const ws = Math.max(0.5, dur * 0.6), we = dur - 0.25;
    cafEl.style.cssText = `display:block;left:${ws/dur*100}%;width:${(we-ws)/dur*100}%`;
  } else { cafEl.style.display = 'none'; }

  const instances = buildInstances();
  const n = instances.length;
  metaEl.textContent = n === 0 ? '0 items' : n === 1 ? '1 item' : `${n} items · every ${Math.round((dur / (n - 1)) * 60)} min`;
  emptyEl.style.display = n ? 'none' : 'block';

  const ABBR = { gel40:'G40', gel60:'G60', drink:'Mix', haribo:'Hb', chews:'Ch', cola:'Co', caf75:'C75', caf100:'C100', banana:'Bn', mango:'Mg', raisins:'Rs', oatbar:'Oat', giff:'Gf', rice:'Rc', water:'H2O', electro:'Elt' };
  itemsEl.innerHTML = instances.map((it, i) => {
    const key = `${it.id}#${it.index}`;
    let h = typeof state.customTimes[key] === 'number' ? state.customTimes[key] : defaultTime(i, n, dur);
    h = Math.max(0, Math.min(dur, h));
    const chipType = it.f.caffeine ? 'caffeine' : it.f.type;
    return `<div class="timeline-item" data-key="${key}" style="left:${(h/dur)*100}%"><div class="chip ${chipType}" title="${it.f.name} at ${fmtTime(h)}">${ABBR[it.id]||'•'}</div><div class="time">${fmtTime(h)}</div></div>`;
  }).join('');

  itemsEl.querySelectorAll('.timeline-item').forEach(el => el.addEventListener('pointerdown', onDragStart));
}

function onDragStart(e) {
  e.preventDefault();
  const el = e.currentTarget;
  dragCtx = { key: el.dataset.key, rect: document.getElementById('tl-items').getBoundingClientRect(), el };
  el.setPointerCapture(e.pointerId);
  el.addEventListener('pointermove', onDragMove);
  el.addEventListener('pointerup', onDragEnd);
  el.addEventListener('pointercancel', onDragEnd);
}
function onDragMove(e) {
  if (!dragCtx) return;
  const dur = Math.max(0.5, Number(state.duration) || 0.5);
  const ratio = Math.max(0, Math.min(1, (e.clientX - dragCtx.rect.left) / dragCtx.rect.width));
  const snapped = Math.round(ratio * dur * 12) / 12;
  state.customTimes[dragCtx.key] = snapped;
  dragCtx.el.style.left = (ratio * 100) + '%';
  const timeEl = dragCtx.el.querySelector('.time');
  if (timeEl) timeEl.textContent = fmtTime(snapped);
}
function onDragEnd() {
  if (!dragCtx) return;
  dragCtx.el.removeEventListener('pointermove', onDragMove);
  dragCtx.el.removeEventListener('pointerup', onDragEnd);
  dragCtx.el.removeEventListener('pointercancel', onDragEnd);
  dragCtx = null; saveState();
}

/* ============ SAVED PLANS (sidebar list) ============ */
function renderSaved() {
  const list  = getSaved();
  const wrap  = document.getElementById('saved-list');
  const empty = document.getElementById('saved-empty');
  empty.style.display = list.length ? 'none' : 'block';
  wrap.innerHTML = list.map((p, i) => {
    const d = new Date(p.savedAt);
    return `<div class="saved-item" data-i="${i}">
      <div><div class="nm">${escapeHtml(p.name)}</div><div class="dt">${p.duration}h · ${p.totalCarbs}g · ${d.getMonth()+1}/${d.getDate()}</div></div>
      <div class="actions"><button class="load">Load</button><button class="danger remove">×</button></div>
    </div>`;
  }).join('');
  wrap.querySelectorAll('.saved-item').forEach(el => {
    const i = Number(el.dataset.i);
    el.querySelector('.load').addEventListener('click', () => { loadSaved(i); });
    el.querySelector('.remove').addEventListener('click', () => { deleteSaved(i); renderSaved(); });
  });
}

function savePlan() {
  const t = totals();
  if (!t.count) { toast('Add some items first'); return; }
  const list = getSaved();
  list.unshift({ name: state.name, duration: state.duration, target: state.target, autoTarget: state.autoTarget, workoutType: state.workoutType, ftp: state.ftp, qty: { ...state.qty }, customTimes: { ...state.customTimes }, totalCarbs: Math.round(t.carbs), savedAt: Date.now() });
  setSaved(list.slice(0, 20));
  renderSaved();
  toast(`Saved "${state.name}"`);
}

function loadSaved(i) {
  const p = getSaved()[i]; if (!p) return;
  Object.assign(state, { name: p.name, duration: p.duration, target: p.target, autoTarget: p.autoTarget !== false, workoutType: p.workoutType || 'endurance', ftp: p.ftp || 0, qty: { ...p.qty }, customTimes: { ...(p.customTimes || {}) } });
  saveState(); renderSetupBar(); render();
  toast(`Loaded "${p.name}"`);
}

function deleteSaved(i) { const list = getSaved(); list.splice(i, 1); setSaved(list); }

function duplicatePlan() {
  state.name = state.name.replace(/ \(copy\)$/, '') + ' (copy)';
  renderSetupBar(); saveState(); savePlan();
}

/* ============ UTIL ============ */
function escapeHtml(s) { return String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); }
let toastTimer = null;
function toast(msg) {
  const el = document.getElementById('toast');
  el.textContent = msg; el.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

/* ============ INIT ============ */
loadState();
wireTweaks();
applyTweaks();
wireLanding();
wireSetup();

// Catalog controls
document.getElementById('clear-btn').addEventListener('click', clearAll);
document.getElementById('save-btn').addEventListener('click', () => goTo('save'));
document.getElementById('duplicate-btn').addEventListener('click', duplicatePlan);
document.getElementById('btn-edit').addEventListener('click', () => goTo('setup'));

// Save step
document.getElementById('save-back').addEventListener('click', () => goTo('catalog'));
document.getElementById('btn-save-local').addEventListener('click', () => { savePlan(); toast('Plan saved to this device'); setTimeout(() => goTo('catalog'), 800); });

// Saved step back
document.getElementById('saved-back').addEventListener('click', () => goTo('landing'));

// Mobile sticky bar / sheet
document.getElementById('sb-toggle').addEventListener('click', () => {
  document.getElementById('stats-panel').classList.toggle('sheet-open');
  document.getElementById('sheet-backdrop').classList.toggle('is-visible');
});
document.getElementById('sheet-backdrop').addEventListener('click', () => {
  document.getElementById('stats-panel').classList.remove('sheet-open');
  document.getElementById('sheet-backdrop').classList.remove('is-visible');
});

// Start on landing; if returning user has items in state, go to catalog directly
if (Object.keys(state.qty).length > 0 && state.name) {
  goTo('catalog');
  renderGrids();
} else {
  goTo('landing');
}
