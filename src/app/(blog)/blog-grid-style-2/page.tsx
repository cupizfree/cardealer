import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BlogGridStyle2Content from "@/components/blog-grid-style-2/BlogGridStyle2Content";

export const metadata: Metadata = {
  title: "Tips & Panduan",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/blog-grid-style-2.html. Same "Artikel" breadcrumb-vs-`<h2>` mismatch as the other
// blog listing pages. No sidebar (full-width tabbed grid, confirmed via source). Real pagination
// (standing rule): source's own `.pagination` has zero backing JS and sits once, outside all 3 tab
// panes — reproduced as real, per-tab pagination (3/page) so switching tabs shows that tab's own real
// page count instead of one pagination row pretending to cover all 3 tabs' different post counts.
export default function BlogGridStyle2Page() {
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
              <span>Artikel</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="container">
          <h2>Tips & Panduan</h2>
        </div>
        <div className="tf-spacing-style3" />

        <BlogGridStyle2Content />
      </section>

      <Footer />
    </>
  );
}
