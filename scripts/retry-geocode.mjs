import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const CITY_NAMES_HE = {
  kiryat_yam: 'קרית ים',
  kiryat_motzkin: 'קרית מוצקין',
  kiryat_haim: 'קרית חיים',
  kiryat_ata: 'קרית אתא',
  kiryat_bialik: 'קרית ביאליק',
};

// Clean address: remove Hebrew gershayim/geresh and ASCII quotes
function cleanAddress(addr) {
  return addr.replace(/[״"״]/g, '').replace(/'/g, '').trim();
}

// Remove common Hebrew street-type prefixes
function stripPrefix(addr) {
  return addr
    .replace(/^שביל\s+/, '')
    .replace(/^נתיב\s+/, '')
    .replace(/^סמטת?\s+/, '')
    .replace(/^ככר\s+/, '')
    .replace(/^שכונת\s+/, '')
    .replace(/^ק\.\s+/, '')
    .trim();
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

async function nominatim(query) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=il&limit=1`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RunningInWar/1.0 (shelter import; contact: yuvaly1.amar@gmail.com)' }
    });
    const data = await res.json();
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {}
  return null;
}

async function geocodeWithRetry(address, cityId) {
  const cityHe = CITY_NAMES_HE[cityId];
  const clean = cleanAddress(address);
  const stripped = stripPrefix(clean);

  const strategies = [
    `${clean}, ${cityHe}, ישראל`,
    `${stripped}, ${cityHe}, ישראל`,
    `רחוב ${stripped}, ${cityHe}, ישראל`,
    `${stripped} ${cityHe}`,
  ];

  for (const q of strategies) {
    const coords = await nominatim(q);
    await sleep(1100);
    if (coords) return { coords, strategy: q };
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
  { city: 'kiryat_ata', address: 'סמטת יאיר 12', notes: 'שכונת בן גוריון, עלי' },
  { city: 'kiryat_ata', address: 'סמטת יאיר 6', notes: 'שכונת בן גוריון, עלי' },
  { city: 'kiryat_ata', address: 'צנחנים 23', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'ככר בני ברית 8', notes: 'פינת כצנלסון, עלי' },
  { city: 'kiryat_ata', address: 'עצמאות 49', notes: 'תת קרקעי' },
  { city: 'kiryat_ata', address: 'יחיא צלאח 15', notes: 'ביה"ס נועם, עלי' },
  { city: 'kiryat_ata', address: 'ק. שטנד 24', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'שכונת בן יוסף 12', notes: 'ק. נחום, עלי' },
  { city: 'kiryat_bialik', address: 'הכלניות 4', notes: 'סמטת הכלניות' },
  { city: 'kiryat_bialik', address: 'נרקיסים 29', notes: '' },
];

async function retryGeocoding() {
  console.log(`Retrying ${FAILED.length} failed shelters with multiple strategies...\n`);

  const withCoords = [];
  const stillFailed = [];

  for (let i = 0; i < FAILED.length; i++) {
    const s = FAILED[i];
    const result = await geocodeWithRetry(s.address, s.city);
    if (result) {
      withCoords.push({ ...s, lat: result.coords.lat, lng: result.coords.lng });
      console.log(`[${i+1}/${FAILED.length}] ✓ ${s.city} — ${s.address}`);
      console.log(`         strategy: "${result.strategy}"`);
    } else {
      stillFailed.push(s);
      console.log(`[${i+1}/${FAILED.length}] ✗ STILL FAILED: ${s.address} (${s.city})`);
    }
  }

  console.log(`\nResolved: ${withCoords.length} / ${FAILED.length}`);
  if (stillFailed.length > 0) {
    console.log(`Still failed (${stillFailed.length}):`);
    stillFailed.forEach(s => console.log(`  - ${s.city}: ${s.address}`));
  }

  if (withCoords.length === 0) {
    console.log('Nothing new to upload.');
    return;
  }

  const col = db.collection('city_shelters');
  const batch = db.batch();
  withCoords.forEach(shelter => batch.set(col.doc(), shelter));
  await batch.commit();
  console.log(`\nUploaded ${withCoords.length} additional shelters to Firestore.`);
}

retryGeocoding().catch(console.error);
