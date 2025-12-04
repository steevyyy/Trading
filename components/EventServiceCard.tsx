import React from 'react';
import type { EventService } from '../types';
import { CheckCircleIcon } from './icons/FormIcons';

interface EventServiceCardProps {
  service: EventService;
  onLearnMore?: (service: EventService) => void;
}

export const EventServiceCard: React.FC<EventServiceCardProps> = ({ service, onLearnMore }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg border border-neutral-200/80 overflow-hidden flex flex-col card-hover animate-fade-in">
      <div className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-4xl bg-sky-100 p-3 rounded-xl">{service.icon}</span>
          <h3 className="text-xl font-bold text-neutral-800">{service.name}</h3>
        </div>
        <p className="text-neutral-600 text-sm mb-4 min-h-[40px]">{service.description}</p>
      </div>
      <div className="p-6 bg-neutral-50/70 flex-grow flex flex-col">
         <ul className="space-y-2.5 text-sm text-neutral-700 mb-6">
            {service.features.map((feature, index) => (
                <li key={index} className="flex items-center">
                    <CheckCircleIcon className="h-5 w-5 text-sky-500 mr-2.5 flex-shrink-0" />
                    <span>{feature}</span>
                </li>
            ))}
        </ul>
        <button
          onClick={() => onLearnMore?.(service)}
          className="mt-auto w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-4 rounded-lg transition-colors button-press focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2">
          Learn More
        </button>
      </div>
    </div>
  );
};
