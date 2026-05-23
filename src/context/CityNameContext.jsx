import { createContext, useContext, useState } from 'react'

const CityNameContext = createContext()

export function CityNameProvider({ children }) {
  const [cityNameMode, setCityNameMode] = useState(
    () => localStorage.getItem('cityNameMode') || 'short'
  )

  function toggle() {
    const next = cityNameMode === 'short' ? 'full' : 'short'
    setCityNameMode(next)
    localStorage.setItem('cityNameMode', next)
  }

  return (
    <CityNameContext.Provider value={{ cityNameMode, toggle }}>
      {children}
    </CityNameContext.Provider>
  )
}

export function useCityName() {
  return useContext(CityNameContext)
}
