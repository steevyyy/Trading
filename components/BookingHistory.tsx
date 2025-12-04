
import React, { useEffect, useState } from 'react';
import { Calendar, MapPin, Car, Clock, CheckCircle, XCircle, Package } from 'lucide-react';
import { EmptyState } from './EmptyState';
import { StatusBadge } from './StatusBadge';
import { LoadingSkeleton } from './LoadingSkeleton';
import { api } from '../lib/api';
import { useAuthContext } from '../lib/auth';
import { format } from 'date-fns';

export const BookingHistory: React.FC = () => {
  const { user } = useAuthContext();
  const [bookings, setBookings] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!user) return;

      try {
        const userBookings = await api.getUserBookings(user.id);
        setBookings(userBookings);
      } catch (error) {
        console.error('Error fetching bookings:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookings();
  }, [user]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'cancelled':
        return 'text-red-600 bg-red-100';
      case 'confirmed':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-yellow-600 bg-yellow-100';
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <LoadingSkeleton />
        <LoadingSkeleton />
        <LoadingSkeleton />
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <EmptyState
        icon={Package}
        title="No bookings yet"
        description="Your booking history will appear here once you make your first ride"
        action={{
          label: 'Book a Ride',
          onClick: () => window.location.reload()
        }}
      />
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-neutral-800 mb-6">Booking History</h2>

      {bookings.map((booking) => (
        <div key={booking.id} className="bg-white rounded-lg shadow-md border border-neutral-200 p-6 card-hover animate-fade-in">
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-center space-x-2">
              {getStatusIcon(booking.status)}
              <StatusBadge status={booking.status as any} />
            </div>
            <div className="text-right">
              <p className="text-lg font-bold text-neutral-800">
                KSh {booking.total_amount.toLocaleString()}
              </p>
              <p className={`text-sm ${booking.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                {booking.payment_status === 'paid' ? 'Paid' : 'Pending Payment'}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4 mb-4">
            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500">Pickup</p>
                <p className="font-medium text-neutral-800">{booking.pickup_location}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MapPin className="w-5 h-5 text-red-500 mt-0.5" />
              <div>
                <p className="text-sm text-neutral-500">Destination</p>
                <p className="font-medium text-neutral-800">{booking.destination}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm text-neutral-500">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1">
                <Calendar className="w-4 h-4" />
                <span>{format(new Date(booking.booking_date), 'MMM dd, yyyy')}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Clock className="w-4 h-4" />
                <span>{format(new Date(booking.created_at), 'HH:mm')}</span>
              </div>
            </div>

            {booking.mpesa_transaction_id && (
              <p className="text-xs text-neutral-400">
                Transaction: {booking.mpesa_transaction_id}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};
