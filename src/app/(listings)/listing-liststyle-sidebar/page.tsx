import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ListingSidebarSection from "@/components/listing/ListingSidebarSection";
import { muatKatalog } from "@/lib/katalog";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil dengan sidebar filter tetap.",
};

// Migrated from ../aurexo/listing-liststyle-sidebar.html — see docs/migration/MIGRATION_STATUS.md and
// COMPONENT_MAP.md for the scope decisions (3 decorative filter fields not reproduced; see
// ListingSidebarSection.tsx's comment).
export default function ListingListstyleSidebarPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-liststyle-sidebar" />

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

        <ListingSidebarSection listings={muatKatalog()} initialView="list" />
      </section>

      <Footer />
    </>
  );
}
