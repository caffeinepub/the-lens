import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Product } from '../backend';
import { queryKeys } from './queryKeys';

export function useAdminGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: queryKeys.admin.products,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminGetAllProducts();
    },
    enabled: !!actor && !actorFetching,
    retry: false,
  });
}

export function useAdminCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminCreateProduct(product);
    },
    onSuccess: () => {
      // Invalidate all product queries so storefront updates
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products });
    },
  });
}

export function useAdminUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (product: Product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminUpdateProduct(product);
    },
    onSuccess: () => {
      // Invalidate all product queries so storefront updates
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products });
    },
  });
}

export function useAdminSetProductPublishStatus() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ productId, published }: { productId: string; published: boolean }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.adminSetProductPublishStatus(productId, published);
    },
    onSuccess: () => {
      // Invalidate all product queries so storefront updates
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.products });
    },
  });
}
