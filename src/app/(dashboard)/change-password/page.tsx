import type { Metadata } from "next";
import ChangePasswordForm from "@/components/change-password/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Change Password | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/change-password.html. Last page of the Dashboard/account family. Uses the
// same `(dashboard)` shell as dashboard.html/my-listings.html/add-listings-2.html/my-favorites.html/
// reviews.html/message.html/my-profile.html.
export default function ChangePasswordPage() {
  return (
    <>
      <p className="h3 mb-40">Change Password</p>
      <ChangePasswordForm />
    </>
  );
}
