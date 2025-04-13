import { apiClient } from "../api/client";
import {
  Place,
  GetPlacesParams,
  CreatePlaceRequest,
  UpdatePlaceRequest,
  PlaceSearchResult,
} from "../types/place.types";

const API_PLACES_URL = "/places";

export const placesService = {
  /**
   * Get all places with optional filtering
   */
  getAllPlaces: async (params?: GetPlacesParams): Promise<Place[]> => {
    const queryParams: Record<string, string> = {};

    if (params?.categories && params.categories.length > 0) {
      params.categories.forEach(() => {
        queryParams[`category`] = params.categories?.join(",") || "";
      });
    }

    if (params?.accessibility && params.accessibility.length > 0) {
      params.accessibility.forEach(() => {
        queryParams[`accessibility`] = params.accessibility?.join(",") || "";
      });
    }

    const response = await apiClient.get<Place[]>(`${API_PLACES_URL}/all`, {
      params: queryParams,
    });

    return response.data;
  },

  /**
   * Search places by query text
   */
  searchPlaces: async (query: string): Promise<PlaceSearchResult[]> => {
    const response = await apiClient.get<PlaceSearchResult[]>(`/places/search`, {
      params: { query },
    });

    return response.data;
  },

  /**
   * Get a place by ID
   */
  getPlaceById: async (id: number | string): Promise<Place> => {
    const response = await apiClient.get<Place>(`${API_PLACES_URL}/${id}`);

    return response.data;
  },

  /**
   * Create a new place
   */
  createPlace: async (data: CreatePlaceRequest): Promise<Place> => {
    const response = await apiClient.post<Place>(API_PLACES_URL, data);

    return response.data;
  },

  /**
   * Update an existing place
   */
  updatePlace: async (id: number | string, data: UpdatePlaceRequest): Promise<Place> => {
    const response = await apiClient.put<Place>(`${API_PLACES_URL}/${id}`, data);

    return response.data;
  },

  /**
   * Delete a place
   */
  deletePlace: async (id: number | string): Promise<void> => {
    await apiClient.delete(`${API_PLACES_URL}/${id}`);
  },
};
