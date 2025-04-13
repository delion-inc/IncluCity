import { routeApiClient, makeDebounceRequest } from "../api/route-client";
import {
  RoutePoint,
  RouteOptions,
  SnapResponse,
  RouteResponse,
  LocationData,
} from "../types/route.types";

export async function getNearestRoad(
  point: RoutePoint,
  profile = "wheelchair",
): Promise<RoutePoint> {
  try {
    const requestKey = `snap_${point.lat.toFixed(6)}_${point.lng.toFixed(6)}_${profile}`;

    const data = await makeDebounceRequest<SnapResponse>(
      requestKey,
      async () => {
        console.log(`Executing snap request to ${profile} API`);
        const response = await routeApiClient.post<SnapResponse>(`/snap/${profile}`, {
          locations: [[point.lng, point.lat]],
          radius: 50, // радіус пошуку в метрах
        });

        if (response.data.locations && response.data.locations.length > 0) {
          return {
            snapped_locations: response.data.locations.map((loc: LocationData) => ({
              location: loc.location,
            })),
          };
        }

        return response.data;
      },
      100, // Менший дебаунс для швидшої прив'язки
    );

    if (data.snapped_locations && data.snapped_locations.length > 0) {
      const [lng, lat] = data.snapped_locations[0].location;

      const distance =
        Math.sqrt(Math.pow(lat - point.lat, 2) + Math.pow(lng - point.lng, 2)) * 111000; // приблизно в метрах

      if (distance < 0.1) {
        // Менше 10 см, вважаємо що це та сама точка
        return point;
      }

      return { lat, lng, name: point.name };
    }

    // Якщо точка не знайдена, повертаємо оригінальну
    return point;
  } catch (error) {
    console.warn("Error snapping to road:", error);

    return point;
  }
}

async function fetchRoute(
  startPoint: RoutePoint,
  endPoint: RoutePoint,
  profile: string,
): Promise<RouteResponse> {
  const requestKey = `route_${startPoint.lat.toFixed(6)}_${startPoint.lng.toFixed(6)}_${endPoint.lat.toFixed(6)}_${endPoint.lng.toFixed(6)}_${profile}`;

  if (
    isNaN(startPoint.lat) ||
    isNaN(startPoint.lng) ||
    isNaN(endPoint.lat) ||
    isNaN(endPoint.lng)
  ) {
    console.error("Invalid coordinates for route, contains NaN");
    throw new Error("Некоректні координати для побудови маршруту");
  }

  try {
    const data = await makeDebounceRequest<RouteResponse>(
      requestKey,
      async () => {
        const response = await routeApiClient.post<RouteResponse>(`/directions/${profile}`, {
          coordinates: [
            [startPoint.lng, startPoint.lat],
            [endPoint.lng, endPoint.lat],
          ],
        });

        if (!response.data || !response.data.routes || response.data.routes.length === 0) {
          console.error("Route API returned empty routes array");
          throw new Error("Сервіс маршрутизації повернув порожній результат");
        }

        const route = response.data.routes[0];

        if (!route.geometry || route.geometry.length === 0) {
          console.error("Route has empty geometry");
          throw new Error("Маршрут повернуто без геометрії");
        }

        return response.data;
      },
      50,
    );

    return data;
  } catch (error) {
    console.error(`Failed to fetch route with ${profile} profile:`, error);
    throw error;
  }
}

export async function getRoute(
  startPoint: RoutePoint,
  endPoint: RoutePoint,
  options: RouteOptions = {},
): Promise<RouteResponse> {
  try {
    const profile = options.profile || "wheelchair";

    const [snappedStartPoint, snappedEndPoint] = await Promise.all([
      getNearestRoad(startPoint, profile),
      getNearestRoad(endPoint, profile),
    ]);

    if (
      snappedStartPoint.lat === snappedEndPoint.lat &&
      snappedStartPoint.lng === snappedEndPoint.lng
    ) {
      console.error("Snapped start and end points are identical, cannot build route");
      throw new Error(
        "Початкова і кінцева точки маршруту співпадають. Будь ласка, оберіть різні точки.",
      );
    }

    try {
      const routeResponse = await fetchRoute(snappedStartPoint, snappedEndPoint, profile);

      return routeResponse;
    } catch (error: unknown) {
      // Якщо маршрут не знайдено, спробуємо використати інший профіль
      if (
        profile === "wheelchair" &&
        error instanceof Error &&
        error.message &&
        error.message.includes("could not be found")
      ) {
        console.warn("Wheelchair route not found, trying walking profile");
        try {
          const walkingRouteData = await fetchRoute(snappedStartPoint, snappedEndPoint, "walking");

          if (walkingRouteData.metadata && walkingRouteData.metadata.query) {
            walkingRouteData.metadata.query.profile = "walking";
          } else if (walkingRouteData.metadata) {
            walkingRouteData.metadata.query = { profile: "walking" };
          } else {
            walkingRouteData.metadata = { query: { profile: "walking" } };
          }

          return walkingRouteData;
        } catch (innerError) {
          console.error("Error fetching walking route:", innerError);
          throw error;
        }
      } else {
        throw error;
      }
    }
  } catch (error) {
    console.error("Error fetching route:", error);
    throw error;
  }
}
