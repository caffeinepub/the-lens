import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product } from '../backend';
import {
  CartState,
  loadCartFromStorage,
  addToCart as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateQuantity as updateQuantityUtil,
  clearCart as clearCartUtil,
  getCartSubtotal,
  getCartItemCount,
} from './cart';

interface CartContextValue {
  cart: CartState;
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  subtotal: number;
  itemCount: number;
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartState>({ items: [] });
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadedCart = loadCartFromStorage();
    setCart(loadedCart);
    setIsInitialized(true);
  }, []);

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart((prevCart) => addToCartUtil(prevCart, product, quantity));
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => removeFromCartUtil(prevCart, productId));
  };

  const updateQuantity = (productId: string, quantity: number) => {
    setCart((prevCart) => updateQuantityUtil(prevCart, productId, quantity));
  };

  const clearCart = () => {
    setCart(clearCartUtil());
  };

  const subtotal = getCartSubtotal(cart);
  const itemCount = getCartItemCount(cart);

  if (!isInitialized) {
    return null;
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        subtotal,
        itemCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within CartProvider');
  }
  return context;
}
