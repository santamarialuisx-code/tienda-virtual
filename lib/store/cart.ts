import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface CartItem {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image?: string;
  quantity: number;
  variant?: string;
  stock: number;
}

export interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (productId: string, variant?: string) => void;
  updateQuantity: (productId: string, quantity: number, variant?: string) => void;
  clearCart: () => void;
  getTotals: () => {
    subtotal: number;
    itemCount: number;
  };
  getItemQuantity: (productId: string, variant?: string) => number;
}

function findItemIndex(
  items: CartItem[],
  productId: string,
  variant?: string
): number {
  return items.findIndex(
    (item) =>
      item.productId === productId &&
      (variant ? item.variant === variant : !item.variant)
  );
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addItem: (item, quantity = 1) => {
        set((state) => {
          const existingIndex = findItemIndex(
            state.items,
            item.productId,
            item.variant
          );

          if (existingIndex >= 0) {
            // Update existing item quantity
            const updatedItems = [...state.items];
            const existingItem = updatedItems[existingIndex];
            const newQuantity = Math.min(
              existingItem.quantity + quantity,
              item.stock
            );
            updatedItems[existingIndex] = {
              ...existingItem,
              quantity: newQuantity,
            };
            return { items: updatedItems };
          }

          // Add new item
          return {
            items: [
              ...state.items,
              { ...item, quantity: Math.min(quantity, item.stock) },
            ],
          };
        });
      },

      removeItem: (productId, variant) => {
        set((state) => ({
          items: state.items.filter(
            (item) =>
              !(
                item.productId === productId &&
                (variant ? item.variant === variant : !item.variant)
              )
          ),
        }));
      },

      updateQuantity: (productId, quantity, variant) => {
        set((state) => {
          const index = findItemIndex(state.items, productId, variant);
          if (index < 0) return state;

          if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            return {
              items: state.items.filter((_, i) => i !== index),
            };
          }

          const updatedItems = [...state.items];
          const item = updatedItems[index];
          updatedItems[index] = {
            ...item,
            quantity: Math.min(quantity, item.stock),
          };
          return { items: updatedItems };
        });
      },

      clearCart: () => {
        set({ items: [] });
      },

      getTotals: () => {
        const { items } = get();
        return {
          subtotal: items.reduce(
            (sum, item) => sum + item.price * item.quantity,
            0
          ),
          itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
        };
      },

      getItemQuantity: (productId, variant) => {
        const { items } = get();
        const index = findItemIndex(items, productId, variant);
        return index >= 0 ? items[index].quantity : 0;
      },
    }),
    {
      name: "tienda-virtual-cart",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ items: state.items }),
    }
  )
);
