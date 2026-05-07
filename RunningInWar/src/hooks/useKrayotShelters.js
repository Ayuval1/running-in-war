import { useState, useEffect } from 'react'
import { fetchKrayotShelters } from '../lib/krayotShelters'

export function useKrayotShelters(cityName) {
  const [shelters, setShelters] = useState([])
  const [loading, setLoading]   = useState(false)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!cityName) {
      setShelters([])
      setError(null)
      return
    }
    let cancelled = false
    setLoading(true)
    setError(null)
    fetchKrayotShelters(cityName)
      .then(results => { if (!cancelled) setShelters(results) })
      .catch(err    => { if (!cancelled) setError(err.message) })
      .finally(()   => { if (!cancelled) setLoading(false) })
    return () => { cancelled = true }
  }, [cityName])

  return { shelters, loading, error }
}
