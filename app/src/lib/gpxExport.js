/**
 * Exports a route as a GPX 1.1 file and triggers a browser download.
 * Compatible with Garmin Connect, Strava, Komoot, and most GPS apps.
 */
export function exportToGPX(waypoints, routeName = 'מסלול ריצה בטוח') {
  const trkpts = waypoints
    .map(p => `      <trkpt lat="${p.lat}" lon="${p.lng}"></trkpt>`)
    .join('\n')

  const gpx = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1"
     creator="ריצה בזמן מלחמה"
     xmlns="http://www.topografix.com/GPX/1/1"
     xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
     xsi:schemaLocation="http://www.topografix.com/GPX/1/1 http://www.topografix.com/GPX/1/1/gpx.xsd">
  <metadata>
    <name>${escapeXml(routeName)}</name>
    <desc>מסלול ריצה בטוח עם מקלטים — ריצה בזמן מלחמה</desc>
    <time>${new Date().toISOString()}</time>
  </metadata>
  <trk>
    <name>${escapeXml(routeName)}</name>
    <trkseg>
${trkpts}
    </trkseg>
  </trk>
</gpx>`

  const blob = new Blob([gpx], { type: 'application/gpx+xml' })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href     = url
  a.download = `${routeName.replace(/\s+/g, '_')}.gpx`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function escapeXml(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}
