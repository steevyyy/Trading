
import React, { useState } from 'react';
import { SignInButton, SignUpButton, useUser } from '@clerk/clerk-react';
import { Menu, X, Zap, Shield, Clock, Star } from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';

export default function WelcomePage() {
  const { isSignedIn } = useUser();
  const [menuOpen, setMenuOpen] = useState(false);

  if (isSignedIn) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=1920&q=80)',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-sky-900/95 via-blue-900/90 to-neutral-900/95"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col">
        {/* Header */}
        <header className="px-4 py-4 backdrop-blur-sm bg-white/5 border-b border-white/10">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <svg className="w-10 h-10" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="logoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#60a5fa" />
                  </linearGradient>
                </defs>
                <path d="M20 80 Q50 20 80 80" stroke="url(#logoGrad)" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <circle cx="20" cy="80" r="8" fill="url(#logoGrad)"/>
                <circle cx="50" cy="35" r="8" fill="url(#logoGrad)"/>
                <circle cx="80" cy="80" r="8" fill="url(#logoGrad)"/>
              </svg>
              <span className="text-2xl font-extrabold text-white">Connecta</span>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <SignInButton mode="modal">
                <button className="px-5 py-2 text-white hover:text-sky-300 font-semibold transition-colors">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="px-6 py-2.5 bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-full transition-all shadow-lg">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="md:hidden p-2 text-white"
            >
              {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
          {menuOpen && (
            <div className="md:hidden mt-4 space-y-2">
              <SignInButton mode="modal">
                <button className="w-full px-5 py-3 text-white bg-white/10 rounded-lg font-semibold">
                  Sign In
                </button>
              </SignInButton>
              <SignUpButton mode="modal">
                <button className="w-full px-5 py-3 bg-sky-500 text-white font-bold rounded-lg">
                  Sign Up
                </button>
              </SignUpButton>
            </div>
          )}
        </header>

        {/* Hero */}
        <div className="flex-1 flex items-center">
          <div className="max-w-7xl mx-auto px-4 py-16 text-center">
            <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white mb-6 leading-tight">
              Your Journey,
              <br />
              <span className="text-sky-400">Our Priority</span>
            </h1>
            <p className="text-xl sm:text-2xl text-sky-100 mb-10 max-w-2xl mx-auto">
              Reliable transportation for daily rides, events, and everything in between across Kenya
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <SignUpButton mode="modal">
                <button className="px-10 py-4 bg-sky-500 hover:bg-sky-600 text-white text-lg font-bold rounded-full transition-all shadow-2xl hover:scale-105">
                  Get Started Free
                </button>
              </SignUpButton>
              <Link
                to="/about"
                className="px-10 py-4 bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white text-lg font-bold rounded-full transition-all border-2 border-white/30"
              >
                Learn More
              </Link>
            </div>

            {/* Features */}
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-14 h-14 bg-sky-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Zap className="w-7 h-7 text-sky-300" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Instant Rides</h3>
                <p className="text-sky-200 text-sm">Get picked up in minutes</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-14 h-14 bg-sky-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl">🎉</span>
                </div>
                <h3 className="text-white font-bold text-lg mb-2">Event Transport</h3>
                <p className="text-sky-200 text-sm">Professional event services</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-14 h-14 bg-sky-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-7 h-7 text-sky-300" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">100% Verified</h3>
                <p className="text-sky-200 text-sm">Vetted drivers & vehicles</p>
              </div>
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="w-14 h-14 bg-sky-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-7 h-7 text-sky-300" />
                </div>
                <h3 className="text-white font-bold text-lg mb-2">24/7 Available</h3>
                <p className="text-sky-200 text-sm">Round-the-clock service</p>
              </div>
            </div>

            {/* Stats */}
            <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              <div>
                <div className="text-4xl font-extrabold text-white mb-1">10K+</div>
                <div className="text-sky-200 text-sm">Happy Customers</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white mb-1">500+</div>
                <div className="text-sky-200 text-sm">Verified Drivers</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white mb-1">50K+</div>
                <div className="text-sky-200 text-sm">Rides Completed</div>
              </div>
              <div>
                <div className="text-4xl font-extrabold text-white mb-1 flex items-center justify-center gap-1">
                  4.9<Star className="w-6 h-6 fill-yellow-400 text-yellow-400" />
                </div>
                <div className="text-sky-200 text-sm">Average Rating</div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-6 text-center text-sky-200/60 text-sm border-t border-white/10">
          <p>&copy; {new Date().getFullYear()} Connecta. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
}
