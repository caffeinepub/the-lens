import { Product } from '../backend';

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface CartState {
  items: CartItem[];
}

const CART_STORAGE_KEY = 'the-lens-cart';

export function loadCartFromStorage(): CartState {
  try {
    const stored = localStorage.getItem(CART_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Failed to load cart from storage:', error);
  }
  return { items: [] };
}

export function saveCartToStorage(cart: CartState): void {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Failed to save cart to storage:', error);
  }
}

export function addToCart(cart: CartState, product: Product, quantity: number = 1): CartState {
  const existingItemIndex = cart.items.findIndex((item) => item.product.id === product.id);

  let newItems: CartItem[];
  if (existingItemIndex >= 0) {
    newItems = [...cart.items];
    newItems[existingItemIndex] = {
      ...newItems[existingItemIndex],
      quantity: newItems[existingItemIndex].quantity + quantity,
    };
  } else {
    newItems = [...cart.items, { product, quantity }];
  }

  const newCart = { items: newItems };
  saveCartToStorage(newCart);
  return newCart;
}

export function removeFromCart(cart: CartState, productId: string): CartState {
  const newCart = {
    items: cart.items.filter((item) => item.product.id !== productId),
  };
  saveCartToStorage(newCart);
  return newCart;
}

export function updateQuantity(cart: CartState, productId: string, quantity: number): CartState {
  if (quantity <= 0) {
    return removeFromCart(cart, productId);
  }

  const newCart = {
    items: cart.items.map((item) =>
      item.product.id === productId ? { ...item, quantity } : item
    ),
  };
  saveCartToStorage(newCart);
  return newCart;
}

export function clearCart(): CartState {
  const emptyCart = { items: [] };
  saveCartToStorage(emptyCart);
  return emptyCart;
}

export function getCartSubtotal(cart: CartState): number {
  return cart.items.reduce((total, item) => {
    return total + Number(item.product.price) * item.quantity;
  }, 0);
}

export function getCartItemCount(cart: CartState): number {
  return cart.items.reduce((total, item) => total + item.quantity, 0);
}
