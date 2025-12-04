import axios from 'axios';

const API_BASE = import.meta.env.PROD
  ? 'https://connecta-transportation.vercel.app/api'
  : '/api';

const retryRequest = async (fn: () => Promise<any>, retries = 3, delay = 1000): Promise<any> => {
  try {
    return await fn();
  } catch (error) {
    if (retries === 0) throw error;
    await new Promise(resolve => setTimeout(resolve, delay));
    return retryRequest(fn, retries - 1, delay * 2);
  }
};

export const apiWithRetry = {
  createBooking: (data: any) => retryRequest(() =>
    axios.post(`${API_BASE}/bookings`, data).then(r => r.data)
  ),

  initiatePayment: (data: any) => retryRequest(() =>
    axios.post(`${API_BASE}/mpesa`, data).then(r => r.data)
  ),

  updateBookingPayment: (bookingId: string, transactionId: string) => retryRequest(() =>
    axios.put(`${API_BASE}/bookings`, { booking_id: bookingId, payment_status: 'paid', mpesa_transaction_id: transactionId }).then(r => r.data)
  ),
};
