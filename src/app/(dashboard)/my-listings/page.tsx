import type { Metadata } from "next";
import DashboardListingsTable, { type DashboardListing } from "@/components/dashboard/DashboardListingsTable";

export const metadata: Metadata = {
  title: "My Listings | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// "Lamborghini Aventador" has no matching record in `allListings` (unlike the other 4 titles here) —
// rather than inventing a new listing just for this one dashboard row, its "Car" link falls back to the
// one real, fully-analyzed listing (`audi-a6-avant-e-tron`), same "generic fallback to one real
// destination" precedent used for the blog family's Recent Posts widget.
const LISTINGS: DashboardListing[] = [
  { id: 1, slug: "audi-a6-avant-e-tron", image: "/assets/images/dashboard/card-1.jpg", title: "Audi A6 Avant E-Tron", brand: "Audi", year: "2021", transmission: "Automatic", fuel: "Benzin + Plin" },
  { id: 2, slug: "kia-ev9-2024", image: "/assets/images/dashboard/card-2.png", title: "Kia EV9 2024", brand: "Audi", year: "2023", transmission: "Automatic", fuel: "Benzin + Plin" },
  { id: 3, slug: "chevrolet-camaro-2020", image: "/assets/images/dashboard/card-4.jpg", title: "Chevrolet Camaro 2020", brand: "Mustang", year: "2020", transmission: "Automatic", fuel: "Benzin + Plin" },
  { id: 4, slug: "audi-a6-avant-e-tron", image: "/assets/images/dashboard/card-5.jpg", title: "Lamborghini Aventador", brand: "Audi", year: "2022", transmission: "Automatic", fuel: "Benzin + Plin" },
  { id: 5, slug: "genesis-electrified-g80", image: "/assets/images/dashboard/card-3.png", title: "Genesis Electrified G80", brand: "BMW", year: "2021", transmission: "Automatic", fuel: "Benzin + Plin" },
];

// Migrated from ../aurexo/my-listings.html. Reuses `DashboardListingsTable` verbatim (byte-identical
// search/sort/table/pagination markup to dashboard.html's own "All Listing" box, confirmed via source
// diff) with this page's own 5 real rows — no `title` prop this time since source has no inner "All
// Listing" heading here (the page-level "My Listings" heading already serves that role, unlike
// dashboard.html). Real, disclosed source content bugs preserved verbatim: brand rarely matches the
// actual car ("Mustang" for a Chevrolet, "Audi" for a Lamborghini, "BMW" for a Genesis), and every row
// shares the identical literal subtitle/price.
export default function MyListingsPage() {
  return (
    <>
      <p className="h3 mb-40">My Listings</p>

      <DashboardListingsTable initialListings={LISTINGS} />
    </>
  );
}
