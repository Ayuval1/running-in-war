import { useEffect, useState, useRef } from 'react'

/**
 * Debounced Nominatim address autocomplete with AbortController.
 * Cancels in-flight requests when query changes or component unmounts.
 */
export function useAddressAutocomplete(query, { enabled = true, delay = 400 } = {}) {
  const [suggestions, setSuggestions] = useState([])
  const [loading, setLoading]         = useState(false)
  const timerRef = useRef(null)

  useEffect(() => {
    if (!enabled || query.length < 2) { setSuggestions([]); return }
    clearTimeout(timerRef.current)
    const ctrl = new AbortController()

    timerRef.current = setTimeout(async () => {
      setLoading(true)
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=6&countrycodes=il&addressdetails=1`,
          { headers: { 'Accept-Language': 'he' }, signal: ctrl.signal }
        )
        setSuggestions(await res.json())
      } catch (e) {
        if (e.name !== 'AbortError') setSuggestions([])
      } finally {
        setLoading(false)
      }
    }, delay)

    return () => { clearTimeout(timerRef.current); ctrl.abort() }
  }, [query, enabled, delay])

  return { suggestions, loading, clear: () => setSuggestions([]) }
}

/** Build a clean address label from a Nominatim result item */
export function buildAddressLabel(item, userQuery = '') {
  const a = item.address || {}
  const city = a.city || a.town || a.village || ''
  const label = a.house_number
    ? [a.road, a.house_number, city].filter(Boolean).join(' ')
    : userQuery.trim() || item.display_name.split(',')[0].trim()
  return label
}
