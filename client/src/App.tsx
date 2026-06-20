import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './context/AuthContext'
import Layout from './components/Layout'
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import Dashboard from './pages/Dashboard'
import GenerateVideo from './pages/GenerateVideo'
import VideoHistory from './pages/VideoHistory'
import Profile from './pages/Profile'
import Admin from './pages/Admin'
import LoadingSpinner from './components/LoadingSpinner'

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" />
  return <>{children}</>
}

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, isAuthenticated, isLoading } = useAuth()
  if (isLoading) return <LoadingSpinner />
  if (!isAuthenticated) return <Navigate to="/login" />
  if (!user?.isAdmin) return <Navigate to="/dashboard" />
  return <>{children}</>
}

function App() {
  const { isLoading } = useAuth()
  if (isLoading) return <LoadingSpinner />

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Landing />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        <Route path="forgot-password" element={<ForgotPassword />} />
        <Route path="dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="generate" element={<ProtectedRoute><GenerateVideo /></ProtectedRoute>} />
        <Route path="history" element={<ProtectedRoute><VideoHistory /></ProtectedRoute>} />
        <Route path="profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        <Route path="admin" element={<AdminRoute><Admin /></AdminRoute>} />
      </Route>
    </Routes>
  )
}

export default App
