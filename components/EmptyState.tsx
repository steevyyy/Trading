import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const EmptyState: React.FC<EmptyStateProps> = ({ icon: Icon, title, description, action }) => (
  <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
    <div className="w-20 h-20 bg-neutral-100 rounded-full flex items-center justify-center mb-4">
      <Icon className="w-10 h-10 text-neutral-400" />
    </div>
    <h3 className="text-xl font-semibold text-neutral-800 mb-2">{title}</h3>
    <p className="text-neutral-600 mb-6 max-w-sm">{description}</p>
    {action && (
      <button
        onClick={action.onClick}
        className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold transition-all transform hover:scale-105"
      >
        {action.label}
      </button>
    )}
  </div>
);
