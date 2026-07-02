import { useEffect, useRef } from 'react';

import type { LeafletMouseEvent } from 'leaflet';
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
    iconRetinaUrl:
        'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',

    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',

    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

interface MapPickerProps {
    lat: number;
    lng: number;

    onLocationChange: (lat: number, lng: number, address?: string) => void;
}

export default function MapPicker({
    lat,
    lng,
    onLocationChange,
}: MapPickerProps) {
    const mapRef = useRef<L.Map | null>(null);

    const markerRef = useRef<L.Marker | null>(null);

    const containerRef = useRef<HTMLDivElement | null>(null);

    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;

        if (!containerRef.current || mapRef.current) return;

        const map = L.map(containerRef.current).setView([lat, lng], 15);

        mapRef.current = map;

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
        }).addTo(map);

        const marker = L.marker([lat, lng], {
            draggable: true,
        }).addTo(map);

        markerRef.current = marker;

        marker.on('dragend', async () => {
            if (!isMountedRef.current) return;

            const pos = marker.getLatLng();

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${pos.lat}&lon=${pos.lng}&format=json`,
                );

                const data = await res.json();

                if (!isMountedRef.current) return;

                onLocationChange(pos.lat, pos.lng, data.display_name || '');
            } catch {
                if (isMountedRef.current) {
                    onLocationChange(pos.lat, pos.lng);
                }
            }
        });

        map.on('click', async (e: LeafletMouseEvent) => {
            if (!isMountedRef.current) return;

            marker.setLatLng(e.latlng);

            try {
                const res = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?lat=${e.latlng.lat}&lon=${e.latlng.lng}&format=json`,
                );

                const data = await res.json();

                if (!isMountedRef.current) return;

                onLocationChange(
                    e.latlng.lat,
                    e.latlng.lng,
                    data.display_name || '',
                );
            } catch {
                if (isMountedRef.current) {
                    onLocationChange(e.latlng.lat, e.latlng.lng);
                }
            }
        });

        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    if (
                        !isMountedRef.current ||
                        !mapRef.current ||
                        !markerRef.current
                    ) {
                        return;
                    }

                    const { latitude, longitude } = pos.coords;

                    mapRef.current.setView([latitude, longitude], 16);

                    markerRef.current.setLatLng([latitude, longitude]);

                    onLocationChange(latitude, longitude);
                },
                () => {},
            );
        }

        return () => {
            isMountedRef.current = false;

            map.remove();

            mapRef.current = null;

            markerRef.current = null;
        };
    }, [lat, lng, onLocationChange]);

    return <div ref={containerRef} className="h-full w-full" />;
}
