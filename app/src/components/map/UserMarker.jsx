import { memo } from 'react'
import { Marker } from 'react-leaflet'
import L from 'leaflet'

const userIcon = L.divIcon({
  className: '',
  iconSize:  [20, 20],
  iconAnchor:[10, 10],
  html: `
    <div style="position:relative;width:20px;height:20px">
      <div style="
        position:absolute;inset:-6px;
        border-radius:50%;
        background:rgba(30,144,255,0.25);
        animation:user-pulse 2s ease-out infinite;
      "></div>
      <div style="
        width:20px;height:20px;border-radius:50%;
        background:#1E90FF;
        border:3px solid white;
        box-shadow:0 0 10px rgba(30,144,255,0.6);
      "></div>
    </div>
    <style>
      @keyframes user-pulse {
        0%   { transform:scale(1);   opacity:0.7 }
        50%  { transform:scale(1.6); opacity:0.3 }
        100% { transform:scale(2);   opacity:0 }
      }
    </style>
  `,
})

export default memo(function UserMarker({ position }) {
  if (!position) return null
  return <Marker position={[position.lat, position.lng]} icon={userIcon} />
})
