import type { Metadata } from "next";
import ChangePasswordForm from "@/components/change-password/ChangePasswordForm";

export const metadata: Metadata = {
  title: "Ubah Kata Sandi",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/change-password.html. Last page of the Dashboard/account family. Uses the
// same `(dashboard)` shell as dashboard.html/my-listings.html/add-listings-2.html/my-favorites.html/
// reviews.html/message.html/my-profile.html.
export default function ChangePasswordPage() {
  return (
    <>
      <p className="h3 mb-40">Ubah Kata Sandi</p>
      <ChangePasswordForm />
    </>
  );
}
