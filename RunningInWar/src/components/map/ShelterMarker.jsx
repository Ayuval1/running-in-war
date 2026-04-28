import { memo } from 'react'
import { Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import { SHELTER_TYPES } from '../../constants/shelterTypes'
import { geoPointToLatLng } from '../../lib/geo'

function createShelterIcon(type) {
  const t = SHELTER_TYPES[type] || SHELTER_TYPES.building
  return L.divIcon({
    className: '',
    iconSize:  [36, 36],
    iconAnchor:[18, 36],
    popupAnchor:[0, -36],
    html: `
      <div style="
        width:36px;height:36px;
        border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);
        background:${t.color};
        border:2px solid rgba(255,255,255,0.5);
        box-shadow:0 2px 10px rgba(0,0,0,0.5);
        display:flex;align-items:center;justify-content:center;
      ">
        <span style="transform:rotate(45deg);font-size:16px;line-height:1">${t.icon}</span>
      </div>
    `,
  })
}

function ShelterMarker({ shelter, onEdit, onDelete, currentUserId }) {
  const pos = geoPointToLatLng(shelter.location)
  if (!pos) return null

  const type = SHELTER_TYPES[shelter.type] || SHELTER_TYPES.building
  const isOwner = shelter.ownerId === currentUserId

  return (
    <Marker position={[pos.lat, pos.lng]} icon={createShelterIcon(shelter.type)}>
      <Popup>
        <div dir="rtl" style={{
          minWidth: 180,
          background: '#0F2035',
          color: '#E6F4F0',
          borderRadius: 12,
          padding: '12px 14px',
          fontFamily: 'Rubik, sans-serif',
        }}>
          {/* Type badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                padding: '2px 8px',
                borderRadius: 99,
                background: `${type.color}22`,
                color: type.color,
                border: `1px solid ${type.color}55`,
              }}
            >
              {type.label}
            </span>
          </div>

          {/* Name */}
          {shelter.name && (
            <p style={{ fontWeight: 700, marginBottom: 4, fontSize: 14 }}>{shelter.name}</p>
          )}

          {/* Address */}
          {shelter.address && (
            <p style={{ fontSize: 12, color: '#3D7070', marginBottom: 4 }}>{shelter.address}</p>
          )}

          {/* Notes */}
          {shelter.notes && (
            <p style={{ fontSize: 12, color: '#8aa0b0', marginBottom: 8, fontStyle: 'italic' }}>{shelter.notes}</p>
          )}

          {/* Owner attribution */}
          {shelter.isImported && shelter.importedFrom && (
            <p style={{ fontSize: 11, color: '#3B9EFF', marginBottom: 8 }}>
              הוסף על ידי: {shelter.importedFrom}
            </p>
          )}

          {/* Actions */}
          {isOwner && !shelter.isImported && (
            <div style={{ display: 'flex', gap: 8, marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <button
                onClick={() => onEdit(shelter)}
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 0',
                  borderRadius: 8,
                  border: '1px solid rgba(59,158,255,0.4)',
                  background: 'rgba(59,158,255,0.1)',
                  color: '#3B9EFF',
                  cursor: 'pointer',
                }}
              >
                ערוך
              </button>
              <button
                onClick={() => onDelete(shelter.id)}
                style={{
                  flex: 1,
                  fontSize: 12,
                  fontWeight: 700,
                  padding: '6px 0',
                  borderRadius: 8,
                  border: '1px solid rgba(255,65,84,0.4)',
                  background: 'rgba(255,65,84,0.1)',
                  color: '#FF4154',
                  cursor: 'pointer',
                }}
              >
                מחק
              </button>
            </div>
          )}
        </div>
      </Popup>
    </Marker>
  )
}

export default memo(ShelterMarker, (prev, next) =>
  prev.shelter.id        === next.shelter.id &&
  prev.shelter.type      === next.shelter.type &&
  prev.shelter.name      === next.shelter.name &&
  prev.currentUserId     === next.currentUserId
)
