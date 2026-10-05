import type { Metadata } from "next";
import MyFavoritesGrid from "@/components/my-favorites/MyFavoritesGrid";

export const metadata: Metadata = {
  title: "Favorit Saya",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/my-favorites.html. Uses the same `(dashboard)` shell as dashboard.html/
// my-listings.html/add-listings-2.html. See `MyFavoritesGrid.tsx` for the real wishlist-data feature
// this page now runs on, per explicit request.
export default function MyFavoritesPage() {
  return (
    <>
      <p className="h3 mb-40">Favorit Saya</p>
      <MyFavoritesGrid />
    </>
  );
}
