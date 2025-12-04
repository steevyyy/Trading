import axios from 'axios';

const GEOAPIFY_API_KEY = import.meta.env.VITE_GEOAPIFY_API_KEY;
const BASE_URL = 'https://api.geoapify.com/v1';

export interface GeocodingResult {
  lat: number;
  lon: number;
  formatted: string;
  address_line1: string;
  address_line2: string;
  city: string;
  country: string;
}

export const geocodeAddress = async (address: string): Promise<GeocodingResult | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/geocode/search`, {
      params: {
        text: address,
        apiKey: GEOAPIFY_API_KEY,
        limit: 1,
        filter: 'countrycode:ke'
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];
      return {
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        formatted: feature.properties.formatted,
        address_line1: feature.properties.address_line1 || '',
        address_line2: feature.properties.address_line2 || '',
        city: feature.properties.city || '',
        country: feature.properties.country || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Geocoding error:', error);
    return null;
  }
};

export const reverseGeocode = async (lat: number, lon: number): Promise<GeocodingResult | null> => {
  try {
    const response = await axios.get(`${BASE_URL}/geocode/reverse`, {
      params: {
        lat,
        lon,
        apiKey: GEOAPIFY_API_KEY
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      const feature = response.data.features[0];
      return {
        lat: feature.geometry.coordinates[1],
        lon: feature.geometry.coordinates[0],
        formatted: feature.properties.formatted,
        address_line1: feature.properties.address_line1 || '',
        address_line2: feature.properties.address_line2 || '',
        city: feature.properties.city || '',
        country: feature.properties.country || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Reverse geocoding error:', error);
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
        apiKey: GEOAPIFY_API_KEY
      }
    });

    if (response.data.features && response.data.features.length > 0) {
      return response.data.features[0].properties.distance / 1000; // Convert to km
    }
    return 0;
  } catch (error) {
    console.error('Distance calculation error:', error);
    return 0;
  }
};