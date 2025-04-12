import { Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

import { Place } from "@/lib/types/place.types";

import MapPlacePopup from "./map-place-popup";

const customIcon = new Icon({
  iconUrl: "/map-pin.svg",
  iconSize: [25, 41],
  iconAnchor: [13, 5],
});

interface MapPlaceMarkerProps {
  place: Place;
}

export default function MapPlaceMarker({ place }: MapPlaceMarkerProps) {
  return (
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
        <MapPlacePopup place={place} />
      </Popup>
    </Marker>
  );
}
