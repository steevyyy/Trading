import React from 'react';
import { Users, Car, Star, Award } from 'lucide-react';

const stats = [
  { icon: Car, value: '10,000+', label: 'Rides Completed', color: 'text-sky-600' },
  { icon: Users, value: '5,000+', label: 'Happy Customers', color: 'text-green-600' },
  { icon: Star, value: '4.9/5', label: 'Average Rating', color: 'text-yellow-600' },
  { icon: Award, value: '100%', label: 'Verified Drivers', color: 'text-orange-600' }
];

export const Stats: React.FC = () => {
  return (
    <section className="py-12 sm:py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-8">
          {stats.map((stat, index) => (
            <div key={index} className="text-center transform hover:scale-105 sm:hover:scale-110 transition-transform duration-300">
              <div className="flex justify-center mb-2 sm:mb-4">
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-neutral-100 rounded-full flex items-center justify-center">
                  <stat.icon className={`w-6 h-6 sm:w-8 sm:h-8 ${stat.color}`} />
                </div>
              </div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-neutral-800 mb-1 sm:mb-2">{stat.value}</h3>
              <p className="text-xs sm:text-sm md:text-base text-neutral-600 font-medium">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};