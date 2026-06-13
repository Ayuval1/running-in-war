/**
 * Applies manually-verified coordinate corrections to 6 mis-geocoded city shelter records.
 * Coordinates sourced from Google Maps.
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const FIXES = [
  { id: 'B9pfs8YBHZLVcLErzsV1', city: 'kiryat_ata',     address: 'ויצמן 1',        lat: 32.8140457, lng: 35.1150417 },
  { id: 'tRYfgGuHAvKWuABdh0xY', city: 'kiryat_ata',     address: 'ויצמן 2',        lat: 32.8139054, lng: 35.1152599 },
  { id: 'GCN10K2xtM43Grw0L0S2', city: 'kiryat_ata',     address: 'ויצמן 24',       lat: 32.8167645, lng: 35.1161899 },
  { id: 'pI3cz5uZpg3uqQJpUkCG', city: 'kiryat_motzkin', address: 'נתיב העלייה 9',  lat: 32.8326226, lng: 35.076712  },
  { id: 'M782V2JwPWXG2m8jnhnG', city: 'kiryat_haim',    address: 'ארזים 62',        lat: 32.8317924, lng: 35.0610431 },
  { id: 'aRyJ8BUeoTrsoYHOMvxn', city: 'kiryat_yam',     address: 'ההסתדרות 6',     lat: 32.8500632, lng: 35.0749927 },
]

async function run() {
  const col = db.collection('city_shelters')
  for (const f of FIXES) {
    await col.doc(f.id).update({ lat: f.lat, lng: f.lng, verified: true })
    console.log(`✓ ${f.city} — ${f.address}  →  ${f.lat}, ${f.lng}`)
  }
  console.log(`\nDone. Updated ${FIXES.length} records.`)
}

run().catch(console.error)
