import type { Metadata } from "next";
import Header from "@/components/header/Header";
import HalfMapListingSection from "@/components/listing/HalfMapListingSection";
import { muatKatalog } from "@/lib/katalog";
import { dariParams, type Params } from "@/lib/saring";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil terbagi antara daftar dan peta.",
};

// Migrated from ../aurexo/listing-liststyle-halfmap.html — see docs/migration/MIGRATION_STATUS.md.
// Identical page to listing-gridstyle-halfmap.html except its default active view is "list"
// (confirmed via diff — same structure, just which `.item-menu`/`.content-inner` is marked "active")
// — same shared `HalfMapListingSection`, just a different `initialView`. See COMPONENT_MAP.md #23.
//
// Halaman inilah yang ditautkan footer ("Daftar Unit + Peta"), jadi penyaringnya harus bekerja
// sungguhan — lihat catatan di listing-gridstyle-halfmap.
export default async function ListingListstyleHalfmapPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  return (
    <>
      <Header variant="style-1" activePath="/listing-liststyle-halfmap" />
      <HalfMapListingSection listings={muatKatalog()} initialView="list" initialFilters={dariParams(sp)} />
    </>
  );
}
