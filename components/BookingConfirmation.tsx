import React from 'react';
import { CheckCircle, Download, Share2, MapPin, Calendar, CreditCard } from 'lucide-react';
import { format } from 'date-fns';

interface BookingConfirmationProps {
  booking: {
    id: string;
    pickup_location: string;
    destination: string;
    booking_date: string;
    total_amount: number;
    payment_status: string;
    mpesa_transaction_id?: string;
    vehicle_id: number;
  };
  vehicleName: string;
  onClose: () => void;
}

export const BookingConfirmation: React.FC<BookingConfirmationProps> = ({ booking, vehicleName, onClose }) => {
  const handleDownload = () => {
    const receipt = `
CONNECTA TRANSPORTATION RECEIPT
================================
Booking ID: ${booking.id}
Date: ${format(new Date(booking.booking_date), 'PPP')}

Vehicle: ${vehicleName}
From: ${booking.pickup_location}
To: ${booking.destination}

Amount: KSh ${booking.total_amount.toLocaleString()}
Payment: ${booking.payment_status}
${booking.mpesa_transaction_id ? `M-Pesa Ref: ${booking.mpesa_transaction_id}` : ''}

Thank you for choosing Connecta!
    `;
    const blob = new Blob([receipt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `connecta-receipt-${booking.id}.txt`;
    a.click();
  };

  const handleShare = async () => {
    const text = `My Connecta ride: ${booking.pickup_location} → ${booking.destination} on ${format(new Date(booking.booking_date), 'PPP')}`;
    if (navigator.share) {
      await navigator.share({ text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Booking details copied to clipboard!');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="text-center mb-6">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-neutral-800 mb-2">Booking Confirmed!</h2>
          <p className="text-neutral-600">Your ride has been successfully booked</p>
        </div>

        <div className="bg-neutral-50 rounded-xl p-4 mb-6 space-y-3">
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-sky-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">Pickup</p>
              <p className="text-sm font-medium text-neutral-800">{booking.pickup_location}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <MapPin className="w-5 h-5 text-green-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">Destination</p>
              <p className="text-sm font-medium text-neutral-800">{booking.destination}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <Calendar className="w-5 h-5 text-neutral-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">Date & Time</p>
              <p className="text-sm font-medium text-neutral-800">{format(new Date(booking.booking_date), 'PPP p')}</p>
            </div>
          </div>
          <div className="flex items-start space-x-3">
            <CreditCard className="w-5 h-5 text-neutral-500 mt-0.5" />
            <div className="flex-1">
              <p className="text-xs text-neutral-500">Total Amount</p>
              <p className="text-lg font-bold text-neutral-800">KSh {booking.total_amount.toLocaleString()}</p>
            </div>
          </div>
        </div>

        <div className="flex gap-3 mb-4">
          <button onClick={handleDownload} className="flex-1 flex items-center justify-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 rounded-lg font-medium transition-colors button-press">
            <Download className="w-4 h-4" />
            <span>Receipt</span>
          </button>
          <button onClick={handleShare} className="flex-1 flex items-center justify-center space-x-2 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 py-3 rounded-lg font-medium transition-colors button-press">
            <Share2 className="w-4 h-4" />
            <span>Share</span>
          </button>
        </div>

        <button onClick={onClose} className="w-full bg-sky-500 hover:bg-sky-600 text-white py-3 rounded-lg font-semibold transition-colors button-press">
          Done
        </button>
      </div>
    </div>
  );
};
