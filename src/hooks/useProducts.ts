/**
 * Hook para gerenciar produtos com React Query
 */
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient } from "@/lib/api-client";
import type { Product } from "@/types";

interface ProductsResponse {
  products: Product[];
  categories: { id: string; name: string }[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface UseProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
}

export function useProducts(options: UseProductsOptions = {}) {
  const { page = 1, limit = 10, category } = options;

  return useQuery({
    queryKey: ["products", { page, limit, category }],
    queryFn: async () => {
      const params: Record<string, string | number> = { page, limit };
      if (category) params.category = category;

      return apiClient.get<ProductsResponse>("/produtos", { params });
    },
  });
}

export function useProduct(productId: string) {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async () => {
      return apiClient.get<Product>(`/produtos/${productId}`);
    },
    enabled: !!productId,
  });
}

export function useAdminProducts(page: number = 1, limit: number = 10) {
  return useQuery({
    queryKey: ["admin", "products", { page, limit }],
    queryFn: async () => {
      return apiClient.get<ProductsResponse>("/admin/produtos", {
        params: { page, limit },
      });
    },
  });
}

export function useCreateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: Partial<Product>) => {
      return apiClient.post<Product>("/admin/produtos", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<Product>;
    }) => {
      return apiClient.put<Product>(`/admin/produtos/${id}`, data);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}

export function useDeleteProduct() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (productId: string) => {
      return apiClient.delete(`/admin/produtos`, { params: { id: productId } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useUpdateProductStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      status,
    }: {
      id: string;
      status: string;
    }) => {
      return apiClient.patch(`/admin/produtos/${id}/status`, { status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["admin", "products"] });
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["product", variables.id] });
    },
  });
}
