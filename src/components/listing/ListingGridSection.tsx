"use client";

import type { Listing } from "@/data/listings";
import ListingCard from "./ListingCard";
import FilterSidebar, { type FilterState } from "./FilterSidebar";
import SortDropdown from "./SortDropdown";
import FilterTagsRow from "./FilterTagsRow";
import Pagination from "@/components/common/Pagination";
import { useListingFilters } from "./useListingFilters";
import { FilterIcon } from "@/components/common/icons";
import { useState } from "react";

// Column-count views from the source's `.listing-tabs .item-menu` icon switcher (see
// ../aurexo/listing-grid4-columns.html lines ~487-524 and `assets/js/app.js`'s `tabs()` handler).
// The source implements this as 3 separate `.content-inner` panes containing DIFFERENT numbers of
// placeholder cards each (6 / 9 / 12) — that's unrelated demo padding, not 3 distinct datasets, so
// we render one pane and only swap its grid CSS classes, driven by the same `allListings` data at
// every column count (no data invented/duplicated to fill a wider grid).
type ColumnCount = 2 | 3 | 4;
const GRID_CLASS: Record<ColumnCount, string> = {
  2: "grid grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-40",
  3: "grid grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41",
  4: "grid grid-cols-4 xl-grid-cols-3 lg-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-41",
};

export default function ListingGridSection({
  listings,
  initialColumns = 4,
  initialFilters,
}: {
  listings: Listing[];
  // listing-grid2/3/4-columns.html are the same page/component with a different default
  // `.item-menu`/`.content-inner` marked `active` in source — not separate implementations. See
  // docs/migration/COMPONENT_MAP.md.
  initialColumns?: ColumnCount;
  /** Keadaan awal dari kueri URL (`?tipe=`, `?merek=`, `?harga=`). */
  initialFilters?: Partial<FilterState>;
}) {
  const [columns, setColumns] = useState<ColumnCount>(initialColumns);
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
  } = useListingFilters(listings, initialFilters);

  return (
    <>
      <div className="container  flat-tabs" data-custom="true">
        <div className="row">
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
              <span className={`item-menu xl2-hidden${columns === 4 ? " active" : ""}`} onClick={() => setColumns(4)}>
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

          <div className="mb-8 col-md-12" />

          <FilterTagsRow
            matchCount={sortedListings.length}
            filterTags={filterTags}
            onRemoveTag={(remove) => setFilters((prev) => remove(prev))}
            onClearAll={clearAllFilters}
          />
        </div>

        <div className="content-tab mb-40">
          <div className="content-inner active">
            {pagedListings.length === 0 ? (
              <p className="text-center" style={{ padding: "80px 0" }}>
                Belum ada unit yang cocok dengan pilihan ini. Coba longgarkan penyaringnya.
              </p>
            ) : (
              <div className={GRID_CLASS[columns]}>
                {pagedListings.map((listing) => (
                  <ListingCard key={listing.id} listing={listing} />
                ))}
              </div>
            )}
          </div>
        </div>

        {sortedListings.length > 0 && (
          <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />
        )}
      </div>

      <FilterSidebar
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFilterChange={(patch) => setFilters((prev) => ({ ...prev, ...patch }))}
        priceMin={priceMin}
        priceMax={priceMax}
      />
    </>
  );
}
