# Connecta - Event Transportation Platform

A comprehensive transportation booking platform for Kenya with integrated payment processing, real-time mapping, and user authentication.

## Features

### 🚗 Transportation Services
- **Regular Rides**: Boda bodas, cars, vans, and buses for daily transportation
- **Event Services**: Specialized transport for weddings, graduations, corporate events, and more
- **Real-time Mapping**: Interactive maps with route visualization using Leaflet and GeoApify
- **Vehicle Selection**: Choose from a diverse fleet based on capacity and pricing

### 🔐 Authentication & User Management
- **Clerk Integration**: Secure user authentication with sign-up/sign-in
- **User Profiles**: Manage personal information and preferences
- **Booking History**: Track all past and current bookings

### 💳 Payment Processing
- **M-Pesa Integration**: Secure mobile money payments via Safaricom STK Push
- **Real-time Payment Status**: Track payment confirmation and booking updates
- **Transaction History**: Complete payment records with M-Pesa transaction IDs

### 🗺️ Location Services
- **GeoApify Integration**: Accurate geocoding and reverse geocoding
- **Distance Calculation**: Automatic fare calculation based on route distance
- **Current Location**: GPS-based location detection for pickup points

### 💾 Database Management
- **NeonDB Integration**: PostgreSQL database for scalable data storage
- **User Management**: Secure user data with Clerk ID integration
- **Booking System**: Complete booking lifecycle management

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Authentication**: Clerk
- **Database**: NeonDB (PostgreSQL)
- **Payments**: M-Pesa STK Push API
- **Maps**: Leaflet, React-Leaflet
- **Geocoding**: GeoApify API
- **Build Tool**: Vite
- **Notifications**: React Hot Toast

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# Clerk Authentication
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_key_here

# GeoApify API
VITE_GEOAPIFY_API_KEY=your_geoapify_key_here

# M-Pesa Configuration
VITE_MPESA_CONSUMER_KEY=your_mpesa_consumer_key
VITE_MPESA_CONSUMER_SECRET=your_mpesa_consumer_secret
VITE_MPESA_SHORTCODE=your_mpesa_shortcode
VITE_MPESA_PASSKEY=your_mpesa_passkey

# Database
DATABASE_URL=postgresql://username:password@host:port/database

# Optional
GEMINI_API_KEY=your_gemini_key_for_ai_features
```

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Database Setup**
   - Create a NeonDB database
   - Run the schema from `sql/schema.sql`
   - Update `DATABASE_URL` in `.env.local`

3. **Configure Services**
   - Set up Clerk authentication project
   - Get GeoApify API key
   - Configure M-Pesa sandbox/production credentials

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## API Integrations

### Clerk Authentication
- User registration and login
- Session management
- User profile data

### NeonDB Database
- User data storage
- Booking management
- Transaction records

### GeoApify Services
- Address geocoding
- Reverse geocoding
- Route distance calculation

### M-Pesa STK Push
- Payment initiation
- Transaction status queries
- Payment confirmation callbacks

## Project Structure

```
├── components/           # Reusable UI components
│   ├── icons/           # SVG icon components
│   ├── BookingForm.tsx  # Booking form with location services
│   ├── PaymentModal.tsx # M-Pesa payment interface
│   └── ...
├── lib/                 # Core utilities and integrations
│   ├── auth.tsx        # Authentication context
│   ├── database.ts     # NeonDB operations
│   ├── geoapify.ts     # Location services
│   └── mpesa.ts        # Payment processing
├── pages/              # Main application pages
├── sql/                # Database schema
└── types.ts           # TypeScript type definitions
```

## Key Features Implementation

### Booking Flow
1. User selects vehicle and enters trip details
2. GeoApify geocodes pickup/destination addresses
3. System calculates distance and fare
4. Booking is created in NeonDB
5. M-Pesa payment modal opens
6. STK Push initiates payment
7. Payment confirmation updates booking status

### Authentication Flow
1. Clerk handles sign-up/sign-in
2. User data synced with NeonDB
3. Session management across app
4. Protected routes for authenticated features

### Payment Processing
1. M-Pesa STK Push API integration
2. Real-time payment status tracking
3. Automatic booking confirmation
4. Transaction ID storage

## Development Notes

- Uses React 18 for compatibility with react-leaflet
- TypeScript for type safety
- Tailwind CSS for responsive design
- Modular architecture for scalability
- Error handling and user feedback
- Mobile-responsive design

## Production Deployment

1. Update M-Pesa URLs to production endpoints
2. Configure production database
3. Set up proper environment variables
4. Enable HTTPS for secure payments
5. Configure Clerk production settings

## Support

For issues or questions:
- Check environment variable configuration
- Verify API key permissions
- Review database connection settings
- Test M-Pesa sandbox integration first