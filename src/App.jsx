import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import LoadingSpinner from './components/ui/LoadingSpinner'

const AuthPage         = lazy(() => import('./pages/AuthPage'))
const HomePage         = lazy(() => import('./pages/HomePage'))
const MapPage          = lazy(() => import('./pages/MapPage'))
const RoutePage        = lazy(() => import('./pages/RoutePage'))
const SharingPage      = lazy(() => import('./pages/SharingPage'))
const SharedImportPage = lazy(() => import('./pages/SharedImportPage'))
const SharedRoutePage  = lazy(() => import('./pages/SharedRoutePage'))
const ProfilePage      = lazy(() => import('./pages/ProfilePage'))

function RequireAuth({ children }) {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />
  if (!user)   return <Navigate to="/auth" replace />
  return children
}

export default function App() {
  const { user, loading } = useAuth()
  if (loading) return <LoadingSpinner />

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Routes>
        <Route path="/auth" element={user ? <Navigate to="/" replace /> : <AuthPage />} />

        <Route path="/" element={
          <RequireAuth><HomePage /></RequireAuth>
        } />

        <Route path="/map" element={
          <RequireAuth><MapPage /></RequireAuth>
        } />

        <Route path="/route" element={
          <RequireAuth><RoutePage /></RequireAuth>
        } />

        <Route path="/share" element={
          <RequireAuth><SharingPage /></RequireAuth>
        } />

        <Route path="/share/:shareId" element={
          <RequireAuth><SharedImportPage /></RequireAuth>
        } />

        <Route path="/shared/route/:routeId" element={<SharedRoutePage />} />

        <Route path="/profile" element={
          <RequireAuth><ProfilePage /></RequireAuth>
        } />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Suspense>
  )
}
