
import React from 'react';
import { DriverOnboardingForm } from '../components/DriverOnboardingForm';
import { Car, Shield, TrendingUp, Users } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function DriverOnboardingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-sky-50">
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
              <rect x="42" y="28" width="16" height="10" rx="2" fill="#0ea5e9"/>
              <circle cx="46" cy="40" r="2" fill="#0ea5e9"/>
              <circle cx="54" cy="40" r="2" fill="#0ea5e9"/>
            </svg>
            <h1 className="text-2xl font-extrabold text-neutral-800">Connecta Driver</h1>
          </div>
          <Link
            to="/home"
            className="px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors text-sm font-semibold"
          >
            Back to Home
          </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4">
            Drive with Connecta
          </h2>
          <p className="text-lg sm:text-xl text-sky-50 max-w-2xl mx-auto">
            Join Kenya's fastest-growing ride-hailing platform. Earn on your schedule, get paid weekly.
          </p>
        </div>
      </div>

      {/* Benefits */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">High Earnings</h3>
            <p className="text-sm text-neutral-600">Earn up to KSh 100,000/month</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Insurance Covered</h3>
            <p className="text-sm text-neutral-600">Full coverage while driving</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Car className="w-6 h-6 text-orange-600" />
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">Flexible Schedule</h3>
            <p className="text-sm text-neutral-600">Drive when you want</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-md text-center">
            <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-bold text-neutral-800 mb-2">24/7 Support</h3>
            <p className="text-sm text-neutral-600">Always here to help</p>
          </div>
        </div>

        {/* Form */}
        <DriverOnboardingForm />

        {/* Requirements */}
        <div className="mt-12 bg-white rounded-xl shadow-md p-6 sm:p-8">
          <h3 className="text-2xl font-bold text-neutral-800 mb-4">Requirements</h3>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-neutral-800 mb-2">Driver Requirements:</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>✓ Valid Kenyan driver's license</li>
                <li>✓ At least 21 years old</li>
                <li>✓ Clean driving record</li>
                <li>✓ National ID</li>
                <li>✓ Bank account for payments</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-neutral-800 mb-2">Vehicle Requirements:</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li>✓ Valid insurance certificate</li>
                <li>✓ Vehicle inspection certificate</li>
                <li>✓ Good condition (clean, no damage)</li>
                <li>✓ 2010 or newer (cars/vans)</li>
                <li>✓ Valid NTSA registration</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-neutral-200 py-6 mt-12">
        <div className="container mx-auto px-4 text-center text-neutral-600 text-sm">
          <p>&copy; {new Date().getFullYear()} Connecta. All rights reserved.</p>
          <p className="mt-2">Questions? Email: drivers@connecta.co.ke | Call: +254 712 345 678</p>
        </div>
      </footer>
    </div>
  );
}
