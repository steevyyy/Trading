import React, { useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';
import { BookingForm } from '../components/BookingForm';
import { RideNowForm } from '../components/RideNowForm';
import { EventServiceCard } from '../components/EventServiceCard';
import { MapView } from '../components/MapView';
import { PaymentModal } from '../components/PaymentModal';
import { BookingConfirmation } from '../components/BookingConfirmation';
import { LoadingSkeleton } from '../components/LoadingSkeleton';
import { DriverMatchingModal } from '../components/DriverMatchingModal';
import { ActiveRideTracker } from '../components/ActiveRideTracker';
import { EventDetailPage } from './EventDetailPage';
import { Stats } from '../components/Stats';
import { Testimonials } from '../components/Testimonials';
import { TrustBadges } from '../components/TrustBadges';
import { VEHICLES, EVENT_SERVICES } from '../constants';
import { api } from '../lib/api';
import { calculateDistance } from '../lib/geoapify';
import { findNearestDriver } from '../lib/rideMatching';
import { useAuthContext } from '../lib/auth';
import type { Vehicle, EventService } from '../types';
import type { Booking } from '../lib/database';
import toast from 'react-hot-toast';

enum ServiceType {
  RideNow = 'Ride Now',
  Event = 'Event Transportation',
}

const nairobiCbd: [number, number] = [-1.286389, 36.817223];
const jkia: [number, number] = [-1.3192, 36.9275];

export default function HomePage() {
  const { isSignedIn } = useUser();
  const { user } = useAuthContext();
  const [serviceType, setServiceType] = useState<ServiceType>(ServiceType.RideNow);
  const [selectedVehicle, setSelectedVehicle] = useState<Vehicle | null>(VEHICLES[1]);
  const [pickupCoords, setPickupCoords] = useState<[number, number]>(nairobiCbd);
  const [destinationCoords, setDestinationCoords] = useState<[number, number]>(jkia);
  const [mapAddresses, setMapAddresses] = useState({ pickup: 'Nairobi CBD', destination: 'Jomo Kenyatta Intl. Airport' });
  const [isBooking, setIsBooking] = useState(false);
  const [bookingError, setBookingError] = useState('');
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<any>(null);
  const [selectedEventService, setSelectedEventService] = useState<EventService | null>(null);
  const [showDriverMatching, setShowDriverMatching] = useState(false);
  const [matchedDriver, setMatchedDriver] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<Booking | null>(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<any>(null);

  const calculateBookingAmount = (vehicle: Vehicle, distance: number): number => {
    const pricePerKm = parseFloat(vehicle.price.replace('$', '').split('/')[0]);
    const baseAmount = Math.max(distance * pricePerKm * 100, 200);
    return Math.round(baseAmount);
  };

  const handleBooking = async (details: {
    pickup: string;
    destination: string;
    date: string;
    pickupCoords?: [number, number];
    destinationCoords?: [number, number];
  }) => {
    if (!isSignedIn) {
      toast.error('Please sign in to make a booking');
      return;
    }

    if (!selectedVehicle) {
      toast.error('Please select a vehicle first.');
      return;
    }

    // Wait for user data
    let retries = 0;
    while (!user && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      retries++;
    }

    if (!user) {
      toast.error('Failed to load user data. Please refresh the page.');
      return;
    }

    setIsBooking(true);
    setBookingError('');

    try {
      if (details.pickupCoords && details.destinationCoords) {
        setPickupCoords(details.pickupCoords);
        setDestinationCoords(details.destinationCoords);
        setMapAddresses({ pickup: details.pickup, destination: details.destination });

        const distance = await calculateDistance(
          details.pickupCoords[0], details.pickupCoords[1],
          details.destinationCoords[0], details.destinationCoords[1]
        );

        const amount = calculateBookingAmount(selectedVehicle, distance);

        const booking = await api.createBooking({
          user_id: user.id,
          vehicle_id: selectedVehicle.id,
          pickup_location: details.pickup,
          destination: details.destination,
          pickup_coords: JSON.stringify(details.pickupCoords),
          destination_coords: JSON.stringify(details.destinationCoords),
          booking_date: new Date(details.date).toISOString(),
          status: 'pending',
          total_amount: amount,
          payment_status: 'pending'
        });

        setCurrentBooking({
          ...booking,
          vehicleName: selectedVehicle.name,
          pickup: details.pickup,
          destination: details.destination,
          date: details.date
        });

        setShowPaymentModal(true);
        toast.success('Booking created! Please complete payment.');
      } else {
        setBookingError('Could not find locations. Please try again with more specific addresses.');
      }
    } catch (error) {
      console.error('Booking error:', error);
      setBookingError('Failed to create booking. Please try again.');
    } finally {
      setIsBooking(false);
    }
  };

  const handlePaymentSuccess = async (transactionId: string) => {
    if (currentBooking) {
      setShowPaymentModal(false);

      if (currentBooking.id) {
        try {
          await api.updateBookingPayment(currentBooking.id, transactionId);
        } catch (err) {
          console.log('Payment update error:', err);
        }
      }

      setConfirmedBooking({ ...currentBooking, mpesa_transaction_id: transactionId });
      setShowConfirmation(true);

      if (user) {
        try {
          const ride = await api.getActiveRide(user.id);
          if (ride) setActiveRide(ride);
        } catch (err) {
          console.log('No active ride');
        }
      }
    }
  };

  const handleInstantRide = async (rideData: {
    vehicleId: number;
    pickupLocation: string;
    destination: string;
    pickupCoords: [number, number];
    destinationCoords: [number, number];
    estimatedFare: number;
  }) => {
    if (!isSignedIn) {
      toast.error('Please sign in to request a ride');
      return;
    }

    // Wait for user data with timeout
    let retries = 0;
    while (!user && retries < 10) {
      await new Promise(resolve => setTimeout(resolve, 500));
      retries++;
    }

    if (!user) {
      toast.error('Failed to load user data. Please refresh the page.');
      return;
    }

    try {
      // Create instant booking
      const booking = await api.createBooking({
        user_id: user.id,
        vehicle_id: rideData.vehicleId,
        pickup_location: rideData.pickupLocation,
        destination: rideData.destination,
        pickup_coords: rideData.pickupCoords.join(','),
        destination_coords: rideData.destinationCoords.join(','),
        booking_date: new Date().toISOString(),
        ride_type: 'instant',
        ride_status: 'searching',
        status: 'pending',
        total_amount: rideData.estimatedFare,
        payment_status: 'pending',
      });

      setCurrentBooking(booking);
      setShowDriverMatching(true);

      // Find nearest driver
      const driver = await findNearestDriver(rideData.pickupCoords, rideData.vehicleId);

      if (driver) {
        await api.updateBookingDriver(booking.id, driver);
        setMatchedDriver(driver);
      } else {
        toast.error('No drivers available at the moment');
        setShowDriverMatching(false);
      }
    } catch (error) {
      console.error('Instant ride error:', error);
      toast.error('Failed to request ride. Please try again.');
    }
  };

  const handleConfirmDriver = async () => {
    setShowDriverMatching(false);

    // Show payment modal after driver is confirmed
    if (currentBooking) {
      setCurrentBooking({
        ...currentBooking,
        vehicleName: VEHICLES.find(v => v.id === currentBooking.vehicle_id)?.name || 'Vehicle',
        pickup: currentBooking.pickup_location,
        destination: currentBooking.destination,
        date: new Date(currentBooking.booking_date).toISOString()
      });
      setShowPaymentModal(true);
    }
  };

  const handleRideComplete = () => {
    setActiveRide(null);
    setMatchedDriver(null);
    setCurrentBooking(null);
    toast.success('Thank you for riding with Connecta!');
  };

  useEffect(() => {
    if (user) {
      api.getActiveRide(user.id).then(ride => {
        if (ride) setActiveRide(ride);
      }).catch(() => {});
    }
  }, [user]);

  if (activeRide) {
    return <ActiveRideTracker ride={activeRide} onClose={() => setActiveRide(null)} onRideComplete={handleRideComplete} />;
  }

  if (selectedEventService) {
    return (
      <div className="min-h-screen">
        <EventDetailPage service={selectedEventService} onBack={() => setSelectedEventService(null)} />
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
        <div className="text-center px-4">
          <h1 className="text-3xl sm:text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
            Seamless Rides for
            <br />
            <span className="text-sky-500">Any Occasion</span>
          </h1>
          <p className="text-center text-base sm:text-lg text-neutral-600 mt-4 max-w-2xl mx-auto">
            From boda bodas to luxury buses, we provide reliable transport for your daily needs and special events across Kenya.
          </p>
        </div>

        <div className="mt-8 sm:mt-12 flex justify-center bg-white p-1.5 rounded-full w-fit mx-auto shadow-md border border-neutral-200">
          <button
            onClick={() => setServiceType(ServiceType.RideNow)}
            aria-pressed={serviceType === ServiceType.RideNow}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
              serviceType === ServiceType.RideNow ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            🚗 {ServiceType.RideNow}
          </button>
          <button
            onClick={() => setServiceType(ServiceType.Event)}
            aria-pressed={serviceType === ServiceType.Event}
            className={`px-4 sm:px-8 py-2.5 sm:py-3 text-xs sm:text-sm font-semibold rounded-full transition-all duration-300 ${
              serviceType === ServiceType.Event ? 'bg-gradient-to-r from-sky-500 to-blue-600 text-white shadow-md' : 'text-neutral-600 hover:bg-neutral-50'
            }`}
          >
            🎉 {ServiceType.Event}
          </button>
        </div>

        {serviceType === ServiceType.RideNow ? (
          <div className="mt-12 max-w-2xl mx-auto">
            <RideNowForm onRequestRide={handleInstantRide} />
          </div>
        ) : (
          <div className="mt-8 sm:mt-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-center text-neutral-800 mb-2 px-4">Event Transportation Services</h2>
            <p className="text-center text-neutral-600 mb-2 sm:mb-4 px-4">Professional transport solutions tailored for your special occasions.</p>
            <p className="text-center text-xs sm:text-sm text-neutral-500 mb-8 sm:mb-10 px-4">Book in advance for weddings, corporate events, and more</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {EVENT_SERVICES.map((service) => (
                <EventServiceCard
                  key={service.id}
                  service={service}
                  onLearnMore={(service) => setSelectedEventService(service)}
                />
              ))}
            </div>

            <div className="mt-8 sm:mt-12 bg-white rounded-2xl shadow-lg p-4 sm:p-8 max-w-4xl mx-auto">
              <h3 className="text-xl sm:text-2xl font-bold text-neutral-800 mb-3 sm:mb-4 text-center">Need to Book in Advance?</h3>
              <p className="text-sm sm:text-base text-neutral-600 text-center mb-4 sm:mb-6">
                For scheduled rides, airport transfers, or daily transportation needs, contact us directly to arrange your booking.
              </p>
              <div className="grid md:grid-cols-2 gap-4 sm:gap-6">
                <div className="bg-neutral-50 rounded-xl p-4 sm:p-6">
                  <BookingForm onBooking={handleBooking} isLoading={isBooking} />
                  {bookingError && <p className="mt-4 text-sm text-red-600">{bookingError}</p>}
                </div>
                <div className="space-y-4">
                  <h4 className="text-lg sm:text-xl font-bold text-neutral-800 mb-3 sm:mb-4">Available Vehicles</h4>
                  <div className="grid grid-cols-2 gap-2 sm:gap-3">
                    {VEHICLES.map((vehicle) => (
                      <button
                        key={vehicle.id}
                        onClick={() => setSelectedVehicle(vehicle)}
                        className={`p-2 sm:p-3 rounded-lg border-2 transition-all ${
                          selectedVehicle?.id === vehicle.id
                            ? 'border-sky-500 bg-sky-50'
                            : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-10 sm:h-12 object-contain mb-1 sm:mb-2" />
                        <p className="font-semibold text-[10px] sm:text-xs text-neutral-800">{vehicle.name}</p>
                        <p className="text-[9px] sm:text-xs text-neutral-600">{vehicle.price}</p>
                      </button>
                    ))}
                  </div>
                  {selectedVehicle && (
                    <div className="bg-sky-50 rounded-lg p-3 sm:p-4 border border-sky-200">
                      <p className="text-xs sm:text-sm text-neutral-700 mb-1">Selected Vehicle</p>
                      <p className="font-bold text-sm sm:text-base text-sky-600">{selectedVehicle.name}</p>
                      <p className="text-xs sm:text-sm text-neutral-600">{selectedVehicle.capacity} • {selectedVehicle.price}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
        </div>
      </div>

      <TrustBadges />
      <Stats />
      <Testimonials />

      {showPaymentModal && currentBooking && (
        <PaymentModal
          isOpen={showPaymentModal}
          onClose={() => setShowPaymentModal(false)}
          amount={currentBooking.total_amount}
          bookingDetails={{
            pickup: currentBooking.pickup,
            destination: currentBooking.destination,
            vehicleName: currentBooking.vehicleName,
            date: currentBooking.date
          }}
          onPaymentSuccess={handlePaymentSuccess}
        />
      )}

      <DriverMatchingModal
        isOpen={showDriverMatching}
        onClose={() => setShowDriverMatching(false)}
        driverInfo={matchedDriver}
        onConfirm={handleConfirmDriver}
      />

      {showConfirmation && confirmedBooking && (
        <BookingConfirmation
          booking={confirmedBooking}
          vehicleName={confirmedBooking.vehicleName}
          onClose={() => {
            setShowConfirmation(false);
            setConfirmedBooking(null);
            setCurrentBooking(null);
          }}
        />
      )}
    </>
  );
}