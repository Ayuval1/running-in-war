import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { MapContainer, TileLayer } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import { Shield, MapPin, Users, ChevronLeft, AlertTriangle } from 'lucide-react'
import { getSharedRoute } from '../firebase/firestore'
import RoutePolyline from '../components/map/RoutePolyline'
import BottomNav from '../components/ui/BottomNav'

export default function SharedRoutePage() {
  const { routeId } = useParams()
  const navigate = useNavigate()
  const [route, setRoute] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    getSharedRoute(routeId)
      .then(r => { if (r) setRoute(r); else setError(true) })
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [routeId])

  const center = route?.waypoints?.[0]
    ? [route.waypoints[0].lat, route.waypoints[0].lng]
    : [31.5, 34.9]

  return (
    <div
      className="fixed inset-0 flex flex-col"
      style={{ background: '#070D18' }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 z-10"
        style={{ borderBottom: '1px solid rgba(26,48,80,0.8)', background: '#0C1929' }}
      >
        <button onClick={() => navigate('/')} style={{ color: '#3D7070' }}>
          <ChevronLeft size={22} strokeWidth={2} />
        </button>
        <Shield size={18} strokeWidth={2} style={{ color: '#00E5A0' }} />
        <span className="font-black text-base" style={{ color: '#E6F4F0' }}>מסלול משותף</span>
      </div>

      {loading && (
        <div className="flex-1 flex items-center justify-center" style={{ color: '#3D7070' }}>
          טוען מסלול...
        </div>
      )}

      {error && (
        <div className="flex-1 flex flex-col items-center justify-center gap-3 px-6 text-center">
          <AlertTriangle size={40} strokeWidth={1.5} style={{ color: '#FF4154' }} />
          <p className="font-bold text-base" style={{ color: '#E6F4F0' }}>המסלול לא נמצא</p>
          <p className="text-sm" style={{ color: '#3D7070' }}>הקישור אולי פג תוקף</p>
        </div>
      )}

      {route && (
        <>
          {/* Route info bar */}
          <div
            className="flex items-center gap-4 px-4 py-3"
            style={{ background: '#0F2035', borderBottom: '1px solid rgba(26,48,80,0.6)' }}
          >
            <div className="flex items-center gap-1.5">
              <Users size={14} strokeWidth={2} style={{ color: '#3D7070' }} />
              <span className="text-sm" style={{ color: '#3D7070' }}>
                מסלול של <span style={{ color: '#E6F4F0', fontWeight: 700 }}>{route.creatorName}</span>
              </span>
            </div>
            <div className="flex items-center gap-1.5 mr-auto font-mono">
              <span className="text-sm font-bold" style={{ color: '#00E5A0' }}>{route.distanceKm}</span>
              <span className="text-xs" style={{ color: '#3D7070' }}>ק"מ</span>
            </div>
            <div className="flex items-center gap-1.5">
              <MapPin size={13} strokeWidth={2} style={{ color: '#3D7070' }} />
              <span className="text-sm font-bold" style={{ color: '#00E5A0' }}>{route.sheltersCovered?.length || 0}</span>
              <span className="text-xs" style={{ color: '#3D7070' }}>מקלטים</span>
            </div>
          </div>

          {/* Map */}
          <div className="flex-1 relative">
            <MapContainer
              center={center}
              zoom={14}
              zoomControl={false}
              style={{ height: '100%', width: '100%' }}
              className="z-0"
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <RoutePolyline waypoints={route.waypoints} />
            </MapContainer>
          </div>
        </>
      )}

      <BottomNav />
    </div>
  )
}
