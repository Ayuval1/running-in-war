import { Polyline, CircleMarker } from 'react-leaflet'

export default function RoutePolyline({ waypoints }) {
  if (!waypoints?.length) return null
  const positions = waypoints.map(p => [p.lat, p.lng])

  return (
    <>
      {/* Shadow line */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#000', weight: 6, opacity: 0.3 }}
      />
      {/* Main line */}
      <Polyline
        positions={positions}
        pathOptions={{ color: '#2EC4B6', weight: 4, opacity: 0.9, dashArray: '8,4' }}
      />
      {/* Start dot */}
      <CircleMarker
        center={positions[0]}
        radius={7}
        pathOptions={{ fillColor: '#2EC4B6', color: '#fff', weight: 2, fillOpacity: 1 }}
      />
      {/* End dot */}
      <CircleMarker
        center={positions.at(-1)}
        radius={7}
        pathOptions={{ fillColor: '#E63946', color: '#fff', weight: 2, fillOpacity: 1 }}
      />
    </>
  )
}
