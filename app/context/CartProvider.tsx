"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

type CartItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string | number) => void;
  updateQuantity: (id: string | number, quantity: number) => void;
  clear: () => void;
  totalCount: number;
  totalPrice: number;
  mounted: boolean;
};

const CartContext = createContext<CartContextValue | undefined>(undefined);

export function useCart() {
  const ctx = useContext(CartContext);

  if (!ctx) {
    throw new Error("useCart must be used within CartProvider");
  }

  return ctx;
}

export function CartProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Always start with an empty cart on both server and client
  const [items, setItems] = useState<CartItem[]>([]);
  const [mounted, setMounted] = useState(false);

  // Load cart from localStorage AFTER hydration
  useEffect(() => {
    try {
      const raw = localStorage.getItem("cart:v1");

      if (raw) {
        setItems(JSON.parse(raw));
      }
    } catch (error) {
      console.error("Failed to load cart:", error);
    } finally {
      setMounted(true);
    }
  }, []);

  // Save cart only after it has been loaded
  useEffect(() => {
    if (!mounted) {
      return;
    }

    try {
      localStorage.setItem("cart:v1", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save cart:", error);
    }
  }, [items, mounted]);

  const addItem = (
    item: Omit<CartItem, "quantity">,
    qty = 1
  ) => {
    setItems((prev) => {
      const existing = prev.find(
        (p) => String(p.id) === String(item.id)
      );

      if (existing) {
        return prev.map((p) =>
          String(p.id) === String(item.id)
            ? {
                ...p,
                quantity: p.quantity + qty,
              }
            : p
        );
      }

      return [...prev, { ...item, quantity: qty }];
    });
  };

  const removeItem = (id: string | number) => {
    setItems((prev) =>
      prev.filter((p) => String(p.id) !== String(id))
    );
  };

  const updateQuantity = (
    id: string | number,
    quantity: number
  ) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prev) =>
      prev.map((p) =>
        String(p.id) === String(id)
          ? { ...p, quantity }
          : p
      )
    );
  };

  const clear = () => {
    setItems([]);
  };

  const totalCount = items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clear,
        totalCount,
        totalPrice,
        mounted,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}