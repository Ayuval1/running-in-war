# 🛡️ Running In War App

A safety-focused navigation app for finding shelters and planning safe routes during emergency situations.

## Features

### 🏠 Shelter Finding
- Real-time location of nearby shelters
- Detailed shelter information (capacity, type, amenities)
- Filter shelters by distance, type, and availability

### 🗺️ Safe Route Planning
- Calculate safest routes to destinations
- Route safety scoring based on multiple factors
- Alternative route suggestions

### 🆘 Emergency SOS
- Quick SOS button for emergencies
- Share location with trusted contacts
- Real-time status updates

### 🌍 Multi-Language Support
- Hebrew (עברית)
- English

### 📱 Progressive Web App
- Works offline with cached data
- Install as mobile app
- Fast and responsive

## Tech Stack

- **Frontend**: React 18 + Vite
- **Styling**: Tailwind CSS
- **Maps**: Leaflet + OpenStreetMap
- **Backend**: Firebase (Authentication, Firestore)
- **Deployment**: Vercel

## Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
cd RunningInWar
npm install
```

### Environment Setup

Create `.env.local` in the `RunningInWar/` folder with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Build for Production

```bash
npm run build
npm run preview
```

## Project Structure

```
RunningInWar/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── context/         # React Context (Auth, Language)
│   ├── hooks/           # Custom React hooks
│   ├── lib/             # Utility functions (routing, geo, etc.)
│   ├── firebase/        # Firebase configuration
│   ├── i18n/            # Translations
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── public/              # Static assets
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## Key Components

### Shelters
- `ShelterMarker` - Display shelter on map
- `PublicShelterMarker` - Mark public shelters
- `ShelterForm` - Add/edit shelter info

### Routing
- `RoutePolyline` - Display route on map
- `SafetyScoreBar` - Show route safety level

### User Interface
- `BottomNav` - Navigation menu
- `Drawer` - Sidebar menu
- `LoadingSpinner` - Loading indicator

## Contributing

This is Yuval's personal project. Built to help people find safe routes during emergencies.

## License

MIT

---

**Status**: Active Development 🚀
