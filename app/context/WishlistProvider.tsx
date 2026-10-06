"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

export type WishlistItem = {
  id: string | number;
  name: string;
  price: number;
  image?: string;
};

type WishlistContextValue = {
  items: WishlistItem[];
  isWishlisted: (id: string | number) => boolean;
  toggleWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (id: string | number) => void;
  clearWishlist: () => void;
  totalCount: number;
  mounted: boolean;
};

const WishlistContext =
  createContext<WishlistContextValue | undefined>(undefined);

export function useWishlist() {
  const ctx = useContext(WishlistContext);

  if (!ctx) {
    throw new Error("useWishlist must be used within WishlistProvider");
  }

  return ctx;
}

export function WishlistProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);

  const [items, setItems] = useState<WishlistItem[]>(() => {
    if (typeof window !== "undefined") {
      const raw = localStorage.getItem("wishlist:v1");

      try {
        return raw ? JSON.parse(raw) : [];
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      }
    }

    return [];
  });

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setMounted(true);
    }, 0);

    return () => window.clearTimeout(timeout);
  }, []);

  useEffect(() => {
    if (!mounted) {
      return;
    }

    try {
      localStorage.setItem("wishlist:v1", JSON.stringify(items));
    } catch (error) {
      console.error("Failed to save wishlist:", error);
    }
  }, [items, mounted]);

  const isWishlisted = (id: string | number) =>
    items.some((item) => String(item.id) === String(id));

  const toggleWishlist = (item: WishlistItem) => {
    setItems((prev) => {
      const exists = prev.some(
        (current) => String(current.id) === String(item.id)
      );

      if (exists) {
        return prev.filter(
          (current) => String(current.id) !== String(item.id)
        );
      }

      return [...prev, item];
    });
  };

  const removeFromWishlist = (id: string | number) => {
    setItems((prev) =>
      prev.filter((item) => String(item.id) !== String(id))
    );
  };

  const clearWishlist = () => {
    setItems([]);
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isWishlisted,
        toggleWishlist,
        removeFromWishlist,
        clearWishlist,
        totalCount: items.length,
        mounted,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
}
