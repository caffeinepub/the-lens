import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '../hooks/useActor';
import { Product, Category, OrderItem } from '../backend';
import { queryKeys } from './queryKeys';
import { sanitizeStorefrontError } from '../utils/storefrontErrorSanitizer';

export function useGetAllProducts() {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[], Error>({
    queryKey: queryKeys.products.all,
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getAllProducts();
      } catch (error) {
        throw sanitizeStorefrontError(error as Error);
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProductsByCategory(category: Category) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product[], Error>({
    queryKey: queryKeys.products.byCategory(category),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      try {
        return await actor.getProductsByCategory(category);
      } catch (error) {
        throw sanitizeStorefrontError(error as Error);
      }
    },
    enabled: !!actor && !actorFetching,
  });
}

export function useGetProduct(productId: string) {
  const { actor, isFetching: actorFetching } = useActor();

  return useQuery<Product>({
    queryKey: queryKeys.products.detail(productId),
    queryFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.getProduct(productId);
    },
    enabled: !!actor && !actorFetching && !!productId,
    retry: false,
  });
}

export function useCreateOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (items: OrderItem[]) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createOrder(items);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useInitializeShop() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      if (!actor) throw new Error('Actor not available');
      return actor.initializeShop();
    },
    onSuccess: () => {
      // Invalidate all product queries so the UI refreshes with new products
      queryClient.invalidateQueries({ queryKey: queryKeys.products.all });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
