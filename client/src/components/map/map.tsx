"use client";

import { MapContainer, TileLayer, ZoomControl } from "react-leaflet";
import { useEffect, useMemo, memo } from "react";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import dynamic from "next/dynamic";

import { usePlaces } from "@/lib/hooks/use-places";
import { useFilters } from "@/lib/contexts/filter.context";

// Dynamically import MapPlaceMarker with no SSR
const MapPlaceMarker = dynamic(() => import("./map-place-marker"), { ssr: false });

// Define constants outside the component to prevent recreating objects on each render
const DEFAULT_CENTER = {
  lat: 49.83826,
  lng: 24.02324,
};

const MAP_STYLE = { height: "100%", width: "100%" };

const ErrorMessage = memo(({ message }: { message: string }) => (
  <div className="absolute top-20 right-4 bg-red-100 p-2 rounded-md shadow-md z-10">
    {message}
  </div>
));
ErrorMessage.displayName = 'ErrorMessage';

function Map() {
  const { selectedCategories, selectedAccessibility } = useFilters();
  
  // Memoize the filter params to prevent unnecessary re-fetching
  const filterParams = useMemo(() => ({
    categories: selectedCategories.length > 0 ? selectedCategories : undefined,
    accessibility: selectedAccessibility.length > 0 ? selectedAccessibility : undefined,
  }), [selectedCategories, selectedAccessibility]);
  
  const { data: places, error } = usePlaces(filterParams);

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
      {error && <ErrorMessage message="Помилка при завантаженні даних" />}

      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        style={MAP_STYLE}
        zoomControl={false}
        attributionControl={true}
        className="z-0"
        preferCanvas={true}
      >
        <ZoomControl position="bottomright" />
        <TileLayer
          attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=yMPPhITp4JDWFD3N3AqU94SuPGKVWnLJD4jdaO0t9LbKLsKiu97If4V2FSx057QT"
        />

        <MarkerClusterGroup
          chunkedLoading={true}
          spiderfyOnMaxZoom={true}
          disableClusteringAtZoom={16}
          maxClusterRadius={60}
          animate={true}
        >
          {places?.map((place) => <MapPlaceMarker key={place.id} place={place} />)}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
}

export default memo(Map);
