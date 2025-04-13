"use client";

import { MapContainer, TileLayer, ZoomControl, useMapEvents, useMap } from "react-leaflet";
import { useEffect, useMemo, memo, useState, useCallback } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import dynamic from "next/dynamic";

import { usePlaces } from "@/lib/hooks/use-places";
import { useFilters } from "@/lib/contexts/filter.context";
import { useRoute } from "@/lib/contexts/route.context";
import { PlaceSearchResult } from "@/lib/types/place.types";

const MapPlaceMarker = dynamic(() => import("./map-place-marker"), { ssr: false });
const MapRoute = dynamic(() => import("./map-route"), { ssr: false });
const MapUnevaluatedPlaceMarker = dynamic(() => import("./map-unevaluated-place-marker"), {
  ssr: false,
});

const DEFAULT_CENTER = {
  lat: 49.83826,
  lng: 24.02324,
};

const MAP_STYLE = { height: "100%", width: "100%" };

const ErrorMessage = memo(({ message }: { message: string }) => (
  <div className="absolute top-20 right-4 bg-red-100 p-2 rounded-md shadow-md z-10">{message}</div>
));

ErrorMessage.displayName = "ErrorMessage";

function MapCustomEventHandler() {
  const map = useMap();
  const [unevaluatedPlaces, setUnevaluatedPlaces] = useState<PlaceSearchResult[]>([]);
  const { data: allPlaces } = usePlaces();

  useEffect(() => {
    return () => {
      setUnevaluatedPlaces([]);
    };
  }, []);

  const focusOnExistingMarker = useCallback(
    (placeId: number) => {
      if (!map) return;

      const existingPlace = allPlaces?.find((place) => place.id === placeId);

      if (existingPlace) {
        map.eachLayer((layer) => {
          if (layer instanceof L.Marker && layer.isPopupOpen()) {
            layer.closePopup();
          }
        });

        map.setView([existingPlace.lat, existingPlace.lon], 17);

        setTimeout(() => {
          const targetLat = existingPlace.lat;
          const targetLon = existingPlace.lon;

          map.eachLayer((layer) => {
            if (layer instanceof L.Marker) {
              const markerLatLng = layer.getLatLng();

              const latDiff = Math.abs(markerLatLng.lat - targetLat);
              const lngDiff = Math.abs(markerLatLng.lng - targetLon);

              if (latDiff < 0.0001 && lngDiff < 0.0001) {
                setTimeout(() => {
                  layer.openPopup();
                }, 100);

                return;
              }
            }
          });

          const newZoom = map.getZoom() + 1;

          map.setView([existingPlace.lat, existingPlace.lon], newZoom);

          setTimeout(() => {
            map.eachLayer((layer) => {
              if (layer instanceof L.Marker) {
                const markerLatLng = layer.getLatLng();

                const latDiff = Math.abs(markerLatLng.lat - targetLat);
                const lngDiff = Math.abs(markerLatLng.lng - targetLon);

                if (latDiff < 0.0001 && lngDiff < 0.0001) {
                  setTimeout(() => {
                    layer.openPopup();
                  }, 100);

                  return;
                }
              }
            });
          }, 500);
        }, 300);
      }
    },
    [map, allPlaces],
  );

  useEffect(() => {
    function handleSetMapView(e: CustomEvent) {
      if (!map) return;

      const { lat, lon, name, placeId } = e.detail;

      if (placeId) {
        focusOnExistingMarker(placeId);
        setUnevaluatedPlaces([]);
      } else {
        const place: PlaceSearchResult = {
          name: name || "Нове місце",
          lat,
          lon,
          placeId: null,
        };

        setUnevaluatedPlaces([place]);

        map.setView([lat, lon], 15);
      }
    }

    window.addEventListener("setMapView", handleSetMapView as EventListener);

    return () => {
      window.removeEventListener("setMapView", handleSetMapView as EventListener);
    };
  }, [map, focusOnExistingMarker]);

  return (
    <>
      {unevaluatedPlaces.map((place, index) => (
        <MapUnevaluatedPlaceMarker
          key={`unevaluated-${index}-${place.lat}-${place.lon}${place.placeId ? `-${place.placeId}` : ""}`}
          place={place}
        />
      ))}
    </>
  );
}

function MapClickHandler() {
  const { isRoutingMode, startPoint, endPoint, setStartPoint, setEndPoint } = useRoute();

  useMapEvents({
    click: (e) => {
      if (isRoutingMode) {
        const { lat, lng } = e.latlng;

        if (!startPoint) {
          setStartPoint({ lat, lng });
        } else if (!endPoint) {
          setEndPoint({ lat, lng });
        } else {
          setStartPoint({ lat, lng });
          setEndPoint(null);
        }
      }
    },
  });

  return null;
}

function Map() {
  const { selectedCategories, selectedAccessibility } = useFilters();

  const filterParams = useMemo(
    () => ({
      categories: selectedCategories.length > 0 ? selectedCategories : undefined,
      accessibility: selectedAccessibility.length > 0 ? selectedAccessibility : undefined,
    }),
    [selectedCategories, selectedAccessibility],
  );

  const { data: places, error } = usePlaces(filterParams);
  const { isRoutingMode } = useRoute();

  useEffect(() => {
    const style = document.createElement("style");

    style.innerHTML = `
      .leaflet-popup {
        pointer-events: auto !important;
      }
      .leaflet-marker-icon {
        pointer-events: auto !important;
      }
      .route-popup .leaflet-popup-content-wrapper {
        background-color: white;
        border-radius: 8px;
      }
      .route-popup .leaflet-popup-content {
        margin: 12px 16px;
        line-height: 1.5;
      }
      .custom-marker-icon {
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        background: none;
      }
      .custom-marker-icon > div {
        box-shadow: 0 0 8px rgba(0, 0, 0, 0.3);
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

        <MapClickHandler />
        <MapRoute />
        <MapCustomEventHandler />

        {!isRoutingMode && (
          <MarkerClusterGroup
            chunkedLoading={true}
            spiderfyOnMaxZoom={true}
            disableClusteringAtZoom={16}
            maxClusterRadius={60}
            animate={true}
          >
            {places?.map((place) => <MapPlaceMarker key={place.id} place={place} />)}
          </MarkerClusterGroup>
        )}
      </MapContainer>
    </div>
  );
}

export default memo(Map);
