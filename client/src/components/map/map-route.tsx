"use client";

import { useEffect, useMemo, useState, useCallback } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet-routing-machine";

import { polyline } from "@/lib/utils/polyline";
import { useRoute } from "@/lib/contexts/route.context";
import { getNearestRoad } from "@/lib/services/route.service";

const createCustomIcon = (color: string, isOriginal = false) => {
  return L.divIcon({
    className: "custom-marker-icon",
    html: `<div style="background-color: ${color}; width: ${isOriginal ? "16" : "24"}px; height: ${isOriginal ? "16" : "24"}px; border-radius: 50%; border: ${isOriginal ? "2" : "3"}px solid white; box-shadow: 0 0 0 2px ${color}${isOriginal ? "90" : ""};"></div>`,
    iconSize: [isOriginal ? 20 : 30, isOriginal ? 20 : 30],
    iconAnchor: [isOriginal ? 10 : 15, isOriginal ? 10 : 15],
    popupAnchor: [0, isOriginal ? -10 : -15],
  });
};

const startIcon = createCustomIcon("#10B981");
const endIcon = createCustomIcon("#EF4444");
const originalStartIcon = createCustomIcon("#10B981", true);
const originalEndIcon = createCustomIcon("#EF4444", true);

export default function MapRoute() {
  const map = useMap();
  const { routeGeometry, startPoint, endPoint, routeSteps, routeProfile } = useRoute();
  const [snappedStart, setSnappedStart] = useState<{ lat: number; lng: number } | null>(null);
  const [snappedEnd, setSnappedEnd] = useState<{ lat: number; lng: number } | null>(null);

  const startPointKey = useMemo(
    () => (startPoint ? `${startPoint.lat},${startPoint.lng}` : null),
    [startPoint],
  );

  const endPointKey = useMemo(
    () => (endPoint ? `${endPoint.lat},${endPoint.lng}` : null),
    [endPoint],
  );

  const snapPoints = useCallback(async () => {
    if (!startPoint && !endPoint) return;

    const profile = routeProfile || "wheelchair";

    if (startPoint) {
      try {
        const snapped = await getNearestRoad(startPoint, profile);

        if (snapped && (snapped.lat !== startPoint.lat || snapped.lng !== startPoint.lng)) {
          setSnappedStart(snapped);
        } else {
          setSnappedStart(null);
        }
      } catch (error) {
        console.error("Error snapping start point:", error);
        setSnappedStart(null);
      }
    } else {
      setSnappedStart(null);
    }

    if (endPoint) {
      try {
        const snapped = await getNearestRoad(endPoint, profile);

        if (snapped && (snapped.lat !== endPoint.lat || snapped.lng !== endPoint.lng)) {
          setSnappedEnd(snapped);
        } else {
          setSnappedEnd(null);
        }
      } catch (error) {
        console.error("Error snapping end point:", error);
        setSnappedEnd(null);
      }
    } else {
      setSnappedEnd(null);
    }
  }, [startPoint, endPoint, routeProfile]);

  useEffect(() => {
    const timer = setTimeout(() => {
      snapPoints();
    }, 300);

    return () => clearTimeout(timer);
  }, [startPointKey, endPointKey, routeProfile, snapPoints]);

  const decodedCoordinates = useMemo(() => {
    if (!routeGeometry) {
      return [];
    }

    try {
      const decoded = polyline
        .decode(routeGeometry)
        .map((coords) => [coords[0], coords[1]] as L.LatLngTuple);

      return decoded;
    } catch (err) {
      console.error("Error decoding polyline:", err);

      return [];
    }
  }, [routeGeometry]);

  const routeKey = useMemo(() => {
    return `route_${routeGeometry || "none"}_${routeProfile || "none"}_${decodedCoordinates.length}`;
  }, [routeGeometry, routeProfile, decodedCoordinates.length]);

  const renderRouteLayers = useCallback(() => {
    if (!map) return () => {};

    map.eachLayer((layer) => {
      if (layer instanceof L.Polyline && layer.options.className === "route-path") {
        map.removeLayer(layer);
      }
      if (layer instanceof L.Marker && layer.getElement()?.querySelector(".custom-marker-icon")) {
        map.removeLayer(layer);
      }
      if (layer instanceof L.Polyline && layer.options.className === "snap-path") {
        map.removeLayer(layer);
      }
    });

    const layers: L.Layer[] = [];

    if (startPoint) {
      if (snappedStart) {
        const originalMarker = L.marker([startPoint.lat, startPoint.lng], {
          icon: originalStartIcon,
          zIndexOffset: 900,
        }).addTo(map);

        layers.push(originalMarker);

        originalMarker.bindTooltip("Вибрана точка", {
          permanent: false,
          direction: "top",
        });

        const snappedMarker = L.marker([snappedStart.lat, snappedStart.lng], {
          icon: startIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        layers.push(snappedMarker);

        snappedMarker.bindTooltip("Прив'язана до дороги", {
          permanent: false,
          direction: "top",
        });

        const snapLine = L.polyline(
          [
            [startPoint.lat, startPoint.lng],
            [snappedStart.lat, snappedStart.lng],
          ],
          {
            color: "#10B981",
            dashArray: "5, 5",
            weight: 2,
            opacity: 0.7,
            className: "snap-path",
          },
        ).addTo(map);

        layers.push(snapLine);
      } else {
        const marker = L.marker([startPoint.lat, startPoint.lng], {
          icon: startIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        layers.push(marker);
      }
    }

    if (endPoint) {
      if (snappedEnd) {
        const originalMarker = L.marker([endPoint.lat, endPoint.lng], {
          icon: originalEndIcon,
          zIndexOffset: 900,
        }).addTo(map);

        layers.push(originalMarker);

        originalMarker.bindTooltip("Вибрана точка", {
          permanent: false,
          direction: "top",
        });

        const snappedMarker = L.marker([snappedEnd.lat, snappedEnd.lng], {
          icon: endIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        layers.push(snappedMarker);

        snappedMarker.bindTooltip("Прив'язана до дороги", {
          permanent: false,
          direction: "top",
        });

        const snapLine = L.polyline(
          [
            [endPoint.lat, endPoint.lng],
            [snappedEnd.lat, snappedEnd.lng],
          ],
          {
            color: "#EF4444",
            dashArray: "5, 5",
            weight: 2,
            opacity: 0.7,
            className: "snap-path",
          },
        ).addTo(map);

        layers.push(snapLine);
      } else {
        const marker = L.marker([endPoint.lat, endPoint.lng], {
          icon: endIcon,
          zIndexOffset: 1000,
        }).addTo(map);

        layers.push(marker);
      }
    }

    if (decodedCoordinates.length > 0) {
      const routeColor = routeProfile === "wheelchair" ? "#3B82F6" : "#F59E0B";

      const routeLine = L.polyline(decodedCoordinates, {
        color: routeColor,
        weight: 5,
        opacity: 0.7,
        smoothFactor: 1,
        className: "route-path",
      }).addTo(map);

      layers.push(routeLine);

      map.fitBounds(routeLine.getBounds(), { padding: [50, 50] });

      if (routeSteps && routeSteps.length > 0) {
        let instructions =
          "<h4 class='font-medium mb-2'>Напрямки руху:</h4><ol class='list-decimal pl-5'>";

        routeSteps.forEach((step) => {
          if (step.type !== 10) {
            instructions += `<li class='mb-1 text-sm'>${step.instruction} (${step.distance.toFixed(0)}м)</li>`;
          }
        });
        instructions += "</ol>";

        if (routeProfile === "walking") {
          instructions +=
            "<p class='mt-2 text-xs text-yellow-600 italic'>Увага: цей маршрут для пішоходів і може бути не повністю доступним для візків.</p>";
        }

        routeLine.bindPopup(instructions, {
          maxWidth: 300,
          className: "route-popup",
        });
      }
    }

    return () => {
      layers.forEach((layer) => {
        if (layer && map) {
          map.removeLayer(layer);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    map,
    decodedCoordinates,
    startPoint,
    endPoint,
    routeSteps,
    snappedStart,
    snappedEnd,
    routeProfile,
    routeKey,
  ]);

  useEffect(() => {
    if (!map) {
      console.warn("Map not available yet");

      return;
    }

    const hasAnyPoint = startPoint || endPoint;
    const hasGeometry = routeGeometry && routeGeometry.length > 0;

    if (hasAnyPoint || hasGeometry) {
      const cleanup = renderRouteLayers();

      return cleanup;
    }

    return undefined;
  }, [renderRouteLayers, map, routeKey, startPoint, endPoint, routeGeometry]);

  return null;
}
