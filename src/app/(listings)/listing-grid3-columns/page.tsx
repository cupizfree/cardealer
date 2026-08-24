import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ListingGridSection from "@/components/listing/ListingGridSection";
import { allListings } from "@/data/listings";

export const metadata: Metadata = {
  title: "Listing Grid 3 Columns | Aurexo",
  description: "Browse car listings in a 3-column grid.",
};

// Migrated from ../aurexo/listing-grid3-columns.html — see docs/migration/MIGRATION_STATUS.md.
// Identical page to listing-grid4-columns.html except its default active column-view is 3 (source's
// own `.item-menu`/`.content-inner` "active" marker sits on the 3-column pane here, not the 4-column
// one) — same shared `ListingGridSection`, just a different `initialColumns`.
export default function ListingGrid3ColumnsPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-grid3-columns" />

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
              <span>Listing</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="container">
          <h2>Listing Grid 3 Columns</h2>
        </div>
        <div className="tf-spacing-style3" />

        <ListingGridSection listings={allListings} initialColumns={3} />
      </section>

      <Footer />
    </>
  );
}
