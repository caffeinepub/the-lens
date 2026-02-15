import { Category } from '../backend';

export const queryKeys = {
  products: {
    all: ['products'] as const,
    byCategory: (category: Category) => ['products', 'category', category] as const,
    detail: (id: string) => ['products', 'detail', id] as const,
  },
  orders: {
    all: ['orders'] as const,
    detail: (id: string) => ['orders', 'detail', id] as const,
  },
  admin: {
    products: ['admin', 'products'] as const,
    isAdmin: ['admin', 'isAdmin'] as const,
  },
};
