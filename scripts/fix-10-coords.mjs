/**
 * Fixes the 10 mis-geocoded city shelter records found by diagnose-coords.mjs.
 * Run without args for dry-run (no Firestore writes).
 * Run with --write to apply corrections.
 */
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const WRITE = process.argv.includes('--write');

// Per-city bounding boxes (slightly wider to catch edge cases)
const CITY_BBOX = {
  kiryat_bialik:  { minLat: 32.810, maxLat: 32.858, minLng: 35.058, maxLng: 35.118 },
  kiryat_yam:     { minLat: 32.810, maxLat: 32.865, minLng: 35.040, maxLng: 35.092 },
  kiryat_motzkin: { minLat: 32.818, maxLat: 32.868, minLng: 35.062, maxLng: 35.118 },
  kiryat_haim:    { minLat: 32.786, maxLat: 32.848, minLng: 35.040, maxLng: 35.092 },
  kiryat_ata:     { minLat: 32.778, maxLat: 32.852, minLng: 35.072, maxLng: 35.142 },
}

const CITY_NAMES_HE = {
  kiryat_bialik:  'קרית ביאליק',
  kiryat_yam:     'קרית ים',
  kiryat_motzkin: 'קרית מוצקין',
  kiryat_haim:    'קרית חיים',
  kiryat_ata:     'קרית אתא',
}

const CITY_NAMES_EN = {
  kiryat_bialik:  'Kiryat Bialik',
  kiryat_yam:     'Kiryat Yam',
  kiryat_motzkin: 'Kiryat Motzkin',
  kiryat_haim:    'Kiryat Haim',
  kiryat_ata:     'Kiryat Ata',
}

// The 10 flagged records from diagnose-coords.mjs
const FLAGGED = [
  { id: 'B9pfs8YBHZLVcLErzsV1', city: 'kiryat_ata',     address: 'ויצמן 1',          notes: 'עלי' },
  { id: 'GCN10K2xtM43Grw0L0S2', city: 'kiryat_ata',     address: 'ויצמן 24',         notes: 'עלי' },
  { id: 'tRYfgGuHAvKWuABdh0xY', city: 'kiryat_ata',     address: 'ויצמן 2',          notes: 'עלי' },
  { id: 'pI3cz5uZpg3uqQJpUkCG', city: 'kiryat_motzkin', address: 'נתיב העלייה 9',   notes: 'בית כנסת' },
  { id: 'M782V2JwPWXG2m8jnhnG', city: 'kiryat_haim',    address: 'ארזים 62',         notes: 'בפארק הצירי, מונגש' },
  { id: 'aRyJ8BUeoTrsoYHOMvxn', city: 'kiryat_yam',     address: 'ההסתדרות 6',       notes: '' },
  { id: 'HZmlqF6Aaz2PidEktp93', city: 'kiryat_bialik',  address: 'העליה 3',          notes: '' },
  { id: 'OGGNYjp4tlkggxQuybQE', city: 'kiryat_bialik',  address: 'חרמון 1',          notes: '' },
  { id: 'j28fhfo5DgX1A68ujyvJ', city: 'kiryat_bialik',  address: 'כרמל 1',           notes: 'סמטת כרמל/חרמון' },
  { id: 'X1gIAwBAZPJRpi2ZgwWm', city: 'kiryat_motzkin', address: 'דבורה 30',         notes: '' },
]

function toViewbox(bbox) {
  return `${bbox.minLng},${bbox.minLat},${bbox.maxLng},${bbox.maxLat}`
}

function inBbox(lat, lng, bbox) {
  return lat >= bbox.minLat && lat <= bbox.maxLat &&
         lng >= bbox.minLng && lng <= bbox.maxLng
}

function sleep(ms) { return new Promise(r => setTimeout(r, ms)) }

async function nominatim(query, viewbox, bounded) {
  const boundedParam = bounded ? '&bounded=1' : ''
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&countrycodes=il&limit=5&viewbox=${viewbox}${boundedParam}&accept-language=he`
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'RunningInWar/1.0 (fix-coords; contact: yuvaly1.amar@gmail.com)' }
    })
    return await res.json()
  } catch {
    return []
  }
}

async function geocode(address, cityId) {
  const bbox = CITY_BBOX[cityId]
  const cityHe = CITY_NAMES_HE[cityId]
  const cityEn = CITY_NAMES_EN[cityId]
  const viewbox = toViewbox(bbox)

  const strategies = [
    { q: `${address}, ${cityHe}, ישראל`, bounded: true },
    { q: `${address}, ${cityHe}`,         bounded: true },
    { q: `${address}, ${cityEn}, Israel`, bounded: true },
    { q: `${address}, ${cityHe}, ישראל`, bounded: false },
    { q: `${address}, ${cityEn}, Israel`, bounded: false },
  ]

  for (const { q, bounded } of strategies) {
    const results = await nominatim(q, viewbox, bounded)
    await sleep(1100)
    for (const r of results) {
      const lat = parseFloat(r.lat)
      const lng = parseFloat(r.lon)
      if (inBbox(lat, lng, bbox)) {
        return { lat, lng, display_name: r.display_name, strategy: q }
      }
    }
  }
  return null
}

async function run() {
  console.log(`Mode: ${WRITE ? '✍️  WRITE (will update Firestore)' : '🔍 DRY-RUN (no writes)'}\n`)

  // Fetch current coords for each flagged record
  const docs = await Promise.all(
    FLAGGED.map(async f => {
      const snap = await db.collection('city_shelters').doc(f.id).get()
      return { ...f, current: snap.data() }
    })
  )

  const results = []

  for (let i = 0; i < docs.length; i++) {
    const s = docs[i]
    console.log(`[${i + 1}/${docs.length}] ${s.city} — ${s.address}`)
    console.log(`  current: lat=${s.current.lat}, lng=${s.current.lng}`)

    const found = await geocode(s.address, s.city)

    if (found) {
      const changed = found.lat !== s.current.lat || found.lng !== s.current.lng
      console.log(`  ✓ new:   lat=${found.lat}, lng=${found.lng}`)
      console.log(`    via: "${found.strategy}"`)
      console.log(`    display: ${found.display_name.substring(0, 80)}`)
      if (!changed) console.log(`    ⚠️  same as current — no change`)
      results.push({ ...s, new: found, changed })
    } else {
      console.log(`  ✗ NOT FOUND — needs manual fix`)
      results.push({ ...s, new: null, changed: false })
    }
    console.log()
  }

  // Summary
  const toWrite = results.filter(r => r.new && r.changed)
  const same    = results.filter(r => r.new && !r.changed)
  const failed  = results.filter(r => !r.new)

  console.log('=== SUMMARY ===')
  console.log(`  Will fix:       ${toWrite.length}`)
  console.log(`  Already OK:     ${same.length}`)
  console.log(`  Needs manual:   ${failed.length}`)

  if (failed.length > 0) {
    console.log('\n  Manual fix list:')
    failed.forEach(s => {
      console.log(`    [${s.city}] ${s.address} (doc: ${s.id})`)
    })
  }

  if (!WRITE) {
    console.log('\nRun with --write to apply fixes.')
    return
  }

  if (toWrite.length === 0) {
    console.log('\nNothing to write.')
    return
  }

  console.log('\nWriting to Firestore...')
  for (const s of toWrite) {
    await db.collection('city_shelters').doc(s.id).update({
      lat: s.new.lat,
      lng: s.new.lng,
      verified: true,
    })
    console.log(`  ✓ updated ${s.city} — ${s.address}`)
  }
  console.log(`\nDone. Updated ${toWrite.length} records.`)
}

run().catch(console.error)
