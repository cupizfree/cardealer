import type { Metadata } from "next";
import DashboardStats from "@/components/dashboard/DashboardStats";
import CarViewsChart from "@/components/dashboard/CarViewsChart";
import DashboardListingsTable, { type DashboardListing } from "@/components/dashboard/DashboardListingsTable";
import RecentReviews from "@/components/dashboard/RecentReviews";

export const metadata: Metadata = {
  title: "Dasbor",
  description: "Panel pengelolaan unit MARF Showroom Mobil Purwokerto.",
};

const LISTINGS: DashboardListing[] = [
  { id: 1, slug: "toyota-avanza-1-5-g-2022", image: "/assets/images/dashboard/card-1.jpg", title: "Toyota Avanza 1.5 G", brand: "Toyota", year: "2022", transmission: "Manual", fuel: "Bensin" },
  { id: 2, slug: "honda-brio-satya-e-2023", image: "/assets/images/dashboard/card-2.png", title: "Honda Brio Satya E", brand: "Honda", year: "2023", transmission: "Matic", fuel: "Bensin" },
  { id: 3, slug: "daihatsu-xenia-r-2021", image: "/assets/images/dashboard/card-3.png", title: "Daihatsu Xenia R", brand: "Daihatsu", year: "2021", transmission: "Matic", fuel: "Bensin" },
];

// Migrated from ../aurexo/dashboard.html. First page of the Dashboard/account family — establishes
// `(dashboard)/layout.tsx`'s shared shell (sidebar + header + real mobile toggle), see that file and
// `docs/migration/COMPONENT_MAP.md` for the full breakdown.
export default function DashboardPage() {
  return (
    <>
      <p className="h3 mb-30">Dasbor</p>

      <DashboardStats />
      <CarViewsChart />
      <DashboardListingsTable title="Semua Iklan" initialListings={LISTINGS} />
      <RecentReviews />
    </>
  );
}
