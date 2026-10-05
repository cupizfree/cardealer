import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ShopSidebarSection from "@/components/shop/ShopSidebarSection";
import { getShopProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Toko Aksesori",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/shop.html. Breadcrumb's "Layanan" AND "Toko Aksesori" crumbs are both dead `<span>`s in
// source (confirmed via source read) — "Toko Aksesori" being a dead span here (the current page) matches the
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
              <Link href="/">Beranda</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Layanan</span>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Toko Aksesori</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white pb-100">
        <div className="container">
          <h2>Toko Aksesori</h2>
          <div className="tf-spacing-style3" />

          <ShopSidebarSection products={products} />
        </div>
      </section>

      <Footer />
    </>
  );
}
