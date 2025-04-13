import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { PlaceDTO } from "../types/admin.types";
import { placesService } from "../services/places.service";
import { adminService, UpdatePlaceRequest } from "../services/admin.service";
import { Place } from "../types/place.types";

const convertToPlaceDTO = (place: Place): PlaceDTO => {
  return {
    id: place.id,
    name: place.name,
    address: place.address,
    lat: place.lat,
    lon: place.lon,
    wheelchairAccessible: place.wheelchairAccessible,
    tactileElements: place.tactileElements,
    brailleSignage: place.brailleSignage,
    accessibleToilets: place.accessibleToilets,
    category: place.category,
    overallAccessibilityScore: place.overallAccessibilityScore,
    createdAt: place.createdAt,
    updatedAt: place.updatedAt,
    createdBy: typeof place.createdBy === "object" ? place.createdBy.id : place.createdBy,
    approved: true, // Assume all places from getAllPlaces are approved
    averageRating: null,
    countOfReviews: 0,
  };
};

export const useAllPlaces = (initialPage: number = 0, pageSize: number = 10) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(pageSize);
  const [placeFilter, setPlaceFilter] = useState<"all" | "unapproved">("all");
  const queryClient = useQueryClient();

  const allPlacesQuery = useQuery({
    queryKey: ["allPlaces", page, size],
    queryFn: async () => {
      const places = await placesService.getAllPlaces();

      return places.map(convertToPlaceDTO);
    },
  });

  const unapprovedPlacesQuery = useQuery({
    queryKey: ["unapprovedPlaces", page, size],
    queryFn: () => adminService.getUnapprovedPlaces(page, size),
  });

  const data =
    placeFilter === "all"
      ? {
          places: allPlacesQuery.data || [],
          totalPages: Math.ceil((allPlacesQuery.data?.length || 0) / size),
          isLoading: allPlacesQuery.isLoading,
          isError: allPlacesQuery.isError,
          error: allPlacesQuery.error,
        }
      : {
          places: unapprovedPlacesQuery.data?.content || [],
          totalPages: unapprovedPlacesQuery.data?.totalPages || 0,
          isLoading: unapprovedPlacesQuery.isLoading,
          isError: unapprovedPlacesQuery.isError,
          error: unapprovedPlacesQuery.error,
        };

  const approveMutation = useMutation({
    mutationFn: (placeId: number) => adminService.approvePlace(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unapprovedPlaces"] });
      queryClient.invalidateQueries({ queryKey: ["allPlaces"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (placeId: number) => adminService.deletePlace(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unapprovedPlaces"] });
      queryClient.invalidateQueries({ queryKey: ["allPlaces"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ placeId, placeData }: { placeId: number; placeData: UpdatePlaceRequest }) =>
      adminService.editPlace(placeId, placeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unapprovedPlaces"] });
      queryClient.invalidateQueries({ queryKey: ["allPlaces"] });
    },
  });

  const approvePlace = useCallback(
    async (placeId: number) => {
      try {
        await approveMutation.mutateAsync(placeId);

        return true;
      } catch (error) {
        console.error("Error approving place:", error);

        return false;
      }
    },
    [approveMutation],
  );

  const deletePlace = useCallback(
    async (placeId: number) => {
      try {
        await deleteMutation.mutateAsync(placeId);

        return true;
      } catch (error) {
        console.error("Error deleting place:", error);

        return false;
      }
    },
    [deleteMutation],
  );

  const editPlace = useCallback(
    async (placeId: number, placeData: UpdatePlaceRequest) => {
      try {
        await editMutation.mutateAsync({ placeId, placeData });

        return true;
      } catch (error) {
        console.error("Error editing place:", error);

        return false;
      }
    },
    [editMutation],
  );

  const handlePageChange = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  const handlePageSizeChange = useCallback((newSize: number) => {
    setSize(newSize);
    setPage(0);
  }, []);

  return {
    places: data.places,
    totalPages: data.totalPages,
    isLoading: data.isLoading,
    isError: data.isError,
    error: data.error,
    placeFilter,
    setPlaceFilter,
    approvePlace,
    approvingPlace: approveMutation.isPending,
    deletePlace,
    deletingPlace: deleteMutation.isPending,
    editPlace,
    editingPlace: editMutation.isPending,
    handlePageChange,
    handlePageSizeChange,
    page,
    size,
    refetch: placeFilter === "all" ? allPlacesQuery.refetch : unapprovedPlacesQuery.refetch,
  };
};
