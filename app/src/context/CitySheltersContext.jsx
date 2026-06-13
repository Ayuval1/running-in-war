import { createContext, useContext, useState } from 'react'
import { useCityShelters } from '../hooks/useCityShelters'

const CitySheltersContext = createContext()

export function CitySheltersProvider({ children }) {
  const [activeCities, setActiveCities] = useState([])
  const { shelters: cityShelterList } = useCityShelters(activeCities)

  function toggleCity(id) {
    setActiveCities(prev =>
      prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
    )
  }

  return (
    <CitySheltersContext.Provider value={{ activeCities, toggleCity, cityShelterList }}>
      {children}
    </CitySheltersContext.Provider>
  )
}

export function useCitySheltersContext() {
  return useContext(CitySheltersContext)
}
