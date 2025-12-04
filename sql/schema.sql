-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clerk_id VARCHAR(255) UNIQUE NOT NULL,
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    vehicle_id INTEGER NOT NULL,
    pickup_location TEXT NOT NULL,
    destination TEXT NOT NULL,
    pickup_coords TEXT NOT NULL,
    destination_coords TEXT NOT NULL,
    booking_date DATE NOT NULL,
    ride_type VARCHAR(20) DEFAULT 'scheduled' CHECK (ride_type IN ('scheduled', 'instant')),
    ride_status VARCHAR(20) DEFAULT 'pending' CHECK (ride_status IN ('pending', 'searching', 'driver_assigned', 'en_route', 'arrived', 'in_progress', 'completed', 'cancelled')),
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled')),
    total_amount INTEGER NOT NULL,
    payment_status VARCHAR(20) DEFAULT 'pending' CHECK (payment_status IN ('pending', 'paid', 'failed')),
    mpesa_transaction_id VARCHAR(255),
    driver_id VARCHAR(255),
    driver_name VARCHAR(255),
    driver_phone VARCHAR(20),
    driver_rating DECIMAL(2,1),
    driver_location TEXT,
    vehicle_plate VARCHAR(20),
    estimated_arrival INTEGER,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_clerk_id ON users(clerk_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_ride_status ON bookings(ride_status);
CREATE INDEX IF NOT EXISTS idx_bookings_ride_type ON bookings(ride_type);
CREATE INDEX IF NOT EXISTS idx_bookings_payment_status ON bookings(payment_status);
CREATE INDEX IF NOT EXISTS idx_bookings_created_at ON bookings(created_at DESC);