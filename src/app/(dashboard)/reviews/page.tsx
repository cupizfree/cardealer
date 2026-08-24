import type { Metadata } from "next";
import ReviewsSection from "@/components/reviews/ReviewsSection";

export const metadata: Metadata = {
  title: "Reviews | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/reviews.html. Uses the same `(dashboard)` shell as dashboard.html/
// my-listings.html/add-listings-2.html/my-favorites.html.
export default function ReviewsPage() {
  return (
    <>
      <p className="h3 mb-40">Reviews</p>
      <ReviewsSection />
    </>
  );
}
