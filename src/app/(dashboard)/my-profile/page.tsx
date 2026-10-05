import type { Metadata } from "next";
import ProfileForm from "@/components/my-profile/ProfileForm";

export const metadata: Metadata = {
  title: "Profil Saya",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/my-profile.html. Uses the same `(dashboard)` shell as dashboard.html/
// my-listings.html/add-listings-2.html/my-favorites.html/reviews.html/message.html.
export default function MyProfilePage() {
  return (
    <>
      <p className="h3 mb-40">Profil Saya</p>
      <ProfileForm />
    </>
  );
}
