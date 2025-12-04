
import React from 'react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';
import { MobileNav } from './MobileNav';

const NavLink: React.FC<{
    to: string;
    children: React.ReactNode;
}> = ({ to, children }) => {
    const location = useLocation();
    const isActive = location.pathname === to;
    return (
        <Link
            to={to}
            aria-current={isActive ? 'page' : undefined}
            className={`font-semibold transition-colors py-1 ${
                isActive ? 'text-sky-500' : 'text-neutral-700 hover:text-sky-500'
            }`}
        >
            {children}
        </Link>
    );
};

export const Header: React.FC<{ currentPage: string }> = ({ currentPage }) => {
  const { isSignedIn } = useUser();

  return (
    <header className="bg-white/90 backdrop-blur-lg sticky top-0 z-50 shadow-sm border-b border-neutral-200/80">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-3">
          <Link to="/home" className="flex items-center gap-2" aria-label="Connecta Homepage">
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
            <span className="text-2xl font-extrabold text-neutral-800 tracking-tight">Connecta</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-8">
            <NavLink to="/home">Home</NavLink>
            <NavLink to="/services">Services</NavLink>
            <NavLink to="/about">About</NavLink>
            <NavLink to="/contact">Contact</NavLink>
            {isSignedIn && (
              <NavLink to="/bookings">My Bookings</NavLink>
            )}
            <Link
              to="/driver-signup"
              className="px-4 py-2 bg-green-500 text-white font-semibold rounded-lg hover:bg-green-600 transition-colors text-sm"
            >
              Drive with Us
            </Link>
          </nav>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div className="hidden md:flex items-center space-x-4">
              {isSignedIn ? (
                <UserButton afterSignOutUrl="/" />
              ) : (
                <div className="flex items-center space-x-2">
                  <SignInButton mode="modal">
                    <button className="text-neutral-700 hover:text-sky-500 font-semibold transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-6 rounded-full transition-all duration-300 shadow-md hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
};
