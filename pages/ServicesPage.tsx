
import React, { useState } from 'react';
import { VEHICLES, EVENT_SERVICES } from '../constants';
import { EventServiceCard } from '../components/EventServiceCard';
import { EventDetailPage } from './EventDetailPage';
import type { Vehicle, EventService } from '../types';
import { UsersIcon } from '../components/icons/FormIcons';
import { Link } from 'react-router-dom';


const ServiceVehicleCard: React.FC<{ vehicle: Vehicle }> = ({ vehicle }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/80 overflow-hidden flex flex-col transform hover:-translate-y-1.5 transition-transform duration-300">
      <div className="h-48 w-full">
        <img src={vehicle.imageUrl} alt={vehicle.name} className="w-full h-full object-cover" />
      </div>
      <div className="p-6 flex-grow flex flex-col">
        <h3 className="text-xl font-bold text-neutral-800">{vehicle.name}</h3>
        <div className="flex items-center justify-between text-neutral-600 mt-2 text-sm">
          <div className="flex items-center space-x-1.5">
            <UsersIcon className="h-4 w-4 text-neutral-400" />
            <span>Capacity: {vehicle.capacity} passengers</span>
          </div>
          <span className="font-bold text-lg text-orange-500">{vehicle.price}</span>
        </div>
        <Link
          to="/home"
          className="mt-auto pt-6 w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 focus-visible:ring-offset-2 text-center">
          Book Now
        </Link>
      </div>
    </div>
  );
};


export default function ServicesPage() {
  const [selectedEventService, setSelectedEventService] = useState<EventService | null>(null);

  if (selectedEventService) {
    return (
      <div className="min-h-screen">
        <EventDetailPage service={selectedEventService} onBack={() => setSelectedEventService(null)} />
      </div>
    );
  }

  return (
    <div>
      <section className="relative py-20 md:py-32 bg-white">
        <div className="absolute inset-0 bg-cover bg-center opacity-10" style={{backgroundImage: `url('https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=1200&auto=format&fit=crop')`}}></div>
        <div className="relative container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-6xl font-extrabold text-neutral-900 leading-tight">
                Our Transportation Solutions
            </h1>
            <p className="text-lg text-neutral-600 mt-4 max-w-3xl mx-auto">
                Whether it's a daily commute, a corporate event, or your special day, Connecta offers a tailored transport solution to meet your needs with professionalism and style.
            </p>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-neutral-100">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">Our Fleet for Regular Rides</h2>
            <p className="text-neutral-600 mb-12">
              A diverse range of vehicles to suit your everyday travel needs. Safe, clean, and readily available.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {VEHICLES.map((vehicle) => (
              <ServiceVehicleCard key={vehicle.id} vehicle={vehicle} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-white">
        <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold text-neutral-800 mb-2">Specialized Event Services</h2>
                <p className="text-neutral-600 mb-12">
                    Professional, coordinated, and reliable transport solutions to make your special occasions seamless and memorable.
                </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {EVENT_SERVICES.map((service) => (
                <EventServiceCard
                  key={service.id}
                  service={service}
                  onLearnMore={(service) => setSelectedEventService(service)}
                />
            ))}
            </div>
        </div>
      </section>
    </div>
  );
}
