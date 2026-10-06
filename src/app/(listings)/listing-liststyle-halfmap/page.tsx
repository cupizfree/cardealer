import type { Metadata } from "next";
import Header from "@/components/header/Header";
import HalfMapListingSection from "@/components/listing/HalfMapListingSection";
import { muatKatalog } from "@/lib/katalog";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil terbagi antara daftar dan peta.",
};

// Migrated from ../aurexo/listing-liststyle-halfmap.html — see docs/migration/MIGRATION_STATUS.md.
// Identical page to listing-gridstyle-halfmap.html except its default active view is "list"
// (confirmed via diff — same structure, just which `.item-menu`/`.content-inner` is marked "active")
// — same shared `HalfMapListingSection`, just a different `initialView`. See COMPONENT_MAP.md #23.
export default function ListingListstyleHalfmapPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-liststyle-halfmap" />
      <HalfMapListingSection listings={muatKatalog()} initialView="list" />
    </>
  );
}
