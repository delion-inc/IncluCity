"use client";

import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useEffect } from "react";
import "leaflet/dist/leaflet.css";

import { usePlaces } from "@/lib/hooks/use-places";
import { useFilters } from "@/lib/contexts/filter.context";

import MapPlaceMarker from "./map-place-marker";

export default function Map() {
  const center = {
    lat: 49.83826,
    lng: 24.02324,
  };

  const { selectedCategories, selectedAccessibility } = useFilters();
  const { data: places, error } = usePlaces({
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    accessibility: selectedAccessibility.length > 0 ? selectedAccessibility : undefined,
  });

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      .leaflet-popup {
        pointer-events: auto !important;
      }
      .leaflet-marker-icon {
        pointer-events: auto !important;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="h-full w-full relative" style={{ zIndex: 0 }}>
      {error && (
        <div className="absolute top-4 right-4 bg-red-100 p-2 rounded-md shadow-md z-10">
          Помилка при завантаженні даних
        </div>
      )}

      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={false}
        attributionControl={true}
        className="z-0"
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=yMPPhITp4JDWFD3N3AqU94SuPGKVWnLJD4jdaO0t9LbKLsKiu97If4V2FSx057QT"
        />

        {places?.map((place) => <MapPlaceMarker key={place.id} place={place} />)}
      </MapContainer>
    </div>
  );
}
