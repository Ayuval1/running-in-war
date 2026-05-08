import { useState } from 'react'
import { useAuth }     from '../context/AuthContext'
import { useShelters } from '../hooks/useShelters'
import { createShareLink } from '../firebase/firestore'
import { SHELTER_TYPES } from '../constants/shelterTypes'
import { geoPointToLatLng } from '../lib/geo'
import BottomNav from '../components/ui/BottomNav'

export default function SharingPage() {
  const { user }     = useAuth()
  const { shelters } = useShelters()

  const [selected, setSelected]   = useState([])
  const [shareUrl, setShareUrl]   = useState('')
  const [creating, setCreating]   = useState(false)
  const [copied, setCopied]       = useState(false)

  function toggleSelect(id) {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  function selectAll() {
    setSelected(shelters.map(s => s.id))
  }

  async function handleCreate() {
    if (!user || !selected.length) return
    setCreating(true)
    try {
      const shareId = await createShareLink(user.uid, user.displayName, selected)
      const url = `${window.location.origin}/share/${shareId}`
      setShareUrl(url)
    } finally {
      setCreating(false)
    }
  }

  async function handleCopy() {
    await navigator.clipboard.writeText(shareUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleNativeShare() {
    if (navigator.share) {
      navigator.share({ title: 'מקלטים שלי — ריצה בזמן מלחמה', url: shareUrl })
    }
  }

  const myOwnShelters = shelters.filter(s => !s.isImported)

  return (
    <div className="fixed inset-0 bg-brand-bg flex flex-col">
      <div className="flex-1 overflow-y-auto px-4 pt-safe pt-4 pb-24">
        <h1 className="text-2xl font-black mb-1">🔗 שיתוף מקלטים</h1>
        <p className="text-brand-dim text-sm mb-6">
          שלח את המקלטים שלך לחברים — הם יתווספו למפה שלהם אוטומטית
        </p>

        {/* Shelter list */}
        {myOwnShelters.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-brand-dim">עדיין לא הוספת מקלטים.</p>
            <p className="text-brand-dim text-sm">עבור למפה והוסף מקלטים קודם.</p>
          </div>
        ) : (
          <>
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm text-brand-dim">{selected.length} נבחרו</span>
              <button onClick={selectAll} className="text-sm text-brand-neon font-semibold">
                בחר הכל
              </button>
            </div>

            <div className="flex flex-col gap-2 mb-6">
              {myOwnShelters.map(s => {
                const type = SHELTER_TYPES[s.type] || SHELTER_TYPES.building
                const pos  = geoPointToLatLng(s.location)
                const isOn = selected.includes(s.id)
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSelect(s.id)}
                    className={`flex items-center gap-3 p-3 rounded-xl border-2 text-right transition-all ${
                      isOn ? 'border-brand-neon bg-brand-neon/5' : 'border-white/10 bg-brand-card'
                    }`}
                  >
                    <div
                      className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                      style={{ background: type.color + '33' }}
                    >
                      {type.emoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-sm truncate">
                        {s.name || type.label}
                      </p>
                      {s.address && (
                        <p className="text-xs text-brand-dim truncate">{s.address}</p>
                      )}
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                      isOn ? 'bg-brand-neon border-brand-neon' : 'border-white/20'
                    }`}>
                      {isOn && <span className="text-brand-bg text-xs font-black">✓</span>}
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Create button */}
            {!shareUrl && (
              <button
                onClick={handleCreate}
                disabled={!selected.length || creating}
                className="w-full bg-brand-neon text-brand-bg font-bold py-3 rounded-xl disabled:opacity-40 active:scale-95 transition-transform mb-4"
              >
                {creating ? 'יוצר קישור...' : `✨ צור קישור (${selected.length} מקלטים)`}
              </button>
            )}

            {/* Share result */}
            {shareUrl && (
              <div className="bg-brand-card border border-brand-neon/30 rounded-2xl p-4">
                <p className="text-brand-neon font-bold mb-2">✅ הקישור מוכן!</p>
                <p className="text-xs text-brand-dim break-all mb-4">{shareUrl}</p>
                <div className="flex gap-2">
                  <button
                    onClick={handleCopy}
                    className="flex-1 bg-brand-card border border-white/20 py-2.5 rounded-xl text-sm font-semibold"
                  >
                    {copied ? '✅ הועתק!' : '📋 העתק'}
                  </button>
                  {navigator.share && (
                    <button
                      onClick={handleNativeShare}
                      className="flex-1 bg-brand-neon text-brand-bg py-2.5 rounded-xl text-sm font-bold"
                    >
                      📤 שתף
                    </button>
                  )}
                </div>
                <button
                  onClick={() => { setShareUrl(''); setSelected([]) }}
                  className="w-full mt-2 text-xs text-brand-dim py-2"
                >
                  צור קישור חדש
                </button>
              </div>
            )}
          </>
        )}
      </div>
      <BottomNav />
    </div>
  )
}
