import axios from 'axios';

const API_BASE = 'https://connecta-transportation.vercel.app/api';

export const api = {
  createBooking: async (data: any) => {
    const res = await axios.post(`${API_BASE}/bookings`, data);
    return res.data;
  },

  getUserBookings: async (userId: string) => {
    const res = await axios.get(`${API_BASE}/bookings?user_id=${userId}`);
    return res.data;
  },

  getActiveRide: async (userId: string) => {
    const res = await axios.get(`${API_BASE}/bookings?user_id=${userId}&active=true`);
    return res.data;
  },

  updateRideStatus: async (bookingId: string, status: string) => {
    const res = await axios.put(`${API_BASE}/bookings`, {
      booking_id: bookingId,
      ride_status: status,
    });
    return res.data;
  },

  initiatePayment: async (data: any) => {
    const res = await axios.post(`${API_BASE}/mpesa`, data);
    return res.data;
  },
};
