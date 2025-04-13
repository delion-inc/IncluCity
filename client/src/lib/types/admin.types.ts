import { PlaceCategory } from "./place.types";

export interface PlaceDTO {
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
  averageRating: number | null;
  countOfReviews: number;
  createdAt: number;
  updatedAt: number;
  createdBy: number;
  approved: boolean;
  title?: string;
  description?: string;
  categoryName?: string;
}

export interface AdminUnapprovedPlacesResponse {
  content: PlaceDTO[];
  total: number;
  totalPages: number;
  pageNumber: number;
}
