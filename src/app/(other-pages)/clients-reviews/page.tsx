import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ClientsReviewsSection from "@/components/clients-reviews/ClientsReviewsSection";

export const metadata: Metadata = {
  title: "Clients Reviews | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/clients-reviews.html. Source's breadcrumb "Pages" crumb is a plain `<span>`
// here (not a link) — same as sell-your-car.html's breadcrumb, confirmed via direct source read.
export default function ClientsReviewsPage() {
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
              <span>Clients Reviews</span>
            </li>
          </ul>
        </div>
      </section>

      <ClientsReviewsSection />

      <Footer />
    </>
  );
}
