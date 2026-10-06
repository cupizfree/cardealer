"use client";

import { useState } from "react";
import type { Listing } from "@/data/listings";
import ListingCard from "./ListingCard";
import HalfMapListingCard from "./HalfMapListingCard";
import FilterSidebar from "./FilterSidebar";
import SortDropdown from "./SortDropdown";
import FilterTagsRow from "./FilterTagsRow";
import Pagination from "@/components/common/Pagination";
import { useListingFilters } from "./useListingFilters";
import { FilterIcon } from "@/components/common/icons";

type View = "list" | "grid";

// Source's own Google Maps JS integration (assets/js/maps.js) draws custom price-bubble markers,
// click-to-open info boxes, and marker clustering — a real, paid Google Maps JavaScript API feature
// requiring an API key. The source's HTML has the theme author's own demo key hardcoded, which isn't
// ours to use in this project (could be revoked, and using someone else's billed credentials isn't
// appropriate here). Per explicit user decision, this renders a plain Google Maps *embed* (like the
// listing-details location map — no key/billing required) instead: a real map, but without the
// per-listing marker/cluster/info-box interactivity the source's JS map has. See
// docs/migration/COMPONENT_MAP.md.
const MAP_EMBED_URL =
  "https://www.google.com/maps?q=40.706243,-74.000303&z=13&output=embed";

export default function HalfMapListingSection({
  listings,
  initialView = "grid",
}: {
  listings: Listing[];
  // listing-gridstyle-halfmap.html / listing-liststyle-halfmap.html are the same page/component with
  // a different default `.item-menu`/`.content-inner` marked `active` in source (confirmed via
  // diff) — not separate implementations. See docs/migration/COMPONENT_MAP.md.
  initialView?: View;
}) {
  const [view, setView] = useState<View>(initialView);
  const {
    sort,
    setSort,
    isFilterOpen,
    setIsFilterOpen,
    page,
    setPage,
    priceMin,
    priceMax,
    filters,
    setFilters,
    sortedListings,
    pagedListings,
    filterTags,
    clearAllFilters,
    totalPages,
    rangeStart,
    rangeEnd,
  } = useListingFilters(listings);

  return (
    <section className="max-w-1920 mx-auto">
      <div className="grid grid-cols-2 xl2-grid-cols-1">
        <div className="listing-halfmap">
          <div className="flat-tabs" data-custom="true">
            <div className="row mb-24">
              <div className="col-xxl-5 col-6">
                <div className="flex items-center gap-16">
                  <button className="btn-filter" onClick={() => setIsFilterOpen(true)}>
                    <FilterIcon />
                    Filter
                  </button>
                  <p className="md-hidden">
                    Menampilkan {rangeStart} – {rangeEnd} dari {sortedListings.length} Unit
                  </p>
                </div>
              </div>

              <div className="col-md-2 col-4 xl2-hidden">
                <div className="flex items-center gap-12 py-12 justify-center listing-tabs menu-tab">
                  <span className={`item-menu${view === "list" ? " active" : ""}`} onClick={() => setView("list")}>
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="3" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
                      <rect x="7.5" y="3.5" width="12" height="5" rx="2.5" fill="white" stroke="#9FA1A4" />
                      <circle cx="3" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
                      <rect x="7.5" y="11.5" width="12" height="5" rx="2.5" fill="white" stroke="#9FA1A4" />
                    </svg>
                  </span>
                  <span className={`item-menu${view === "grid" ? " active" : ""}`} onClick={() => setView("grid")}>
                    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <circle cx="3" cy="6" r="2.5" stroke="#9FA1A4" />
                      <circle cx="11" cy="6" r="2.5" stroke="#9FA1A4" />
                      <circle cx="3" cy="14" r="2.5" stroke="#9FA1A4" />
                      <circle cx="11" cy="14" r="2.5" stroke="#9FA1A4" />
                    </svg>
                  </span>
                </div>
              </div>

              <div className="col-xxl-5 col-6">
                <SortDropdown sort={sort} onChange={setSort} />
              </div>

              <div className="mb-8 col-md-12" />

              <FilterTagsRow
                matchCount={sortedListings.length}
                filterTags={filterTags}
                onRemoveTag={(remove) => setFilters((prev) => remove(prev))}
                onClearAll={clearAllFilters}
              />
            </div>

            <div className="content-tab wow fadeInUp" data-wow-delay="0.1s">
              {view === "list" ? (
                <div className="content-inner active">
                  <div className="grid grid-cols-1 gap-20">
                    {pagedListings.map((listing) => (
                      <HalfMapListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              ) : (
                <div className="content-inner active">
                  <div className="grid grid-cols-2 md-grid-cols-1 gap-x-30 gap-y-41">
                    {pagedListings.map((listing) => (
                      <ListingCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              )}
            </div>

            {sortedListings.length > 0 && (
              <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
            )}
          </div>
        </div>

        <div className="halfmap-widget" style={{ height: "calc(100vh - 94px)" }}>
          <iframe
            src={MAP_EMBED_URL}
            style={{ border: 0, width: "100%", height: "100%" }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Listings map"
          />
        </div>
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        priceMin={priceMin}
        priceMax={priceMax}
      />
    </section>
  );
}
