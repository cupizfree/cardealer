import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BlogGridStyle1Content from "@/components/blog-grid-style-1/BlogGridStyle1Content";

export const metadata: Metadata = {
  title: "Artikel",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/blog-grid-style-1.html. Same "Artikel" breadcrumb-vs-`<h2>` mismatch as
// blog-standard.html/blog-list.html. No sidebar on this page (full-width 3-column grid, confirmed via
// source — genuinely different layout from those two). Real pagination (standing rule): source's own
// `.pagination` has zero backing JS (confirmed via grep), and its 9 real posts split evenly into the
// exact 3 pages source's own literal markup shows (3/page), same lucky alignment as clients-reviews.html.
export default function BlogGridStyle1Page() {
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
          <h2>Artikel</h2>
        </div>
        <div className="tf-spacing-style3" />

        <BlogGridStyle1Content />
      </section>

      <Footer />
    </>
  );
}
