"use client";

import { useEffect, useState } from "react";
import { MapPin, Navigation, Info, AlertCircle, User, X, MapIcon, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRoute } from "@/lib/contexts/route.context";
import { getRoute } from "@/lib/services/route.service";
import { useSearchPlaces } from "@/lib/hooks/use-places";
import { RoutePoint } from "@/lib/types/route.types";
import { PlaceSearchResult } from "@/lib/types/place.types";

import RouteErrors from "./route-errors";

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export default function RouteCard() {
  const {
    isRoutingMode,
    toggleRoutingMode,
    startPoint,
    endPoint,
    setStartPoint,
    setEndPoint,
    setRouteGeometry,
    setRouteSteps,
    clearRoute,
    routeProfile,
    setRouteProfile,
  } = useRoute();

  const [isCardOpen, setIsCardOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 1000); // 1 секунда дебаунс
  const [showResults, setShowResults] = useState(false);
  const [activePoint, setActivePoint] = useState<"start" | "end" | null>(null);

  const { data: searchResults, isLoading: isSearchLoading } = useSearchPlaces(debouncedSearchQuery);

  const [pickMode, setPickMode] = useState<"start" | "end" | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function calculateRoute() {
      if (startPoint && endPoint) {
        setError(null);
        setRouteProfile(null);

        const distance =
          Math.sqrt(
            Math.pow(startPoint.lat - endPoint.lat, 2) + Math.pow(startPoint.lng - endPoint.lng, 2),
          ) * 111000; // приблизна відстань в метрах (1 градус ≈ 111 км)

        if (distance < 5) {
          // Менше 5 метрів
          console.warn("Points are too close, may cause routing issues");
        }

        try {
          const routeData = await getRoute(startPoint, endPoint);

          if (!isMounted) return;

          if (!routeData) {
            console.error("Route data is null or undefined");
            setError("Помилка отримання даних маршруту");

            return;
          }

          if (routeData.routes && routeData.routes.length > 0) {
            const route = routeData.routes[0];

            if (!route.geometry) {
              console.error("Route geometry is missing");
              setError("Маршрут повернуто без геометрії");

              return;
            }

            const geometry = route.geometry;
            const steps = route.segments[0].steps;

            setTimeout(() => {
              if (!isMounted) return;
              setRouteGeometry(geometry);
              setRouteSteps(steps);

              if (routeData.metadata?.query?.profile) {
                const profile =
                  routeData.metadata.query.profile === "wheelchair" ? "wheelchair" : "walking";

                setRouteProfile(profile);
              } else {
                console.log("No profile in metadata, defaulting to wheelchair");
                setRouteProfile("wheelchair");
              }
            }, 50);
          } else {
            console.error("No routes found in response", routeData);
            setError("Не вдалося побудувати маршрут. Спробуйте інші точки.");
          }
        } catch (err: unknown) {
          console.error("Error calculating route:", err);

          if (err instanceof Error && err.message && err.message.includes("could not be found")) {
            setError(
              "Не вдалося побудувати маршрут між вказаними точками. Спробуйте вибрати точки ближче до тротуарів або вулиць.",
            );
          } else {
            setError(
              `Помилка при побудові маршруту: ${err instanceof Error ? err.message : "Невідома помилка"}`,
            );
          }
        }
      }
    }

    if (startPoint && endPoint) {
      calculateRoute();

      if (!isRoutingMode) {
        toggleRoutingMode();
      }
    }

    return () => {
      isMounted = false;
    };
  }, [
    startPoint,
    endPoint,
    isRoutingMode,
    toggleRoutingMode,
    setRouteGeometry,
    setRouteSteps,
    setRouteProfile,
  ]);

  const handleToggleCard = () => {
    setIsCardOpen(!isCardOpen);

    if (isCardOpen && (startPoint || endPoint)) {
    }

    if (isCardOpen && isRoutingMode) {
      toggleRoutingMode();
    }
  };

  const handleSearchPlace = (point: "start" | "end") => {
    setActivePoint(point);
    setShowResults(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (e.target.value.length >= 3) {
      setShowResults(true);
    } else {
      setShowResults(false);
    }
  };

  useEffect(() => {
    if (debouncedSearchQuery.length >= 3) {
      setShowResults(true);
    }
  }, [debouncedSearchQuery, searchResults]);

  const handlePlaceSelect = (place: PlaceSearchResult) => {
    const routePoint: RoutePoint = {
      lat: place.lat,
      lng: place.lon,
      name: place.name,
    };

    if (activePoint === "start") {
      setStartPoint(routePoint);
    } else if (activePoint === "end") {
      setEndPoint(routePoint);
    }

    setShowResults(false);
    setSearchQuery("");
    setActivePoint(null);
  };

  const handleClearRoute = () => {
    clearRoute();
    setError(null);

    if (isRoutingMode) {
      toggleRoutingMode();
    }
  };

  const handlePickFromMap = (point: "start" | "end") => {
    setPickMode(point);
    window.dispatchEvent(new CustomEvent("activatePickMode", { detail: { point } }));
  };

  const handleCancelPickMode = () => {
    setPickMode(null);
    window.dispatchEvent(new CustomEvent("deactivatePickMode"));
  };

  useEffect(() => {
    const handlePlacePicked = (e: CustomEvent) => {
      const { lat, lng, point } = e.detail;

      const pointName = `${lat.toFixed(5)}, ${lng.toFixed(5)}`;

      if (point === "start") {
        setStartPoint({ lat, lng, name: pointName });
      } else if (point === "end") {
        setEndPoint({ lat, lng, name: pointName });
      }

      setPickMode(null);
    };

    window.addEventListener("placePicked", handlePlacePicked as EventListener);

    return () => {
      window.removeEventListener("placePicked", handlePlacePicked as EventListener);
    };
  }, [setStartPoint, setEndPoint]);

  return (
    <>
      <Button
        variant="secondary"
        size="lg"
        className={`rounded-xl shadow-lg px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 text-primary 
          ${startPoint || endPoint ? "border-primary " : "hover:border-primary"}`}
        aria-label="Побудова маршруту"
        onClick={handleToggleCard}
      >
        <Navigation className="h-5 w-5 mr-2" aria-hidden="true" />
        <span>Маршрут</span>
      </Button>

      {isCardOpen && (
        <div className="fixed top-20 right-4 z-50 w-96 max-w-[90vw] bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
          {pickMode && (
            <div className="absolute inset-0 z-10 bg-white/95 flex flex-col items-center justify-center p-4">
              <p className="text-center font-medium mb-2">
                Виберіть {pickMode === "start" ? "початкову" : "кінцеву"} точку на карті
              </p>
              <p className="text-sm text-gray-500 text-center mb-4">
                Рухайте карту, щоб розмістити маркер у потрібній точці, потім натисніть на карту або
                підтвердіть вибір
              </p>
              <div className="flex flex-col gap-2 w-full max-w-xs">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent("confirmPickMode"));
                  }}
                >
                  Підтвердити вибір
                </Button>
                <Button variant="outline" className="w-full" onClick={handleCancelPickMode}>
                  <XCircle className="h-4 w-4 mr-2" />
                  Скасувати вибір
                </Button>
              </div>
            </div>
          )}

          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">Побудова доступного маршруту</h3>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => {
                  handleToggleCard();
                  if (isRoutingMode) {
                    toggleRoutingMode();
                  }
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-gray-600 text-sm">
                Виберіть початкову і кінцеву точки для побудови найбільш доступного маршруту для
                людей з обмеженими можливостями.
              </p>

              <div className="space-y-3">
                <div className="relative">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
                    <p className="text-sm font-medium">Початкова точка</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Input
                        placeholder="Знайти місце..."
                        value={activePoint === "start" ? searchQuery : startPoint?.name || ""}
                        className="text-sm w-full"
                        onClick={() => handleSearchPlace("start")}
                        onChange={activePoint === "start" ? handleSearchChange : undefined}
                      />
                      {activePoint === "start" && isSearchLoading && searchQuery.length >= 3 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="shrink-0"
                      onClick={() => handlePickFromMap("start")}
                    >
                      <MapIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  {showResults && activePoint === "start" && searchQuery.length >= 3 && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {isSearchLoading ? (
                        <div className="p-3 text-center">
                          <div className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : searchResults && searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                          <button
                            key={`start-${result.placeId || result.name}-${index}`}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-start"
                            onClick={() => handlePlaceSelect(result)}
                          >
                            <MapPin className="h-4 w-4 text-primary mt-0.5 mr-2 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">{result.name}</p>
                              {result.placeId ? (
                                <p className="text-xs text-green-600">Доступне місце</p>
                              ) : (
                                <p className="text-xs text-gray-500">Адреса</p>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          Нічого не знайдено
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div className="relative">
                  <div className="flex items-center mb-1">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <p className="text-sm font-medium">Кінцева точка</p>
                  </div>
                  <div className="flex gap-2">
                    <div className="relative flex-grow">
                      <Input
                        placeholder="Знайти місце..."
                        value={activePoint === "end" ? searchQuery : endPoint?.name || ""}
                        className="text-sm w-full"
                        onClick={() => handleSearchPlace("end")}
                        onChange={activePoint === "end" ? handleSearchChange : undefined}
                      />
                      {activePoint === "end" && isSearchLoading && searchQuery.length >= 3 && (
                        <div className="absolute right-2 top-1/2 -translate-y-1/2">
                          <div className="h-3 w-3 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      )}
                    </div>
                    <Button
                      variant="outline"
                      className="shrink-0"
                      onClick={() => handlePickFromMap("end")}
                    >
                      <MapIcon className="h-4 w-4" />
                    </Button>
                  </div>

                  {showResults && activePoint === "end" && searchQuery.length >= 3 && (
                    <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {isSearchLoading ? (
                        <div className="p-3 text-center">
                          <div className="inline-block h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
                        </div>
                      ) : searchResults && searchResults.length > 0 ? (
                        searchResults.map((result, index) => (
                          <button
                            key={`end-${result.placeId || result.name}-${index}`}
                            className="w-full text-left px-3 py-2 hover:bg-gray-50 flex items-start"
                            onClick={() => handlePlaceSelect(result)}
                          >
                            <MapPin className="h-4 w-4 text-primary mt-0.5 mr-2 shrink-0" />
                            <div>
                              <p className="text-sm font-medium">{result.name}</p>
                              {result.placeId ? (
                                <p className="text-xs text-green-600">Доступне місце</p>
                              ) : (
                                <p className="text-xs text-gray-500">Адреса</p>
                              )}
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className="p-3 text-center text-gray-500 text-sm">
                          Нічого не знайдено
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {error && (
                <div className="p-3 bg-red-50 rounded-lg text-red-600 text-sm">{error}</div>
              )}

              {routeProfile && (
                <div
                  className={`p-3 rounded-lg ${routeProfile === "wheelchair" ? "bg-green-50" : "bg-yellow-50"}`}
                >
                  <p
                    className={`text-sm flex items-start ${routeProfile === "wheelchair" ? "text-green-600" : "text-yellow-600"}`}
                  >
                    {routeProfile === "wheelchair" ? (
                      <AlertCircle className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                    ) : (
                      <User className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                    )}
                    <span>
                      {routeProfile === "wheelchair"
                        ? "Маршрут побудовано для людей на візках"
                        : "Маршрут побудовано для пішоходів (частково може бути недоступним для візків)"}
                    </span>
                  </p>
                </div>
              )}

              <div className="p-3 bg-blue-50 rounded-lg">
                <p className="text-blue-600 text-sm flex items-start">
                  <Info className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
                  <span>
                    Маркери автоматично будуть прив&apos;язані до найближчої доступної дороги чи
                    тротуару для побудови маршруту.
                  </span>
                </p>
              </div>

              {(startPoint || endPoint) && (
                <Button variant="destructive" className="w-full" onClick={handleClearRoute}>
                  Очистити маршрут
                </Button>
              )}

              <RouteErrors />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
