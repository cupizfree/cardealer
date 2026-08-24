import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BlogGridStyle3Content from "@/components/blog-grid-style-3/BlogGridStyle3Content";

export const metadata: Metadata = {
  title: "Blog Grid Style 3 | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/blog-grid-style-3.html. Same "News" breadcrumb-vs-`<h2>` mismatch as the other
// blog listing pages. No sidebar, no tabs (full-width 2-column grid, confirmed via source). Real
// pagination (standing rule): source's own `.pagination` has zero backing JS (confirmed via grep), and
// its 8 real posts split 3-per-page (3+3+2) across exactly the 3 pages source's own literal markup shows.
export default function BlogGridStyle3Page() {
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
              <span>News</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="container">
          <h2>Blog Grid Style 3</h2>
        </div>
        <div className="tf-spacing-style3" />

        <BlogGridStyle3Content />
      </section>

      <Footer />
    </>
  );
}
