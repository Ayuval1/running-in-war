import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const CITY_BBOX = {
  kiryat_bialik:  { minLat: 32.810, maxLat: 32.858, minLng: 35.058, maxLng: 35.118 },
  kiryat_yam:     { minLat: 32.810, maxLat: 32.865, minLng: 35.040, maxLng: 35.092 },
  kiryat_motzkin: { minLat: 32.818, maxLat: 32.868, minLng: 35.062, maxLng: 35.118 },
  kiryat_haim:    { minLat: 32.786, maxLat: 32.848, minLng: 35.040, maxLng: 35.092 },
  kiryat_ata:     { minLat: 32.778, maxLat: 32.852, minLng: 35.072, maxLng: 35.142 },
}

function inBbox(lat, lng, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat &&
         lng >= bbox.minLng && lng <= bbox.maxLng
}

async function diagnose() {
  console.log('Fetching all city_shelters from Firestore...')
  const snap = await db.collection('city_shelters').get()
  const all = snap.docs.map(d => ({ id: d.id, ...d.data() }))

  console.log(`\nTotal records: ${all.length}\n`)

  const byCity = {}
  const flagged = []
  const noCoords = []

  for (const s of all) {
    if (!s.lat || !s.lng) {
      noCoords.push(s)
      continue
    }
    const bbox = CITY_BBOX[s.city]
    if (!bbox) {
      console.warn(`Unknown city: ${s.city}`)
      continue
    }
    if (!inBbox(s.lat, s.lng, bbox)) {
      flagged.push(s)
      byCity[s.city] = (byCity[s.city] || 0) + 1
    }
  }

  console.log('=== FLAGGED (coordinates outside city bbox) ===')
  if (flagged.length === 0) {
    console.log('None! All coordinates look correct.\n')
  } else {
    console.log(`Total flagged: ${flagged.length}\n`)
    for (const [city, count] of Object.entries(byCity)) {
      console.log(`  ${city}: ${count} records`)
    }
    console.log('\nDetailed list:')
    for (const s of flagged) {
      const bbox = CITY_BBOX[s.city]
      console.log(`\n  [${s.city}]`)
      console.log(`    address: ${s.address}`)
      console.log(`    current coords: lat=${s.lat}, lng=${s.lng}`)
      console.log(`    expected bbox:  lat ${bbox.minLat}–${bbox.maxLat}, lng ${bbox.minLng}–${bbox.maxLng}`)
      console.log(`    doc id: ${s.id}`)
    }
  }

  if (noCoords.length > 0) {
    console.log(`\n=== NO COORDS (${noCoords.length} records) ===`)
    noCoords.forEach(s => console.log(`  [${s.city}] ${s.address} (id: ${s.id})`))
  }

  console.log('\n=== SUMMARY ===')
  console.log(`  Total: ${all.length}`)
  console.log(`  Flagged (wrong location): ${flagged.length}`)
  console.log(`  No coords: ${noCoords.length}`)
  console.log(`  Looks OK: ${all.length - flagged.length - noCoords.length}`)
}

diagnose().catch(console.error)
