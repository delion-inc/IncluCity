"use client";

import { useEffect, useState } from "react";
import { Map, Navigation, Info, AlertCircle, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRoute } from "@/lib/contexts/route.context";
import { getRoute } from "@/lib/services/route.service";

import RouteErrors from "./route-errors";

export default function RouteDialog() {
  const {
    isRoutingMode,
    toggleRoutingMode,
    startPoint,
    endPoint,
    setRouteGeometry,
    setRouteSteps,
    clearRoute,
    routeProfile,
    setRouteProfile,
  } = useRoute();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function calculateRoute() {
      if (startPoint && endPoint) {
        setIsLoading(true);
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
        } finally {
          setIsLoading(false);
        }
      }
    }

    if (isRoutingMode && startPoint && endPoint) {
      calculateRoute();
    }

    return () => {
      isMounted = false;
    };
  }, [startPoint, endPoint, isRoutingMode, setRouteGeometry, setRouteSteps, setRouteProfile]);

  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (!open) {
      setError(null);
    }
  };

  const handleToggleRoutingMode = () => {
    toggleRoutingMode();
    setIsOpen(false);
  };

  const handleClearRoute = () => {
    clearRoute();
    setError(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant="secondary"
          size="lg"
          className={`rounded-xl shadow-lg px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 text-primary 
            ${isRoutingMode ? "border-primary " : "hover:border-primary"}`}
          aria-label="Побудова маршруту"
          onClick={() => setIsOpen(true)}
        >
          <Navigation className="h-5 w-5 mr-2" aria-hidden="true" />
          <span>Маршрут</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-full max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Побудова доступного маршруту</DialogTitle>
        </DialogHeader>

        <div className="mt-4 space-y-4">
          <p className="text-gray-600 text-sm">
            Виберіть початкову і кінцеву точки на карті для побудови найбільш доступного маршруту
            для людей з обмеженими можливостями.
          </p>

          <div className="p-3 bg-blue-50 rounded-lg">
            <p className="text-blue-600 text-sm flex items-start">
              <Info className="h-4 w-4 mr-2 shrink-0 mt-0.5" />
              <span>
                Маркери автоматично будуть прив&apos;язані до найближчої доступної дороги чи
                тротуару для побудови маршруту.
              </span>
            </p>
          </div>

          {error && <div className="p-3 bg-red-50 rounded-lg text-red-600 text-sm">{error}</div>}

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

          <div className="space-y-2">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-green-500 mr-2"></div>
              <p className="text-sm">
                {startPoint
                  ? `Початкова точка: ${startPoint.name || `${startPoint.lat.toFixed(5)}, ${startPoint.lng.toFixed(5)}`}`
                  : "Початкова точка: Не вибрано"}
              </p>
            </div>
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
              <p className="text-sm">
                {endPoint
                  ? `Кінцева точка: ${endPoint.name || `${endPoint.lat.toFixed(5)}, ${endPoint.lng.toFixed(5)}`}`
                  : "Кінцева точка: Не вибрано"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 pt-2">
            <Button
              variant={isRoutingMode ? "destructive" : "default"}
              disabled={isLoading}
              onClick={handleToggleRoutingMode}
            >
              {isRoutingMode ? "Вимкнути режим" : "Увімкнути режим"}
            </Button>
            <Button
              variant="outline"
              disabled={isLoading || (!startPoint && !endPoint)}
              onClick={handleClearRoute}
            >
              Очистити маршрут
            </Button>
          </div>

          {isRoutingMode && (
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-600 text-sm flex items-center">
                <Map className="h-4 w-4 mr-2" />
                Натисніть на карту, щоб вибрати точки маршруту
              </p>
            </div>
          )}

          <RouteErrors />
        </div>
      </DialogContent>
    </Dialog>
  );
}
