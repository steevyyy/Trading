
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { api } from '../lib/api';

export default function PaymentScreen({ route, navigation }: any) {
  const { booking, vehicleName } = route.params;
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);

  const handlePayment = async () => {
    if (!phoneNumber || phoneNumber.length < 12) {
      Alert.alert('Error', 'Enter valid phone number (254XXXXXXXXX)');
      return;
    }

    setLoading(true);
    try {
      await api.initiatePayment({
        phoneNumber,
        amount: booking.total_amount,
        accountReference: `CONNECTA-${booking.id}`,
        transactionDesc: `Payment for ${vehicleName}`,
        bookingId: booking.id,
      });

      Alert.alert('Success', 'Payment request sent! Check your phone for M-Pesa prompt', [
        { text: 'OK', onPress: () => navigation.navigate('RideTracking', { booking }) },
      ]);
    } catch (error) {
      Alert.alert('Error', 'Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Ionicons name="card" size={48} color="#0ea5e9" style={styles.icon} />
          <Text style={styles.title}>Complete Payment</Text>
          <Text style={styles.subtitle}>Pay with M-Pesa</Text>

          <View style={styles.amountContainer}>
            <Text style={styles.amountLabel}>Total Amount</Text>
            <Text style={styles.amount}>KSh {booking.total_amount.toLocaleString()}</Text>
          </View>

          <View style={styles.detailsContainer}>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Vehicle:</Text>
              <Text style={styles.detailValue}>{vehicleName}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>From:</Text>
              <Text style={styles.detailValue}>{booking.pickup_location}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>To:</Text>
              <Text style={styles.detailValue}>{booking.destination}</Text>
            </View>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="call" size={20} color="#9ca3af" />
            <TextInput
              style={styles.input}
              placeholder="M-Pesa Phone (254XXXXXXXXX)"
              keyboardType="phone-pad"
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              maxLength={12}
            />
          </View>

          <TouchableOpacity
            style={[styles.payButton, loading && styles.payButtonDisabled]}
            onPress={handlePayment}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.payButtonText}>Pay KSh {booking.total_amount.toLocaleString()}</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  content: { flex: 1, padding: 20 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
  },
  icon: { marginBottom: 15 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  subtitle: { fontSize: 16, color: '#6b7280', marginBottom: 20 },
  amountContainer: {
    width: '100%',
    padding: 15,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 15,
  },
  amountLabel: { fontSize: 14, color: '#6b7280', marginBottom: 5 },
  amount: { fontSize: 32, fontWeight: 'bold', color: '#0ea5e9' },
  detailsContainer: { width: '100%', marginBottom: 15 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  detailLabel: { fontSize: 14, color: '#6b7280' },
  detailValue: { fontSize: 14, fontWeight: '600', flex: 1, textAlign: 'right' },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
  },
  input: { flex: 1, marginLeft: 10, fontSize: 16 },
  payButton: {
    width: '100%',
    backgroundColor: '#10b981',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  payButtonDisabled: { opacity: 0.6 },
  payButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});
