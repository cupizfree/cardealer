import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ListingGridSection from "@/components/listing/ListingGridSection";
import { muatKatalog } from "@/lib/katalog";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil dalam grid 2 kolom.",
};

// Migrated from ../aurexo/listing-grid2-columns.html — see docs/migration/MIGRATION_STATUS.md.
// Identical page to listing-grid4-columns.html/listing-grid3-columns.html except its default active
// column-view is 2 (confirmed via diff — same structure, just which `.item-menu`/`.content-inner` is
// marked "active" by source, plus the `<h2>` text) — same shared `ListingGridSection`, just a
// different `initialColumns`. See COMPONENT_MAP.md #22.
export default function ListingGrid2ColumnsPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-grid2-columns" />

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
              <span>Katalog</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="container">
          <h2>Katalog Mobil</h2>
        </div>
        <div className="tf-spacing-style3" />

        <ListingGridSection listings={muatKatalog()} initialColumns={2} />
      </section>

      <Footer />
    </>
  );
}
