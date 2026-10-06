"use client";

import { useState } from "react";
import type { Listing } from "@/data/listings";
import ListingCard from "./ListingCard";
import SortDropdown from "./SortDropdown";
import Pagination from "@/components/common/Pagination";
import TopSearchFilterBar from "./TopSearchFilterBar";
import { useListingFilters } from "./useListingFilters";

type ColumnCount = 2 | 3 | 4;

// Breakpoints as they actually appear in ../aurexo/listing-topmap.html — grid2/grid4 match
// `ListingGridSection`'s own GRID_CLASS exactly, but grid3 here skips the `lg-grid-cols-2` step
// (`xl-grid-cols-2 sm-grid-cols-1` instead) — a real, if minor, source discrepancy, not our typo.
const GRID_CLASS: Record<ColumnCount, string> = {
  2: "grid grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-40",
  3: "grid grid-cols-3 xl-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41",
  4: "grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41",
};

// A static Google Maps embed (no API key/billing) fills the source's full-width `#map` div, same
// decision as gridstyle-halfmap.html — see docs/migration/COMPONENT_MAP.md #23.
const MAP_EMBED_URL = "https://www.google.com/maps?q=40.706243,-74.000303&z=13&output=embed";

// Migrated from ../aurexo/listing-topmap.html: full-width map, then the horizontal
// `TopSearchFilterBar` hero search (real Brand/Model/FuelType/Transmission filtering shared with
// the grid below via one `useListingFilters` instance), then a 2/3/4-column listing grid. Unlike
// `ListingGridSection`, source has no "Filter" button or filter-tags row on this page (filtering
// lives entirely in the hero bar above) — a genuine DOM difference, not a trimmed-down reuse of
// that component.
export default function TopMapListingSection({ listings }: { listings: Listing[] }) {
  const [columns, setColumns] = useState<ColumnCount>(4);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const {
    sort,
    setSort,
    filters,
    setFilters,
    sortedListings,
    pagedListings,
    page,
    setPage,
    totalPages,
    rangeStart,
    rangeEnd,
  } = useListingFilters(listings);

  const onFilterChange = (patch: Partial<typeof filters>) => setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <div className="listing-topmap">
      <div className="w-full mx-auto">
        <iframe
          src={MAP_EMBED_URL}
          width="100%"
          height="602"
          style={{ border: 0, display: "block" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title="Listings map"
        />
      </div>

      <section className="py-60 relative index-2">
        <TopSearchFilterBar
          filters={filters}
          onFilterChange={onFilterChange}
          matchCount={sortedListings.length}
          isAdvancedOpen={isAdvancedOpen}
          onToggleAdvanced={() => setIsAdvancedOpen((prev) => !prev)}
        />
      </section>

      <section className="pb-100">
        <div className="container mb-40 flat-tabs" data-custom="true">
          <div className="row mb-34">
            <div className="col-xxl-5 col-6 flex items-center">
              <p className="md-hidden">
                Menampilkan {rangeStart} – {rangeEnd} dari {sortedListings.length} Unit
              </p>
            </div>

            <div className="col-md-2 col-4 xl2-hidden">
              <div className="flex items-center gap-12 py-12 justify-center listing-tabs menu-tab md-justify-start">
                <span className={`item-menu${columns === 2 ? " active" : ""}`} onClick={() => setColumns(2)}>
                  <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="11" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="3" cy="14" r="2.5" stroke="#9FA1A4" />
                    <circle cx="11" cy="14" r="2.5" stroke="#9FA1A4" />
                  </svg>
                </span>
                <span className={`item-menu${columns === 3 ? " active" : ""}`} onClick={() => setColumns(3)}>
                  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="11" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="19" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="3" cy="14" r="2.5" stroke="#9FA1A4" />
                    <circle cx="11" cy="14" r="2.5" stroke="#9FA1A4" />
                    <circle cx="19" cy="14" r="2.5" stroke="#9FA1A4" />
                  </svg>
                </span>
                <span className={`item-menu${columns === 4 ? " active" : ""}`} onClick={() => setColumns(4)}>
                  <svg width="30" height="20" viewBox="0 0 30 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
                    <circle cx="11" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
                    <circle cx="19" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
                    <circle cx="27" cy="6" r="2.5" fill="white" stroke="#9FA1A4" />
                    <circle cx="3" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
                    <circle cx="11" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
                    <circle cx="19" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
                    <circle cx="27" cy="14" r="2.5" fill="white" stroke="#9FA1A4" />
                  </svg>
                </span>
              </div>
            </div>

            <div className="col-xxl-5 col-6">
              <SortDropdown sort={sort} onChange={setSort} />
            </div>
          </div>

          <div className="content-tab">
            <div className="content-inner active">
              <div className={GRID_CLASS[columns]}>
                {pagedListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            </div>
          </div>

          {sortedListings.length > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
        </div>
      </section>
    </div>
  );
}
