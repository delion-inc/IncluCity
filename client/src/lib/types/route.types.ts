export interface RoutePoint {
  lat: number;
  lng: number;
  name?: string;
}

export interface RouteOptions {
  profile?: "wheelchair" | "walking";
}

export interface LocationData {
  location: number[];
  [key: string]: unknown;
}

export interface SnapResponse {
  snapped_locations: LocationData[];
  locations?: LocationData[];
  [key: string]: unknown;
}

export interface RouteStep {
  distance: number;
  duration: number;
  instruction: string;
  name: string;
  type: number;
  way_points: number[];
  [key: string]: unknown;
}

export interface RouteSegment {
  steps: RouteStep[];
  distance: number;
  duration: number;
  [key: string]: unknown;
}

export interface RouteData {
  geometry: string;
  segments: RouteSegment[];
  summary: {
    distance: number;
    duration: number;
  };
  bbox: number[];
  way_points: number[];
  [key: string]: unknown;
}

export interface RouteMetadataQuery {
  profile?: string;
  [key: string]: unknown;
}

export interface RouteMetadata {
  query?: RouteMetadataQuery;
  service?: string;
  engine?: {
    version: string;
    build_date: string;
  };
  [key: string]: unknown;
}

export interface RouteResponse {
  routes: RouteData[];
  metadata?: RouteMetadata;
  [key: string]: unknown;
}

export type RouteServiceError = Error & {
  code?: string;
};

export type CachedData<T> = {
  timestamp: number;
  data: T;
};

export type PendingRequest = {
  controller: AbortController;
  promise: Promise<unknown>;
};
