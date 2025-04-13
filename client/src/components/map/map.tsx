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
  const [centerMarkerActive, setCenterMarkerActive] = useState(false);

  useEffect(() => {
    const handleActivatePickMode = () => {
      setCenterMarkerActive(true);
    };

    const handleDeactivatePickMode = () => {
      setCenterMarkerActive(false);
    };

    const handlePlacePicked = () => {
      setCenterMarkerActive(false);
    };

    window.addEventListener("activatePickMode", handleActivatePickMode);
    window.addEventListener("deactivatePickMode", handleDeactivatePickMode);
    window.addEventListener("placePicked", handlePlacePicked);

    return () => {
      window.removeEventListener("activatePickMode", handleActivatePickMode);
      window.removeEventListener("deactivatePickMode", handleDeactivatePickMode);
      window.removeEventListener("placePicked", handlePlacePicked);
    };
  }, []);

  useMapEvents({
    click: (e) => {
      if (centerMarkerActive) return;

      if (!isRoutingMode) return;

      const { lat, lng } = e.latlng;

      if (!startPoint) {
        setStartPoint({ lat, lng });
      } else if (!endPoint) {
        setEndPoint({ lat, lng });
      } else {
        setStartPoint({ lat, lng });
        setEndPoint(null);
      }
    },
  });

  return null;
}

function MapCenterMarker() {
  const [isActive, setIsActive] = useState(false);
  const [activePoint, setActivePoint] = useState<"start" | "end" | null>(null);
  const map = useMap();

  const confirmSelection = useCallback(() => {
    if (isActive && activePoint && map) {
      const center = map.getCenter();

      window.dispatchEvent(
        new CustomEvent("placePicked", {
          detail: {
            lat: center.lat,
            lng: center.lng,
            point: activePoint,
          },
        }),
      );
      setIsActive(false);
      setActivePoint(null);
    }
  }, [isActive, activePoint, map]);

  useEffect(() => {
    if (!map) return;

    const centerMarkerStyle = document.createElement("style");

    centerMarkerStyle.innerHTML = `
      .center-marker {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 1000;
        pointer-events: none;
      }
      .center-marker-inner {
        width: 20px;
        height: 20px;
        border-radius: 50%;
        border: 2px solid white;
        box-shadow: 0 0 0 2px #3182ce;
        background-color: rgba(49, 130, 206, 0.5);
      }
      .center-marker-pulse {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 40px;
        height: 40px;
        border-radius: 50%;
        background-color: rgba(49, 130, 206, 0.3);
        animation: pulse 1.5s infinite;
      }
      @keyframes pulse {
        0% {
          transform: translate(-50%, -50%) scale(0.5);
          opacity: 1;
        }
        100% {
          transform: translate(-50%, -50%) scale(1.5);
          opacity: 0;
        }
      }
      .center-text {
        position: absolute;
        top: calc(50% + 15px);
        left: 50%;
        transform: translateX(-50%);
        background-color: white;
        padding: 4px 10px;
        border-radius: 4px;
        font-size: 12px;
        box-shadow: 0 1px 3px rgba(0,0,0,0.2);
        color: #3182ce;
        font-weight: 600;
        white-space: nowrap;
      }
    `;
    document.head.appendChild(centerMarkerStyle);

    return () => {
      document.head.removeChild(centerMarkerStyle);
    };
  }, [map]);

  useEffect(() => {
    const handleActivatePickMode = (e: CustomEvent) => {
      const { point } = e.detail;

      setIsActive(true);
      setActivePoint(point);
    };

    const handleDeactivatePickMode = () => {
      setIsActive(false);
      setActivePoint(null);
    };

    const handleConfirmPickMode = () => {
      confirmSelection();
    };

    window.addEventListener("activatePickMode", handleActivatePickMode as EventListener);
    window.addEventListener("deactivatePickMode", handleDeactivatePickMode as EventListener);
    window.addEventListener("confirmPickMode", handleConfirmPickMode as EventListener);

    return () => {
      window.removeEventListener("activatePickMode", handleActivatePickMode as EventListener);
      window.removeEventListener("deactivatePickMode", handleDeactivatePickMode as EventListener);
      window.removeEventListener("confirmPickMode", handleConfirmPickMode as EventListener);
    };
  }, [confirmSelection]);

  useMapEvents({
    click: () => {
      if (isActive && activePoint && map) {
        confirmSelection();
      }
    },
  });

  if (!isActive) return null;

  return (
    <div className="center-marker">
      <div className="center-marker-pulse"></div>
      <div className="center-marker-inner"></div>
      <div className="center-text">
        {activePoint === "start" ? "Початкова точка" : "Кінцева точка"}
      </div>
    </div>
  );
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
  const { isRoutingMode, startPoint, endPoint } = useRoute();

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
        <MapCenterMarker />

        {(!isRoutingMode || (!startPoint && !endPoint)) && (
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
