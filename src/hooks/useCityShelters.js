import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useCityShelters(cityId) {
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!cityId) { setShelters([]); return }
    setLoading(true)
    const q = query(collection(db, 'city_shelters'), where('city', '==', cityId))
    getDocs(q)
      .then(snap => setShelters(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(err => console.error('useCityShelters error:', err))
      .finally(() => setLoading(false))
  }, [cityId])

  return { shelters, loading }
}

export async function getCityShelterCounts() {
  const cities = ['kiryat_bialik', 'kiryat_yam', 'kiryat_motzkin', 'kiryat_haim', 'kiryat_ata']
  const counts = {}
  await Promise.all(cities.map(async city => {
    const q = query(collection(db, 'city_shelters'), where('city', '==', city))
    const snap = await getCountFromServer(q)
    counts[city] = snap.data().count
  }))
  return counts
}
