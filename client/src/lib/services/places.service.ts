import { apiClient } from "../api/client";
import {
  Place,
  GetPlacesParams,
  CreatePlaceRequest,
  UpdatePlaceRequest,
} from "../types/place.types";

const API_PLACES_URL = "/places";

export const placesService = {
  /**
   * Get all places with optional filtering
   */
  getAllPlaces: async (params?: GetPlacesParams): Promise<Place[]> => {
    const response = await apiClient.get<Place[]>(`${API_PLACES_URL}/all`, { params });

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