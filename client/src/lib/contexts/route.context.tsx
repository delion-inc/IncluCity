"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

import { RoutePoint, RouteStep } from "../types/route.types";

interface RouteContextType {
  startPoint: RoutePoint | null;
  endPoint: RoutePoint | null;
  routeGeometry: string | null;
  routeSteps: RouteStep[] | null;
  isRoutingMode: boolean;
  routeProfile: "wheelchair" | "walking" | null;
  setStartPoint: (point: RoutePoint | null) => void;
  setEndPoint: (point: RoutePoint | null) => void;
  setRouteGeometry: (geometry: string | null) => void;
  setRouteSteps: (steps: RouteStep[] | null) => void;
  setRouteProfile: (profile: "wheelchair" | "walking" | null) => void;
  toggleRoutingMode: () => void;
  clearRoute: () => void;
}

const RouteContext = createContext<RouteContextType | undefined>(undefined);

export function RouteProvider({ children }: { children: ReactNode }) {
  const [startPoint, setStartPoint] = useState<RoutePoint | null>(null);
  const [endPoint, setEndPoint] = useState<RoutePoint | null>(null);
  const [routeGeometry, setRouteGeometry] = useState<string | null>(null);
  const [routeSteps, setRouteSteps] = useState<RouteStep[] | null>(null);
  const [isRoutingMode, setIsRoutingMode] = useState(false);
  const [routeProfile, setRouteProfile] = useState<"wheelchair" | "walking" | null>(null);

  const toggleRoutingMode = useCallback(() => {
    setIsRoutingMode((prev) => !prev);
  }, []);

  const clearRoute = useCallback(() => {
    setStartPoint(null);
    setEndPoint(null);
    setRouteGeometry(null);
    setRouteSteps(null);
    setRouteProfile(null);
  }, []);

  return (
    <RouteContext.Provider
      value={{
        startPoint,
        endPoint,
        routeGeometry,
        routeSteps,
        isRoutingMode,
        routeProfile,
        setStartPoint,
        setEndPoint,
        setRouteGeometry,
        setRouteSteps,
        setRouteProfile,
        toggleRoutingMode,
        clearRoute,
      }}
    >
      {children}
    </RouteContext.Provider>
  );
}

export function useRoute() {
  const context = useContext(RouteContext);

  if (context === undefined) {
    throw new Error("useRoute must be used within a RouteProvider");
  }

  return context;
}
