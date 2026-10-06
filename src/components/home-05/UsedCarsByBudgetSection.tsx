"use client";

import { useState } from "react";
import ListingCard from "@/components/listing/ListingCard";
import { allListings } from "@/data/listings";

// Migrated from ../aurexo/home-05.html lines 1847-3538 ("Mobil Bekas Sesuai Anggaran"). A genuinely new
// section — 5 price-range tabs (`.menu-tab-style2 .car-box`) each with its own static
// `grid-cols-3 xl-grid-cols-2 sm-grid-cols-1` grid of `.card-box.card-box-style-1` cards (the exact
// `ListingCard` shape — reused directly). Every title across all 5 tabs matches an existing canonical
// listing (ids 1-8, confirmed via full source title/spec/price read) — no new data needed, same
// conclusion as every other tabbed listing section in this migration. Real client-side tab switch
// (same `content-tab > content-inner.active` pattern as `NewCarsSection.tsx`), default active tab is
// "$20.000 - $50.000" (index 1), matching source's own `active` markers on both the tab pill and its
// `content-inner`. The price-range labels don't actually correspond to the real listing prices shown
// under them (e.g. "$20.000 - $50.000" shows a $45.500,00 card) — a real, disclosed source
// inconsistency, not filtered/enforced here, same as every other decorative-tab pattern already
// documented in this migration.
const TABS: { label: string; ids: number[] }[] = [
  { label: "Semua Mobil", ids: [1, 2, 3, 4, 5, 6, 7, 8] },
  { label: "Rp 200 jt - Rp 500 jt", ids: [1, 2, 3] },
  { label: "Rp 500 jt - Rp 700 jt", ids: [6, 7, 8] },
  { label: "Rp 700 jt - Rp 1 M", ids: [5, 6] },
  { label: "Rp 1 M - Rp 1,5 M", ids: [1, 2] },
];

export default function UsedCarsByBudgetSection() {
  const [activeTab, setActiveTab] = useState("Rp 200 jt - Rp 500 jt");
  const tab = TABS.find((t) => t.label === activeTab) ?? TABS[1];
  const listings = tab.ids.map((id) => allListings.find((l) => l.id === id)!);

  return (
    <section className="py-100 flat-tabs">
      <div className="container">
        <div className="flex items-center justify-center mb-40 wow fadeInUp">
          <h2>Mobil Bekas Sesuai Anggaran</h2>
        </div>
        <div className="flex items-center justify-center overflow-x-auto mb-40 gap-8 wow fadeIn" data-wow-delay="0.1s">
          <ul className="menu-tab menu-tab-style2 margin-auto gap-10">
            {TABS.map((t) => (
              <li
                className={`car-box${t.label === activeTab ? " active" : ""}`}
                key={t.label}
                onClick={() => setActiveTab(t.label)}
              >
                {t.label}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="container wow fadeIn" data-wow-delay="0.2s">
        <div className="content-tab">
          <div className="content-inner active">
            <div className="grid grid-cols-3 xl-grid-cols-2 sm-grid-cols-1 gap-30">
              {listings.map((listing) => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
