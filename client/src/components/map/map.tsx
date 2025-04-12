"use client";

import { MapContainer, TileLayer, Marker } from "react-leaflet";
import { Icon } from "leaflet";

import "leaflet/dist/leaflet.css";
import { usePlaces } from "@/lib/hooks/use-places";

const customIcon = new Icon({
  iconUrl: "/map-pin.svg",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map() {
  const center = {
    lat: 49.83826000,
    lng: 24.02324000,
  };

  const { data: places, error } = usePlaces();

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
        zoomControl={true}
        attributionControl={true}
        className="z-0"
      >
        <TileLayer
          // attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          // url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='<a href="https://jawg.io" title="Tiles Courtesy of Jawg Maps" target="_blank">&copy; <b>Jawg</b>Maps</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://tile.jawg.io/jawg-streets/{z}/{x}/{y}{r}.png?access-token=yMPPhITp4JDWFD3N3AqU94SuPGKVWnLJD4jdaO0t9LbKLsKiu97If4V2FSx057QT"
        />
        
        {places?.map((place) => (
          <Marker 
            key={place.id}
            position={{ lat: place.lat, lng: place.lon }}
            icon={customIcon}
          >
            {/* <Popup>
              <div>
                <h3 className="font-semibold">{place.name}</h3>
                <p className="text-sm">{place.address}</p>
                <p className="text-xs mt-1">Категорія: {place.category}</p>
                <div className="text-xs mt-2">
                  <p>Доступність:</p>
                  <ul className="list-disc list-inside ml-2">
                    {place.wheelchairAccessible && <li>Доступно для інвалідних візків</li>}
                    {place.tactileElements && <li>Тактильні елементи</li>}
                    {place.brailleSignage && <li>Позначення шрифтом Брайля</li>}
                    {place.accessibleToilets && <li>Доступні туалети</li>}
                  </ul>
                </div>
              </div>
            </Popup> */}
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
