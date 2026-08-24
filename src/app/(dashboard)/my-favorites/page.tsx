import type { Metadata } from "next";
import MyFavoritesGrid from "@/components/my-favorites/MyFavoritesGrid";

export const metadata: Metadata = {
  title: "My Favorites | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/my-favorites.html. Uses the same `(dashboard)` shell as dashboard.html/
// my-listings.html/add-listings-2.html. See `MyFavoritesGrid.tsx` for the real wishlist-data feature
// this page now runs on, per explicit request.
export default function MyFavoritesPage() {
  return (
    <>
      <p className="h3 mb-40">My Favorites</p>
      <MyFavoritesGrid />
    </>
  );
}
