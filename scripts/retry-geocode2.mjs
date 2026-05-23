import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// Krayot bounding box: ~Kiryat Bialik to Kiryat Ata
const VIEWBOX = '35.02,32.79,35.13,32.93';

const TRANSLATIONS = {
  'הפלמ"ח': 'Palmach',
  'הפלמח': 'Palmach',
  'ויצמן': 'Weizmann',
  'ההסתדרות': 'Histadrut',
  'הראשונים': 'HaRishonim',
  'רמב"ם': 'Rambam',
  'רמבם': 'Rambam',
  'ארזים': 'Arazim',
  'וורבורג': 'Warburg',
  'יבניאלי': 'Yavniely',
  'חנה סנש': 'Hannah Senesh',
  'יהושע בן נון': 'Yehoshua Ben Nun',
  'צנחנים': 'Tzanchanim',
  'עצמאות': 'Atzmaut',
  'הכלניות': 'HaKalaniyot',
  'נרקיסים': 'Narkisim',
  'הבנים': 'HaBanim',
  'העלייה': 'HaAliya',
  'כלנית': 'Kalanit',
  'רקפת': 'Rakefet',
  'ארזים': 'Arazim',
  'בן ציון ישראלי': 'Ben Zion Israeli',
  'השקד': 'HaShaked',
  'אפרים': 'Efraim',
  'ככר בני ברית': 'Bnei Brit Square',
  'יחיא צלאח': 'Yahya Tzalah',
  'ק. שטנד': 'Shtand',
};

