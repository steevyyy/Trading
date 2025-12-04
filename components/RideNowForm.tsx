import React, { useState, useEffect } from 'react';
import { MapPin, Navigation, Loader2 } from 'lucide-react';
import { geocodeAddress } from '../lib/geoapify';
import { calculateDistance } from '../lib/geoapify';
import { VEHICLES } from '../constants';
import toast from 'react-hot-toast';

interface RideNowFormProps {
  onRequestRide: (rideData: {
    vehicleId: number;
    pickupLocation: string;
    destination: string;
    pickupCoords: [number, number];
    destinationCoords: [number, number];
    estimatedFare: number;
  }) => void;
}

export const RideNowForm: React.FC<RideNowFormProps> = ({ onRequestRide }) => {
  const [selectedVehicle, setSelectedVehicle] = useState(1);
  const [pickupLocation, setPickupLocation] = useState('');
  const [destination, setDestination] = useState('');
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [destinationCoords, setDestinationCoords] = useState<[number, number] | null>(null);
  const [estimatedFare, setEstimatedFare] = useState<number | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [destinationSuggestions, setDestinationSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  const instantRideVehicles = VEHICLES.filter(v => v.id <= 3); // Boda, Car, Van only

  const getCurrentLocation = () => {
    setIsGettingLocation(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const coords: [number, number] = [position.coords.latitude, position.coords.longitude];
          setPickupCoords(coords);

          try {
            const address = await fetch(
              `https://api.geoapify.com/v1/geocode/reverse?lat=${coords[0]}&lon=${coords[1]}&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
            ).then(res => res.json());

            if (address.features?.[0]) {
              setPickupLocation(address.features[0].properties.formatted);
            }
          } catch (error) {
            console.error('Reverse geocoding error:', error);
            // Fallback coordinates for testing
            setPickupLocation('Nairobi, Kenya');
          }
          setIsGettingLocation(false);
        },
        (error) => {
          // Fallback for testing
          setPickupCoords([-1.286389, 36.817223]); // Nairobi coordinates
          setPickupLocation('Nairobi, Kenya');
          setIsGettingLocation(false);
        }
      );
    } else {
      toast.error('Geolocation not supported');
      setIsGettingLocation(false);
    }
  };

  const handleDestinationChange = async (value: string) => {
    setDestination(value);
    setShowSuggestions(true);

    if (value.length > 2) {
      try {
        const response = await fetch(
          `https://api.geoapify.com/v1/geocode/autocomplete?text=${encodeURIComponent(value)}&filter=countrycode:ke&apiKey=${import.meta.env.VITE_GEOAPIFY_API_KEY}`
        );
        const data = await response.json();
        setDestinationSuggestions(data.features || []);

        // Auto-select first result if available
        if (data.features && data.features.length > 0) {
          const firstResult = data.features[0];
          setDestinationCoords([firstResult.properties.lat, firstResult.properties.lon]);
        }
      } catch (error) {
        console.error('Autocomplete error:', error);
      }
    } else {
      setDestinationSuggestions([]);
    }
  };

  const selectDestination = (feature: any) => {
    setDestination(feature.properties.formatted);
    setDestinationCoords([feature.properties.lat, feature.properties.lon]);
    setShowSuggestions(false);
    setDestinationSuggestions([]);
  };

  useEffect(() => {
    if (pickupCoords && destinationCoords) {
      setIsCalculating(true);
      calculateDistance(pickupCoords, destinationCoords)
        .then(distance => {
          const vehicle = VEHICLES.find(v => v.id === selectedVehicle);
          if (vehicle) {
            const pricePerKm = parseInt(vehicle.price.replace(/[^0-9]/g, ''));
            const fare = Math.ceil(distance * pricePerKm);
            setEstimatedFare(fare);
          }
          setIsCalculating(false);
        })
        .catch(() => setIsCalculating(false));
    }
  }, [pickupCoords, destinationCoords, selectedVehicle]);

  const handleRequestRide = () => {
    // Set default pickup coords if not set
    const finalPickupCoords = pickupCoords || [-1.286389, 36.817223]; // Nairobi
    const finalPickupLocation = pickupLocation || 'Nairobi, Kenya';

    if (!destinationCoords) {
      toast.error('Please enter a destination');
      return;
    }

    // Calculate fare if not already calculated
    const vehicle = VEHICLES.find(v => v.id === selectedVehicle);
    const pricePerKm = parseInt(vehicle?.price.replace(/[^0-9]/g, '') || '100');
    const finalFare = estimatedFare || pricePerKm * 5; // Default 5km

    onRequestRide({
      vehicleId: selectedVehicle,
      pickupLocation: finalPickupLocation,
      destination,
      pickupCoords: finalPickupCoords,
      destinationCoords,
      estimatedFare: finalFare,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 space-y-6">
      <div>
        <h3 className="text-2xl font-bold text-neutral-800 mb-2">Request a Ride Now</h3>
        <p className="text-neutral-600">Get picked up in minutes</p>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Pickup Location</label>
        <div className="flex gap-2">
          <div className="relative flex-1">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={pickupLocation}
              onChange={(e) => setPickupLocation(e.target.value)}
              placeholder="Enter pickup location"
              className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={getCurrentLocation}
            disabled={isGettingLocation}
            className="px-4 py-3 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition-colors disabled:opacity-50"
          >
            {isGettingLocation ? <Loader2 className="w-5 h-5 animate-spin" /> : <Navigation className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-2">Destination</label>
        <div className="relative">
          <MapPin className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
          <input
            type="text"
            value={destination}
            onChange={(e) => handleDestinationChange(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            placeholder="Where to?"
            className="w-full pl-10 pr-4 py-3 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          />
          {showSuggestions && destinationSuggestions.length > 0 && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-neutral-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
              {destinationSuggestions.map((feature, index) => (
                <button
                  key={index}
                  onClick={() => selectDestination(feature)}
                  className="w-full text-left px-4 py-3 hover:bg-sky-50 border-b border-neutral-100 last:border-b-0 transition-colors"
                >
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-sky-500 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm font-medium text-neutral-800">{feature.properties.name || feature.properties.formatted}</p>
                      <p className="text-xs text-neutral-600">{feature.properties.formatted}</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-semibold text-neutral-700 mb-3">Select Vehicle</label>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {instantRideVehicles.map((vehicle) => (
            <button
              key={vehicle.id}
              onClick={() => setSelectedVehicle(vehicle.id)}
              className={`p-2 sm:p-4 rounded-lg border-2 transition-all ${
                selectedVehicle === vehicle.id
                  ? 'border-sky-500 bg-sky-50'
                  : 'border-neutral-200 hover:border-neutral-300'
              }`}
            >
              <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-12 sm:h-16 object-contain mb-1 sm:mb-2" />
              <p className="font-semibold text-xs sm:text-sm text-neutral-800">{vehicle.name}</p>
              <p className="text-[10px] sm:text-xs text-neutral-600">{vehicle.price}</p>
            </button>
          ))}
        </div>
      </div>

      {estimatedFare && (
        <div className="bg-sky-50 rounded-lg p-4 border border-sky-200">
          <div className="flex justify-between items-center">
            <span className="text-neutral-700 font-medium">Estimated Fare</span>
            <span className="text-2xl font-bold text-sky-600">
              {isCalculating ? <Loader2 className="w-6 h-6 animate-spin" /> : `KSh ${estimatedFare.toLocaleString()}`}
            </span>
          </div>
        </div>
      )}

      <button
        onClick={handleRequestRide}
        disabled={!pickupLocation || !destination || !destinationCoords || isCalculating}
        className="w-full bg-gradient-to-r from-sky-500 to-blue-600 text-white py-4 rounded-lg font-semibold hover:from-sky-600 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isCalculating ? 'Calculating...' : 'Request Ride'}
      </button>
    </div>
  );
};
