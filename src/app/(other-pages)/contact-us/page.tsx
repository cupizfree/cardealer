import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ContactMap from "@/components/contact-us/ContactMap";
import ContactInfoFormSection from "@/components/contact-us/ContactInfoFormSection";

export const metadata: Metadata = {
  title: "Contact Us | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
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
