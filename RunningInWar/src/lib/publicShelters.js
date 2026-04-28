/**
 * Public shelter data sources for Israeli cities.
 *
 * Two types:
 * - 'api': data.gov.il CKAN datastore — returns map markers directly
 * - 'website': municipality page — opens in a new browser tab
 */

const CITY_RESOURCES = {
  'באר שבע':     { type: 'api', id: '23650a0e-43eb-4937-b3c4-7d161779e30f', latField: 'lat', lngField: 'lon' },
  'מעלה אדומים': { type: 'api', id: 'd35945fa-eb3c-4802-a956-73b6273017f6', latField: 'lat', lngField: 'lon' },
  'קרית ביאליק': { type: 'website', url: 'https://qbialik.org.il/%D7%97%D7%99%D7%A8%D7%95%D7%9D/%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%A7%D7%9C%D7%98%D7%99%D7%9D-%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%99%D7%9D-2/' },
  'פתח תקווה':   { type: 'website', url: 'https://www.petah-tikva.muni.il/city-and-municipality/emergency/receivers' },
  'רמת השרון':   { type: 'website', url: 'https://ramat-hasharon.muni.il/%D7%A8%D7%A9%D7%99%D7%9E%D7%AA-%D7%9E%D7%A7%D7%9C%D7%98%D7%99%D7%9D-%D7%A6%D7%99%D7%91%D7%95%D7%A8%D7%99%D7%99%D7%9D-%D7%A4%D7%AA%D7%95%D7%97%D7%99%D7%9D/' },
  'חיפה':        { type: 'website', url: 'https://www.haifa.muni.il/residents/emergency/' },
  'אשקלון':      { type: 'website', url: 'https://www.govmap.gov.il/?lay=218045' },
}

export const API_CITIES     = Object.entries(CITY_RESOURCES).filter(([, v]) => v.type === 'api').map(([k]) => k)
export const WEBSITE_CITIES = Object.entries(CITY_RESOURCES).filter(([, v]) => v.type === 'website').map(([k]) => k)
export const SUPPORTED_CITIES = Object.keys(CITY_RESOURCES)

export function getCityWebsiteUrl(city) {
  return CITY_RESOURCES[city]?.url ?? null
}

function normalizeRecord(rec, latField, lngField) {
  const lat = parseFloat(
    rec[latField] ?? rec.lat ?? rec.latitude ?? rec.Y ?? rec.y ?? rec.LATITUDE
  )
  const lng = parseFloat(
    rec[lngField] ?? rec.lon ?? rec.long ?? rec.longitude ?? rec.X ?? rec.x ?? rec.LONGITUDE
  )
  if (isNaN(lat) || isNaN(lng)) return null
  if (lat < 29 || lat > 34 || lng < 34 || lng > 36) return null

  const name =
    rec.name || rec.shem || rec.shelter_name || rec.NAME || rec['שם'] || `מקלט ${rec._id}`

  return { id: `pub_${rec._id}`, lat, lng, name: String(name) }
}

/**
 * Fetch public shelters for a city from data.gov.il.
 * Only works for cities with type: 'api'. For 'website' cities use getCityWebsiteUrl().
 * @returns {Promise<Array<{id, lat, lng, name}>>}
 */
export async function fetchPublicShelters(city) {
  const config = CITY_RESOURCES[city]
  if (!config) throw new Error(`אין נתונים זמינים עבור: ${city}`)
  if (config.type !== 'api') throw new Error(`WEBSITE_CITY`)

  const url = `https://data.gov.il/api/3/action/datastore_search?resource_id=${config.id}&limit=2000`

  let res
  try {
    res = await fetch(url)
  } catch {
    throw new Error('לא ניתן להתחבר ל-data.gov.il. בדוק את חיבור האינטרנט.')
  }

  if (!res.ok) throw new Error(`שגיאת שרת (${res.status})`)

  const json = await res.json()
  if (!json.success) throw new Error('שגיאה בטעינת הנתונים מ-data.gov.il')

  const records = json.result?.records ?? []
  return records.map(r => normalizeRecord(r, config.latField, config.lngField)).filter(Boolean)
}
