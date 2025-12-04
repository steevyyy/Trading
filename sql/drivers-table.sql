-- Drivers table for driver management
CREATE TABLE IF NOT EXISTS drivers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  vehicle_type VARCHAR(100) NOT NULL,
  vehicle_plate VARCHAR(50) NOT NULL,
  license_number VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  is_available BOOLEAN DEFAULT true,
  rating DECIMAL(3,2) DEFAULT 5.0,
  total_rides INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for faster queries
CREATE INDEX idx_drivers_status ON drivers(status);
CREATE INDEX idx_drivers_available ON drivers(is_available);
