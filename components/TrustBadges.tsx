import React from 'react';
import { Shield, Lock, Clock, CheckCircle } from 'lucide-react';

const badges = [
  { icon: Shield, title: 'Verified Service', description: 'Licensed & Insured' },
  { icon: Lock, title: 'Secure Payment', description: 'M-Pesa Protected' },
  { icon: Clock, title: '24/7 Support', description: 'Always Available' },
  { icon: CheckCircle, title: 'Quality Assured', description: 'Top-Rated Drivers' }
];

export const TrustBadges: React.FC = () => {
  return (
    <section className="py-8 sm:py-12 bg-neutral-50 border-y border-neutral-200">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {badges.map((badge, index) => (
            <div key={index} className="flex flex-col items-center text-center">
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-sky-100 rounded-full flex items-center justify-center mb-2 sm:mb-3">
                <badge.icon className="w-5 h-5 sm:w-6 sm:h-6 text-sky-600" />
              </div>
              <h4 className="font-bold text-xs sm:text-sm md:text-base text-neutral-800 mb-1">{badge.title}</h4>
              <p className="text-[10px] sm:text-xs md:text-sm text-neutral-600">{badge.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};