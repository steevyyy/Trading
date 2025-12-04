
import axios from 'axios';

const GEOAPIFY_API_KEY = process.env.EXPO_PUBLIC_GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com/v1';

export interface GeocodingResult {
  lat: number;
  lon: number;
  formatted: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/geocode/search`, {
      params: {
        text: address,
        apiKey: GEOAPIFY_API_KEY,
        limit: 1,
      },
    });

    if (response.data.features && response.data.features.length > 0) {
      const { geometry, properties } = response.data.features[0];
      return {
        lat: geometry.coordinates[1],
        lon: geometry.coordinates[0],
        formatted: properties.formatted,
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const calculateDistance = async (
  startLat: number,
  startLon: number,
  endLat: number,
  endLon: number
): Promise<number> => {
  try {
    const response = await axios.get(`${BASE_URL}/routing`, {
      params: {
        waypoints: `${startLat},${startLon}|${endLat},${endLon}`,
        mode: 'drive',
        apiKey: GEOAPIFY_API_KEY,
      },
    });

    if (response.data.features && response.data.features.length > 0) {
      return response.data.features[0].properties.distance / 1000; // in km
    }
    return 0;
  } catch (error) {
    console.error('Distance calculation error:', error);
    return 0;
  }
};
