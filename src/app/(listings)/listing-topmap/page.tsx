import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import TopMapListingSection from "@/components/listing/TopMapListingSection";
import { muatKatalog } from "@/lib/katalog";
import { dariParams, type Params } from "@/lib/saring";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil dengan peta lebar penuh di atas filter pencarian.",
};

// Migrated from ../aurexo/listing-topmap.html — no breadcrumb/heading section (source goes
// straight from the header to the full-width map), unlike most other listing pages. See
// docs/migration/MIGRATION_STATUS.md and COMPONENT_MAP.md #28 for the new `TopSearchFilterBar`
// component and its scope decisions.
export default async function ListingTopmapPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  return (
    <>
      <Header variant="style-1" activePath="/listing-topmap" />
      <TopMapListingSection listings={muatKatalog()} initialFilters={dariParams(sp)} />
      <Footer />
    </>
  );
}
