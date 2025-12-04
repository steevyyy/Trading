import React from 'react';
import { Home, Calendar, User, Menu } from 'lucide-react';
import type { Page } from '../App';

interface MobileBottomNavProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({ currentPage, setCurrentPage }) => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 z-40 safe-area-bottom">
    <div className="flex justify-around items-center h-16">
      <button
        onClick={() => setCurrentPage('Home')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          currentPage === 'Home' ? 'text-sky-500' : 'text-neutral-600'
        }`}
      >
        <Home className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Home</span>
      </button>
      <button
        onClick={() => setCurrentPage('Bookings')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          currentPage === 'Bookings' ? 'text-sky-500' : 'text-neutral-600'
        }`}
      >
        <Calendar className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Bookings</span>
      </button>
      <button
        onClick={() => setCurrentPage('Services')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          currentPage === 'Services' ? 'text-sky-500' : 'text-neutral-600'
        }`}
      >
        <Menu className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">Services</span>
      </button>
      <button
        onClick={() => setCurrentPage('About')}
        className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
          currentPage === 'About' ? 'text-sky-500' : 'text-neutral-600'
        }`}
      >
        <User className="w-6 h-6 mb-1" />
        <span className="text-xs font-medium">About</span>
      </button>
    </div>
  </nav>
);
