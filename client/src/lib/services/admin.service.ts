import { apiClient } from "../api/client";
import { PlaceDTO, AdminUnapprovedPlacesResponse } from "../types/admin.types";

export interface UpdatePlaceRequest {
  name: string;
  address: string;
  wheelchairAccessible: boolean;
  tactileElements: boolean;
  brailleSignage: boolean;
  accessibleToilets: boolean;
  category: string;
}

export const adminService = {
  /**
   * Get all unapproved places with pagination
   */
  getUnapprovedPlaces: async (
    page: number = 0,
    size: number = 10,
  ): Promise<AdminUnapprovedPlacesResponse> => {
    try {
      const response = await apiClient.get<AdminUnapprovedPlacesResponse>(
        `/admin/places/unapproved?page=${page}&size=${size}`,
      );

      return response.data;
    } catch (error) {
      console.error("Error fetching unapproved places:", error);
      throw error;
    }
  },

  /**
   * Approve a place by ID
   */
  approvePlace: async (placeId: number): Promise<PlaceDTO> => {
    try {
      const response = await apiClient.post<PlaceDTO>(`/admin/places/${placeId}/approve`);

      return response.data;
    } catch (error) {
      console.error(`Error approving place with ID ${placeId}:`, error);
      throw error;
    }
  },

  /**
   * Edit a place
   */
  editPlace: async (placeId: number, placeData: UpdatePlaceRequest): Promise<PlaceDTO> => {
    try {
      const response = await apiClient.put<PlaceDTO>(`/places/${placeId}`, placeData);

      return response.data;
    } catch (error) {
      console.error(`Error updating place with ID ${placeId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a place by ID
   */
  deletePlace: async (placeId: number): Promise<void> => {
    try {
      await apiClient.delete(`/places/${placeId}`);
    } catch (error) {
      console.error(`Error deleting place with ID ${placeId}:`, error);
      throw error;
    }
  },
};
