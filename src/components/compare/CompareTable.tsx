"use client";

import Image from "next/image";
import Link from "next/link";
import { useCompare } from "@/components/common/CompareProvider";
import { allListings, withDetailFallback, type Listing, type ListingOverview } from "@/data/listings";

// Migrated from ../aurexo/compare.html lines 483-658. Source hardcodes exactly 4 comparison columns
// (with "2024 Hyundai Elantra" literally repeated 3 times across different card images — a genuine
// source content quirk, not something to reproduce since this page is now driven by real data). This
// table now renders whichever listings are actually in `CompareProvider`'s state (added via
// `ListingCard`/`HalfMapListingCard`'s "Bandingkan" button) — a real new feature, not a migration of
// source's static demo.
//
// Each column needs the full detail-page field set (Color/Location/Interior/Engine/VIN/Stock Number),
// but `ListingCardData` (all a card ever carries) only has the 4-field `spec`. Reused the same
// `withDetailFallback()` already established for `/listing-details/[slug]` (see `src/data/listings.ts`)
// instead of inventing a new fallback scheme: only listing id 1 has real per-listing detail values,
// every other listing falls back to that same template's real, source-derived values for the fields it
// doesn't have — never fabricated fresh data.
const ROWS: Array<{ icon: string; label: string; key: keyof ListingOverview }> = [
  { icon: "mileage.svg", label: "Jarak Tempuh:", key: "mileage" },
  { icon: "years.svg", label: "Years:", key: "year" },
  { icon: "fuel.svg", label: "Bahan Bakar:", key: "fuel" },
  { icon: "color.svg", label: "Warna:", key: "color" },
  { icon: "location.svg", label: "Location:", key: "location" },
  { icon: "interior.svg", label: "Interior:", key: "interior" },
  { icon: "engine.svg", label: "Engine:", key: "engine" },
  { icon: "transmission.svg", label: "Transmisi:", key: "transmission" },
  { icon: "VIN.svg", label: "VIN:", key: "vin" },
  { icon: "QrCode.svg", label: "Nomor Stok:", key: "stockNumber" },
];

const removeButtonStyle: React.CSSProperties = {
  position: "absolute",
  top: 0,
  right: 0,
  background: "transparent",
  border: "none",
  cursor: "pointer",
  padding: 8,
  zIndex: 10,
};

export default function CompareTable() {
  const { compareItems, removeFromCompare } = useCompare();

  if (compareItems.length === 0) {
    return (
      <div className="compare-empty-state text-center">
        <p className="text-muted mb-20">Perbandingan Anda masih kosong</p>
        <Link href="/listing-grid4-columns" className="btn btn-primary btn-large font-weight-600">
          Lihat Katalog
        </Link>
      </div>
    );
  }

  // `compareItems` always comes from a card built off `allListings`, so the canonical record with the
  // same id is guaranteed present — falling back to the card data itself only as a defensive measure.
  const detailed = compareItems.map((item) =>
    withDetailFallback(allListings.find((listing) => listing.id === item.id) ?? (item as Listing))
  );

  return (
    <div className="card-details">
      <table className="card-details--table">
        <tbody>
          <tr>
            <td />
            {detailed.map((listing) => (
              <td key={listing.id}>
                <div className="relative top">
                  <button
                    className="compare-item-remove-table"
                    type="button"
                    style={removeButtonStyle}
                    aria-label={`Remove ${listing.title}`}
                    onClick={() => removeFromCompare(listing.id)}
                  >
                    <Image src="/assets/icons/close-modal.svg" alt="Hapus" width={24} height={24} />
                  </button>
                  <Image className="mb-10 radius-16 image" src={listing.image} alt="" width={200} height={140} />
                  <p className="h4 text-center">{listing.title}</p>
                </div>
              </td>
            ))}
          </tr>

          {ROWS.map((row) => (
            <tr key={row.key}>
              <td>
                <div className="flex items-center gap-8">
                  <Image src={`/assets/icons/${row.icon}`} alt="mileage" width={20} height={20} />
                  <span>{row.label}</span>
                </div>
              </td>
              {detailed.map((listing) => (
                <td key={listing.id}>{listing.overview[row.key]}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
