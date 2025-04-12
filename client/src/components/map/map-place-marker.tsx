import { useState, memo, useMemo } from "react";
import dynamic from "next/dynamic";
import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

import { Place } from "@/lib/types/place.types";

import MapPlacePopup from "./map-place-popup";

const PlaceDetailsDrawer = dynamic(() => import("../place/place-details-drawer"), {
  ssr: false,
  loading: () => null,
});

const customIcon = new Icon({
  iconUrl: "/map-pin.svg",
  iconSize: [25, 41],
  iconAnchor: [13, 5],
});

interface MapPlaceMarkerProps {
  place: Place;
}

function MapPlaceMarker({ place }: MapPlaceMarkerProps) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleOpenDetails = () => {
    setIsDrawerOpen(true);
  };

  const position = useMemo(() => ({ lat: place.lat, lng: place.lon }), [place.lat, place.lon]);

  return (
    <>
      <Marker
        key={place.id}
        position={position}
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

      {isDrawerOpen && (
        <PlaceDetailsDrawer
          place={place}
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
        />
      )}
    </>
  );
}

MapPlaceMarker.displayName = "MapPlaceMarker";

export default memo(MapPlaceMarker);
