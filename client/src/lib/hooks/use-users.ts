import { useState, useCallback } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import { userService, UserDTO, UpdateUserRequest } from "../services/user.service";

export const useUsers = () => {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const {
    data: users = [],
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery<UserDTO[]>({
    queryKey: ["users"],
    queryFn: () => userService.getAllUsers(),
  });

  const updateMutation = useMutation({
    mutationFn: ({ userId, userData }: { userId: number; userData: UpdateUserRequest }) =>
      userService.updateUser(userId, userData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (userId: number) => userService.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const updateUser = useCallback(
    async (userId: number, userData: UpdateUserRequest) => {
      try {
        await updateMutation.mutateAsync({ userId, userData });

        return true;
      } catch (error) {
        console.error("Error updating user:", error);

        return false;
      }
    },
    [updateMutation],
  );

  const deleteUser = useCallback(
    async (userId: number) => {
      try {
        await deleteMutation.mutateAsync(userId);

        return true;
      } catch (error) {
        console.error("Error deleting user:", error);

        return false;
      }
    },
    [deleteMutation],
  );

  const filteredUsers = selectedRole
    ? users.filter((user) => user.roles.includes(selectedRole))
    : users;

  return {
    users: filteredUsers,
    allUsers: users,
    isLoading,
    isError,
    error,
    refetch,
    updateUser,
    isUpdating: updateMutation.isPending,
    deleteUser,
    isDeleting: deleteMutation.isPending,
    selectedRole,
    setSelectedRole,
  };
};
