import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DealersListSection from "@/components/dealers/DealersListSection";
import DealersBrandsCarousel from "@/components/dealers/DealersBrandsCarousel";

export const metadata: Metadata = {
  title: "Dealers Listing | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/dealers-listing.html. Source nests the dealer list, a `tf-spacing` divider,
// and the "Dealers Brands" carousel all inside ONE `<section class="pb-100">` — assembled here to
// match that exact nesting (see `DealersListSection`/`DealersBrandsCarousel`'s own header comments).
export default function DealersListingPage() {
  return (
    <>
      <Header />

      <section className="background-light">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <Link href="/">Pages</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Dealers Listing</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <DealersListSection />
        <div className="tf-spacing" />
        <DealersBrandsCarousel />
      </section>

      <Footer />
    </>
  );
}
