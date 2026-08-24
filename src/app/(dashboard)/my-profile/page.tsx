import type { Metadata } from "next";
import ProfileForm from "@/components/my-profile/ProfileForm";

export const metadata: Metadata = {
  title: "My Profile | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/my-profile.html. Uses the same `(dashboard)` shell as dashboard.html/
// my-listings.html/add-listings-2.html/my-favorites.html/reviews.html/message.html.
export default function MyProfilePage() {
  return (
    <>
      <p className="h3 mb-40">My profile</p>
      <ProfileForm />
    </>
  );
}
