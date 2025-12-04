// Simulated driver matching service
// In production, this would connect to a real driver pool with GPS tracking

interface Driver {
  id: string;
  name: string;
  phone: string;
  rating: number;
  vehicle_plate: string;
  location: [number, number];
  vehicle_type: number;
}

// Mock driver pool for simulation
const mockDrivers: Driver[] = [
  { id: 'DRV001', name: 'John Kamau', phone: '+254712345001', rating: 4.8, vehicle_plate: 'KCA 123A', location: [-1.2921, 36.8219], vehicle_type: 1 },
  { id: 'DRV002', name: 'Mary Wanjiku', phone: '+254712345002', rating: 4.9, vehicle_plate: 'KCB 456B', location: [-1.2864, 36.8172], vehicle_type: 1 },
  { id: 'DRV003', name: 'Peter Omondi', phone: '+254712345003', rating: 4.7, vehicle_plate: 'KCC 789C', location: [-1.2995, 36.8283], vehicle_type: 2 },
  { id: 'DRV004', name: 'Grace Akinyi', phone: '+254712345004', rating: 4.9, vehicle_plate: 'KCD 012D', location: [-1.2850, 36.8250], vehicle_type: 2 },
  { id: 'DRV005', name: 'David Mwangi', phone: '+254712345005', rating: 4.6, vehicle_plate: 'KCE 345E', location: [-1.2940, 36.8150], vehicle_type: 3 },
];

const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

export const findNearestDriver = async (
  pickupCoords: [number, number],
  vehicleType: number
): Promise<{
  driver_id: string;
  driver_name: string;
  driver_phone: string;
  driver_rating: number;
  vehicle_plate: string;
  estimated_arrival: number;
} | null> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  // Filter drivers by vehicle type
  const availableDrivers = mockDrivers.filter(d => d.vehicle_type === vehicleType);

  if (availableDrivers.length === 0) return null;

  // Find nearest driver
  let nearestDriver = availableDrivers[0];
  let minDistance = calculateDistance(
    pickupCoords[0], pickupCoords[1],
    nearestDriver.location[0], nearestDriver.location[1]
  );

  for (const driver of availableDrivers.slice(1)) {
    const distance = calculateDistance(
      pickupCoords[0], pickupCoords[1],
      driver.location[0], driver.location[1]
    );
    if (distance < minDistance) {
      minDistance = distance;
      nearestDriver = driver;
    }
  }

  // Calculate ETA (assuming 30 km/h average speed in city)
  const eta = Math.ceil((minDistance / 30) * 60); // minutes

  return {
    driver_id: nearestDriver.id,
    driver_name: nearestDriver.name,
    driver_phone: nearestDriver.phone,
    driver_rating: nearestDriver.rating,
    vehicle_plate: nearestDriver.vehicle_plate,
    estimated_arrival: eta,
  };
};
