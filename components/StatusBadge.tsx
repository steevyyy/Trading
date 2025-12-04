import React from 'react';

interface StatusBadgeProps {
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'paid' | 'searching' | 'driver_assigned';
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const styles = {
    pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    confirmed: 'bg-blue-100 text-blue-800 border-blue-200',
    completed: 'bg-green-100 text-green-800 border-green-200',
    cancelled: 'bg-red-100 text-red-800 border-red-200',
    paid: 'bg-green-100 text-green-800 border-green-200',
    searching: 'bg-purple-100 text-purple-800 border-purple-200',
    driver_assigned: 'bg-sky-100 text-sky-800 border-sky-200',
  };

  const sizeClass = size === 'sm' ? 'text-xs px-2 py-1' : 'text-sm px-3 py-1.5';

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${styles[status]} ${sizeClass}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
};
