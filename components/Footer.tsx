
import React from 'react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-2">
              <svg className="w-8 h-8" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <linearGradient id="footerLogoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#2563eb" />
                  </linearGradient>
                </defs>
                <path d="M20 80 Q50 20 80 80" stroke="url(#footerLogoGradient)" strokeWidth="8" fill="none" strokeLinecap="round"/>
                <circle cx="20" cy="80" r="8" fill="url(#footerLogoGradient)"/>
                <circle cx="50" cy="35" r="8" fill="url(#footerLogoGradient)"/>
                <circle cx="80" cy="80" r="8" fill="url(#footerLogoGradient)"/>
                <rect x="42" y="28" width="16" height="10" rx="2" fill="#0ea5e9"/>
                <circle cx="46" cy="40" r="2" fill="#0ea5e9"/>
                <circle cx="54" cy="40" r="2" fill="#0ea5e9"/>
              </svg>
              <h3 className="text-2xl font-bold text-sky-500">Connecta</h3>
            </div>
            <p className="text-neutral-600 max-w-md">Your trusted partner for event and daily transportation in Kenya. Reliable, professional, and always on time.</p>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/home" className="text-neutral-600 hover:text-sky-500 transition">Home</Link></li>
              <li><Link to="/services" className="text-neutral-600 hover:text-sky-500 transition">Services</Link></li>
              <li><Link to="/about" className="text-neutral-600 hover:text-sky-500 transition">About</Link></li>
              <li><Link to="/contact" className="text-neutral-600 hover:text-sky-500 transition">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-neutral-800 mb-4">For Drivers</h4>
            <ul className="space-y-2">
              <li><Link to="/driver-signup" className="text-neutral-600 hover:text-sky-500 transition">Become a Driver</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-10 pt-6 border-t border-neutral-200 text-center text-neutral-500">
          <p>&copy; {new Date().getFullYear()} Connecta. All rights reserved.</p>
          <p className="mt-2 text-xs">Questions? Email: support@connecta.co.ke | Call: +254 712 345 678</p>
        </div>
      </div>
    </footer>
  );
};
