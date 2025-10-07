'use client';

import { useEffect, useRef } from 'react';
import { MapPin, ExternalLink } from 'lucide-react';

interface RestaurantMapProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export default function RestaurantMap({ lat, lng, name, address }: RestaurantMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(name)}`;

  useEffect(() => {
    if (!mapContainerRef.current) return;

    // Create static map image URL using OpenStreetMap static tiles
    const zoom = 15;
    const width = mapContainerRef.current.offsetWidth;
    const height = 384; // h-96 = 384px

    // Using Mapbox static API (free tier available)
    // Alternative: Can use other static map providers
    const staticMapUrl = `https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/pin-l-restaurant+FF6B35(${lng},${lat})/${lng},${lat},${zoom},0/${width}x${height}@2x?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw`;

    const img = document.createElement('img');
    img.src = staticMapUrl;
    img.alt = `Map of ${name}`;
    img.className = 'w-full h-full object-cover';
    img.onerror = () => {
      // Fallback to OpenStreetMap tile-based static map
      const tileUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
      mapContainerRef.current!.innerHTML = `
        <iframe
          width="100%"
          height="100%"
          frameborder="0"
          scrolling="no"
          src="${tileUrl}"
          title="Map showing location of ${name}"
        ></iframe>
      `;
    };

    mapContainerRef.current.appendChild(img);

    return () => {
      if (mapContainerRef.current) {
        mapContainerRef.current.innerHTML = '';
      }
    };
  }, [lat, lng, name]);

  return (
    <div className="space-y-4">
      {/* Static Map with Pin */}
      <div
        ref={mapContainerRef}
        className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden border border-gray-300 relative"
      >
        {/* Loading state */}
        <div className="absolute inset-0 flex items-center justify-center">
          <MapPin size={48} className="text-gray-400 animate-pulse" />
        </div>
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
