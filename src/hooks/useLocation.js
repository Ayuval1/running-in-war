import { useEffect, useState } from 'react'

export function useLocation() {
  const [position, setPosition] = useState(null)
  const [error, setError]       = useState(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setError('הדפדפן לא תומך ב-GPS')
      return
    }

    const id = navigator.geolocation.watchPosition(
      (pos) => {
        setPosition({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        setError(null)
      },
      (err) => {
        setError('לא ניתן לקבל מיקום: ' + err.message)
        // Fall back to Tel Aviv center so the map still loads
        setPosition({ lat: 32.0853, lng: 34.7818 })
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )

    return () => navigator.geolocation.clearWatch(id)
  }, [])

  return { position, error }
}
