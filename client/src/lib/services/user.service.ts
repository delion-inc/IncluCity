import { apiClient } from "../api/client";

export interface UserDTO {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  roles: number[];
}

export interface UpdateUserRequest {
  email: string;
  firstName: string;
  lastName: string;
  roles: number[];
}

export const userService = {
  /**
   * Get current user information
   */
  getCurrentUser: async (): Promise<UserDTO> => {
    try {
      const response = await apiClient.get<UserDTO>("/users/current");

      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      throw error;
    }
  },

  /**
   * Get a user by ID
   */
  getUserById: async (userId: number): Promise<UserDTO> => {
    try {
      const response = await apiClient.get<UserDTO>(`/users/${userId}`);

      return response.data;
    } catch (error) {
      console.error(`Error fetching user with ID ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Get all users
   */
  getAllUsers: async (): Promise<UserDTO[]> => {
    try {
      const response = await apiClient.get<UserDTO[]>("/users/all");

      return response.data;
    } catch (error) {
      console.error("Error fetching all users:", error);
      throw error;
    }
  },

  /**
   * Update a user by ID
   */
  updateUser: async (userId: number, userData: UpdateUserRequest): Promise<UserDTO> => {
    try {
      const response = await apiClient.put<UserDTO>(`/users/${userId}`, userData);

      return response.data;
    } catch (error) {
      console.error(`Error updating user with ID ${userId}:`, error);
      throw error;
    }
  },

  /**
   * Delete a user by ID
   */
  deleteUser: async (userId: number): Promise<void> => {
    try {
      await apiClient.delete(`/users/${userId}`);
    } catch (error) {
      console.error(`Error deleting user with ID ${userId}:`, error);
      throw error;
    }
  },
};
