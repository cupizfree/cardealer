import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ListingGridSection from "@/components/listing/ListingGridSection";
import { muatKatalog } from "@/lib/katalog";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil dalam grid 4 kolom.",
};

// Migrated from ../aurexo/listing-grid4-columns.html — see docs/migration/MIGRATION_STATUS.md.
export default function ListingGrid4ColumnsPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-grid4-columns" />

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

        <ListingGridSection listings={muatKatalog()} />
      </section>

      <Footer />
    </>
  );
}
