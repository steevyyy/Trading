import React from 'react';

export const MapPlaceholder: React.FC = () => {
  return (
    <div className="w-full h-full bg-neutral-200 flex items-center justify-center rounded-lg">
      <div className="text-center text-neutral-500">
        <div className="text-4xl mb-2">🗺️</div>
        <p>Map Loading...</p>
      </div>
    </div>
  );
};