import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

// Distinct purple marker so users can tell it apart from personal shelters
const PUBLIC_ICON = L.divIcon({
  className: '',
  iconSize:    [34, 34],
  iconAnchor:  [17, 34],
  popupAnchor: [0, -34],
  html: `
    <div style="
      width:34px;height:34px;
      border-radius:50% 50% 50% 0;
      transform:rotate(-45deg);
      background:#A855F7;
      border:2px solid rgba(255,255,255,0.45);
      box-shadow:0 2px 10px rgba(0,0,0,0.5);
      display:flex;align-items:center;justify-content:center;
    ">
      <span style="transform:rotate(45deg);font-size:15px;line-height:1">🏛️</span>
    </div>
  `,
})

export default function PublicShelterMarker({ shelter }) {
  return (
    <Marker position={[shelter.lat, shelter.lng]} icon={PUBLIC_ICON}>
      <Popup>
        <div dir="rtl" style={{
          minWidth: 160,
          background: '#0F2035',
          color: '#E6F4F0',
          borderRadius: 12,
          padding: '10px 12px',
          fontFamily: 'Rubik, sans-serif',
        }}>
          <div style={{
            fontSize: 11,
            fontWeight: 700,
            padding: '2px 8px',
            borderRadius: 99,
            background: 'rgba(168,85,247,0.15)',
            color: '#A855F7',
            border: '1px solid rgba(168,85,247,0.4)',
            display: 'inline-block',
            marginBottom: 6,
          }}>
            מקלט ציבורי
          </div>
          <p style={{ fontWeight: 700, fontSize: 13, margin: 0 }}>{shelter.name}</p>
          <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)', margin: '4px 0 0' }}>
            מקור: data.gov.il
          </p>
        </div>
      </Popup>
    </Marker>
  )
}
