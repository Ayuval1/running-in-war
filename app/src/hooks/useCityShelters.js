import { useState, useEffect } from 'react'
import { collection, query, where, getDocs, getCountFromServer } from 'firebase/firestore'
import { db } from '../firebase/config'

export function useCityShelters(cityIds) {
  const [shelters, setShelters] = useState([])
  const [loading, setLoading] = useState(false)

  const key = JSON.stringify(cityIds)

  useEffect(() => {
    if (!cityIds || cityIds.length === 0) { setShelters([]); return }
    setLoading(true)
    const q = query(collection(db, 'city_shelters'), where('city', 'in', cityIds))
    getDocs(q)
      .then(snap => setShelters(snap.docs.map(d => ({ id: d.id, ...d.data() }))))
      .catch(err => console.error('useCityShelters error:', err))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key])

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
