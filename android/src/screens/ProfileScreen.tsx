
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useUser, useAuth } from '@clerk/clerk-expo';

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();

  const menuItems = [
    { icon: 'person-outline', title: 'Edit Profile', onPress: () => Alert.alert('Coming Soon') },
    { icon: 'card-outline', title: 'Payment Methods', onPress: () => Alert.alert('Coming Soon') },
    { icon: 'location-outline', title: 'Saved Places', onPress: () => Alert.alert('Coming Soon') },
    { icon: 'notifications-outline', title: 'Notifications', onPress: () => Alert.alert('Coming Soon') },
    { icon: 'help-circle-outline', title: 'Help & Support', onPress: () => Alert.alert('Coming Soon') },
    { icon: 'document-text-outline', title: 'Terms & Conditions', onPress: () => Alert.alert('Coming Soon') },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Ionicons name="person" size={48} color="#fff" />
        </View>
        <Text style={styles.name}>{user?.fullName}</Text>
        <Text style={styles.email}>{user?.primaryEmailAddress?.emailAddress}</Text>
        <Text style={styles.phone}>{user?.primaryPhoneNumber?.phoneNumber}</Text>
      </View>

      <View style={styles.menuContainer}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem} onPress={item.onPress}>
            <View style={styles.menuLeft}>
              <Ionicons name={item.icon as any} size={24} color="#000" />
              <Text style={styles.menuTitle}>{item.title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9ca3af" />
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={() => signOut()}>
        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>

      <Text style={styles.version}>Version 1.0.0</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f1f5f9' },
  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 5 },
  email: { fontSize: 14, color: '#6b7280', marginBottom: 4 },
  phone: { fontSize: 14, color: '#6b7280' },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    borderRadius: 12,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  menuLeft: { flexDirection: 'row', alignItems: 'center' },
  menuTitle: { marginLeft: 15, fontSize: 16 },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 10,
    marginHorizontal: 10,
    padding: 15,
    borderRadius: 12,
  },
  logoutText: { marginLeft: 10, fontSize: 16, color: '#ef4444', fontWeight: '600' },
  version: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 20,
    marginBottom: 20,
  },
});
