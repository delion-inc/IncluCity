"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Icon } from "leaflet";

// Fix for default marker icon in Next.js
const customIcon = new Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  // Центр Києва
  const center = {
    lat: 50.4501,
    lng: 30.5234,
  };

  return (
    <div className="h-full w-full relative" style={{ zIndex: 0 }}>
      <MapContainer
        center={center}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
        attributionControl={true}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={center} icon={customIcon}>
          <Popup>Київ, Україна</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
