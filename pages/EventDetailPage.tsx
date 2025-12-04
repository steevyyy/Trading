import React from 'react';
import { CheckCircle, ArrowLeft, Phone, Mail } from 'lucide-react';
import type { EventService } from '../types';

interface EventDetailPageProps {
  service: EventService;
  onBack: () => void;
}

export const EventDetailPage: React.FC<EventDetailPageProps> = ({ service, onBack }) => {
  const getServiceDetails = (serviceId: number) => {
    switch (serviceId) {
      case 1: // Wedding Services
        return {
          image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=1200&q=80',
          pricing: 'Starting from KSh 15,000',
          duration: 'Full day coverage',
          vehicles: ['Luxury Cars', 'Decorated Bridal Car', '14-Seater Vans', 'Buses'],
          details: 'Make your special day unforgettable with our premium wedding transportation services. We provide elegant vehicles, professional drivers, and complete coordination for your entire wedding party.',
          included: ['Bridal car decoration with flowers', 'Red carpet service', 'Professional chauffeurs in formal attire', 'Guest shuttle coordination', 'Multiple pickup and drop-off points', 'Backup vehicles on standby']
        };
      case 2: // Dowry Ceremonies
        return {
          image: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=1200&q=80',
          pricing: 'Starting from KSh 10,000',
          duration: 'Half day or full day',
          vehicles: ['14-Seater Vans', '30-Seater Buses', 'Standard Cars'],
          details: 'Culturally sensitive transportation for traditional dowry ceremonies. We understand the importance of these events and provide respectful, reliable service for your family and guests.',
          included: ['Family group coordination', 'Traditional ceremony timing flexibility', 'Multiple vehicle options', 'Experienced drivers familiar with routes', 'Luggage and gift transport', 'Elder-friendly boarding assistance']
        };
      case 3: // Graduation Events
        return {
          image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
          pricing: 'Starting from KSh 8,000',
          duration: '4-8 hours',
          vehicles: ['Standard Cars', '14-Seater Vans', '30-Seater Buses'],
          details: 'Celebrate your academic achievement with hassle-free transportation. We coordinate transport for graduates, families, and friends to and from graduation venues across Kenya.',
          included: ['University campus pickup', 'Family coordination services', 'Photo stop accommodations', 'Celebration venue transport', 'Flexible timing for ceremonies', 'Group booking discounts']
        };
      case 4: // Corporate Events
        return {
          image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1200&q=80',
          pricing: 'Starting from KSh 12,000',
          duration: 'Hourly or daily rates',
          vehicles: ['Luxury Cars', 'Standard Cars', '14-Seater Vans', 'Buses'],
          details: 'Professional transportation solutions for your corporate needs. From executive transfers to conference shuttles, we ensure punctual and reliable service for your business events.',
          included: ['Executive airport transfers', 'Conference shuttle services', 'Professional drivers', 'Corporate invoicing', 'Real-time tracking', 'Multiple vehicle coordination']
        };
      case 5: // Funeral Services
        return {
          image: 'https://images.unsplash.com/photo-1584515933487-779824d29309?w=1200&q=80',
          pricing: 'Starting from KSh 9,000',
          duration: 'Full day service',
          vehicles: ['Standard Cars', '14-Seater Vans', '30-Seater Buses', '60-Seater Buses'],
          details: 'Respectful and discreet transportation during difficult times. We provide compassionate service to help families coordinate transport for funeral services and memorial gatherings.',
          included: ['Respectful and discreet service', 'Family coordination support', 'Flexible scheduling', 'Multiple location pickups', 'Experienced sensitive drivers', 'Last-minute arrangement accommodation']
        };
      case 6: // Parties & Celebrations
        return {
          image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=1200&q=80',
          pricing: 'Starting from KSh 7,000',
          duration: '3-6 hours',
          vehicles: ['Standard Cars', '14-Seater Vans', '30-Seater Buses'],
          details: 'Safe and fun transportation for your celebrations. Whether it\'s a birthday party, anniversary, or social gathering, we ensure your guests arrive safely and on time.',
          included: ['Birthday party transport', 'Anniversary celebrations', 'Group coordination', 'Flexible timing', 'Multiple pickup points', 'Safe return transport']
        };
      case 7: // Construction & Materials Delivery
        return {
          image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=1200&q=80',
          pricing: 'Starting from KSh 5,000/trip',
          duration: 'Per trip or daily hire',
          vehicles: ['Sand Lorries', 'Construction Trucks', 'Flatbed Trucks'],
          details: 'Reliable and efficient transport for all your construction needs. From sand and ballast to bricks and cement, we deliver building materials directly to your construction site on time.',
          included: ['Sand delivery (10-15 tons)', 'Building materials transport', 'Bricks and cement delivery', 'Site-to-site transfer', 'Experienced drivers', 'Flexible scheduling']
        };
      case 8: // Farm Produce Transportation
        return {
          image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=1200&q=80',
          pricing: 'Starting from KSh 3,000/trip',
          duration: 'Per trip or daily hire',
          vehicles: ['Pickup Trucks', 'Covered Lorries', 'Refrigerated Trucks'],
          details: 'Fresh farm produce transportation from farms to markets across Kenya. We ensure your vegetables, cereals, and agricultural products arrive fresh and in perfect condition, maintaining quality throughout the journey.',
          included: ['Vegetables transport (Potatoes, Cabbages, Tomatoes, Onions)', 'Cereals delivery (Maize, Beans, Wheat, Rice)', 'Farm-to-market direct service', 'Temperature-controlled options for perishables', 'Early morning pickup available', 'Market delivery coordination']
        };
      default:
        return null;
    }
  };

  const details = getServiceDetails(service.id);
  if (!details) return null;

  return (
    <div className="min-h-screen bg-neutral-100">
      <div className="relative h-64 sm:h-80 md:h-96 bg-cover bg-center" style={{ backgroundImage: `url('${details.image}')` }}>
        <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        <div className="relative container mx-auto px-4 h-full flex flex-col justify-center">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 text-white mb-3 sm:mb-4 hover:text-sky-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5" />
            <span className="text-sm sm:text-base">Back to Services</span>
          </button>
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-6xl font-extrabold text-white mb-3 sm:mb-4">
            {service.name}
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-white max-w-2xl">{service.description}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <p className="text-xs sm:text-sm text-neutral-600 mb-1 sm:mb-2">Starting Price</p>
              <p className="text-lg sm:text-2xl font-bold text-sky-600">{details.pricing}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center">
              <p className="text-xs sm:text-sm text-neutral-600 mb-1 sm:mb-2">Duration</p>
              <p className="text-lg sm:text-2xl font-bold text-neutral-800">{details.duration}</p>
            </div>
            <div className="bg-white p-4 sm:p-6 rounded-xl shadow-md text-center sm:col-span-2 md:col-span-1">
              <p className="text-xs sm:text-sm text-neutral-600 mb-1 sm:mb-2">Vehicles</p>
              <p className="text-base sm:text-lg font-bold text-neutral-800">{details.vehicles.length}+ Types</p>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-neutral-800 mb-3 sm:mb-4">About This Service</h2>
            <p className="text-sm sm:text-base md:text-lg text-neutral-600 leading-relaxed mb-4 sm:mb-6">{details.details}</p>

            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-800 mb-3 sm:mb-4">What's Included</h3>
            <div className="grid md:grid-cols-2 gap-4">
              {details.included.map((item, index) => (
                <div key={index} className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-green-500 flex-shrink-0 mt-1" />
                  <span className="text-neutral-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 mb-6 sm:mb-8">
            <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-neutral-800 mb-3 sm:mb-4">Available Vehicles</h3>
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-4">
              {details.vehicles.map((vehicle, index) => (
                <div key={index} className="flex items-center space-x-3 p-4 bg-neutral-50 rounded-lg">
                  <div className="w-12 h-12 bg-sky-100 rounded-full flex items-center justify-center">
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  <span className="font-semibold text-neutral-800">{vehicle}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-sky-500 to-blue-600 rounded-2xl shadow-lg p-4 sm:p-6 md:p-8 text-white">
            <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4">Ready to Book?</h3>
            <p className="text-sm sm:text-base mb-4 sm:mb-6">Contact us today to discuss your requirements and get a customized quote for your event.</p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <a href="tel:+254712345678" className="flex items-center justify-center space-x-2 bg-white text-sky-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors text-sm sm:text-base">
                <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>+254 712 345 678</span>
              </a>
              <a href="mailto:events@connecta.co.ke" className="flex items-center justify-center space-x-2 bg-white text-sky-600 px-4 sm:px-6 py-2.5 sm:py-3 rounded-lg font-semibold hover:bg-neutral-100 transition-colors text-sm sm:text-base">
                <Mail className="w-4 h-4 sm:w-5 sm:h-5" />
                <span>events@connecta.co.ke</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};