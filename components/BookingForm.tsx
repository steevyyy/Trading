import React, { useState } from 'react';
import { LocationPinIcon, CalendarIcon, GpsIcon, SpinnerIcon } from './icons/FormIcons';
import { geocodeAddress, reverseGeocode } from '../lib/geoapify';
import toast from 'react-hot-toast';

interface BookingFormProps {
  onBooking: (details: {
    pickup: string;
    destination: string;
    date: string;
    pickupCoords?: [number, number];
    destinationCoords?: [number, number];
  }) => void;
  isLoading: boolean;
}

export const BookingForm: React.FC<BookingFormProps> = ({ onBooking, isLoading }) => {
  const [pickup, setPickup] = useState('Nairobi CBD');
  const [destination, setDestination] = useState('Jomo Kenyatta Intl. Airport');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [isLocating, setIsLocating] = useState(false);
  const [error, setError] = useState('');

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setIsLocating(true);
    setError('');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const result = await reverseGeocode(latitude, longitude);
          if (result) {
            setPickup(result.formatted);
            toast.success('Location found!');
          } else {
            setPickup(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
            setError('Could not find a street address.');
          }
        } catch (err) {
          console.error('Reverse geocoding error:', err);
          setError('Could not fetch your location address.');
        } finally {
          setIsLocating(false);
        }
      },
      (err) => {
        let errorMessage = 'An unknown error occurred.';
        switch (err.code) {
          case err.PERMISSION_DENIED:
            errorMessage = 'Please enable location permissions.';
            break;
          case err.POSITION_UNAVAILABLE:
            errorMessage = 'Location information is unavailable.';
            break;
          case err.TIMEOUT:
            errorMessage = 'Request timed out.';
            break;
        }
        setError(errorMessage);
        setIsLocating(false);
      }
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!pickup || !destination || !date) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const [pickupResult, destinationResult] = await Promise.all([
        geocodeAddress(pickup),
        geocodeAddress(destination)
      ]);

      onBooking({
        pickup,
        destination,
        date,
        pickupCoords: pickupResult ? [pickupResult.lat, pickupResult.lon] : undefined,
        destinationCoords: destinationResult ? [destinationResult.lat, destinationResult.lon] : undefined
      });
      toast.success('Finding available rides...');
    } catch (err) {
      setError('Error processing locations. Please try again.');
      toast.error('Could not process locations.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-3xl font-extrabold text-neutral-800">Book Your Ride</h2>
      <div>
        <label htmlFor="pickup" className="block text-sm font-semibold text-neutral-600 mb-2">
          Pickup Location
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
             <LocationPinIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            id="pickup"
            value={pickup}
            onChange={(e) => setPickup(e.target.value)}
            className="w-full pl-11 pr-12 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Enter pickup location"
            required
          />
           <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <button
              type="button"
              onClick={handleGetCurrentLocation}
              disabled={isLocating}
              className="text-neutral-500 hover:text-sky-500 disabled:text-neutral-400 disabled:cursor-not-allowed transition-colors"
              aria-label="Get current location"
            >
              {isLocating ? (
                <SpinnerIcon className="h-5 w-5" />
              ) : (
                <GpsIcon className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>
      <div>
        <label htmlFor="destination" className="block text-sm font-semibold text-neutral-600 mb-2">
          Destination
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <LocationPinIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="text"
            id="destination"
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            placeholder="Enter destination"
            required
          />
        </div>
      </div>
      <div>
        <label htmlFor="date" className="block text-sm font-semibold text-neutral-600 mb-2">
          Date
        </label>
        <div className="relative">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5">
            <CalendarIcon className="h-5 w-5 text-neutral-400" />
          </div>
          <input
            type="date"
            id="date"
            value={date}
            min={new Date().toISOString().split('T')[0]}
            onChange={(e) => setDate(e.target.value)}
            className="w-full pl-11 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
            required
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-4 rounded-lg transition-all duration-300 shadow-lg hover:shadow-orange-300 text-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 flex items-center justify-center disabled:bg-orange-300 disabled:cursor-not-allowed"
      >
        {isLoading ? <SpinnerIcon className="h-6 w-6" /> : 'Find Ride'}
      </button>
    </form>
  );
};