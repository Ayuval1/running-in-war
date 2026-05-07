// Bounding boxes: [south, west, north, east] in WGS84
export const KRAYOT_CITIES = [
  { name: 'קרית ביאליק', bbox: [32.820, 35.070, 32.870, 35.120] },
  { name: 'קרית מוצקין', bbox: [32.830, 35.055, 32.870, 35.100] },
  { name: 'קרית חיים',   bbox: [32.815, 35.040, 32.860, 35.080] },
  { name: 'קרית ים',     bbox: [32.835, 35.065, 32.875, 35.110] },
]

// In-memory cache: cityName → shelter array
const _cache = {}

/**
 * Fetch public shelters for a Krayot city from Overpass (OpenStreetMap).
 * Returns array of { id, lat, lng, name, type, isPublic }.
 */
export async function fetchKrayotShelters(cityName) {
  if (_cache[cityName]) return _cache[cityName]

  const city = KRAYOT_CITIES.find(c => c.name === cityName)
  if (!city) throw new Error(`עיר לא מוכרת: ${cityName}`)

  const [south, west, north, east] = city.bbox
  const bbox = `${south},${west},${north},${east}`

  const query = `[out:json][timeout:25];(node["amenity"="shelter"](${bbox});node["emergency"="shelter"](${bbox}););out body;`
  const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`

  let res
  try {
    res = await fetch(url)
  } catch {
    throw new Error('לא ניתן להתחבר ל-Overpass. בדוק חיבור אינטרנט.')
  }
  if (!res.ok) throw new Error(`שגיאת שרת Overpass (${res.status})`)

  const json = await res.json()
  const shelters = (json.elements ?? [])
    .filter(el => el.lat && el.lon)
    .map(el => ({
      id:       `osm_${el.id}`,
      lat:      el.lat,
      lng:      el.lon,
      name:     el.tags?.name || el.tags?.['name:he'] || `מקלט ציבורי`,
      type:     'municipal',
      isPublic: true,
      osmId:    el.id,
    }))

  _cache[cityName] = shelters
  return shelters
}
