import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Polyline, Tooltip, useMap } from 'react-leaflet';
import L from 'leaflet';

interface MapViewProps {
  pickupCoords?: [number, number];
  destinationCoords?: [number, number];
  officeLocation?: [number, number];
  pickupAddress?: string;
  destinationAddress?: string;
}

const createIcon = (svg: string, size: [number, number]) => {
  return L.divIcon({
    html: svg,
    className: 'leaflet-div-icon',
    iconSize: size,
    iconAnchor: [size[0] / 2, size[1]],
  });
};

const vehicleIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 text-sky-500 drop-shadow-lg">
  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.964 3.934a.75.75 0 0 1 .93.642l.068.583c.234 1.996.617 3.96.98 5.922a.75.75 0 0 1-.514.852l-.934.33a.75.75 0 0 0-.514.852l.934.33a.75.75 0 0 1 .514.852c-.363 1.962-.746 3.926-.98 5.922l-.068.583a.75.75 0 0 1-1.562-.132l-.068-.583c-.234-1.996-.617-3.96-.98-5.922a.75.75 0 0 1 .514-.852l.934-.33a.75.75 0 0 0 .514-.852l-.934-.33a.75.75 0 0 1-.514-.852c.363-1.962.746-3.926.98-5.922l.068-.583a.75.75 0 0 1 .632-.642Z" clip-rule="evenodd" />
  <path d="M12 7.5a4.5 4.5 0 1 0 0 9 4.5 4.5 0 0 0 0-9Z" />
</svg>
`;

const startIconSvg = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" class="w-8 h-8 drop-shadow-md">
  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z" clip-rule="evenodd" />
</svg>
`;

const endIconSvg = (color: string) => `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="${color}" class="w-8 h-8 drop-shadow-md">
 <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zm-1.72 6.97a.75.75 0 10-1.06 1.06L10.94 12l-1.72 1.72a.75.75 0 101.06 1.06L12 13.06l1.72 1.72a.75.75 0 101.06-1.06L13.06 12l1.72-1.72a.75.75 0 10-1.06-1.06L12 10.94l-1.72-1.72z" clip-rule="evenodd" />
</svg>
`;

const officeIconSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-10 h-10 text-orange-500 drop-shadow-lg">
  <path d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" stroke="#fff" stroke-width="1.5" />
</svg>
`;

const vehicleIcon = createIcon(vehicleIconSvg, [40, 40]);
const startIcon = createIcon(startIconSvg('#16a34a'), [32, 32]); // green
const endIcon = createIcon(endIconSvg('#dc2626'), [32, 32]); // red
const officeIcon = createIcon(officeIconSvg, [40, 40]);

function ChangeView({ bounds }: { bounds: L.LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }, [bounds, map]);
  return null;
}

export const MapView: React.FC<MapViewProps> = ({ pickupCoords, destinationCoords, officeLocation, pickupAddress, destinationAddress }) => {
  const [vehiclePosition, setVehiclePosition] = useState(pickupCoords);

  useEffect(() => {
    if (!pickupCoords || !destinationCoords) return;

    setVehiclePosition(pickupCoords);
    const totalSteps = 200;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const progress = step / totalSteps;
      const lat = pickupCoords[0] + (destinationCoords[0] - pickupCoords[0]) * progress;
      const lng = pickupCoords[1] + (destinationCoords[1] - pickupCoords[1]) * progress;
      setVehiclePosition([lat, lng]);

      if (step >= totalSteps) {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [pickupCoords, destinationCoords]);

  const bounds = useMemo(() => {
    if (officeLocation) return L.latLngBounds([officeLocation]);
    if (pickupCoords && destinationCoords) return L.latLngBounds([pickupCoords, destinationCoords]);
    return L.latLngBounds([[-1.286389, 36.817223]]); // Default to Nairobi
  }, [pickupCoords, destinationCoords, officeLocation]);

  return (
    <MapContainer
      key={bounds.toBBoxString()} // Force re-render on bounds change
      center={bounds.getCenter()}
      zoom={13}
      scrollWheelZoom={false}
      style={{ height: '100%', width: '100%' }}
    >
      <ChangeView bounds={bounds} />
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {officeLocation && (
        <Marker position={officeLocation} icon={officeIcon}>
            <Tooltip permanent>Connecta HQ</Tooltip>
        </Marker>
      )}
      {pickupCoords && destinationCoords && vehiclePosition && (
        <>
          <Polyline positions={[pickupCoords, destinationCoords]} color="#0ea5e9" weight={5} dashArray="10, 10" />
          <Marker position={pickupCoords} icon={startIcon}>
             <Tooltip>{pickupAddress || 'Pickup'}</Tooltip>
          </Marker>
          <Marker position={destinationCoords} icon={endIcon}>
            <Tooltip>{destinationAddress || 'Destination'}</Tooltip>
          </Marker>
          <Marker position={vehiclePosition} icon={vehicleIcon} />
        </>
      )}
    </MapContainer>
  );
};