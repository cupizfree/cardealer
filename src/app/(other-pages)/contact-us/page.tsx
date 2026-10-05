import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ContactMap from "@/components/contact-us/ContactMap";
import ContactInfoFormSection from "@/components/contact-us/ContactInfoFormSection";

export const metadata: Metadata = {
  title: "Hubungi Kami",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/contact-us.html. No breadcrumb section here (confirmed via source grep) —
// unlike every other page in the `(other-pages)` group so far.
export default function ContactUsPage() {
  return (
    <>
      <Header />
      <ContactMap />
      <ContactInfoFormSection />
      <Footer />
    </>
  );
}
