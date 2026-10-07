import type { Metadata } from "next";
import Header from "@/components/header/Header";
import HalfMapListingSection from "@/components/listing/HalfMapListingSection";
import { muatKatalog } from "@/lib/katalog";
import { dariParams, type Params } from "@/lib/saring";

export const metadata: Metadata = {
  title: "Katalog Mobil",
  description: "Lihat katalog mobil terbagi antara grid/daftar dan peta.",
};

// Migrated from ../aurexo/listing-gridstyle-halfmap.html — see docs/migration/MIGRATION_STATUS.md and
// COMPONENT_MAP.md for the map-implementation decision (static Google Maps embed, not the source's
// real Google Maps JS API + custom markers/clustering — see HalfMapListingSection.tsx's comment).
// Source has no breadcrumb/heading section here (unlike listing-grid2/3/4-columns) — the grid+map
// section runs full height right under the header, and no Footer either (map fills the rest of the
// viewport, matching the source's own layout).
//
// Halaman ini ikut membaca `searchParams` seperti grid2/3/4-columns: footer menautkan
// `/listing-liststyle-halfmap` dengan label "Daftar Unit + Peta", jadi satu dari keluarga
// halaman ini benar-benar terjangkau pengunjung dan tidak boleh jadi tautan mati.
export default async function ListingGridstyleHalfmapPage({
  searchParams,
}: {
  searchParams: Promise<Params>;
}) {
  const sp = await searchParams;
  return (
    <>
      <Header variant="style-1" activePath="/listing-gridstyle-halfmap" />
      <HalfMapListingSection listings={muatKatalog()} initialFilters={dariParams(sp)} />
    </>
  );
}
