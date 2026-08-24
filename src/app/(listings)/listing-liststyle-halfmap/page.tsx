import type { Metadata } from "next";
import Header from "@/components/header/Header";
import HalfMapListingSection from "@/components/listing/HalfMapListingSection";
import { allListings } from "@/data/listings";

export const metadata: Metadata = {
  title: "Listing List Half Map | Aurexo",
  description: "Browse car listings split between a list and a map.",
};

// Migrated from ../aurexo/listing-liststyle-halfmap.html — see docs/migration/MIGRATION_STATUS.md.
// Identical page to listing-gridstyle-halfmap.html except its default active view is "list"
// (confirmed via diff — same structure, just which `.item-menu`/`.content-inner` is marked "active")
// — same shared `HalfMapListingSection`, just a different `initialView`. See COMPONENT_MAP.md #23.
export default function ListingListstyleHalfmapPage() {
  return (
    <>
      <Header variant="style-1" activePath="/listing-liststyle-halfmap" />
      <HalfMapListingSection listings={allListings} initialView="list" />
    </>
  );
}
