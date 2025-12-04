
import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { User, Phone, Star, Car, MapPin, Navigation, X } from 'lucide-react';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export const ActiveRideTracker: React.FC<any> = ({ ride, onClose, onRideComplete }) => {
  const [rideStatus, setRideStatus] = useState(ride.ride_status);

  const pickupCoords = ride.pickup_coords.split(',').map(Number) as [number, number];
  const destinationCoords = ride.destination_coords.split(',').map(Number) as [number, number];

  // Simulate driver location (in production, this would come from real-time GPS)
  const driverLocation = pickupCoords;

  const statusMessages: { [key: string]: string } = {
    driver_assigned: 'Driver is on the way to pick you up',
    en_route: 'Driver is heading to your location',
    arrived: 'Driver has arrived at pickup location',
    in_progress: 'Trip in progress',
    completed: 'Trip completed',
  };

  const handleCancelRide = async () => {
    if (confirm('Are you sure you want to cancel this ride?')) {
      try {
        await api.updateRideStatus(ride.id, 'cancelled');
        toast.success('Ride cancelled');
        onClose();
      } catch (error) {
        toast.error('Failed to cancel ride');
      }
    }
  };

  const simulateRideProgress = () => {
    // Simulate ride status progression for demo
    const statusFlow = ['driver_assigned', 'en_route', 'arrived', 'in_progress', 'completed'];
    const currentIndex = statusFlow.indexOf(rideStatus);

    if (currentIndex < statusFlow.length - 1) {
      setTimeout(() => {
        const nextStatus = statusFlow[currentIndex + 1];
        setRideStatus(nextStatus as any);
        api.updateRideStatus(ride.id, nextStatus);

        if (nextStatus === 'completed') {
          toast.success('Ride completed!');
          setTimeout(() => onRideComplete(), 2000);
        }
      }, 10000); // Progress every 10 seconds for demo
    }
  };

  useEffect(() => {
    if (rideStatus !== 'completed' && rideStatus !== 'cancelled') {
      simulateRideProgress();
    }
  }, [rideStatus]);

  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col">
      {/* Header */}
      <div className="bg-gradient-to-r from-sky-500 to-blue-600 text-white p-4 shadow-lg">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Active Ride</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/20 rounded-lg transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="bg-white/20 rounded-lg p-3">
          <p className="text-sm opacity-90 mb-1">Status</p>
          <p className="font-semibold">{statusMessages[rideStatus as keyof typeof statusMessages]}</p>
        </div>
      </div>

      {/* Map */}
      <div className="flex-1 relative">
        <MapContainer
          center={pickupCoords}
          zoom={13}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />

          {/* Driver marker */}
          <Marker position={driverLocation}>
            <Popup>
              <div className="text-center">
                <Car className="w-6 h-6 mx-auto mb-1 text-sky-600" />
                <p className="font-semibold">{ride.driver_name}</p>
              </div>
            </Popup>
          </Marker>

          {/* Pickup marker */}
          <Marker position={pickupCoords}>
            <Popup>Pickup: {ride.pickup_location}</Popup>
          </Marker>

          {/* Destination marker */}
          <Marker position={destinationCoords}>
            <Popup>Destination: {ride.destination}</Popup>
          </Marker>

          {/* Route line */}
          <Polyline positions={[driverLocation, pickupCoords, destinationCoords]} color="blue" />
        </MapContainer>
      </div>

      {/* Driver Info Card */}
      <div className="bg-white border-t border-neutral-200 p-4 shadow-lg">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-sky-400 to-blue-500 rounded-full flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-bold text-neutral-800">{ride.driver_name}</h3>
              <div className="flex items-center gap-3 text-sm text-neutral-600">
                <span className="flex items-center gap-1">
                  <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                  {ride.driver_rating}
                </span>
                <span className="flex items-center gap-1">
                  <Car className="w-4 h-4" />
                  {ride.vehicle_plate}
                </span>
              </div>
            </div>
            <a
              href={`tel:${ride.driver_phone}`}
              className="p-3 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition-colors"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="text-neutral-600 mb-1 flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                Pickup
              </p>
              <p className="font-semibold text-neutral-800 truncate">{ride.pickup_location}</p>
            </div>
            <div className="bg-neutral-50 rounded-lg p-3">
              <p className="text-neutral-600 mb-1 flex items-center gap-1">
                <Navigation className="w-4 h-4" />
                Destination
              </p>
              <p className="font-semibold text-neutral-800 truncate">{ride.destination}</p>
            </div>
          </div>

          <div className="flex items-center justify-between bg-sky-50 rounded-lg p-3 border border-sky-200">
            <span className="text-neutral-700 font-medium">Total Fare</span>
            <span className="text-2xl font-bold text-sky-600">KSh {ride.total_amount.toLocaleString()}</span>
          </div>

          {rideStatus !== 'completed' && rideStatus !== 'in_progress' && (
            <button
              onClick={handleCancelRide}
              className="w-full py-3 border-2 border-red-500 text-red-500 rounded-lg font-semibold hover:bg-red-50 transition-colors"
            >
              Cancel Ride
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
