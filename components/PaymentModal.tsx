
import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Loader2 } from 'lucide-react';
import { api } from '../lib/api';
import { validatePhone, formatPhone } from '../utils/validation';
import toast from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  bookingDetails: {
    pickup: string;
    destination: string;
    vehicleName: string;
    date: string;
  };
  onPaymentSuccess: (transactionId: string) => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  bookingDetails,
  onPaymentSuccess
}) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [phoneError, setPhoneError] = useState('');

  if (!isOpen) return null;

  const handleMpesaPayment = async () => {
    const formatted = formatPhone(phoneNumber);
    const validation = validatePhone(formatted);

    if (!validation.valid) {
      setPhoneError(validation.error || '');
      return;
    }

    setPhoneError('');

    setIsProcessing(true);

    try {
      const response = await api.initiatePayment({
        phoneNumber: formatted,
        amount: Math.ceil(amount),
        accountReference: `CONNECTA-${Date.now()}`,
        transactionDesc: `Payment for ${bookingDetails.vehicleName}`
      });

      if (response.ResponseCode === '0') {
        toast.success('✅ STK Push sent! Please check your phone to complete the payment.');
        // In a real application, you would poll a callback URL or use WebSockets
        // to get the payment status. For this demo, we'll simulate a success
        // after a short delay.
        setTimeout(() => {
          onPaymentSuccess(response.CheckoutRequestID);
          onClose();
        }, 8000);
      } else {
        toast.error(response.CustomerMessage || 'Payment failed to initiate.');
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('Payment failed. Please try again.');
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fade-in">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 animate-scale-in">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-neutral-800">Complete Payment</h2>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="mb-6 p-4 bg-neutral-50 rounded-lg">
          <h3 className="font-semibold text-neutral-800 mb-2">Booking Summary</h3>
          <div className="space-y-1 text-sm text-neutral-600">
            <p><span className="font-medium">Vehicle:</span> {bookingDetails.vehicleName}</p>
            <p><span className="font-medium">From:</span> {bookingDetails.pickup}</p>
            <p><span className="font-medium">To:</span> {bookingDetails.destination}</p>
            <p><span className="font-medium">Date:</span> {bookingDetails.date}</p>
          </div>
          <div className="mt-3 pt-3 border-t border-neutral-200">
            <p className="text-lg font-bold text-neutral-800">
              Total: KSh {amount.toLocaleString()}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-3 p-4 border-2 border-green-200 rounded-lg bg-green-50">
            <Smartphone className="w-8 h-8 text-green-600" />
            <div>
              <h4 className="font-semibold text-green-800">M-Pesa Payment</h4>
              <p className="text-sm text-green-600">Pay securely with M-Pesa</p>
            </div>
          </div>

          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-neutral-700 mb-2">
              M-Pesa Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              value={phoneNumber}
              onChange={(e) => {
                setPhoneNumber(e.target.value);
                setPhoneError('');
              }}
              placeholder="254712345678"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 ${
                phoneError ? 'border-red-500' : 'border-neutral-300'
              }`}
            />
            {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
            <p className="text-xs text-neutral-500 mt-1">
              Enter your M-Pesa registered phone number
            </p>
          </div>

          <button
            onClick={handleMpesaPayment}
            disabled={isProcessing}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg transition-colors button-press disabled:bg-green-300 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-5 h-5" />
                <span>Pay KSh {amount.toLocaleString()}</span>
              </>
            )}
          </button>
        </div>

        <p className="text-xs text-neutral-500 text-center mt-4">
          You will receive an M-Pesa prompt on your phone to complete the payment
        </p>
      </div>
    </div>
  );
};
