export enum PlaceCategory {
  CAFE = "CAFE",
  RESTAURANT = "RESTAURANT",
  CINEMA = "CINEMA",
  LIBRARY = "LIBRARY",
  TRANSPORT = "TRANSPORT",
  SHOP = "SHOP",
  MEDICAL = "MEDICAL",
  EDUCATION = "EDUCATION",
  SPORT = "SPORT",
  ENTERTAINMENT = "ENTERTAINMENT",
  GOVERNMENT = "GOVERNMENT",
  COMMUNITY_CENTER = "COMMUNITY_CENTER",
  CULTURAL_CENTER = "CULTURAL_CENTER",
  PARK = "PARK",
  OTHER = "OTHER",
}

export enum AccessibilityFeature {
  WHEELCHAIR_ACCESSIBLE = "WHEELCHAIR_ACCESSIBLE",
  TACTILE_ELEMENTS = "TACTILE_ELEMENTS",
  BRAILLE_SIGNAGE = "BRAILLE_SIGNAGE",
  ACCESSIBLE_TOILETS = "ACCESSIBLE_TOILETS",
}

export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: number[];
}

export interface Place {
  id: number;
  name: string;
  address: string;
  lat: number;
  lon: number;
  wheelchairAccessible: boolean;
  tactileElements: boolean;
  brailleSignage: boolean;
  accessibleToilets: boolean;
  category: PlaceCategory;
  overallAccessibilityScore: number;
  createdAt: number;
  updatedAt: number;
  createdBy: User;
}

export interface CreatePlaceRequest {
  name: string;
  address: string;
  lat: number;
  lon: number;
  wheelchairAccessible: boolean;
  tactileElements: boolean;
  brailleSignage: boolean;
  accessibleToilets: boolean;
  category: PlaceCategory;
}

export type UpdatePlaceRequest = CreatePlaceRequest;

export interface GetPlacesParams {
  category?: PlaceCategory;
  accessibility?: AccessibilityFeature;
} 