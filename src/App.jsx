import { Routes, Route, useLocation } from 'react-router-dom'
import { useEffect } from 'react'
import { AuthProvider } from './context/AuthContext'
import { FavoritesProvider } from './context/FavoritesContext'
import { ListingsProvider } from './context/ListingsContext'
import { ToastProvider } from './context/ToastContext'
import { Navbar } from './components/Navbar'
import { Footer } from './components/Footer'
import Home from './pages/Home'
import Properties from './pages/Properties'
import PropertyDetails from './pages/PropertyDetails'
import Login from './pages/Login'
import Register from './pages/Register'
import ForgotPassword from './pages/ForgotPassword'
import TenantDashboard from './pages/TenantDashboard'
import LandlordDashboard from './pages/LandlordDashboard'
import PropertyForm from './pages/PropertyForm'
import AdminDashboard from './pages/AdminDashboard'
import NotFound from './pages/NotFound'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

export default function App() {
  return (
    <AuthProvider>
      <FavoritesProvider>
        <ListingsProvider>
          <ToastProvider>
            <ScrollToTop />
            <div className="flex min-h-screen flex-col">
              <Navbar />
              <main className="flex-1">
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/properties/:id" element={<PropertyDetails />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/dashboard/tenant" element={<TenantDashboard />} />
                  <Route path="/dashboard/landlord" element={<LandlordDashboard />} />
                  <Route path="/dashboard/landlord/new" element={<PropertyForm />} />
                  <Route path="/dashboard/landlord/edit/:id" element={<PropertyForm />} />
                  <Route path="/dashboard/admin" element={<AdminDashboard />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </ToastProvider>
        </ListingsProvider>
      </FavoritesProvider>
    </AuthProvider>
  )
}
