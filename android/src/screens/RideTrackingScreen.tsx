
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../lib/api';
import toast from 'react-hot-toast';

export default function RideTrackingScreen({ route, navigation }: any) {
  const { booking } = route.params;
  const [rideStatus, setRideStatus] = useState(booking.ride_status);

  const pickupCoords = booking.pickup_coords.split(',').map(Number);
  const destinationCoords = booking.destination_coords.split(',').map(Number);

  const statusMessages: { [key: string]: string } = {
    driver_assigned: 'Driver is on the way',
    en_route: 'Driver arriving soon',
    arrived: 'Driver has arrived',
    in_progress: 'Ride in progress',
    completed: 'Ride completed',
  };

  useEffect(() => {
    const interval = setInterval(() => {
      // In a real app, you would fetch the ride status from the backend
      // For now, we'll simulate the ride progress
      const statuses = ['driver_assigned', 'en_route', 'arrived', 'in_progress', 'completed'];
      const currentIndex = statuses.indexOf(rideStatus);
      if (currentIndex < statuses.length - 1) {
        setRideStatus(statuses[currentIndex + 1]);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [rideStatus]);

  const handleCancelRide = async () => {
    try {
      await api.updateRideStatus(booking.id, 'cancelled');
      toast.success('Ride cancelled');
      navigation.goBack();
    } catch (error) {
      toast.error('Failed to cancel ride');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          latitude: pickupCoords[0],
          longitude: pickupCoords[1],
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        }}
      >
        <Marker coordinate={{ latitude: pickupCoords[0], longitude: pickupCoords[1] }} title="Pickup" />
        <Marker coordinate={{ latitude: destinationCoords[0], longitude: destinationCoords[1] }} title="Destination" pinColor="blue" />
        <Polyline coordinates={[{ latitude: pickupCoords[0], longitude: pickupCoords[1] }, { latitude: destinationCoords[0], longitude: destinationCoords[1] }]} strokeColor="#0ea5e9" strokeWidth={3} />
      </MapView>

      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Ionicons name="arrow-back" size={24} color="#000" />
      </TouchableOpacity>

      <View style={styles.driverCard}>
        <View style={styles.statusHeader}>
          <View style={styles.statusDot} />
          <Text style={styles.statusText}>{statusMessages[rideStatus]}</Text>
        </View>

        <View style={styles.driverInfo}>
          <View style={styles.avatar}>
            <Ionicons name="person" size={32} color="#fff" />
          </View>
          <View style={styles.driverDetails}>
            <Text style={styles.driverName}>{booking.driver_name || 'Searching...'}</Text>
            {booking.driver_rating && (
              <View style={styles.ratingContainer}>
                <Ionicons name="star" size={16} color="#f59e0b" />
                <Text style={styles.rating}>{booking.driver_rating}</Text>
              </View>
            )}
            <Text style={styles.vehicleInfo}>{booking.vehicle_plate}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelRide}>
          <Text style={styles.cancelButtonText}>Cancel Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  driverCard: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 10,
  },
  statusHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
    marginRight: 10,
  },
  statusText: { fontSize: 16, fontWeight: '600' },
  driverInfo: { flexDirection: 'row', marginBottom: 20 },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  driverDetails: { flex: 1 },
  driverName: { fontSize: 18, fontWeight: 'bold', marginBottom: 5 },
  ratingContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 5 },
  rating: { marginLeft: 4, fontSize: 14, fontWeight: '600' },
  vehicleInfo: { fontSize: 14, color: '#6b7280' },
  cancelButton: {
    padding: 15,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ef4444',
    alignItems: 'center',
  },
  cancelButtonText: { color: '#ef4444', fontSize: 16, fontWeight: '600' },
});
