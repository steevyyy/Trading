
import React, { useState, useEffect } from 'react';
import { TrendingUp, DollarSign, Users, Car, Calendar } from 'lucide-react';
import { adminApi } from '../../lib/adminApi';

export default function Analytics() {
  const [stats, setStats] = useState<any>(null);
  const [revenueData, setRevenueData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [period, setPeriod] = useState(30);

  useEffect(() => {
    loadAnalytics();
  }, [period]);

  const loadAnalytics = async () => {
    try {
      const [statsData, revenueByDate] = await Promise.all([
        adminApi.getAnalytics('stats'),
        adminApi.getAnalytics('revenue', period)
      ]);
      setStats(statsData);
      setRevenueData(revenueByDate);
    } catch (error) {
      console.error('Failed to load analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-500"></div></div>;
  }

  const StatCard = ({ icon: Icon, title, value, color, subtitle }: any) => (
    <div className="bg-white rounded-xl shadow-md p-6 border border-neutral-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center ${color}`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
      <h3 className="text-3xl font-bold text-neutral-800 mb-1">{value}</h3>
      <p className="text-sm text-neutral-600">{title}</p>
      {subtitle && <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>}
    </div>
  );

  const totalRevenue = revenueData.reduce((sum, day) => sum + parseFloat(day.revenue || 0), 0);
  const totalRides = revenueData.reduce((sum, day) => sum + parseInt(day.rides || 0), 0);
  const avgRevenuePerRide = totalRides > 0 ? totalRevenue / totalRides : 0;

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-neutral-800">Analytics & Reports</h2>
        <select
          value={period}
          onChange={(e) => setPeriod(Number(e.target.value))}
          className="px-4 py-2 border border-neutral-300 rounded-lg focus:ring-2 focus:ring-sky-500"
        >
          <option value={7}>Last 7 days</option>
          <option value={30}>Last 30 days</option>
          <option value={90}>Last 90 days</option>
        </select>
      </div>

      {/* Overview Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={Users}
          title="Total Users"
          value={stats?.totalUsers?.toLocaleString() || '0'}
          color="bg-sky-500"
        />
        <StatCard
          icon={Car}
          title="Total Bookings"
          value={stats?.totalBookings?.toLocaleString() || '0'}
          color="bg-green-500"
        />
        <StatCard
          icon={DollarSign}
          title="Total Revenue"
          value={`KSh ${(stats?.totalRevenue || 0).toLocaleString()}`}
          color="bg-purple-500"
        />
        <StatCard
          icon={TrendingUp}
          title="Active Rides"
          value={stats?.activeRides || '0'}
          color="bg-orange-500"
          subtitle="Currently in progress"
        />
      </div>

      {/* Period Stats */}
      <div className="grid sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-sky-500 to-blue-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <DollarSign className="w-8 h-8" />
            <h3 className="text-lg font-semibold">Period Revenue</h3>
          </div>
          <p className="text-3xl font-bold">KSh {totalRevenue.toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-1">Last {period} days</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <Car className="w-8 h-8" />
            <h3 className="text-lg font-semibold">Period Rides</h3>
          </div>
          <p className="text-3xl font-bold">{totalRides.toLocaleString()}</p>
          <p className="text-sm opacity-90 mt-1">Last {period} days</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-md p-6 text-white">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-8 h-8" />
            <h3 className="text-lg font-semibold">Avg per Ride</h3>
          </div>
          <p className="text-3xl font-bold">KSh {avgRevenuePerRide.toFixed(0)}</p>
          <p className="text-sm opacity-90 mt-1">Average revenue</p>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="bg-white rounded-xl shadow-md border border-neutral-200 p-6">
        <h3 className="text-xl font-bold text-neutral-800 mb-6">Daily Revenue</h3>
        <div className="space-y-3">
          {revenueData.slice(0, 10).map((day, index) => {
            const maxRevenue = Math.max(...revenueData.map(d => parseFloat(d.revenue || 0)));
            const percentage = maxRevenue > 0 ? (parseFloat(day.revenue || 0) / maxRevenue) * 100 : 0;

            return (
              <div key={index} className="flex items-center gap-4">
                <div className="w-24 text-sm text-neutral-600 flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </div>
                <div className="flex-1">
                  <div className="bg-neutral-100 rounded-full h-8 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-sky-500 to-blue-600 h-full flex items-center justify-end pr-3 text-white text-sm font-semibold transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    >
                      {percentage > 15 && `KSh ${parseFloat(day.revenue || 0).toLocaleString()}`}
                    </div>
                  </div>
                </div>
                <div className="w-20 text-sm text-neutral-600 text-right">
                  {day.rides} rides
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
