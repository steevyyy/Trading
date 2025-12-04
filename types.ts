
import type React from 'react';

export interface Vehicle {
  id: number;
  name: string;
  capacity: string;
  price: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
}

export interface EventService {
  id: number;
  name: string;
  icon: string;
  description: string;
  features: string[];
}

export interface RideRequest {
  vehicleId: number;
  pickupLocation: string;
  destination: string;
  pickupCoords: [number, number];
  destinationCoords: [number, number];
  estimatedFare: number;
}

export interface DriverInfo {
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  driver_rating: number;
  vehicle_plate: string;
  estimated_arrival: number;
}
