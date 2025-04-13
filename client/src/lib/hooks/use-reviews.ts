import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { reviewsService } from "../services/reviews.service";
import { Review, CreateReviewRequest, UpdateReviewRequest } from "../types/review.types";

export const REVIEWS_QUERY_KEYS = {
  all: ["reviews"] as const,
  list: () => [...REVIEWS_QUERY_KEYS.all, "list"] as const,
  byPlace: (placeId: number | string) => [...REVIEWS_QUERY_KEYS.all, "byPlace", placeId] as const,
  byUser: (userId: number | string) => [...REVIEWS_QUERY_KEYS.all, "byUser", userId] as const,
  detail: (id: number | string) => [...REVIEWS_QUERY_KEYS.all, "detail", id] as const,
};

/**
 * Hook for fetching all reviews
 */
export function useReviews(
  options?: UseQueryOptions<Review[], Error, Review[], ReturnType<typeof REVIEWS_QUERY_KEYS.list>>,
) {
  return useQuery({
    queryKey: REVIEWS_QUERY_KEYS.list(),
    queryFn: () => reviewsService.getAllReviews(),
    ...options,
  });
}

/**
 * Hook for fetching reviews for a specific place
 */
export function useReviewsByPlace(
  placeId: number | string,
  options?: UseQueryOptions<
    Review[],
    Error,
    Review[],
    ReturnType<typeof REVIEWS_QUERY_KEYS.byPlace>
  >,
) {
  return useQuery({
    queryKey: REVIEWS_QUERY_KEYS.byPlace(placeId),
    queryFn: () => reviewsService.getReviewsByPlaceId(placeId),
    ...options,
  });
}

/**
 * Hook for fetching reviews by a specific user
 */
export function useReviewsByUser(
  userId: number | string,
  options?: UseQueryOptions<
    Review[],
    Error,
    Review[],
    ReturnType<typeof REVIEWS_QUERY_KEYS.byUser>
  >,
) {
  return useQuery({
    queryKey: REVIEWS_QUERY_KEYS.byUser(userId),
    queryFn: () => reviewsService.getReviewsByUserId(userId),
    ...options,
  });
}

/**
 * Hook for fetching a single review by ID
 */
export function useReviewById(
  id: number | string,
  options?: UseQueryOptions<Review, Error, Review, ReturnType<typeof REVIEWS_QUERY_KEYS.detail>>,
) {
  return useQuery({
    queryKey: REVIEWS_QUERY_KEYS.detail(id),
    queryFn: () => reviewsService.getReviewById(id),
    ...options,
  });
}

/**
 * Hook for creating a new review
 */
export function useCreateReview(options?: UseMutationOptions<Review, Error, CreateReviewRequest>) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateReviewRequest) => reviewsService.createReview(data),
    onSuccess: (newReview) => {
      // Invalidate relevant queries
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: REVIEWS_QUERY_KEYS.byPlace(newReview.place.id),
      });
      queryClient.invalidateQueries({
        queryKey: REVIEWS_QUERY_KEYS.byUser(newReview.user.id),
      });
    },
    ...options,
  });
}

/**
 * Hook for updating an existing review
 */
export function useUpdateReview(
  options?: UseMutationOptions<Review, Error, { id: number | string; data: UpdateReviewRequest }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdateReviewRequest }) =>
      reviewsService.updateReview(id, data),
    onSuccess: (updatedReview) => {
      // Update the cache for this specific review
      queryClient.setQueryData(REVIEWS_QUERY_KEYS.detail(updatedReview.id), updatedReview);
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.list() });
      queryClient.invalidateQueries({
        queryKey: REVIEWS_QUERY_KEYS.byPlace(updatedReview.place.id),
      });
      queryClient.invalidateQueries({
        queryKey: REVIEWS_QUERY_KEYS.byUser(updatedReview.user.id),
      });
    },
    ...options,
  });
}

/**
 * Hook for deleting a review
 */
export function useDeleteReview(
  options?: UseMutationOptions<
    void,
    Error,
    { id: number | string; placeId: number | string; userId: number | string }
  >,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
    }: {
      id: number | string;
      placeId: number | string;
      userId: number | string;
    }) => reviewsService.deleteReview(id),
    onSuccess: (_, { id, placeId, userId }) => {
      // Remove the review from the cache
      queryClient.removeQueries({ queryKey: REVIEWS_QUERY_KEYS.detail(id) });
      // Invalidate related queries
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.list() });
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.byPlace(placeId) });
      queryClient.invalidateQueries({ queryKey: REVIEWS_QUERY_KEYS.byUser(userId) });
    },
    ...options,
  });
}
