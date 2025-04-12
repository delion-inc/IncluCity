import { useState } from "react";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

import { Place } from "@/lib/types/place.types";

import MapPlacePopup from "./map-place-popup";
import PlaceDetailsDrawer from "../place/place-details-drawer";

const customIcon = new Icon({
  iconUrl: "/map-pin.svg",
  iconSize: [25, 41],
  iconAnchor: [13, 5],
});

interface MapPlaceMarkerProps {
  place: Place;
}

export default function MapPlaceMarker({ place }: MapPlaceMarkerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDetails = () => {
    setIsDrawerOpen(true);
  };

  return (
    <>
      <Marker
        key={place.id}
        position={{ lat: place.lat, lng: place.lon }}
        icon={customIcon}
        eventHandlers={{
          mouseover: (e) => {
            e.target.openPopup();
          },
        }}
      >
        <Popup className="custom-popup">
          <MapPlacePopup place={place} onDetailsClick={handleOpenDetails} />
        </Popup>
      </Marker>

      <PlaceDetailsDrawer
        place={place}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
}
