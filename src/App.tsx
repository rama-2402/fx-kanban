import { useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { useAuth } from './hooks/useAuth'
import LoginPage from './pages/LoginPage'
import FormPage from './pages/FormPage'
import DashboardPage from './pages/DashboardPage'

function DocumentTitle() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (pathname === '/login') document.title = 'FX Design Tracker — Login'
    else if (pathname === '/dashboard') document.title = 'FX Design Tracker — Dashboard'
    else if (pathname === '/submit') document.title = 'FX Design Tracker — Submit Task'
    else document.title = 'FX Design Tracker'
  }, [pathname])
  return null
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { session, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F172A] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!session) {
    return <Navigate to="/login" replace />
  }

  return <>{children}</>
}

function App() {
  return (
    <>
      <BrowserRouter>
        <DocumentTitle />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<LoginPage />} />
          <Route
            path="/submit"
            element={
              <ProtectedRoute>
                <FormPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
      <Toaster position="top-center" />
    </>
  )
}

export default App
