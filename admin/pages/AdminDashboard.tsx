
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Users, Car, DollarSign, TrendingUp, Clock, CheckCircle, XCircle, AlertCircle, BarChart3, Settings } from 'lucide-react';
import UsersManagement from '../components/UsersManagement';
import BookingsManagement from '../components/BookingsManagement';
import Analytics from '../components/Analytics';

export default function AdminDashboard() {
  const location = useLocation();
  const currentView = location.hash.substring(1) || 'dashboard';

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <header className="bg-white border-b border-neutral-200 shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                <path d="M20 80 Q50 20 80 80" stroke="url(#logoGradient)" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <circle cx="20" cy="80" r="8" fill="url(#logoGradient)"/>
                <circle cx="50" cy="35" r="8" fill="url(#logoGradient)"/>
                <circle cx="80" cy="80" r="8" fill="url(#logoGradient)"/>
              </svg>
              <h1 className="text-2xl font-extrabold text-neutral-800">Connecta Admin</h1>
            </div>
            <div className="flex items-center gap-4">
              <Link
                to="/home"
                className="px-4 py-2 bg-neutral-200 text-neutral-700 rounded-lg hover:bg-neutral-300 transition-colors"
              >
                Back to Site
              </Link>
              <span className="text-sm text-neutral-600">Admin User</span>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Navigation */}
      <div className="flex">
        <aside className="w-64 bg-white border-r border-neutral-200 min-h-screen">
          <nav className="p-4 space-y-2">
            <Link
              to="#dashboard"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'dashboard' ? 'bg-sky-500 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <TrendingUp className="w-5 h-5" />
              Dashboard
            </Link>
            <Link
              to="#users"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'users' ? 'bg-sky-500 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Users className="w-5 h-5" />
              Users
            </Link>
            <Link
              to="#bookings"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'bookings' ? 'bg-sky-500 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Car className="w-5 h-5" />
              Bookings
            </Link>
            <Link
              to="#analytics"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'analytics' ? 'bg-sky-500 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <BarChart3 className="w-5 h-5" />
              Analytics
            </Link>
            <Link
              to="#settings"
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition ${
                currentView === 'settings' ? 'bg-sky-500 text-white' : 'text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Settings className="w-5 h-5" />
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <div className="flex-1 bg-neutral-50">
          <div className="container mx-auto px-4 py-8">
            {currentView === 'dashboard' && <Analytics />}
            {currentView === 'users' && <UsersManagement />}
            {currentView === 'bookings' && <BookingsManagement />}
            {currentView === 'analytics' && <Analytics />}
            {currentView === 'settings' && (
              <div>
                <h2 className="text-2xl font-bold text-neutral-800 mb-6">Settings</h2>
                <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
                  <p className="text-neutral-600">Settings panel coming soon...</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
