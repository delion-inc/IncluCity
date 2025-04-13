import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { adminService, UpdatePlaceRequest } from "../services/admin.service";
import { AdminUnapprovedPlacesResponse } from "../types/admin.types";

export const useUnapprovedPlaces = (initialPage: number = 0, pageSize: number = 10) => {
  const [page, setPage] = useState(initialPage);
  const [size, setSize] = useState(pageSize);
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error, refetch } = useQuery<AdminUnapprovedPlacesResponse>({
    queryKey: ["unapprovedPlaces", page, size],
    queryFn: () => adminService.getUnapprovedPlaces(page, size),
  });

  const approveMutation = useMutation({
    mutationFn: (placeId: number) => adminService.approvePlace(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unapprovedPlaces"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (placeId: number) => adminService.deletePlace(placeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unapprovedPlaces"] });
    },
  });

  const editMutation = useMutation({
    mutationFn: ({ placeId, placeData }: { placeId: number; placeData: UpdatePlaceRequest }) =>
      adminService.editPlace(placeId, placeData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["unapprovedPlaces"] });
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
    unapprovedPlaces: data?.content || [],
    totalPlaces: data?.total || 0,
    totalPages: data?.totalPages || 0,
    currentPage: data?.pageNumber || 0,
    isLoading,
    isError,
    error,
    refetch,
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
  };
};
