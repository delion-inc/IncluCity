import {
  useMutation,
  useQuery,
  useQueryClient,
  UseMutationOptions,
  UseQueryOptions,
} from "@tanstack/react-query";

import { placesService } from "../services/places.service";
import {
  Place,
  GetPlacesParams,
  CreatePlaceRequest,
  UpdatePlaceRequest,
} from "../types/place.types";

export const PLACES_QUERY_KEYS = {
  all: ["places"] as const,
  list: (params?: GetPlacesParams) => [...PLACES_QUERY_KEYS.all, "list", params] as const,
  detail: (id: number | string) => [...PLACES_QUERY_KEYS.all, "detail", id] as const,
};

/**
 * Hook for fetching all places
 */
export function usePlaces(
  params?: GetPlacesParams,
  options?: UseQueryOptions<Place[], Error, Place[], ReturnType<typeof PLACES_QUERY_KEYS.list>>,
) {
  return useQuery({
    queryKey: PLACES_QUERY_KEYS.list(params),
    queryFn: () => placesService.getAllPlaces(params),
    ...options,
  });
}

/**
 * Hook for fetching a single place by ID
 */
export function usePlaceById(
  id: number | string,
  options?: UseQueryOptions<Place, Error, Place, ReturnType<typeof PLACES_QUERY_KEYS.detail>>,
) {
  return useQuery({
    queryKey: PLACES_QUERY_KEYS.detail(id),
    queryFn: () => placesService.getPlaceById(id),
    ...options,
  });
}

/**
 * Hook for creating a new place
 */
export function useCreatePlace(
  options?: UseMutationOptions<Place, Error, CreatePlaceRequest>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreatePlaceRequest) => placesService.createPlace(data),
    onSuccess: () => {
      // Invalidate the list query to refetch places after a new one is created
      queryClient.invalidateQueries({ queryKey: PLACES_QUERY_KEYS.list() });
    },
    ...options,
  });
}

/**
 * Hook for updating an existing place
 */
export function useUpdatePlace(
  options?: UseMutationOptions<Place, Error, { id: number | string; data: UpdatePlaceRequest }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: number | string; data: UpdatePlaceRequest }) =>
      placesService.updatePlace(id, data),
    onSuccess: (updatedPlace) => {
      // Update the cache for this specific place
      queryClient.setQueryData(PLACES_QUERY_KEYS.detail(updatedPlace.id), updatedPlace);
      // Invalidate the list query since the order or filtering might change
      queryClient.invalidateQueries({ queryKey: PLACES_QUERY_KEYS.list() });
    },
    ...options,
  });
}

/**
 * Hook for deleting a place
 */
export function useDeletePlace(
  options?: UseMutationOptions<void, Error, number | string>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number | string) => placesService.deletePlace(id),
    onSuccess: (_, id) => {
      // Remove the place from the cache
      queryClient.removeQueries({ queryKey: PLACES_QUERY_KEYS.detail(id) });
      // Invalidate the list query to refetch places after deletion
      queryClient.invalidateQueries({ queryKey: PLACES_QUERY_KEYS.list() });
    },
    ...options,
  });
} 