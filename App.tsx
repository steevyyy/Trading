
import React from 'react';
import { ClerkProvider } from '@clerk/clerk-react';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import './styles/animations.css';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AuthProvider, useAuthContext } from './lib/auth';
import HomePage from './pages/HomePage';
import ServicesPage from './pages/ServicesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import { BookingHistory } from './components/BookingHistory';
import { ProtectedRoute } from './components/ProtectedRoute';
import WelcomePage from './pages/WelcomePage';
import AdminDashboard from './admin/pages/AdminDashboard';
import DriverOnboardingPage from './admin/pages/DriverOnboardingPage';
import { MobileBottomNav } from './components/MobileBottomNav';

const CLERK_PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!CLERK_PUBLISHABLE_KEY) {
  console.warn('Clerk not configured - running in demo mode');
}

function AppContent() {
  const location = useLocation();
  const { isAdmin } = useAuthContext();
  const showHeaderFooter = !['/', '/driver-signup'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-900 flex flex-col">
      {showHeaderFooter && <Header currentPage={location.pathname} />}
      <main className="flex-grow pb-20 md:pb-0">
        <Routes>
          <Route path="/" element={<WelcomePage />} />
          <Route path="/home" element={<HomePage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/bookings" element={
            <ProtectedRoute>
              <div className="container mx-auto px-4 py-8">
                <BookingHistory />
              </div>
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute>
              {isAdmin ? <AdminDashboard /> : <div>Access Denied</div>}
            </ProtectedRoute>
          } />
          <Route path="/driver-signup" element={<DriverOnboardingPage />} />
        </Routes>
      </main>
      {showHeaderFooter && <MobileBottomNav currentPage={location.pathname} />}
      {showHeaderFooter && <Footer />}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            padding: '16px',
          },
          success: {
            iconTheme: { primary: '#10b981', secondary: '#fff' },
          },
          error: {
            iconTheme: { primary: '#ef4444', secondary: '#fff' },
          },
        }}
      />
    </div>
  );
}

export default function App() {
  return (
    <ClerkProvider publishableKey={CLERK_PUBLISHABLE_KEY}>
      <AuthProvider>
        <Router>
          <AppContent />
        </Router>
      </AuthProvider>
    </ClerkProvider>
  );
}
