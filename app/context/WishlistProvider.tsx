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

  // Ensure server rendering and the first browser render agree.
  const [items, setItems] = useState<WishlistItem[]>([]);

  // Restore the saved wishlist after hydration.
  useEffect(() => {
    const timeout = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem("wishlist:v1");

        if (raw) {
          const parsed = JSON.parse(raw);
          if (Array.isArray(parsed)) {
            setItems(parsed);
          }
        }
      } catch (error) {
        console.error("Failed to load wishlist:", error);
      } finally {
        setMounted(true);
      }
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
