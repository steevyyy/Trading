import React from 'react';
import type { Vehicle } from '../types';
import { UsersIcon } from './icons/FormIcons';

interface VehicleCardProps {
  vehicle: Vehicle;
  isSelected: boolean;
  onSelect: () => void;
}

export const VehicleCard: React.FC<VehicleCardProps> = ({ vehicle, isSelected, onSelect }) => {
  return (
    <button
      onClick={onSelect}
      aria-pressed={isSelected}
      className={`flex-shrink-0 w-40 text-left rounded-xl overflow-hidden transition-all duration-300 border-2 ${
        isSelected ? 'border-sky-500 shadow-xl scale-105' : 'border-transparent hover:shadow-lg'
      }`}
    >
      <div className="bg-white">
        <div className="h-24 w-full relative">
          <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" loading="lazy" />
          <div className={`absolute inset-0 bg-black transition-opacity duration-300 ${isSelected ? 'opacity-10' : 'opacity-30'}`}></div>
        </div>
        <div className="p-3">
          <h4 className="font-bold text-neutral-800 truncate">{vehicle.name}</h4>
          <div className="flex items-center justify-between text-sm text-neutral-600 mt-1">
            <div className="flex items-center space-x-1">
                <UsersIcon className="h-4 w-4 text-neutral-400" />
                <span>{vehicle.capacity}</span>
            </div>
            <span className="font-semibold text-neutral-800">{vehicle.price.split('/')[0]}</span>
          </div>
        </div>
      </div>
    </button>
  );
};