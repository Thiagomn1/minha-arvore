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

export function useUserOrders(
  userId: string,
  page: number = 1,
  limit: number = 10
) {
  return useQuery({
    queryKey: ["orders", "user", userId, { page, limit }],
    queryFn: async () => {
      const response = await apiClient.get<Order[] | OrdersResponse>(
        `/pedidos/${userId}`,
        {
          params: { page, limit },
        }
      );

      if (Array.isArray(response)) {
        return {
          orders: response,
          pagination: {
            page: 1,
            limit: response.length,
            total: response.length,
            totalPages: 1,
          },
        };
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
    retry: false,
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
      queryClient.invalidateQueries({
        queryKey: ["orders", "user", variables.userId],
      });
    },
  });
}

export function useAdminOrders(
  options: {
    page?: number;
    limit?: number;
    status?: string;
  } = {}
) {
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
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: FormData;
    }) => {
      const response = await fetch(`/api/admin/pedidos/${id}/upload-image`, {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Erro ao enviar imagem");
      }

      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["order", variables.id] });
    },
  });
}
