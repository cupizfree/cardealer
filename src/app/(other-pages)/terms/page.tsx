import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import TermsSection from "@/components/terms/TermsSection";

export const metadata: Metadata = {
  title: "Terms of Use | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/terms.html. Breadcrumb's "Pages" crumb is a plain non-link <span>, same
// established pattern as sell-your-car.html/clients-reviews.html/financing.html/services-center.html/
// faqs.html. Already linked from src/data/menu.ts:141 ("Terms of use" -> /terms).
export default function TermsPage() {
  return (
    <>
      <Header />

      <section className="background-light mb-32">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Pages</span>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span className="capitalize">Terms of use</span>
            </li>
          </ul>
        </div>
      </section>

      <TermsSection />

      <Footer />
    </>
  );
}
