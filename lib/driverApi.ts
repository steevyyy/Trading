const API_BASE = 'https://connecta-transportation.vercel.app';

export const driverApi = {
  getAvailableRides: async () => {
    const res = await fetch(`${API_BASE}/api/rides/available`);
    return res.json();
  },

  acceptRide: async (data: {
    booking_id: string;
    driver_id: string;
    driver_name: string;
    driver_phone: string;
    driver_rating: number;
    vehicle_plate: string;
    estimated_arrival: number;
  }) => {
    const res = await fetch(`${API_BASE}/api/rides/accept`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },

  updateRideStatus: async (booking_id: string, ride_status: string) => {
    const res = await fetch(`${API_BASE}/api/bookings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ booking_id, ride_status })
    });
    return res.json();
  },

  registerDriver: async (data: {
    name: string;
    phone: string;
    email: string;
    vehicle_type: string;
    vehicle_plate: string;
    license_number: string;
  }) => {
    const res = await fetch(`${API_BASE}/api/drivers`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};
