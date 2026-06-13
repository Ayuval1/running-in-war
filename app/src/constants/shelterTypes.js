export const SHELTER_TYPES = {
  building: {
    id: 'building',
    label: 'מקלט בניין',
    emoji: '🏢',
    icon: '🏢',
    color: '#3B82F6',
    bg: 'bg-blue-500',
    text: 'text-blue-400',
    border: 'border-blue-500',
  },
  municipal: {
    id: 'municipal',
    label: 'מקלט עירוני',
    emoji: '🏛️',
    icon: '🏛️',
    color: '#22C55E',
    bg: 'bg-green-500',
    text: 'text-green-400',
    border: 'border-green-500',
  },
  safe_room: {
    id: 'safe_room',
    label: 'ממ"ד / מיגונית',
    emoji: '🛡️',
    icon: '🛡️',
    color: '#F97316',
    bg: 'bg-orange-500',
    text: 'text-orange-400',
    border: 'border-orange-500',
  },
}

export const SHELTER_TYPE_LIST = Object.values(SHELTER_TYPES)

// How far (meters) from shelter is considered "safe"
export const SAFE_RADIUS_METERS = 150
