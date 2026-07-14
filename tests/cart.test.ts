import { describe, it, expect, beforeEach, vi } from "vitest";

// Mock localStorage before importing the store
const localStorageMock = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: vi.fn((key: string) => store[key] || null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] || null),
  };
})();

Object.defineProperty(globalThis, "localStorage", {
  value: localStorageMock,
});

// Now import the store after mocking
const { useCartStore } = await import("@/lib/store/cart");
const { addItem, removeItem, updateQuantity, clearCart, getTotals, getItemQuantity } =
  useCartStore.getState();

describe("Cart Store", () => {
  beforeEach(() => {
    // Reset store before each test
    useCartStore.getState().clearCart();
    localStorageMock.clear();
    vi.clearAllMocks();
  });

  const mockItem = {
    productId: "product-1",
    name: "Test Product",
    slug: "test-product",
    price: 29.99,
    image: "https://example.com/image.jpg",
    stock: 10,
  };

  describe("addItem", () => {
    it("adds a new item to the cart", () => {
      useCartStore.getState().addItem(mockItem);

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems).toHaveLength(1);
      expect(updatedItems[0].productId).toBe("product-1");
      expect(updatedItems[0].quantity).toBe(1);
    });

    it("increments quantity when adding existing item", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem(mockItem);

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems).toHaveLength(1);
      expect(updatedItems[0].quantity).toBe(2);
    });

    it("respects stock limit when adding items", () => {
      useCartStore.getState().addItem(mockItem, 5);
      useCartStore.getState().addItem(mockItem, 10); // Should only add 5 more (stock is 10)

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems[0].quantity).toBe(10);
    });

    it("adds items with different variants separately", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem({ ...mockItem, variant: "Large" });

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems).toHaveLength(2);
    });
  });

  describe("removeItem", () => {
    it("removes an item from the cart", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().removeItem("product-1");

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems).toHaveLength(0);
    });

    it("removes only the correct variant", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem({ ...mockItem, variant: "Large" });
      useCartStore.getState().removeItem("product-1", "Large");

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems).toHaveLength(1);
      expect(updatedItems[0].variant).toBeUndefined();
    });
  });

  describe("updateQuantity", () => {
    it("updates item quantity", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().updateQuantity("product-1", 5);

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems[0].quantity).toBe(5);
    });

    it("removes item when quantity is 0", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().updateQuantity("product-1", 0);

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems).toHaveLength(0);
    });

    it("respects stock limit when updating", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().updateQuantity("product-1", 100); // Stock is only 10

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems[0].quantity).toBe(10);
    });
  });

  describe("clearCart", () => {
    it("clears all items from the cart", () => {
      useCartStore.getState().addItem(mockItem);
      useCartStore.getState().addItem({ ...mockItem, productId: "product-2" });
      useCartStore.getState().clearCart();

      const updatedItems = useCartStore.getState().items;
      expect(updatedItems).toHaveLength(0);
    });
  });

  describe("getTotals", () => {
    it("calculates correct totals", () => {
      useCartStore.getState().addItem(mockItem); // $29.99
      useCartStore.getState().addItem({ ...mockItem, productId: "product-2", price: 19.99 }); // $19.99

      const { subtotal, itemCount } = useCartStore.getState().getTotals();
      expect(subtotal).toBeCloseTo(49.98);
      expect(itemCount).toBe(2);
    });

    it("returns zero for empty cart", () => {
      const { subtotal, itemCount } = useCartStore.getState().getTotals();
      expect(subtotal).toBe(0);
      expect(itemCount).toBe(0);
    });
  });

  describe("getItemQuantity", () => {
    it("returns quantity of item in cart", () => {
      useCartStore.getState().addItem(mockItem, 3);

      const quantity = useCartStore.getState().getItemQuantity("product-1");
      expect(quantity).toBe(3);
    });

    it("returns 0 for item not in cart", () => {
      const quantity = useCartStore.getState().getItemQuantity("non-existent");
      expect(quantity).toBe(0);
    });
  });

  describe("persistence", () => {
    it("persists cart to localStorage", () => {
      useCartStore.getState().addItem(mockItem);

      // Check that localStorage was called
      expect(localStorageMock.setItem).toHaveBeenCalled();
    });
  });
});
