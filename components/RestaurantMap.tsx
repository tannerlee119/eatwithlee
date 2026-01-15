'use client';

import { useEffect, useState } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface RestaurantMapProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export default function RestaurantMap({ lat, lng, name, address }: RestaurantMapProps) {
  const [mapUrl, setMapUrl] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [imageKey, setImageKey] = useState(0);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(name + ' ' + address)}`;
  const appleMapsUrl = `https://maps.apple.com/?q=${encodeURIComponent(name + ' ' + address)}`;

  useEffect(() => {
    setError('');

    // Fetch Google Maps API key from server
    fetch('/api/maps-config')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          const zoom = 15;
          const width = 800;
          const height = 512;

          // Offset the center slightly north so marker appears centered in visible area
          const offsetLat = lat + 0.002;

          // Google Maps Static API URL with small marker
          const url = `https://maps.googleapis.com/maps/api/staticmap?center=${offsetLat},${lng}&zoom=${zoom}&size=${width}x${height}&scale=2&markers=size:mid%7C${lat},${lng}&key=${data.apiKey}`;
          console.log('Map URL generated:', url.replace(data.apiKey, 'API_KEY_HIDDEN'));
          setMapUrl(url);
        } else {
          setError('Map API key not configured');
        }
      })
      .catch(err => {
        console.error('Failed to load map config:', err);
        setError('Failed to load map configuration');
      });
  }, [lat, lng]);

  return (
    <div className="space-y-4">
      {/* Static Map with Pin */}
      <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 relative">
        {mapUrl ? (
          <img
            key={imageKey}
            src={mapUrl}
            alt={`Map of ${name}`}
            className="w-full h-full object-cover"
            onLoad={() => setError('')}
            onError={(e) => {
              console.error('Map image failed to load, retrying...');
              // Retry once after a brief delay
              if (imageKey === 0) {
                setTimeout(() => setImageKey(1), 500);
              } else {
                setError('Map failed to load. Try refreshing the page.');
              }
            }}
          />
        ) : error ? (
          <div className="absolute inset-0 flex items-center justify-center p-4">
            <p className="text-red-600 text-sm text-center">{error}</p>
          </div>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <MapPin size={48} className="text-gray-400 animate-pulse" />
          </div>
        )}
      </div>

      {/* Map Links */}
      <div className="flex flex-wrap gap-3">
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
        >
          <ExternalLink size={16} />
          Open in Google Maps
        </a>
        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg hover:bg-gray-50 transition-colors text-sm"
        >
          <ExternalLink size={16} />
          Open in Apple Maps
        </a>
      </div>

    </div>
  );
}
