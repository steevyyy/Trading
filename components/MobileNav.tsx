
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { SignInButton, SignUpButton, UserButton, useUser } from '@clerk/clerk-react';
import { Link, useLocation } from 'react-router-dom';

export const MobileNav: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { isSignedIn } = useUser();
  const location = useLocation();

  const navItems = [
    { to: '/home', label: 'Home' },
    { to: '/services', label: 'Services' },
    { to: '/about', label: 'About' },
    { to: '/contact', label: 'Contact' },
  ];
  if (isSignedIn) navItems.push({ to: '/bookings', label: 'My Bookings' });

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-neutral-800 p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t border-neutral-200 z-50">
          <nav className="container mx-auto px-4 py-4">
            {navItems.map((item) => (
              <Link
                key={item.to}
                to={item.to}
                onClick={() => setIsOpen(false)}
                className={`block w-full text-left py-3 px-4 rounded-lg mb-2 font-semibold transition-colors ${
                  location.pathname === item.to ? 'bg-sky-100 text-sky-600' : 'text-neutral-700 hover:bg-neutral-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
            <div className="mt-4 pt-4 border-t border-neutral-200">
              {isSignedIn ? (
                <div className="flex items-center space-x-3 px-4">
                  <UserButton afterSignOutUrl="/" />
                  <span className="text-neutral-700">My Account</span>
                </div>
              ) : (
                <div className="space-y-2">
                  <SignInButton mode="modal">
                    <button className="w-full text-neutral-700 hover:bg-neutral-100 font-semibold py-3 px-4 rounded-lg transition-colors">
                      Sign In
                    </button>
                  </SignInButton>
                  <SignUpButton mode="modal">
                    <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg transition-colors">
                      Sign Up
                    </button>
                  </SignUpButton>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </div>
  );
};
