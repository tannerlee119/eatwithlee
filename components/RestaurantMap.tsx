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
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(name)}`;

  useEffect(() => {
    // Fetch Google Maps API key from server
    fetch('/api/maps-config')
      .then(res => res.json())
      .then(data => {
        if (data.apiKey) {
          const zoom = 14;
          const width = 800;
          const height = 384;

          // Google Maps Static API URL with small marker
          const url = `https://maps.googleapis.com/maps/api/staticmap?center=${lat},${lng}&zoom=${zoom}&size=${width}x${height}&scale=2&markers=size:mid|${lat},${lng}&key=${data.apiKey}`;
          console.log('Map URL:', url);
          setMapUrl(url);
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
            src={mapUrl}
            alt={`Map of ${name}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              console.error('Map image failed to load');
              setError('Map failed to load. Check Google Cloud Console: Maps Static API must be enabled.');
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
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ExternalLink size={16} />
          Open in Google Maps
        </a>
        <a
          href={appleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          <ExternalLink size={16} />
          Open in Apple Maps
        </a>
      </div>

      {/* Address */}
      <div className="flex items-start gap-2 text-gray-600">
        <MapPin size={18} className="mt-1 flex-shrink-0" />
        <p className="text-sm">{address}</p>
      </div>
    </div>
  );
}
