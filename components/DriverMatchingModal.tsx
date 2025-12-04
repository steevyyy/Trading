import React, { useEffect, useState } from 'react';
import { X, Loader2, User, Phone, Star, Car } from 'lucide-react';

interface DriverMatchingModalProps {
  isOpen: boolean;
  onClose: () => void;
  driverInfo?: {
    driver_name: string;
    driver_phone: string;
    driver_rating: number;
    vehicle_plate: string;
    estimated_arrival: number;
  } | null;
  onConfirm: () => void;
}

export const DriverMatchingModal: React.FC<DriverMatchingModalProps> = ({
  isOpen,
  onClose,
  driverInfo,
  onConfirm,
}) => {
  const [dots, setDots] = useState('');

  useEffect(() => {
    if (!driverInfo) {
      const interval = setInterval(() => {
        setDots(prev => prev.length >= 3 ? '' : prev + '.');
      }, 500);
      return () => clearInterval(interval);
    }
  }, [driverInfo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600"
        >
          <X className="w-6 h-6" />
        </button>

        {!driverInfo ? (
          <div className="text-center py-8">
            <div className="mb-6">
              <Loader2 className="w-16 h-16 text-sky-500 animate-spin mx-auto" />
            </div>
            <h3 className="text-2xl font-bold text-neutral-800 mb-2">
              Finding your driver{dots}
            </h3>
            <p className="text-neutral-600">
              We're matching you with the nearest available driver
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <User className="w-10 h-10 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-neutral-800 mb-1">Driver Found!</h3>
              <p className="text-neutral-600">Your driver is on the way</p>
            </div>

            <div className="bg-neutral-50 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Driver Name</span>
                <span className="font-semibold text-neutral-800">{driverInfo.driver_name}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Phone</span>
                <a href={`tel:${driverInfo.driver_phone}`} className="font-semibold text-sky-600 hover:text-sky-700 flex items-center gap-1">
                  <Phone className="w-4 h-4" />
                  {driverInfo.driver_phone}
                </a>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Rating</span>
                <span className="font-semibold text-neutral-800 flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {driverInfo.driver_rating}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-neutral-600">Vehicle</span>
                <span className="font-semibold text-neutral-800 flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  {driverInfo.vehicle_plate}
                </span>
              </div>

              <div className="flex items-center justify-between pt-3 border-t border-neutral-200">
                <span className="text-neutral-600">Estimated Arrival</span>
                <span className="text-2xl font-bold text-sky-600">{driverInfo.estimated_arrival} min</span>
              </div>
            </div>

            <button
              onClick={onConfirm}
              className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all"
            >
              Confirm & Pay
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
