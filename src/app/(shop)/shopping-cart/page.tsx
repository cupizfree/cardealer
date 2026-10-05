import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ShoppingCartSection from "@/components/shopping-cart/ShoppingCartSection";
import OrderSummarySidebar from "@/components/shopping-cart/OrderSummarySidebar";
import RelatedProducts from "@/components/product-details/RelatedProducts";
import { allProducts, getRelatedProducts } from "@/data/products";

export const metadata: Metadata = {
  title: "Keranjang",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/shopping-cart.html. Breadcrumb is only 2 crumbs (Home > Shopping Cart) —
// confirmed via source read, no "Layanan" middle crumb here unlike most other pages in this route group.
// Related Products carousel is byte-identical to product-details.html's own (same 4 products, same
// promos/old-price, same dead `href="#"` on the 4th title) — reused `RelatedProducts` verbatim rather
// than rebuilding an identical component.
export default function ShoppingCartPage() {
  const related = getRelatedProducts(allProducts[0], 4);

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
              <span>Keranjang</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white pb-84 shopping-cart-page">
        <div className="container">
          <h2>Keranjang</h2>
          <div className="tf-spacing-style3" />

          <div className="innerpage-container">
            <ShoppingCartSection />
            <OrderSummarySidebar />
          </div>

          <RelatedProducts products={related} headingClassName="mb-40" enableQuickView />
        </div>
      </section>

      <Footer />
    </>
  );
}
