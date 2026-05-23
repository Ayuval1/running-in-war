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

const rawShelters = [
  // ── קרית ים (26) ──────────────────────────────────────────
  { city: 'kiryat_yam', address: 'אחד העם 23', notes: 'גן דוד, בית כנסת, מקלט נגיש' },
  { city: 'kiryat_yam', address: "ז'בוטינסקי 3", notes: 'גן אריה, המתנ"ס - אימון גופני, מקלט נגיש' },
  { city: 'kiryat_yam', address: 'הרצל 73', notes: 'הנוער העובד והלומד' },
  { city: 'kiryat_yam', address: 'צה"ל 19', notes: '' },
  { city: 'kiryat_yam', address: 'ליהמן 1', notes: 'פינת הנרייטה סולד, וטרנים, מקלט נגיש' },
  { city: 'kiryat_yam', address: 'שפרינצק 10', notes: 'מועדון אגרוף' },
  { city: 'kiryat_yam', address: 'שמעון 10', notes: 'פינת בוזגלו, בית מדרש' },
  { city: 'kiryat_yam', address: 'יהודה 8', notes: 'חלוקת מזון' },
  { city: 'kiryat_yam', address: 'הנרייטה סולד 19', notes: 'מועדון נוער - אגרוף' },
  { city: 'kiryat_yam', address: 'פינסקר 1', notes: 'גן סולד, מועדון גימלאים, מקלט נגיש' },
  { city: 'kiryat_yam', address: 'ליהמן 15', notes: 'מרכז הפעלה משני של העירייה' },
  { city: 'kiryat_yam', address: 'פנקס 3', notes: 'מועדון פנקס' },
  { city: 'kiryat_yam', address: 'אשר 13', notes: 'כולל תורה' },
  { city: 'kiryat_yam', address: 'אפרים 2', notes: 'מועדון הגנה עצמית' },
  { city: 'kiryat_yam', address: 'הראשונים 6', notes: 'כניסה יוספטל' },
  { city: 'kiryat_yam', address: 'ההסתדרות 6', notes: '' },
  { city: 'kiryat_yam', address: 'רמב"ם 11', notes: 'פינת כצנלסון' },
  { city: 'kiryat_yam', address: 'יצחק שדה 19', notes: 'בית כנסת בית-אל' },
  { city: 'kiryat_yam', address: 'הפלמ"ח 16', notes: 'פינת שופטים' },
  { city: 'kiryat_yam', address: 'פלמ"ח 16', notes: 'פינת פינסקר' },
  { city: 'kiryat_yam', address: 'פלמ"ח 16', notes: 'פינת טרומפלדור, עזרה לנזקקים' },
  { city: 'kiryat_yam', address: 'הפלמ"ח 26', notes: 'פינת המעפילים, מועדון עולי צפון אמריקה' },
  { city: 'kiryat_yam', address: 'הקוממיות 6', notes: 'מועדון קווקזים, מקלט נגיש' },
  { city: 'kiryat_yam', address: 'הדס 6', notes: 'שכונת אלמוגים' },
  { city: 'kiryat_yam', address: 'תמר 6', notes: '' },
  { city: 'kiryat_yam', address: 'מצדה 1', notes: 'סמוך לביה"ס אמירים' },

  // ── קרית מוצקין (26) ──────────────────────────────────────
  { city: 'kiryat_motzkin', address: 'גושן 1', notes: 'בית כנסת' },
  { city: 'kiryat_motzkin', address: 'גושן 2', notes: '' },
  { city: 'kiryat_motzkin', address: 'דבורה 30', notes: '' },
  { city: 'kiryat_motzkin', address: 'כצנלסון 8', notes: '' },
  { city: 'kiryat_motzkin', address: 'רוקח 12', notes: 'מועדון נערות' },
  { city: 'kiryat_motzkin', address: 'ברק 31', notes: 'אחדות אולם ספורט' },
  { city: 'kiryat_motzkin', address: 'קק"ל 23', notes: 'מועדון וטרנים' },
  { city: 'kiryat_motzkin', address: 'קק"ל 8', notes: 'בית כנסת' },
  { city: 'kiryat_motzkin', address: 'רנ"ס 37', notes: 'מחסן ביגוד' },
  { city: 'kiryat_motzkin', address: 'נתיב הבנים 9', notes: 'מרכז הנוער אלי כהן' },
  { city: 'kiryat_motzkin', address: 'נתיב העלייה 9', notes: 'בית כנסת' },
  { city: 'kiryat_motzkin', address: 'הילדים 22', notes: '' },
  { city: 'kiryat_motzkin', address: 'ויצמן 25', notes: 'צהרון' },
  { city: 'kiryat_motzkin', address: "ז'בוטינסקי 13", notes: 'בני עקיבא' },
  { city: 'kiryat_motzkin', address: 'אח"י אילת 15', notes: 'האגודה למען החיל' },
  { city: 'kiryat_motzkin', address: "ז'בוטינסקי 31", notes: 'צהרון' },
  { city: 'kiryat_motzkin', address: 'טרומפלדור 9', notes: '' },
  { city: 'kiryat_motzkin', address: 'שביל כלנית 5', notes: 'מועדון לימודי' },
  { city: 'kiryat_motzkin', address: 'שביל רקפת 7', notes: 'מועדון לימודי' },
  { city: 'kiryat_motzkin', address: 'יוספטל 30', notes: 'אולפן' },
  { city: 'kiryat_motzkin', address: 'יוספטל 25', notes: '' },
  { city: 'kiryat_motzkin', address: 'גן העצמאות 2', notes: 'בית כנסת' },
  { city: 'kiryat_motzkin', address: 'גן העצמאות 14', notes: 'מועדון שחמט' },
  { city: 'kiryat_motzkin', address: 'שפרינצק 13', notes: 'אקי"ם' },
  { city: 'kiryat_motzkin', address: 'הרב יוסף לוי 1', notes: 'בית הכנסת שלטי גיבורים' },
  { city: 'kiryat_motzkin', address: 'דקר 4', notes: 'פתחון לב' },

  // ── קרית חיים (32 ייחודיים לאחר dedup) ───────────────────
  { city: 'kiryat_haim', address: 'אברבנאל 26', notes: 'מונגש' },
  { city: 'kiryat_haim', address: 'אברבנאל 69', notes: 'בחצר בית הכנסת, מונגש' },
  { city: 'kiryat_haim', address: 'אנה פרנק 11', notes: '' },
  { city: 'kiryat_haim', address: 'אנה פרנק 40', notes: 'מונגש' },
  { city: 'kiryat_haim', address: 'ארזים 62', notes: 'בפארק הצירי, מונגש' },
  { city: 'kiryat_haim', address: 'משמר העמק 10', notes: 'מונגש' },
  { city: 'kiryat_haim', address: 'בן ציון ישראלי 41', notes: 'בפארק הצירי' },
  { city: 'kiryat_haim', address: 'משמר העמק 19', notes: '' },
  { city: 'kiryat_haim', address: 'בית אלפא 27', notes: '' },
  { city: 'kiryat_haim', address: 'דגניה 10', notes: 'מונגש' },
  { city: 'kiryat_haim', address: 'דגניה 33', notes: 'מאחורי ביה"ס, מונגש' },
  { city: 'kiryat_haim', address: 'דגניה 53', notes: 'בחצר ביה"ס רגבים, מונגש' },
  { city: 'kiryat_haim', address: 'נתיב התנאים 16', notes: 'בחצר ביה"ס הרא"ה ק.שמואל' },
  { city: 'kiryat_haim', address: 'בעל התניא 4', notes: 'ק. שמואל' },
  { city: 'kiryat_haim', address: 'השקד 2', notes: '' },
  { city: 'kiryat_haim', address: 'הנוטר 53', notes: 'בגן' },
  { city: 'kiryat_haim', address: 'הנוטר 54', notes: 'ליד בית ספר' },
  { city: 'kiryat_haim', address: 'הפלוגות 54', notes: '' },
  { city: 'kiryat_haim', address: 'השיירה 34', notes: 'במבנה בית יד לבנים' },
  { city: 'kiryat_haim', address: 'הקיבוצים 73', notes: '' },
  { city: 'kiryat_haim', address: 'הראשונים 55', notes: '' },
  { city: 'kiryat_haim', address: 'חומה ומגדל 18', notes: 'בחורשה' },
  { city: 'kiryat_haim', address: 'הקונגרס 43', notes: 'בית היינה' },
  { city: 'kiryat_haim', address: 'יציב 46', notes: 'ליד בית יציב, מונגש' },
  { city: 'kiryat_haim', address: 'יציב 24', notes: '' },
  { city: 'kiryat_haim', address: 'אלכסנדר זייד 77', notes: '' },
  { city: 'kiryat_haim', address: 'ברכה פולד 13', notes: 'מאחורי ביטוח לאומי' },
  { city: 'kiryat_haim', address: 'ציזלינג 26', notes: '' },
  { city: 'kiryat_haim', address: 'שבטי ישראל 66', notes: '' },
  { city: 'kiryat_haim', address: 'שטרית 26', notes: '' },
  { city: 'kiryat_haim', address: 'וורבורג 7', notes: '' },

  // ── קרית אתא (57) ─────────────────────────────────────────
  { city: 'kiryat_ata', address: 'מבצע סיני 5', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'המכבים 8', notes: 'תת קרקעי' },
  { city: 'kiryat_ata', address: 'בן עמי 30', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'בן עמי 46', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'בר כוכבא 6', notes: 'מאחורי בהכנ"ס, עלי' },
  { city: 'kiryat_ata', address: 'בר כוכבא 9', notes: 'מאחורי החנויות, עלי' },
  { city: 'kiryat_ata', address: 'יצחק שדה 4', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'יצחק שדה 6', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'יצחק שדה 26', notes: 'עלי' },
  { city: 'kiryat_ata', address: "אנילביץ' 18", notes: 'עלי' },
  { city: 'kiryat_ata', address: 'אלי כהן 9', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'פלמ"ח 16', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'פלמ"ח 3', notes: 'תת קרקעי' },
  { city: 'kiryat_ata', address: 'יבניאלי 25', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'יבניאלי 2', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'א. טביב 18', notes: 'מתחת לבהכנ"ס, תת קרקעי' },
  { city: 'kiryat_ata', address: 'חנה סנש 19', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'יהושע בן נון 5', notes: 'תת קרקעי' },
  { city: 'kiryat_ata', address: 'שמואל עזר 26', notes: 'פינת אביגדור עשת, עלי' },
  { city: 'kiryat_ata', address: 'אביגדור עשת 44', notes: 'פינת שמואל עזר, עלי' },
  { city: 'kiryat_ata', address: 'אביגדור עשת 32', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'ויצמן 24', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'הרב עוזיאל 25', notes: 'סמטת רקפת, עלי' },
  { city: 'kiryat_ata', address: 'זמנהוף 7', notes: 'פינת וינגייט, עלי' },
  { city: 'kiryat_ata', address: 'איינשטיין 17', notes: 'כניסה מירמיהו, עלי' },
  { city: 'kiryat_ata', address: 'ויצמן 2', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'ויצמן 1', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'אהרון בן יוסף 1', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'סמטת יאיר 12', notes: 'שכונת בן גוריון, עלי' },
  { city: 'kiryat_ata', address: 'סמטת יאיר 6', notes: 'שכונת בן גוריון, עלי' },
  { city: 'kiryat_ata', address: 'סמטת יאיר 12', notes: 'רחבה, תת קרקעי' },
  { city: 'kiryat_ata', address: 'צנחנים 23', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'בורוכוב 1', notes: 'פינת הוגו מולר, עלי' },
  { city: 'kiryat_ata', address: 'יוספטל 61', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'אסף שמחוני 16', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'אסף שמחוני 44', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'סירקין 24', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'הוגו מולר 31', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'רופין 7', notes: 'ליד החנויות, תת קרקעי' },
  { city: 'kiryat_ata', address: 'רופין 6', notes: 'כניסה מהוגו מולר, עלי' },
  { city: 'kiryat_ata', address: 'הוגו מולר 51', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'סוקולוב 63', notes: 'פינת הוגו מולר, תת קרקעי' },
  { city: 'kiryat_ata', address: 'ככר בני ברית 8', notes: 'פינת כצנלסון, עלי' },
  { city: 'kiryat_ata', address: 'עצמאות 49', notes: 'תת קרקעי' },
  { city: 'kiryat_ata', address: 'שיבת ציון 23', notes: 'ביה"ס יהלום, תת קרקעי' },
  { city: 'kiryat_ata', address: 'שיבת ציון 37', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'הותיקים 5', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'בר אילן 8', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'קיבוץ גלויות 4', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'קיבוץ גלויות 5', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'קיבוץ גלויות 9', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'שבזי 19', notes: 'שכונת התמנים, עלי' },
  { city: 'kiryat_ata', address: 'צלאח 15', notes: 'שכונת התמנים, תת קרקעי' },
  { city: 'kiryat_ata', address: 'יחיא צלאח 15', notes: 'ביה"ס נועם, עלי' },
  { city: 'kiryat_ata', address: 'ק. שטנד 24', notes: 'עלי' },
  { city: 'kiryat_ata', address: 'שכונת בן יוסף 12', notes: 'ק. נחום, עלי' },
  { city: 'kiryat_ata', address: 'אלבז 1', notes: 'תת קרקעי' },

  // ── קרית ביאליק (21) ──────────────────────────────────────
  { city: 'kiryat_bialik', address: 'הגליל 26', notes: '' },
  { city: 'kiryat_bialik', address: 'כרמל 1', notes: 'סמטת כרמל/חרמון' },
  { city: 'kiryat_bialik', address: 'ההגנה 12', notes: '' },
  { city: 'kiryat_bialik', address: 'חרמון 1', notes: '' },
  { city: 'kiryat_bialik', address: 'תבור 7', notes: '' },
  { city: 'kiryat_bialik', address: 'ציפורי 18', notes: '' },
  { city: 'kiryat_bialik', address: 'קישון 14', notes: '' },
  { city: 'kiryat_bialik', address: 'קק"ל 75', notes: '' },
  { city: 'kiryat_bialik', address: 'אפרים 28', notes: '' },
  { city: 'kiryat_bialik', address: 'הפלמח 4', notes: 'גן מרים' },
  { city: 'kiryat_bialik', address: 'העצמאות 15', notes: '' },
  { city: 'kiryat_bialik', address: 'הפלמ"ח 51', notes: '' },
  { city: 'kiryat_bialik', address: 'אשר 2', notes: 'סמטת אשר' },
  { city: 'kiryat_bialik', address: 'דרור 2', notes: 'שכונת אפק' },
  { city: 'kiryat_bialik', address: 'הכלניות 4', notes: 'סמטת הכלניות' },
  { city: 'kiryat_bialik', address: 'סיגליות 7', notes: '' },
  { city: 'kiryat_bialik', address: 'חנה סנש 33', notes: 'גן אלי כהן' },
  { city: 'kiryat_bialik', address: 'העליה 3', notes: '' },
  { city: 'kiryat_bialik', address: 'נרקיסים 29', notes: '' },
  { city: 'kiryat_bialik', address: 'השקדים 4', notes: 'א.ש.ק' },
  { city: 'kiryat_bialik', address: 'דפנה 43', notes: 'קונסרבטוריון' },
];

