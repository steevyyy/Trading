
import axios from 'axios';

const API_BASE = import.meta.env.PROD
  ? 'https://connecta-transportation.vercel.app/api'
  : '/api';

async function request(endpoint: string, options: any = {}) {
  const { method = 'GET', data, params } = options;

  const session = window.Clerk.session;
  if (!session) {
    throw new Error('Unauthorized');
  }

  const sessionId = session.id;
  constqueryParams = { ...params, sessionId };

  const config = {
    url: `${API_BASE}/${endpoint}`,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    data,
    params: queryParams,
  };

  try {
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`API request to ${endpoint} failed:`, error);
    throw error;
  }
}

export const api = {
  // Users
  createUser: (userData: any) => request('users', { method: 'POST', data: userData }),
  getUserByClerkId: (clerkId: string) => request('users', { params: { clerk_id: clerkId } }),

  // Bookings
  createBooking: (bookingData: any) => request('bookings', { method: 'POST', data: bookingData }),
  getUserBookings: (userId: string) => request('bookings', { params: { user_id: userId } }),
  getActiveRide: (userId: string) => request('bookings', { params: { user_id: userId, active: true } }),
  updateBookingPayment: (bookingId: string, transactionId: string) => request('bookings', { method: 'PUT', data: { booking_id: bookingId, payment_status: 'paid', mpesa_transaction_id: transactionId } }),
  updateBookingDriver: (bookingId: string, driverInfo: any) => request('bookings', { method: 'PUT', data: { booking_id: bookingId, driver_info: driverInfo } }),
  updateRideStatus: (bookingId: string, rideStatus: string) => request('bookings', { method: 'PUT', data: { booking_id: bookingId, ride_status: rideStatus } }),

  // M-Pesa
  initiatePayment: (paymentData: any) => request('mpesa', { method: 'POST', data: paymentData }),

  // Drivers
  createDriver: (driverData: any) => request('drivers', { method: 'POST', data: driverData }),
};
