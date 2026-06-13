import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

// Manually geocoded via Google Maps — all 11 that Nominatim couldn't find
const shelters = [
  { city: 'kiryat_motzkin', address: 'שביל רקפת 7',    notes: 'מועדון לימודי',           lat: 32.8354824, lng: 35.0773502 },
  { city: 'kiryat_haim',    address: 'בן ציון ישראלי 41', notes: 'בפארק הצירי',          lat: 32.833791,  lng: 35.059341  },
  { city: 'kiryat_haim',    address: 'השקד 2',           notes: '',                        lat: 32.8192813, lng: 35.0770058 },
  { city: 'kiryat_haim',    address: 'וורבורג 7',        notes: '',                        lat: 32.8288366, lng: 35.0626059 },
  { city: 'kiryat_ata',     address: 'יבניאלי 25',       notes: 'עלי',                    lat: 32.8099843, lng: 35.1213031 },
  { city: 'kiryat_ata',     address: 'יבניאלי 2',        notes: 'עלי',                    lat: 32.8089005, lng: 35.1207208 },
  { city: 'kiryat_ata',     address: 'יהושע בן נון 5',   notes: 'תת קרקעי',              lat: 32.8113862, lng: 35.1181377 },
  { city: 'kiryat_ata',     address: 'צנחנים 23',        notes: 'עלי',                    lat: 32.8121384, lng: 35.1140773 },
  { city: 'kiryat_ata',     address: 'ככר בני ברית 8',   notes: 'פינת כצנלסון, עלי',     lat: 32.800025,  lng: 35.1056558 },
  { city: 'kiryat_ata',     address: 'יחיא צלאח 15',    notes: 'ביה"ס נועם, עלי',       lat: 32.7875392, lng: 35.0861978 },
  { city: 'kiryat_bialik',  address: 'הכלניות 4',        notes: 'סמטת הכלניות',          lat: 32.8501438, lng: 35.0963204 },
];

async function upload() {
  const col = db.collection('city_shelters');
  const batch = db.batch();
  shelters.forEach(s => batch.set(col.doc(), s));
  await batch.commit();
  console.log(`Uploaded ${shelters.length} manually-geocoded shelters.`);
}

upload().catch(console.error);
