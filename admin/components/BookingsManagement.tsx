
import React, { useState, useEffect } from 'react';
import { Search, MapPin, Calendar, DollarSign, CheckCircle, XCircle, Clock, AlertCircle, Trash2 } from 'lucide-react';
import { adminApi } from '../../lib/adminApi';
import toast from 'react-hot-toast';

export default function BookingsManagement() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  useEffect(() => {
    let filtered = bookings;

    if (searchTerm) {
      filtered = filtered.filter(booking =>
        booking.user_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.pickup_location.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.destination.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter(booking => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchTerm, statusFilter, bookings]);

  const loadBookings = async () => {
    try {
      const data = await adminApi.getBookings();
      setBookings(data);
      setFilteredBookings(data);
    } catch (error) {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (bookingId: string, newStatus: string) => {
    try {
      await adminApi.updateBooking(bookingId, { status: newStatus });
      toast.success('Booking status updated');
      loadBookings();
    } catch (error) {
      toast.error('Failed to update status');
    }
  };

  const handleDelete = async (bookingId: string) => {
    if (!confirm('Delete this booking? This action cannot be undone.')) return;

    try {
      await adminApi.deleteBooking(bookingId);
      toast.success('Booking deleted');
      loadBookings();
    } catch (error) {
      toast.error('Failed to delete booking');
    }
  };

  const getStatusBadge = (status: string) => {
    const badges: any = {
      completed: { color: 'bg-green-100 text-green-700', icon: CheckCircle, text: 'Completed' },
      confirmed: { color: 'bg-blue-100 text-blue-700', icon: Clock, text: 'Confirmed' },
      pending: { color: 'bg-yellow-100 text-yellow-700', icon: AlertCircle, text: 'Pending' },
      cancelled: { color: 'bg-red-100 text-red-700', icon: XCircle, text: 'Cancelled' },
    };
    const badge = badges[status] || badges.pending;
    const Icon = badge.icon;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${badge.color}`}>
        <Icon className="w-3 h-3" />
        {badge.text}
      </span>
    );
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div></div>;
  }

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <h2 className="text-2xl font-bold text-neutral-800">Bookings Management</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search bookings..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent w-full sm:w-64"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md border border-neutral-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-neutral-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">User</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Route</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-neutral-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200">
              {filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-neutral-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-neutral-800">{booking.user_name || 'Unknown'}</div>
                    <div className="text-xs text-neutral-500">{booking.user_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-start gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <div className="text-neutral-800 font-medium">{booking.pickup_location}</div>
                        <div className="text-neutral-600">→ {booking.destination}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-neutral-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-semibold text-neutral-800">
                    <div className="flex items-center gap-1">
                      <DollarSign className="w-4 h-4" />
                      KSh {booking.total_amount}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                      booking.payment_status === 'paid' ? 'bg-green-100 text-green-700' :
                      booking.payment_status === 'failed' ? 'bg-red-100 text-red-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {booking.payment_status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={booking.status}
                      onChange={(e) => handleStatusChange(booking.id, e.target.value)}
                      className="px-3 py-1 border border-neutral-300 rounded-lg text-sm focus:ring-2 focus:ring-sky-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleDelete(booking.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-4 text-sm text-neutral-600">
        Showing {filteredBookings.length} of {bookings.length} bookings
      </div>
    </div>
  );
}
