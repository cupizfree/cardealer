import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import TopMapListingSection from "@/components/listing/TopMapListingSection";
import { allListings } from "@/data/listings";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil dengan peta lebar penuh di atas filter pencarian.",
};

// Migrated from ../aurexo/listing-topmap.html — no breadcrumb/heading section (source goes
// straight from the header to the full-width map), unlike most other listing pages. See
// docs/migration/MIGRATION_STATUS.md and COMPONENT_MAP.md #28 for the new `TopSearchFilterBar`
// component and its scope decisions.
export default function ListingTopmapPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-topmap" />
      <TopMapListingSection listings={allListings} />
      <Footer />
    </>
  );
}
