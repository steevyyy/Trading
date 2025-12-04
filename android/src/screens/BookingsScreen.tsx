
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, RefreshControl } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { useFocusEffect } from '@react-navigation/native';
import { api } from '../lib/api';

export default function BookingsScreen() {
  const { userId } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    if (!userId) return;
    try {
      const data = await api.getUserBookings(userId);
      setBookings(data);
    } catch (error) {
      console.error('Error fetching bookings:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchBookings();
    }, [userId])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'cancelled': return '#ef4444';
      case 'confirmed': return '#3b82f6';
      default: return '#f59e0b';
    }
  };

  const renderBooking = ({ item }: any) => (
    <View style={styles.bookingCard}>
      <View style={styles.bookingHeader}>
        <View style={[styles.statusBadge, { backgroundColor: getStatusColor(item.status) }]}>
          <Text style={styles.statusText}>{item.status.toUpperCase()}</Text>
        </View>
        <Text style={styles.amount}>KSh {item.total_amount.toLocaleString()}</Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="location" size={20} color="#0ea5e9" />
        <Text style={styles.locationText}>{item.pickup_location}</Text>
      </View>

      <View style={styles.locationRow}>
        <Ionicons name="navigate" size={20} color="#ef4444" />
        <Text style={styles.locationText}>{item.destination}</Text>
      </View>

      <View style={styles.bookingFooter}>
        <Text style={styles.date}>{new Date(item.created_at).toLocaleDateString()}</Text>
        {item.mpesa_transaction_id && (
          <Text style={styles.transactionId}>Ref: {item.mpesa_transaction_id}</Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
      </View>

      {bookings.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="calendar-outline" size={64} color="#9ca3af" />
          <Text style={styles.emptyText}>No bookings yet</Text>
          <Text style={styles.emptySubtext}>Your ride history will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={bookings}
          renderItem={renderBooking}
          keyExtractor={(item: any) => item.id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    backgroundColor: '#fff',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: { fontSize: 24, fontWeight: 'bold' },
  list: { padding: 10 },
  bookingCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  bookingHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  amount: { fontSize: 18, fontWeight: 'bold' },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  locationText: { marginLeft: 10, fontSize: 14, flex: 1 },
  bookingFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  date: { fontSize: 12, color: '#6b7280' },
  transactionId: { fontSize: 12, color: '#6b7280' },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: { fontSize: 18, fontWeight: 'bold', marginTop: 15 },
  emptySubtext: { fontSize: 14, color: '#6b7280', marginTop: 5 },
});
