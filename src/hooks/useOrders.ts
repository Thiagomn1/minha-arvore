/**
 * Hook para gerenciar pedidos com React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Order } from "@/types";

interface OrdersResponse {
  orders: Order[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export function useUserOrders(userId: string, page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["orders", "user", userId, { page, limit }],
    queryFn: async () => {
      const response = await apiClient.get<Order[] | OrdersResponse>(`/pedidos/${userId}`, {
        params: { page, limit },
      });

      // Suporta tanto array direto quanto formato paginado
      if (Array.isArray(response)) {
        return { orders: response, pagination: { page: 1, limit: response.length, total: response.length, totalPages: 1 } };
      }
      return response;
    },
    enabled: !!userId,
  });
}

export function useOrderPhoto(orderId: string) {
  return useQuery({
    queryKey: ["order", "photo", orderId],
    queryFn: async () => {
      return apiClient.get<{ photoUrl: string }>(`/pedidos/${orderId}/foto`);
    },
    enabled: !!orderId,
    retry: false, // Não retentar se foto não existir
  });
}

export function useOrder(orderId: string) {
  return useQuery({
    queryKey: ["order", orderId],
    queryFn: async () => {
      return apiClient.get<Order>(`/pedidos/${orderId}`);
    },
    enabled: !!orderId,
  });
}

export function useCreateOrder() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: {
      userId: string;
      products: any[];
      location?: { latitude: number; longitude: number };
    }) => {
      return apiClient.post<Order>("/checkout", data);
    },
    onSuccess: (_, variables) => {
      // Invalidar cache de pedidos do usuário
      queryClient.invalidateQueries({
        queryKey: ["orders", "user", variables.userId],
      });
    },
  });
}

// Hooks Admin
export function useAdminOrders(options: {
  page?: number;
  limit?: number;
  status?: string;
} = {}) {
  const { page = 1, limit = 10, status } = options;

  return useQuery({
    queryKey: ["admin", "orders", { page, limit, status }],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit };
      if (status) params.status = status;

      return apiClient.get<OrdersResponse>("/admin/pedidos", { params });
    },
  });
}

export function useUpdateOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiClient.patch<Order>(`/admin/pedidos/${id}`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
}

export function useUploadOrderImage() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, imageUrl }: { id: string; imageUrl: string }) => {
      return apiClient.post(`/admin/pedidos/${id}/upload-image`, { imageUrl });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
}
