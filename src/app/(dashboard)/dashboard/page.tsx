import type { Metadata } from "next";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CarViewsChart from "@/components/dashboard/CarViewsChart";
import DashboardListingsTable, { type DashboardListing } from "@/components/dashboard/DashboardListingsTable";
import RecentReviews from "@/components/dashboard/RecentReviews";

export const metadata: Metadata = {
  title: "Dashboard | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

const LISTINGS: DashboardListing[] = [
  { id: 1, slug: "audi-a6-avant-e-tron", image: "/assets/images/dashboard/card-1.jpg", title: "Audi A6 Avant E-Tron", brand: "Audi", year: "2021", transmission: "Automatic", fuel: "Benzin + Plin" },
  { id: 2, slug: "kia-ev9-2024", image: "/assets/images/dashboard/card-2.png", title: "Kia EV9 2024", brand: "Audi", year: "2023", transmission: "Automatic", fuel: "Benzin + Plin" },
  { id: 3, slug: "genesis-electrified-g80", image: "/assets/images/dashboard/card-3.png", title: "Genesis Electrified G80", brand: "Audi", year: "2021", transmission: "Automatic", fuel: "Benzin + Plin" },
];

// Migrated from ../aurexo/dashboard.html. First page of the Dashboard/account family — establishes
// `(dashboard)/layout.tsx`'s shared shell (sidebar + header + real mobile toggle), see that file and
// `docs/migration/COMPONENT_MAP.md` for the full breakdown.
export default function DashboardPage() {
  return (
    <>
      <p className="h3 mb-30">Dashboard</p>

      <DashboardStats />
      <CarViewsChart />
      <DashboardListingsTable title="All Listing" initialListings={LISTINGS} />
      <RecentReviews />
    </>
  );
}
