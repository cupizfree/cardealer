import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ListingSidebarSection, { SIDEBAR_LR_GRID_CLASS } from "@/components/listing/ListingSidebarSection";
import { allListings } from "@/data/listings";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil dengan sidebar filter tetap di kanan.",
};

// Migrated from ../aurexo/listing-sidebar-right.html — same permanent-sidebar page family as
// listing-sidebar-left.html and listing-liststyle-sidebar.html (identical filter fields, identical
// 12-listing dataset). Two differences from listing-sidebar-left.html: (a) the filter panel is
// rendered AFTER the content column in the source DOM instead of before it — `.listing-sidebar-right`
// is a plain `display: flex` container with no `order` override, so DOM order alone decides whether
// the sidebar appears left or right (confirmed by reading assets/scss/inner-page.scss); `sidebarPosition`
// controls this. (b) default view is Grid3 here vs. Grid2 on listing-sidebar-left.html — same Grid3
// breakpoint pair though, reused via `SIDEBAR_LR_GRID_CLASS`. See docs/migration/MIGRATION_STATUS.md
// and COMPONENT_MAP.md for the scope decisions (3 decorative filter fields not reproduced).
export default function ListingSidebarRightPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-sidebar-right" />

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

        <ListingSidebarSection
          listings={allListings}
          initialView="grid3"
          gridClass={SIDEBAR_LR_GRID_CLASS}
          sidebarPosition="right"
        />
      </section>

      <Footer />
    </>
  );
}
