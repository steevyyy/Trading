
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@clerk/clerk-expo';
import { api } from '../lib/api';
import { geocodeAddress, calculateDistance } from '../lib/geoapify';

const VEHICLES = [
  { id: 1, name: 'Boda Boda', icon: 'bicycle', price: 50, capacity: '1-2' },
  { id: 2, name: 'Car', icon: 'car', price: 100, capacity: '1-4' },
  { id: 3, name: 'Van', icon: 'bus', price: 250, capacity: '8-14' },
];

export default function HomeScreen({ navigation }: any) {
  const { userId } = useAuth();
  const [location, setLocation] = useState<any>(null);
  const [pickup, setPickup] = useState('');
  const [destination, setDestination] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState(VEHICLES[0]);
  const [estimatedFare, setEstimatedFare] = useState(0);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        latitude: loc.coords.latitude,
        longitude: loc.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      });
    })();
  }, []);

  useEffect(() => {
    if (pickup && destination) {
      calculateFare();
    }
  }, [pickup, destination, selectedVehicle]);

  const calculateFare = async () => {
    try {
      const [pickupCoords, destinationCoords] = await Promise.all([
        geocodeAddress(pickup),
        geocodeAddress(destination),
      ]);

      if (pickupCoords && destinationCoords) {
        const distance = await calculateDistance(
          pickupCoords.lat,
          pickupCoords.lon,
          destinationCoords.lat,
          destinationCoords.lon
        );
        setEstimatedFare(distance * selectedVehicle.price);
      }
    } catch (error) {
      console.error('Failed to calculate fare:', error);
    }
  };

  const handleBookRide = async () => {
    if (!pickup || !destination) {
      Alert.alert('Error', 'Please enter pickup and destination');
      return;
    }

    try {
      const booking = await api.createBooking({
        user_id: userId,
        vehicle_id: selectedVehicle.id,
        pickup_location: pickup,
        destination: destination,
        pickup_coords: `${location.latitude},${location.longitude}`,
        destination_coords: `${location.latitude + 0.01},${location.longitude + 0.01}`,
        booking_date: new Date().toISOString(),
        ride_type: 'instant',
        ride_status: 'searching',
        status: 'pending',
        total_amount: estimatedFare,
        payment_status: 'pending',
      });

      navigation.navigate('Payment', { booking, vehicleName: selectedVehicle.name });
    } catch (error) {
      Alert.alert('Error', 'Failed to create booking');
    }
  };

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        provider={PROVIDER_GOOGLE}
        region={location}
        showsUserLocation
        showsMyLocationButton
      >
        {location && <Marker coordinate={location} title="Your Location" />}
      </MapView>

      <View style={styles.searchContainer}>
        <View style={styles.inputContainer}>
          <Ionicons name="location" size={20} color="#0ea5e9" />
          <TextInput
            style={styles.input}
            placeholder="Pickup location"
            value={pickup}
            onChangeText={setPickup}
          />
        </View>
        <View style={styles.inputContainer}>
          <Ionicons name="navigate" size={20} color="#ef4444" />
          <TextInput
            style={styles.input}
            placeholder="Where to?"
            value={destination}
            onChangeText={setDestination}
          />
        </View>
      </View>

      <View style={styles.bottomSheet}>
        <Text style={styles.title}>Choose Vehicle</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.vehicleList}>
          {VEHICLES.map((vehicle) => (
            <TouchableOpacity
              key={vehicle.id}
              style={[
                styles.vehicleCard,
                selectedVehicle.id === vehicle.id && styles.vehicleCardActive,
              ]}
              onPress={() => setSelectedVehicle(vehicle)}
            >
              <Ionicons
                name={vehicle.icon as any}
                size={32}
                color={selectedVehicle.id === vehicle.id ? '#fff' : '#000'}
              />
              <Text style={[styles.vehicleName, selectedVehicle.id === vehicle.id && styles.textWhite]}>
                {vehicle.name}
              </Text>
              <Text style={[styles.vehiclePrice, selectedVehicle.id === vehicle.id && styles.textWhite]}>
                KSh {vehicle.price}/km
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <View style={styles.fareContainer}>
          <Text style={styles.fareLabel}>Estimated Fare</Text>
          <Text style={styles.fareAmount}>KSh {estimatedFare.toFixed(2)}</Text>
        </View>

        <TouchableOpacity style={styles.bookButton} onPress={handleBookRide}>
          <Text style={styles.bookButtonText}>Request Ride</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  map: { flex: 1 },
  searchContainer: {
    position: 'absolute',
    top: 50,
    left: 10,
    right: 10,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingVertical: 8,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  bottomSheet: {
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
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  vehicleList: { marginBottom: 20 },
  vehicleCard: {
    alignItems: 'center',
    padding: 10,
    marginRight: 10,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    minWidth: 100,
  },
  vehicleCardActive: { backgroundColor: '#0ea5e9' },
  vehicleName: { fontSize: 14, fontWeight: '600', marginTop: 5 },
  vehiclePrice: { fontSize: 12, color: '#64748b', marginTop: 4 },
  textWhite: { color: '#fff' },
  fareContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
  },
  fareLabel: { fontSize: 16, color: '#64748b' },
  fareAmount: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  bookButton: {
    backgroundColor: '#0ea5e9',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  bookButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
