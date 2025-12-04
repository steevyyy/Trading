# Connecta Customer App - Android

Production-ready Uber-like customer app for Connecta Transportation platform.

## Features

### 🚗 Core Features
- **Real-time Map** - Interactive map with current location
- **Instant Booking** - Request rides with live vehicle selection
- **M-Pesa Payment** - Secure mobile money integration
- **Live Tracking** - Track driver location in real-time
- **Booking History** - View all past and current rides
- **User Profile** - Manage account and preferences

### 🎨 UI/UX
- **Connecta Branding** - Sky blue (#0ea5e9) primary color
- **Smooth Animations** - Native feel with smooth transitions
- **Bottom Navigation** - Easy access to main features
- **Status Updates** - Real-time ride status notifications
- **Empty States** - Helpful messages when no data

### 📱 Screens
1. **Home** - Map view with booking interface
2. **Payment** - M-Pesa payment processing
3. **Ride Tracking** - Live driver tracking with ETA
4. **Bookings** - Complete ride history
5. **Profile** - User settings and stats

## Installation

```bash
cd connecta-customer-app
npm install
```

## Run Development

```bash
# Start Expo
npm start

# Run on Android
npm run android

# Run on iOS
npm run ios
```

## Build for Production

```bash
# Install EAS CLI
npm install -g eas-cli

# Login to Expo
eas login

# Build Android APK
eas build --platform android --profile production

# Build iOS
eas build --platform ios --profile production
```

## Configuration

Update `src/services/api.ts` with your backend URL:
```typescript
const API_BASE = 'https://connecta-transportation.vercel.app/api';
```

## Tech Stack

- **React Native** - Cross-platform mobile framework
- **Expo** - Development and build platform
- **React Navigation** - Navigation library
- **React Native Maps** - Map integration
- **Expo Location** - GPS and location services
- **Axios** - API client
- **TypeScript** - Type safety

## API Integration

Connects to Connecta backend:
- `/api/bookings` - Create and manage bookings
- `/api/mpesa` - Process payments
- `/api/rides/available` - Get available rides

## Permissions

- **Location** - Required for pickup/destination
- **Internet** - Required for API calls

## Production Checklist

- [x] Real-time map integration
- [x] Vehicle selection
- [x] M-Pesa payment flow
- [x] Ride tracking
- [x] Booking history
- [x] User profile
- [x] Error handling
- [x] Loading states
- [x] Empty states
- [x] Responsive design
- [x] Production-ready styling

## Next Steps

1. Add push notifications
2. Implement real-time driver location updates
3. Add ride rating system
4. Implement promo codes
5. Add saved locations
6. Integrate with Clerk authentication

## Support

For issues or questions, contact: support@connecta.co.ke
