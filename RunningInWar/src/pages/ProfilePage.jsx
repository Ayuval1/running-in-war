import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { User, MapPin, LocateFixed, Loader2, CheckCircle2, Share2, LogOut, ChevronRight, Languages, Smartphone } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { useLang } from '../context/LanguageContext'
import { logOut } from '../firebase/auth'
import { saveHomeLocation } from '../firebase/firestore'
import { useInstallPrompt } from '../hooks/useInstallPrompt'
import { useAddressAutocomplete, buildAddressLabel } from '../hooks/useAddressAutocomplete'
import BottomNav from '../components/ui/BottomNav'

export default function ProfilePage() {
  const { user }          = useAuth()
  const { lang, toggleLang } = useLang()
  const navigate              = useNavigate()

  const [address, setAddress]     = useState('')
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [savedName, setSavedName] = useState('')
  const [gpsLoading, setGpsLoading] = useState(false)

  const { suggestions, loading: loadingSug } = useAddressAutocomplete(address, { enabled: !saved })
  const { canInstall, install, isStandalone } = useInstallPrompt()

  async function handlePickSuggestion(item) {
    setAddress(item.display_name)
    setSaving(true)
    try {
      await saveHomeLocation(user.uid, parseFloat(item.lat), parseFloat(item.lon))
      setSavedName(buildAddressLabel(item, address))
      setSaved(true)
      setAddress('')
      setTimeout(() => setSaved(false), 4000)
    } catch {
      alert('שגיאה בשמירה')
    } finally {
      setSaving(false)
    }
  }

  async function handleGPS() {
    if (!navigator.geolocation) { alert('GPS לא זמין במכשיר זה'); return }
    setGpsLoading(true)
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const { latitude: lat, longitude: lng } = pos.coords
          await saveHomeLocation(user.uid, lat, lng)
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`,
            { headers: { 'Accept-Language': 'he' } }
          )
          const data = await res.json()
          setSavedName(data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`)
          setSaved(true)
          setTimeout(() => setSaved(false), 4000)
        } catch {
          alert('שגיאה בשמירת המיקום')
        } finally {
          setGpsLoading(false)
        }
      },
      () => { alert('לא ניתן לקבל מיקום GPS'); setGpsLoading(false) },
      { enableHighAccuracy: true, timeout: 10000 }
    )
  }

  async function handleLogout() {
    await logOut()
    navigate('/auth', { replace: true })
  }

  const initials = user?.displayName?.[0]?.toUpperCase() || null

  return (
    <div className="fixed inset-0 bg-brand-bg flex flex-col" style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}>
      <div className="flex items-center px-4 py-3 border-b border-white/8">
        <User size={20} className="text-brand-neon ml-2" strokeWidth={2} />
        <h1 className="text-xl font-black">פרופיל</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-6 pb-24 flex flex-col gap-4">

        {/* User info */}
        <div className="bg-brand-card border border-white/8 rounded-2xl p-5 flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-brand-neon/15 border-2 border-brand-neon/50 flex items-center justify-center">
            {initials
              ? <span className="text-2xl font-black text-brand-neon">{initials}</span>
              : <User size={24} className="text-brand-neon" strokeWidth={2} />
            }
          </div>
          <div>
            <p className="font-black text-lg">{user?.displayName || 'משתמש'}</p>
            <p className="text-white/40 text-sm">{user?.email}</p>
          </div>
        </div>

        {/* Home location */}
        <div className="bg-brand-card border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <MapPin size={16} className="text-brand-neon" strokeWidth={2} />
            <p className="font-bold text-base">מיקום בית</p>
          </div>
          <p className="text-white/40 text-sm mb-4 pr-6">משמש כנקודת התחלה במסלולים</p>

          {/* GPS button */}
          <button
            onClick={handleGPS}
            disabled={gpsLoading}
            className="w-full bg-brand-neon/10 border border-brand-neon/40 text-brand-neon font-bold py-3 rounded-xl mb-3 flex items-center justify-center gap-2 active:scale-95 transition-transform disabled:opacity-50 cursor-pointer"
          >
            {gpsLoading
              ? <><Loader2 size={16} strokeWidth={2} className="animate-spin" /> מאתר מיקום...</>
              : <><LocateFixed size={16} strokeWidth={2} /> השתמש במיקום הנוכחי (GPS)</>
            }
          </button>

          <div className="flex items-center gap-3 mb-3">
            <div className="flex-1 h-px bg-white/10" />
            <span className="text-white/30 text-xs">או הקלד כתובת</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Address autocomplete */}
          <div className="relative">
            <div className="relative flex gap-2">
              <input
                value={address}
                onChange={e => { setAddress(e.target.value); setSaved(false) }}
                placeholder='לדוגמה: "אפרים 5, תל אביב"'
                className="flex-1 bg-[#0A1628] border border-white/10 rounded-lg px-4 py-3 text-brand-text placeholder:text-white/20 focus:outline-none focus:border-brand-neon transition-colors"
                style={{ fontSize: 16 }}
                autoComplete="off"
              />
              {loadingSug && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                  <Loader2 size={16} className="text-brand-neon animate-spin" strokeWidth={2} />
                </div>
              )}
            </div>

            {/* Suggestions dropdown */}
            {suggestions.length > 0 && (
              <div className="absolute top-full right-0 left-0 z-50 mt-1 bg-brand-card border border-white/10 rounded-xl overflow-hidden shadow-2xl">
                {suggestions.map((item, i) => {
                  const addr = item.address || {}
                  const line1 = [addr.road, addr.house_number].filter(Boolean).join(' ')
                  const line2 = [addr.city || addr.town || addr.village, addr.state].filter(Boolean).join(', ')
                  return (
                    <button
                      key={i}
                      onClick={() => handlePickSuggestion(item)}
                      className="w-full text-right px-4 py-3 flex items-center gap-3 hover:bg-white/5 active:bg-white/10 border-b border-white/5 last:border-0 transition-colors cursor-pointer"
                    >
                      <MapPin size={14} className="text-white/30 flex-shrink-0" strokeWidth={2} />
                      <div className="flex-1 min-w-0">
                        <span className="block font-bold text-sm text-brand-text truncate">{line1 || item.display_name.split(',')[0]}</span>
                        <span className="block text-xs text-white/40 truncate">{line2 || item.display_name}</span>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {saved && (
            <div className="flex items-center gap-2 text-brand-neon text-sm mt-3">
              <CheckCircle2 size={16} strokeWidth={2} />
              <span>מיקום הבית נשמר!</span>
              {savedName && <span className="text-white/40 text-xs truncate">{savedName.split(',').slice(0,2).join(',')}</span>}
            </div>
          )}
        </div>

        {/* Sharing */}
        <div className="bg-brand-card border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Share2 size={16} className="text-brand-neon" strokeWidth={2} />
            <p className="font-bold text-base">שיתוף מקלטים</p>
          </div>
          <p className="text-white/40 text-sm mb-4 pr-6">שתף מקלטים עם חברים ומשפחה</p>
          <button
            onClick={() => navigate('/share')}
            className="w-full flex items-center justify-between bg-white/5 border border-white/10 text-brand-text font-semibold py-3 px-4 rounded-xl hover:border-white/20 active:scale-95 transition-all cursor-pointer"
          >
            <span>פתח שיתוף</span>
            <ChevronRight size={16} className="text-white/40 rotate-180" strokeWidth={2} />
          </button>
        </div>

        {/* Install PWA */}
        {!isStandalone && (canInstall || /iphone|ipad|ipod/i.test(navigator.userAgent)) && (
          <div className="bg-brand-card border border-white/8 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Smartphone size={16} className="text-brand-neon" strokeWidth={2} />
              <p className="font-bold text-base">התקן אפליקציה</p>
            </div>
            <p className="text-white/40 text-sm mb-4 pr-6">הוסף לדף הבית לגישה מהירה ללא דפדפן</p>
            {canInstall ? (
              <button
                onClick={install}
                className="w-full flex items-center justify-center gap-2 bg-green-600/20 border border-green-500/40 text-green-400 font-bold py-3 rounded-xl active:scale-95 transition-all cursor-pointer"
              >
                <Smartphone size={16} strokeWidth={2} />
                התקן עכשיו
              </button>
            ) : (
              <div className="text-white/40 text-sm bg-white/5 rounded-xl p-3 leading-relaxed">
                ב-iOS: לחץ על <strong className="text-white/60">שתף</strong> ← <strong className="text-white/60">הוסף למסך הבית</strong>
              </div>
            )}
          </div>
        )}

        {/* Language toggle */}
        <div className="bg-brand-card border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-1">
            <Languages size={16} className="text-brand-neon" strokeWidth={2} />
            <p className="font-bold text-base">{lang === 'he' ? 'שפה' : 'Language'}</p>
          </div>
          <p className="text-white/40 text-sm mb-4 pr-6">Hebrew / English</p>
          <button
            onClick={toggleLang}
            className="w-full flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-4 py-3 hover:border-white/20 active:scale-95 transition-all cursor-pointer"
          >
            <span className="font-semibold text-brand-text">
              {lang === 'he' ? '🇮🇱 עברית' : '🇺🇸 English'}
            </span>
            <span className="text-xs text-white/40 bg-white/8 px-2.5 py-1 rounded-full font-medium">
              {lang === 'he' ? 'Switch to English' : 'עבור לעברית'}
            </span>
          </button>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-red-900/20 border border-red-500/25 text-red-400 font-bold py-4 rounded-2xl hover:bg-red-900/30 active:scale-95 transition-all cursor-pointer"
        >
          <LogOut size={18} strokeWidth={2} />
          {lang === 'he' ? 'יציאה מהחשבון' : 'Sign Out'}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
