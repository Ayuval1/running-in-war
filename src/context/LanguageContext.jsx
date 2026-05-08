import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react'
import { translations } from '../i18n/translations'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('lang') || 'he')

  useEffect(() => {
    localStorage.setItem('lang', lang)
    document.documentElement.lang = lang
    document.documentElement.dir  = lang === 'he' ? 'rtl' : 'ltr'
  }, [lang])

  const toggleLang = useCallback(() => {
    setLang(l => l === 'he' ? 'en' : 'he')
  }, [])

  const t = useCallback((key) => {
    return translations[lang]?.[key] ?? translations['he'][key] ?? key
  }, [lang])

  const value = useMemo(() => ({ lang, toggleLang, t }), [lang, toggleLang, t])

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLang() {
  const ctx = useContext(LanguageContext)
  if (!ctx) {
    // Fallback — LanguageProvider not in tree yet (e.g. stale SW cache)
    const he = translations['he']
    return { lang: 'he', toggleLang: () => {}, t: (k) => he[k] ?? k }
  }
  return ctx
}
