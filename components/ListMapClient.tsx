'use client';

import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

interface MapEntry {
    lat: number;
    lng: number;
    label: string;
    name: string;
}

interface ListMapClientProps {
    entries: MapEntry[];
    activeIndex: number;
}

export default function ListMapClient({ entries, activeIndex }: ListMapClientProps) {
    const mapRef = useRef<L.Map | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const markersRef = useRef<L.Marker[]>([]);

    // Initialize map
    useEffect(() => {
        if (!containerRef.current || mapRef.current) return;

        const validEntries = entries.filter((e) => e.lat && e.lng);
        if (validEntries.length === 0) return;

        const map = L.map(containerRef.current, {
            zoomControl: true,
            scrollWheelZoom: true,
        });

        L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/">CARTO</a>',
            maxZoom: 19,
        }).addTo(map);

        // Add markers
        const markers = entries.map((entry, i) => {
            if (!entry.lat || !entry.lng) return null;

            const icon = L.divIcon({
                className: 'custom-map-marker',
                html: `<div style="
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: ${i === activeIndex ? '#0f172a' : '#64748b'};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: 13px;
                    border: 3px solid white;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
                    transition: background 0.3s ease;
                ">${entry.label}</div>`,
                iconSize: [32, 32],
                iconAnchor: [16, 16],
            });

            const marker = L.marker([entry.lat, entry.lng], { icon }).addTo(map);
            marker.bindTooltip(entry.name, {
                direction: 'top',
                offset: [0, -20],
                className: 'map-tooltip',
            });
            return marker;
        });

        markersRef.current = markers.filter(Boolean) as L.Marker[];

        // Fit bounds to all markers
        if (validEntries.length > 0) {
            const bounds = L.latLngBounds(validEntries.map((e) => [e.lat, e.lng]));
            map.fitBounds(bounds, { padding: [30, 30], maxZoom: 13 });
        }

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fly to active entry (debounced to handle fast scrolling)
    const flyTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const lastIndexRef = useRef(activeIndex);

    useEffect(() => {
        const map = mapRef.current;
        if (!map) return;

        const entry = entries[activeIndex];
        if (!entry || !entry.lat || !entry.lng) return;

        // Cancel any pending fly
        if (flyTimerRef.current) {
            clearTimeout(flyTimerRef.current);
        }

        // If the index changed very recently, skip animation for snappier feel
        const indexDelta = Math.abs(activeIndex - lastIndexRef.current);
        lastIndexRef.current = activeIndex;

        if (indexDelta > 1) {
            // Jumped multiple entries — teleport instantly
            map.stop();
            map.setView([entry.lat, entry.lng], 15, { animate: false });
        } else {
            // Debounce: wait a bit before flying in case user keeps scrolling
            flyTimerRef.current = setTimeout(() => {
                map.stop();
                map.flyTo([entry.lat, entry.lng], 15, {
                    duration: 0.8,
                    easeLinearity: 0.35,
                });
            }, 150);
        }

        // Update marker styles immediately
        entries.forEach((e, i) => {
            if (!e.lat || !e.lng) return;
            const markerIndex = entries.slice(0, i + 1).filter((x) => x.lat && x.lng).length - 1;
            const marker = markersRef.current[markerIndex];
            if (!marker) return;

            const isActive = i === activeIndex;
            const icon = L.divIcon({
                className: 'custom-map-marker',
                html: `<div style="
                    width: ${isActive ? '38px' : '32px'};
                    height: ${isActive ? '38px' : '32px'};
                    border-radius: 50%;
                    background: ${isActive ? '#0f172a' : '#94a3b8'};
                    color: white;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 700;
                    font-size: ${isActive ? '14px' : '12px'};
                    border: 3px solid white;
                    box-shadow: 0 2px ${isActive ? '12px' : '6px'} rgba(0,0,0,${isActive ? '0.4' : '0.2'});
                    transition: all 0.3s ease;
                ">${e.label}</div>`,
                iconSize: [isActive ? 38 : 32, isActive ? 38 : 32],
                iconAnchor: [isActive ? 19 : 16, isActive ? 19 : 16],
            });
            marker.setIcon(icon);
        });

        return () => {
            if (flyTimerRef.current) clearTimeout(flyTimerRef.current);
        };
    }, [activeIndex, entries]);

    return (
        <div
            ref={containerRef}
            className="w-full h-full rounded-2xl overflow-hidden"
            style={{ minHeight: '400px' }}
        />
    );
}
