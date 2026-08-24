import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ShopSidebarSection from "@/components/shop/ShopSidebarSection";
import { getShopProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Shop | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/shop.html. Breadcrumb's "Pages" AND "Shop" crumbs are both dead `<span>`s in
// source (confirmed via source read) — "Shop" being a dead span here (the current page) matches the
// same "current-page crumb is never a link" pattern seen throughout the site.
export default function ShopPage() {
  const products = getShopProducts();

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
              <span>Shop</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white pb-100">
        <div className="container">
          <h2>Shop</h2>
          <div className="tf-spacing-style3" />

          <ShopSidebarSection products={products} />
        </div>
      </section>

      <Footer />
    </>
  );
}
