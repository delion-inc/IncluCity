import { apiClient } from "../api/client";
import { Review, CreateReviewRequest, UpdateReviewRequest } from "../types/review.types";

const API_REVIEWS_URL = "/reviews";

export const reviewsService = {
  /**
   * Get all reviews
   */
  getAllReviews: async (): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>(`${API_REVIEWS_URL}/all`);
    
    return response.data;
  },

  /**
   * Get reviews by place ID
   */
  getReviewsByPlaceId: async (placeId: number | string): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>(`${API_REVIEWS_URL}/place/${placeId}`);

    return response.data;
  },

  /**
   * Get reviews by user ID
   */
  getReviewsByUserId: async (userId: number | string): Promise<Review[]> => {
    const response = await apiClient.get<Review[]>(`${API_REVIEWS_URL}/user/${userId}`);

    return response.data;
  },

  /**
   * Get a review by ID
   */
  getReviewById: async (id: number | string): Promise<Review> => {
    const response = await apiClient.get<Review>(`${API_REVIEWS_URL}/${id}`);

    return response.data;
  },

  /**
   * Create a new review
   */
  createReview: async (data: CreateReviewRequest): Promise<Review> => {
    const response = await apiClient.post<Review>(API_REVIEWS_URL, data);

    return response.data;
  },

  /**
   * Update an existing review
   */
  updateReview: async (id: number | string, data: UpdateReviewRequest): Promise<Review> => {
    const response = await apiClient.put<Review>(`${API_REVIEWS_URL}/${id}`, data);

    return response.data;
  },

  /**
   * Delete a review
   */
  deleteReview: async (id: number | string): Promise<void> => {
    await apiClient.delete(`${API_REVIEWS_URL}/${id}`);
  },
}; 