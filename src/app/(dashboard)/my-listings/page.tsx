import type { Metadata } from "next";
import DashboardListingsTable, { type DashboardListing } from "@/components/dashboard/DashboardListingsTable";

export const metadata: Metadata = {
  title: "Iklan Saya",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// "Lamborghini Aventador" has no matching record in `allListings` (unlike the other 4 titles here) —
// rather than inventing a new listing just for this one dashboard row, its "Car" link falls back to the
// one real, fully-analyzed listing (`audi-a6-avant-e-tron`), same "generic fallback to one real
// destination" precedent used for the blog family's Recent Posts widget.
const LISTINGS: DashboardListing[] = [
  { id: 1, slug: "toyota-avanza-1-5-g-2022", image: "/assets/images/dashboard/card-1.jpg", title: "Toyota Avanza 1.5 G", brand: "Toyota", year: "2022", transmission: "Manual", fuel: "Bensin" },
  { id: 2, slug: "honda-brio-satya-e-2023", image: "/assets/images/dashboard/card-2.png", title: "Honda Brio Satya E", brand: "Honda", year: "2023", transmission: "Matic", fuel: "Bensin" },
  { id: 3, slug: "suzuki-ertiga-gx-2022", image: "/assets/images/dashboard/card-4.jpg", title: "Suzuki Ertiga GX", brand: "Suzuki", year: "2022", transmission: "Matic", fuel: "Bensin" },
  { id: 4, slug: "mitsubishi-xpander-ultimate-2023", image: "/assets/images/dashboard/card-5.jpg", title: "Mitsubishi Xpander Ultimate", brand: "Mitsubishi", year: "2023", transmission: "Matic", fuel: "Bensin" },
  { id: 5, slug: "toyota-rush-s-gr-sport-2022", image: "/assets/images/dashboard/card-3.png", title: "Toyota Rush S GR Sport", brand: "Toyota", year: "2022", transmission: "Matic", fuel: "Bensin" },
];

// Migrated from ../aurexo/my-listings.html. Reuses `DashboardListingsTable` verbatim (byte-identical
// search/sort/table/pagination markup to dashboard.html's own "All Listing" box, confirmed via source
// diff) with this page's own 5 real rows — no `title` prop this time since source has no inner "All
// Listing" heading here (the page-level "Iklan Saya" heading already serves that role, unlike
// dashboard.html). Real, disclosed source content bugs preserved verbatim: brand rarely matches the
// actual car ("Mustang" for a Chevrolet, "Audi" for a Lamborghini, "BMW" for a Genesis), and every row
// shares the identical literal subtitle/price.
export default function MyListingsPage() {
  return (
    <>
      <p className="h3 mb-40">Iklan Saya</p>

      <DashboardListingsTable initialListings={LISTINGS} />
    </>
  );
}
