'use client';

import { MapPin, ExternalLink } from 'lucide-react';

interface RestaurantMapProps {
  lat: number;
  lng: number;
  name: string;
  address: string;
}

export default function RestaurantMap({ lat, lng, name, address }: RestaurantMapProps) {
  // Using OpenStreetMap (free alternative to Google Maps)
  const osmUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${lng-0.01},${lat-0.01},${lng+0.01},${lat+0.01}&layer=mapnik&marker=${lat},${lng}`;
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
  const appleMapsUrl = `https://maps.apple.com/?ll=${lat},${lng}&q=${encodeURIComponent(name)}`;

  return (
    <div className="space-y-4">
      {/* OpenStreetMap Embed - Free alternative */}
      <div className="w-full h-96 bg-gray-200 rounded-xl overflow-hidden border border-gray-300">
        <iframe
          width="100%"
          height="100%"
          frameBorder="0"
          scrolling="no"
          src={osmUrl}
          title={`Map showing location of ${name}`}
        />
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
