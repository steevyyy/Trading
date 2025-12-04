
import axios from 'axios';

const API_BASE = import.meta.env.PROD
  ? 'https://connecta-transportation.vercel.app/api/admin'
  : '/api/admin';

async function request(endpoint: string, options: any = {}) {
  const { method = 'GET', data, params } = options;

  const session = window.Clerk.session;
  if (!session) {
    throw new Error('Unauthorized');
  }

  const sessionId = session.id;
  const queryParams = { ...params, sessionId };

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

export const adminApi = {
  getUsers: () => request('users'),
  updateUser: (userId: string, data: any) => request(`users`, { method: 'PUT', data: { user_id: userId, ...data } }),
  deleteUser: (userId: string) => request(`users`, { method: 'DELETE', data: { user_id: userId } }),

  getBookings: () => request('bookings'),
  updateBooking: (bookingId: string, data: any) => request(`bookings`, { method: 'PUT', data: { booking_id: bookingId, ...data } }),
  deleteBooking: (bookingId: string) => request(`bookings`, { method: 'DELETE', data: { booking_id: bookingId } }),

  getAnalytics: (type: string, days?: number) => request('analytics', { params: { type, days } }),
};