function dedup(shelters) {
  const seen = new Set();
  return shelters.filter(s => {
    const key = `${s.city}::${s.address}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms));
}

async function geocode(address, cityId) {
  const cityHe = CITY_NAMES_HE[cityId];
  const query = `${address}, ${cityHe}, ישראל`;
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=il&limit=1`;
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RunningInWar/1.0 (shelter import script; contact: yuvaly1.amar@gmail.com)' }
    });
    const data = await res.json();
    if (data.length > 0) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch (e) {
    console.error(`Geocode error for "${address}": ${e.message}`);
  }
  return null;
}

async function importShelters() {
  const shelters = dedup(rawShelters);
  console.log(`Total shelters after dedup: ${shelters.length}`);
  console.log('Geocoding via Nominatim (1.1s delay between requests)...\n');

  const withCoords = [];
  const failed = [];

  for (let i = 0; i < shelters.length; i++) {
    const s = shelters[i];
    const coords = await geocode(s.address, s.city);
    if (coords) {
      withCoords.push({ ...s, lat: coords.lat, lng: coords.lng });
      process.stdout.write(`\r[${i + 1}/${shelters.length}] ✓ ${s.city} — ${s.address.substring(0, 35).padEnd(35)}`);
    } else {
      failed.push(s);
      console.log(`\n[${i + 1}/${shelters.length}] ✗ FAILED: ${s.address} (${s.city})`);
    }
    if (i < shelters.length - 1) await sleep(1100);
  }

  console.log(`\n\nGeocoded: ${withCoords.length} / ${shelters.length}`);
  if (failed.length > 0) {
    console.log(`Failed geocoding (${failed.length}):`);
    failed.forEach(s => console.log(`  - ${s.city}: ${s.address}`));
  }

  if (withCoords.length === 0) {
    console.log('Nothing to import. Exiting.');
    return;
  }

  // Upload in batches (Firestore limit: 500 per batch)
  const col = db.collection('city_shelters');
  const BATCH_SIZE = 400;
  for (let i = 0; i < withCoords.length; i += BATCH_SIZE) {
    const batch = db.batch();
    const chunk = withCoords.slice(i, i + BATCH_SIZE);
    chunk.forEach(shelter => batch.set(col.doc(), shelter));
    await batch.commit();
    console.log(`Uploaded batch ${Math.floor(i / BATCH_SIZE) + 1}: ${chunk.length} docs`);
  }

  console.log(`\nDone! Imported ${withCoords.length} shelters to Firestore.`);
}

importShelters().catch(console.error);
