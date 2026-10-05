import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BlogStandardList from "@/components/blog-standard/BlogStandardList";
import BlogListingSidebar from "@/components/common/BlogListingSidebar";

export const metadata: Metadata = {
  title: "Artikel",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/blog-standard.html. Breadcrumb's last crumb literally reads "Artikel" (not
// "Blog Standard", confirmed via source read) despite the `<h2>` right below reading "Blog Standard" —
// a real source mismatch, preserved as-is. Real pagination (standing rule): source's own `.pagination`
// has no backing JS anywhere on the site (confirmed via grep across assets/js), but the 6 real grid
// posts split evenly into the 3 pages source's own markup literally shows (2/page), so no page needed
// to be invented or dropped to make the real data and the real markup agree.
export default function BlogStandardPage() {
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

        <div className="container innerpage-container">
          <BlogStandardList />
          <BlogListingSidebar tagsHref="/blog-grid-style-1" />
        </div>
      </section>

      <Footer />
    </>
  );
}
