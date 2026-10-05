import type { Metadata } from "next";
import AddListingsHeader from "@/components/add-listings-2/AddListingsHeader";
import AddListingsForm from "@/components/add-listings-2/AddListingsForm";

export const metadata: Metadata = {
  title: "Tambah Iklan",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/add-listings-2.html. Uses the same `(dashboard)` shell as dashboard.html/
// my-listings.html (confirmed via source — same `dashboard-container`/`dashboard-sidebar`/dashboard
// header markup, not a standalone page). add-listings.html (not yet migrated) turned out NOT to be a
// layout variant of this same form as the original TODO note guessed — its own "Your Package" section is
// genuinely different content; that relationship will be re-examined when add-listings.html itself is
// migrated.
export default function AddListings2Page() {
  return (
    <>
      <AddListingsHeader />
      <AddListingsForm />
    </>
  );
}
