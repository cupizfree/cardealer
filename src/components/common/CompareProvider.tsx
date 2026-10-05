"use client";

// Source's own compare feature (`.compare-details` buttons on card-box, the header's compare badge,
// the bottom `#CompareModal` tray, and `/compare.html` itself) is ENTIRELY decorative in Aurexo:
// traced `app.js`'s `compareModal()` in full and confirmed it only handles removing items from a
// hardcoded static list and toggling the empty state — nothing anywhere adds a real clicked listing to
// compare, and the header's `data-badge="2"` is a literal hardcoded string. This Context is a genuine
// new feature built for aurexo-nextjs (not a migration of existing behavior) so that clicking "Bandingkan"
// on a real `ListingCard`/`HalfMapListingCard` actually adds that listing here, and every consumer
// (header badge, the tray, `/compare`) reads from the same shared state — same "small shared Context
// for a cross-tree UI need" precedent as `ModalProvider`.
import { createContext, useCallback, useContext, useState } from "react";
import type { ListingCardData } from "@/data/listings";

type CompareContextValue = {
  compareItems: ListingCardData[];
  addToCompare: (listing: ListingCardData) => void;
  removeFromCompare: (id: number) => void;
  isComparing: (id: number) => boolean;
};

const CompareContext = createContext<CompareContextValue | null>(null);

export function CompareProvider({ children }: { children: React.ReactNode }) {
  const [compareItems, setCompareItems] = useState<ListingCardData[]>([]);

  const addToCompare = useCallback((listing: ListingCardData) => {
    setCompareItems((current) =>
      current.some((item) => item.id === listing.id) ? current : [...current, listing]
    );
  }, []);

  const removeFromCompare = useCallback((id: number) => {
    setCompareItems((current) => current.filter((item) => item.id !== id));
  }, []);

  const isComparing = useCallback(
    (id: number) => compareItems.some((item) => item.id === id),
    [compareItems]
  );

  return (
    <CompareContext.Provider value={{ compareItems, addToCompare, removeFromCompare, isComparing }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
