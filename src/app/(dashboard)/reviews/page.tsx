import type { Metadata } from "next";
import ReviewsSection from "@/components/reviews/ReviewsSection";

export const metadata: Metadata = {
  title: "Ulasan Saya",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/reviews.html. Uses the same `(dashboard)` shell as dashboard.html/
// my-listings.html/add-listings-2.html/my-favorites.html.
export default function ReviewsPage() {
  return (
    <>
      <p className="h3 mb-40">Ulasan</p>
      <ReviewsSection />
    </>
  );
}
