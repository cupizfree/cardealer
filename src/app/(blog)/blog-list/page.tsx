import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BlogListContent from "@/components/blog-list/BlogListContent";
import BlogListingSidebar from "@/components/common/BlogListingSidebar";

export const metadata: Metadata = {
  title: "Blog List | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/blog-list.html. Same "News" breadcrumb-vs-`<h2>` mismatch as blog-standard.html
// (a real, disclosed source inconsistency — the breadcrumb never actually matches the page's own title
// text on either page). Real pagination (standing rule): source's own `.pagination` has zero backing JS
// (confirmed via grep), and its 5 real posts split into 2/page (2+2+1) across the same 3 pages source's
// own literal markup shows, without inventing a 6th post to make the last page full.
export default function BlogListPage() {
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
          <h2>Blog List</h2>
        </div>
        <div className="tf-spacing-style3" />

        <div className="container innerpage-container">
          <BlogListContent />
          <BlogListingSidebar tagsHref="/blog-details-1/compact-suv-vs-full-size-suv" />
        </div>
      </section>

      <Footer />
    </>
  );
}
