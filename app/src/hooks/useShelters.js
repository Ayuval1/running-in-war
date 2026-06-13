import { useEffect, useState } from 'react'
import { subscribeShelters } from '../firebase/firestore'
import { cacheShelters, getCachedShelters } from '../lib/indexedDB'
import { useAuth } from '../context/AuthContext'

export function useShelters() {
  const { user } = useAuth()
  const [shelters, setShelters] = useState([])
  const [offline, setOffline]   = useState(false)

  useEffect(() => {
    if (!user) { setShelters([]); return }

    getCachedShelters().then(cached => {
      if (cached.length) setShelters(cached)
    })

    const unsub = subscribeShelters(user.uid, (data) => {
      setShelters(data)
      cacheShelters(data)
      setOffline(false)
    })

    const goOffline = () => setOffline(true)
    window.addEventListener('offline', goOffline)

    return () => {
      unsub()
      window.removeEventListener('offline', goOffline)
    }
  }, [user])

  return { shelters, offline }
}
