/** Fetch active alerts from Pikud HaOref */
export async function fetchActiveAlerts() {
  try {
    const res = await fetch('/oref/WarningMessages/alert/alerts.json', {
      headers: { referer: 'https://www.oref.org.il/' },
      cache: 'no-store',
    })
    if (!res.ok) return null
    const text = await res.text()
    if (!text.trim()) return null
    return JSON.parse(text)
  } catch {
    return null
  }
}

/** Fetch warning times by city */
export async function fetchCityWarningTime(cityName) {
  try {
    const res = await fetch(
      `/oref/Shared/Ajax/GetCities.aspx?lang=he`,
      { headers: { referer: 'https://www.oref.org.il/' } }
    )
    if (!res.ok) return null
    const cities = await res.json()
    const match = cities.find(
      c => c.label === cityName || c.value === cityName
    )
    return match?.migun_time ?? null
  } catch {
    return null
  }
}
