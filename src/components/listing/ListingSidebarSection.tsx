"use client";

import { useState } from "react";
import type { Listing } from "@/data/listings";
import type { FilterState } from "./FilterSidebar";
import ListingCard from "./ListingCard";
import HalfMapListingCard from "./HalfMapListingCard";
import FilterSidebar from "./FilterSidebar";
import FilterFields from "./FilterFields";
import SortDropdown from "./SortDropdown";
import FilterTagsRow from "./FilterTagsRow";
import Pagination from "@/components/common/Pagination";
import { useListingFilters } from "./useListingFilters";
import { FilterIcon } from "@/components/common/icons";

type View = "list" | "grid2" | "grid3";
type GridClassMap = Record<"grid2" | "grid3", string>;

// Narrower breakpoints than the full-width grid2/3-columns pages (`ListingGridSection`'s
// GRID_CLASS) — this page's content column shares horizontal space with a permanent 300px filter
// sidebar, so source uses `xl-grid-cols-2 lg-grid-cols-1` here instead of `lg-grid-cols-2
// sm-grid-cols-1` (confirmed via direct read of ../aurexo/listing-liststyle-sidebar.html). Source's
// sibling page listing-sidebar-left.html uses yet another breakpoint pair for its grid3 tab
// (`lg-grid-cols-2 sm-grid-cols-1`) — passed in via the `gridClass` prop rather than hardcoded here.
const DEFAULT_GRID_CLASS: GridClassMap = {
  grid2: "grid grid-cols-2 md-grid-cols-1 gap-x-30 gap-y-41",
  grid3: "grid grid-cols-3 xl-grid-cols-2 lg-grid-cols-1 gap-x-30 gap-y-41",
};

// Shared by listing-sidebar-left.html and listing-sidebar-right.html — both use this Grid3
// breakpoint pair (confirmed via direct source read of both files), distinct from the
// liststyle-sidebar breakpoints above.
export const SIDEBAR_LR_GRID_CLASS: GridClassMap = {
  grid2: "grid grid-cols-2 md-grid-cols-1 gap-x-30 gap-y-41",
  grid3: "grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41",
};

// Source's permanent sidebar (../aurexo/listing-liststyle-sidebar.html, listing-sidebar-left.html)
// has 3 extra decorative filter fields not present on the grid pages' popup sidebar: "Penggerak",
// "Select miles", and a Min/Max Year dropdown pair. None have a corresponding `Listing` field (no
// drive-type/mileage-band/year-band data was ever modeled) and — like Body Style/Door count/
// Cylinders/Colors on the shared `FilterFields` — would be purely decorative if added. Deliberately
// not reproduced here rather than transcribing 3 more inert option lists for a single page;
// disclosed, not a silent gap. See docs/migration/COMPONENT_MAP.md.
export default function ListingSidebarSection({
  listings,
  initialView = "list",
  gridClass = DEFAULT_GRID_CLASS,
  sidebarPosition = "left",
  initialFilters,
}: {
  listings: Listing[];
  initialView?: View;
  gridClass?: GridClassMap;
  sidebarPosition?: "left" | "right";
  /** Keadaan awal dari kueri URL (`?tipe=`, `?merek=`, `?harga=`, `?model=`, `?jarak=`). */
  initialFilters?: Partial<FilterState>;
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
    jarakMin,
    jarakMaks,
    filters,
    setFilters,
    sortedListings,
    pagedListings,
    filterTags,
    clearAllFilters,
    totalPages,
    rangeStart,
    rangeEnd,
  } = useListingFilters(listings, initialFilters);

  const onFilterChange = (patch: Partial<typeof filters>) => setFilters((prev) => ({ ...prev, ...patch }));

  const filterPanel = (
    <div className="listing-sidebar-right__filter md-mb-30">
      <div className="filter-sidebar-popup filter-sidebar-desktop md-hidden">
        <form action="#" onSubmit={(event) => event.preventDefault()}>
          <FilterFields
            filters={filters}
            onFilterChange={onFilterChange}
            priceMin={priceMin}
            priceMax={priceMax}
            jarakMin={jarakMin}
            jarakMaks={jarakMaks}
          />
        </form>
      </div>
    </div>
  );

  const contentPanel = (
    <div className="listing-sidebar-right__content">
      <div className="flat-tabs" data-custom="true">
          <div className="row mb-24">
            <div className="col-xxl-5 col-6">
              <div className="flex items-center gap-16">
                <button className="btn-filter hidden md-block" onClick={() => setIsFilterOpen(true)}>
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
                <span className={`item-menu${view === "grid2" ? " active" : ""}`} onClick={() => setView("grid2")}>
                  <svg width="14" height="20" viewBox="0 0 14 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="11" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="3" cy="14" r="2.5" stroke="#9FA1A4" />
                    <circle cx="11" cy="14" r="2.5" stroke="#9FA1A4" />
                  </svg>
                </span>
                <span className={`item-menu${view === "grid3" ? " active" : ""}`} onClick={() => setView("grid3")}>
                  <svg width="22" height="20" viewBox="0 0 22 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="3" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="11" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="19" cy="6" r="2.5" stroke="#9FA1A4" />
                    <circle cx="3" cy="14" r="2.5" stroke="#9FA1A4" />
                    <circle cx="11" cy="14" r="2.5" stroke="#9FA1A4" />
                    <circle cx="19" cy="14" r="2.5" stroke="#9FA1A4" />
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

          <div className="content-tab">
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
                <div className={gridClass[view]}>
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
  );

  return (
    <div className="container listing-sidebar-right">
      {sidebarPosition === "left" ? (
        <>
          {filterPanel}
          {contentPanel}
        </>
      ) : (
        <>
          {contentPanel}
          {filterPanel}
        </>
      )}

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={onFilterChange}
        priceMin={priceMin}
        priceMax={priceMax}
        jarakMin={jarakMin}
        jarakMaks={jarakMaks}
      />
    </div>
  );
}
