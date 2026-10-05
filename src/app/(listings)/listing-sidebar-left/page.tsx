import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ListingSidebarSection, { SIDEBAR_LR_GRID_CLASS } from "@/components/listing/ListingSidebarSection";
import { allListings } from "@/data/listings";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil dengan sidebar filter tetap di kiri.",
};

// Migrated from ../aurexo/listing-sidebar-left.html — structurally identical to
// listing-liststyle-sidebar.html (same permanent-sidebar layout, same filter fields, same 12
// listings) but with a different default view (grid2 instead of list) and a different grid3
// breakpoint pair (`lg-grid-cols-2 sm-grid-cols-1` instead of `xl-grid-cols-2 lg-grid-cols-1`) —
// both confirmed via direct source read. Shares its Grid3 breakpoint pair with
// listing-sidebar-right.html via `SIDEBAR_LR_GRID_CLASS`. See docs/migration/MIGRATION_STATUS.md and
// COMPONENT_MAP.md for the scope decisions (3 decorative filter fields not reproduced; see
// ListingSidebarSection.tsx's comment).
export default function ListingSidebarLeftPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-sidebar-left" />

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
        <div className="tf-spacing-style3 md-hidden" />

        <ListingSidebarSection listings={allListings} initialView="grid2" gridClass={SIDEBAR_LR_GRID_CLASS} />
      </section>

      <Footer />
    </>
  );
}
