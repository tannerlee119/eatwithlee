'use client';

import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

interface Location {
    lat: number;
    lng: number;
    name: string;
    label: string; // number label for the marker
}

interface MultiPinMapProps {
    locations: Location[];
}

export default function MultiPinMap({ locations }: MultiPinMapProps) {
    const [mapUrl, setMapUrl] = useState<string>('');
    const [error, setError] = useState<string>('');
    const [imageKey, setImageKey] = useState(0);

    useEffect(() => {
        if (locations.length === 0) return;
        setError('');

        fetch('/api/maps-config')
            .then(res => res.json())
            .then(data => {
                if (data.apiKey) {
                    const width = 800;
                    const height = 400;

                    // Build marker params — each marker gets a numbered label
                    const markerParams = locations
                        .map((loc, i) => {
                            // Google Static Maps supports labels A-Z and 0-9
                            // Use numbers 1-9 then letters for larger lists
                            const label = i < 9 ? String(i + 1) : String.fromCharCode(65 + i - 9);
                            return `markers=color:0x1e293b%7Clabel:${label}%7C${loc.lat},${loc.lng}`;
                        })
                        .join('&');

                    // Let Google auto-fit all markers
                    const url = `https://maps.googleapis.com/maps/api/staticmap?size=${width}x${height}&scale=2&${markerParams}&key=${data.apiKey}`;
                    setMapUrl(url);
                } else {
                    setError('Map API key not configured');
                }
            })
            .catch(err => {
                console.error('Failed to load map config:', err);
                setError('Failed to load map configuration');
            });
    }, [locations]);

    if (locations.length === 0) return null;

    return (
        <div className="w-full aspect-[2/1] sm:aspect-[5/2] bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 relative">
            {mapUrl ? (
                <img
                    key={imageKey}
                    src={mapUrl}
                    alt="Map of all restaurants"
                    className="w-full h-full object-cover"
                    onLoad={() => setError('')}
                    onError={() => {
                        if (imageKey === 0) {
                            setTimeout(() => setImageKey(1), 500);
                        } else {
                            setError('Map failed to load.');
                        }
                    }}
                />
            ) : error ? (
                <div className="absolute inset-0 flex items-center justify-center p-4">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                </div>
            ) : (
                <div className="absolute inset-0 flex items-center justify-center">
                    <MapPin size={48} className="text-slate-300 animate-pulse" />
                </div>
            )}
        </div>
    );
}
