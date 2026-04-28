import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { getShareLink, getSheltersByIds, importShelters } from '../firebase/firestore'
import { SHELTER_TYPES } from '../constants/shelterTypes'
import LoadingSpinner from '../components/ui/LoadingSpinner'

export default function SharedImportPage() {
  const { shareId } = useParams()
  const { user }    = useNavigate() && useAuth()
  const navigate    = useNavigate()

  const [link, setLink]         = useState(null)
  const [shelters, setShelters] = useState([])
  const [loading, setLoading]   = useState(true)
  const [importing, setImport]  = useState(false)
  const [done, setDone]         = useState(false)
  const [error, setError]       = useState('')

  useEffect(() => {
    if (!user) {
      navigate(`/auth?redirect=/share/${shareId}`)
      return
    }
    async function load() {
      try {
        const linkData = await getShareLink(shareId)
        if (!linkData) { setError('הקישור לא קיים או פג תוקף'); return }
        const items = await getSheltersByIds(linkData.shelterIds)
        setLink(linkData)
        setShelters(items)
      } catch {
        setError('שגיאה בטעינת הנתונים')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [shareId, user, navigate])

  async function handleImport() {
    if (!user || !link) return
    setImport(true)
    try {
      await importShelters(user.uid, user.displayName, shelters, shareId, link.creatorName)
      setDone(true)
      setTimeout(() => navigate('/map'), 1500)
    } catch {
      setError('שגיאה בייבוא')
    } finally {
      setImport(false)
    }
  }

  if (loading) return <LoadingSpinner text="טוען מקלטים..." />
  if (error)   return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 bg-brand-bg">
      <div className="text-5xl mb-4">❌</div>
      <p className="text-red-400 font-bold mb-4">{error}</p>
      <button onClick={() => navigate('/map')} className="text-brand-neon">← חזור למפה</button>
    </div>
  )

  return (
    <div className="min-h-screen bg-brand-bg px-4 pt-safe pt-6 pb-8">
      {/* Header */}
      <div className="text-center mb-6">
        <div className="text-5xl mb-3">🔗</div>
        <h1 className="text-2xl font-black mb-1">מקלטים משותפים</h1>
        <p className="text-brand-dim text-sm">
          {link?.creatorName} שלח לך {shelters.length} מקלטים
        </p>
      </div>

      {/* Shelter list */}
      <div className="flex flex-col gap-2 mb-6">
        {shelters.map(s => {
          const type = SHELTER_TYPES[s.type] || SHELTER_TYPES.building
          return (
            <div key={s.id} className="flex items-center gap-3 bg-brand-card rounded-xl p-3">
              <div
                className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                style={{ background: type.color + '33' }}
              >
                {type.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-sm">{s.name || type.label}</p>
                {s.address && <p className="text-xs text-brand-dim truncate">{s.address}</p>}
                <p className="text-xs text-brand-dim">{type.label}</p>
              </div>
            </div>
          )
        })}
      </div>

      {done ? (
        <div className="text-center py-6">
          <div className="text-5xl mb-3">✅</div>
          <p className="text-brand-neon font-bold text-lg">המקלטים נוספו למפה!</p>
          <p className="text-brand-dim text-sm">מועבר למפה...</p>
        </div>
      ) : (
        <button
          onClick={handleImport}
          disabled={importing}
          className="w-full bg-brand-neon text-brand-bg font-bold py-4 rounded-2xl text-lg disabled:opacity-50 active:scale-95 transition-transform"
        >
          {importing ? 'מוסיף...' : `➕ הוסף ${shelters.length} מקלטים למפה שלי`}
        </button>
      )}

      <button
        onClick={() => navigate('/map')}
        className="w-full mt-3 text-brand-dim py-3 text-sm"
      >
        ← חזור למפה בלי לייבא
      </button>
    </div>
  )
}
