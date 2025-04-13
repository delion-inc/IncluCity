import { useMemo, useRef, useEffect } from "react";
import { Marker, Popup } from "react-leaflet";
import L from "leaflet";

import { PlaceSearchResult } from "@/lib/types/place.types";

import MapUnevaluatedPlacePopup from "./map-unevaluated-place-popup";

interface MapUnevaluatedPlaceMarkerProps {
  place: PlaceSearchResult;
}

const newPlaceIcon = new L.Icon({
  iconUrl: "/map-pin-yellow.svg",
  iconSize: [32, 42],
  iconAnchor: [16, 42],
  popupAnchor: [0, -42],
});

try {
  newPlaceIcon.createIcon();
} catch (error) {
  console.warn("Failed to load custom icon, using fallback", error);
  Object.assign(newPlaceIcon.options, {
    iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
    iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
    shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
  });
}

export default function MapUnevaluatedPlaceMarker({ place }: MapUnevaluatedPlaceMarkerProps) {
  const markerRef = useRef<L.Marker>(null);

  const position = useMemo(() => ({ lat: place.lat, lng: place.lon }), [place.lat, place.lon]);

  useEffect(() => {
    const marker = markerRef.current;

    if (marker) {
      const timer = setTimeout(() => {
        marker.openPopup();
      }, 100);

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <Marker
      ref={markerRef}
      position={position}
      icon={newPlaceIcon}
      eventHandlers={{
        add: (e) => {
          setTimeout(() => {
            e.target.openPopup();
          }, 100);
        },
      }}
    >
      <Popup className="custom-popup" autoClose={false} closeOnClick={false}>
        <MapUnevaluatedPlacePopup place={place} />
      </Popup>
    </Marker>
  );
}
