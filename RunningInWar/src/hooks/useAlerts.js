import { useEffect, useState, useRef } from 'react'
import { fetchActiveAlerts } from '../lib/pikudHaOref'

export function useAlerts(userCity) {
  const [activeAlert, setActiveAlert] = useState(null)
  const intervalRef = useRef(null)

  useEffect(() => {
    async function check() {
      const data = await fetchActiveAlerts()
      if (!data?.data || !userCity) { setActiveAlert(null); return }
      const cities = data.data
      const hit = cities.some(c =>
        typeof c === 'string'
          ? c === userCity
          : c?.label === userCity || c?.value === userCity
      )
      setActiveAlert(hit ? data : null)
    }

    check()
    intervalRef.current = setInterval(check, 5000)
    return () => clearInterval(intervalRef.current)
  }, [userCity])

  return { activeAlert }
}
