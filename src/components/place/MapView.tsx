"use client";

import { useEffect, useRef } from "react";
import { MarkerClusterer } from "@googlemaps/markerclusterer";
import { loadMapsLibrary } from "@/lib/googleMaps";
import { useRouter } from "@/i18n/navigation";

type Pin = {
  id: string;
  name: string;
  latitude: number | null;
  longitude: number | null;
  href: string;
};

export default function MapView({
  pins,
  fallbackCenter,
}: {
  pins: Pin[];
  fallbackCenter: { lat: number; lng: number };
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    let cancelled = false;
    let clusterer: MarkerClusterer | undefined;
    let markers: google.maps.Marker[] = [];

    async function init() {
      await loadMapsLibrary();
      if (cancelled || !containerRef.current) return;

      const validPins = pins.filter(
        (p): p is Pin & { latitude: number; longitude: number } =>
          p.latitude != null && p.longitude != null,
      );

      const map = new google.maps.Map(containerRef.current, {
        center: fallbackCenter,
        zoom: validPins.length > 0 ? 12 : 10,
      });

      markers = validPins.map((pin) => {
        const marker = new google.maps.Marker({
          position: { lat: pin.latitude, lng: pin.longitude },
          title: pin.name,
        });
        marker.addListener("click", () => router.push(pin.href));
        return marker;
      });

      if (validPins.length > 0) {
        const bounds = new google.maps.LatLngBounds();
        validPins.forEach((p) =>
          bounds.extend({ lat: p.latitude, lng: p.longitude }),
        );
        map.fitBounds(bounds);
      }

      clusterer = new MarkerClusterer({ map, markers });
    }

    init();

    return () => {
      cancelled = true;
      clusterer?.clearMarkers();
      markers.forEach((m) => m.setMap(null));
    };
  }, [pins, fallbackCenter, router]);

  return (
    <div
      ref={containerRef}
      className="h-[28rem] w-full rounded-xl border border-ink-text/15"
    />
  );
}
