"use client";

// Source's own heart/wishlist icon (`.heart` on every card-box, `app.js`'s `heartList()`) is real but
// shallow: traced in full and confirmed it only ever does `$(this).toggleClass('active')` — a pure
// visual toggle with no data behind it, and `/my-favorites.html` itself is a static demo grid completely
// disconnected from any card's heart state anywhere else in the site. Per the explicit request ("lấy
// data từ việc product heart active" — have My Favorites' data actually come from clicking a card's heart
// active), this Context is a genuine new feature for aurexo-nextjs: clicking the heart on a real
// `ListingCard`/`HalfMapListingCard` now really adds/removes that listing here, and every consumer
// (header badge, `/my-favorites`) reads from the same shared state — same "small shared Context for a
// cross-tree UI need" precedent as `CompareProvider`/`ModalProvider`.
import { createContext, useCallback, useContext, useState } from "react";
import type { ListingCardData } from "@/data/listings";

type WishlistContextValue = {
  wishlistItems: ListingCardData[];
  addToWishlist: (listing: ListingCardData) => void;
  removeFromWishlist: (id: number) => void;
  toggleWishlist: (listing: ListingCardData) => void;
  isWishlisted: (id: number) => boolean;
};

const WishlistContext = createContext<WishlistContextValue | null>(null);

export function WishlistProvider({ children }: { children: React.ReactNode }) {
  const [wishlistItems, setWishlistItems] = useState<ListingCardData[]>([]);

  const addToWishlist = useCallback((listing: ListingCardData) => {
    setWishlistItems((current) => (current.some((item) => item.id === listing.id) ? current : [...current, listing]));
  }, []);

  const removeFromWishlist = useCallback((id: number) => {
    setWishlistItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const toggleWishlist = useCallback((listing: ListingCardData) => {
    setWishlistItems((current) =>
      current.some((item) => item.id === listing.id)
        ? current.filter((item) => item.id !== listing.id)
        : [...current, listing]
    );
  }, []);

  const isWishlisted = useCallback((id: number) => wishlistItems.some((item) => item.id === id), [wishlistItems]);

  return (
    <WishlistContext.Provider value={{ wishlistItems, addToWishlist, removeFromWishlist, toggleWishlist, isWishlisted }}>
      {children}
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error("useWishlist must be used within a WishlistProvider");
  return ctx;
}
