/**
 * Hook para gerenciar usuários com React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { User } from "@/types";

interface UsersResponse {
  users: User[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Hooks Admin
export function useAdminUsers(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["admin", "users", { page, limit }],
    queryFn: async () => {
      return apiClient.get<UsersResponse>("/admin/usuarios", {
        params: { page, limit },
      });
    },
  });
}

export function usePromoteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (userId: string) => {
      return apiClient.post(`/admin/usuarios/${userId}/promote`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      type: "dados" | "endereco" | "senha";
      payload: any;
    }) => {
      return apiClient.put("/usuario", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
}