const CITY_NAMES_EN = {
  kiryat_yam: 'Kiryat Yam',
  kiryat_motzkin: 'Kiryat Motzkin',
  kiryat_haim: 'Kiryat Haim',
  kiryat_ata: 'Kiryat Ata',
  kiryat_bialik: 'Kiryat Bialik',
};
const CITY_NAMES_HE = {
  kiryat_yam: 'קרית ים',
  kiryat_motzkin: 'קרית מוצקין',
  kiryat_haim: 'קרית חיים',
  kiryat_ata: 'קרית אתא',
  kiryat_bialik: 'קרית ביאליק',
};

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function toEnglish(address) {
  let en = address.replace(/"/g, '').replace(/״/g, '').replace(/׳/g, '');
  for (const [he, eng] of Object.entries(TRANSLATIONS)) {
    en = en.replace(he, eng);
  }
  return en;
}

function stripPrefix(addr) {
  return addr
    .replace(/^שביל\s+/, '').replace(/^נתיב\s+/, '').replace(/^סמטת?\s+/, '')
    .replace(/^ככר\s+/, '').replace(/^שכונת\s+/, '').replace(/^ק\.\s+/, '')
    .trim();
}

async function nominatim(query, bounded = false) {
  const viewboxParam = bounded ? `&viewbox=${VIEWBOX}&bounded=1` : `&viewbox=${VIEWBOX}`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=il&limit=1${viewboxParam}`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RunningInWar/1.0 (shelter import; contact: yuvaly1.amar@gmail.com)' }
    });
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

async function geocodeAggressive(address, cityId) {
  const cityHe = CITY_NAMES_HE[cityId];
  const cityEn = CITY_NAMES_EN[cityId];
  const clean = address.replace(/[״"]/g, '').trim();
  const stripped = stripPrefix(clean);
  const enAddr = toEnglish(stripped);

  const strategies = [
    // Hebrew with viewbox bounded
    [() => nominatim(`${clean}, ${cityHe}, ישראל`, true), `HE+city bounded`],
    [() => nominatim(`${stripped}, ${cityHe}, ישראל`, true), `HE stripped+city bounded`],
    [() => nominatim(`${clean}`, true), `HE only bounded`],
    [() => nominatim(`${stripped}`, true), `HE stripped bounded`],
    // English
    [() => nominatim(`${enAddr}, ${cityEn}, Israel`, false), `EN+city`],
    [() => nominatim(`${enAddr}, ${cityEn}`, false), `EN+city short`],
    [() => nominatim(`${enAddr} ${cityEn}`, true), `EN+city bounded`],
  ];

  for (const [fn, label] of strategies) {
    const coords = await fn();
    await sleep(1100);
    if (coords) return { coords, label };
  }
  return null;
}

const FAILED = [
  { city: 'kiryat_yam', address: 'אפרים 2', notes: 'מועדון הגנה עצמית' },
  { city: 'kiryat_yam', address: 'הראשונים 6', notes: 'כניסה יוספטל' },
  { city: 'kiryat_yam', address: 'ההסתדרות 6', notes: '' },
  { city: 'kiryat_yam', address: 'רמב"ם 11', notes: 'פינת כצנלסון' },
  { city: 'kiryat_yam', address: 'הפלמ"ח 16', notes: 'פינת שופטים' },
  { city: 'kiryat_yam', address: 'הפלמ"ח 26', notes: 'פינת המעפילים' },
  { city: 'kiryat_motzkin', address: 'נתיב הבנים 9', notes: 'מרכז הנוער אלי כהן' },
  { city: 'kiryat_motzkin', address: 'נתיב העלייה 9', notes: 'בית כנסת' },
  { city: 'kiryat_motzkin', address: 'שביל כלנית 5', notes: 'מועדון לימודי' },
  { city: 'kiryat_motzkin', address: 'שביל רקפת 7', notes: 'מועדון לימודי' },
  { city: 'kiryat_haim', address: 'ארזים 62', notes: 'בפארק הצירי, מונגש' },
  { city: 'kiryat_haim', address: 'בן ציון ישראלי 41', notes: 'בפארק הצירי' },
  { city: 'kiryat_haim', address: 'השקד 2', notes: '' },
  { city: 'kiryat_haim', address: 'וורבורג 7', notes: '' },
  { city: 'kiryat_ata', address: 'יבניאלי 25', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'יבניאלי 2', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'חנה סנש 19', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'יהושע בן נון 5', notes: 'תת קרקעי' },
  { city: 'kiryat_ata', address: 'ויצמן 24', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'ויצמן 2', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'ויצמן 1', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'צנחנים 23', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'ככר בני ברית 8', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'עצמאות 49', notes: 'תת קרקעי' },
  { city: 'kiryat_ata', address: 'יחיא צלאח 15', notes: 'ביה"ס נועם, עלי' },
  { city: 'kiryat_bialik', address: 'הכלניות 4', notes: 'סמטת הכלניות' },
  { city: 'kiryat_bialik', address: 'נרקיסים 29', notes: '' },
];

async function run() {
  console.log(`Aggressive retry for ${FAILED.length} shelters...\n`);
  const withCoords = [];
  const stillFailed = [];

  for (let i = 0; i < FAILED.length; i++) {
    const s = FAILED[i];
    const result = await geocodeAggressive(s.address, s.city);
    if (result) {
      withCoords.push({ ...s, lat: result.coords.lat, lng: result.coords.lng });
      console.log(`[${i+1}/${FAILED.length}] ✓ ${s.city} — ${s.address} (${result.label})`);
    } else {
      stillFailed.push(s);
      console.log(`[${i+1}/${FAILED.length}] ✗ FAILED: ${s.address} (${s.city})`);
    }
  }

  console.log(`\nResolved: ${withCoords.length} / ${FAILED.length}`);
  if (stillFailed.length > 0) {
    console.log(`Still failed (${stillFailed.length}):`);
    stillFailed.forEach(s => console.log(`  - ${s.city}: ${s.address}`));
  }

  if (withCoords.length > 0) {
    const col = db.collection('city_shelters');
    const batch = db.batch();
    withCoords.forEach(s => batch.set(col.doc(), s));
    await batch.commit();
    console.log(`Uploaded ${withCoords.length} shelters.`);
  }
}

run().catch(console.error);
