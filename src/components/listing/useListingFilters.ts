"use client";

import { useEffect, useMemo, useState } from "react";
import type { Listing } from "@/data/listings";
import type { FilterState } from "./FilterSidebar";

export type SortOption =
  | "best-match"
  | "lowest-price"
  | "highest-price"
  | "lowest-mileage"
  | "highest-mileage"
  | "nearest-location"
  | "best-deal"
  | "newest-year"
  | "oldest-year"
  | "newest-listed"
  | "oldest-listed";

export const SORT_LABELS: Record<SortOption, string> = {
  "best-match": "Paling Sesuai",
  "lowest-price": "Harga Terendah",
  "highest-price": "Harga Tertinggi",
  "lowest-mileage": "Jarak Terendah",
  "highest-mileage": "Jarak Tertinggi",
  "nearest-location": "Nearest Location",
  "best-deal": "Penawaran Terbaik",
  "newest-year": "Tahun Terbaru",
  "oldest-year": "Tahun Terlama",
  "newest-listed": "Newest Listed",
  "oldest-listed": "Oldest Listed",
};

// Options with no corresponding field anywhere in the canonical Listing type (no post date, no
// per-listing geo, no "deal score") — sorting by these is a no-op rather than fabricated data.
const UNSUPPORTED_SORTS = new Set<SortOption>(["best-match", "nearest-location", "best-deal", "newest-listed", "oldest-listed"]);

// The source's own `.pagination` is static markup with no page-switching JS anywhere in the theme
// (`filterCar.js` only shows/hides the whole block based on whether any cards are visible) — real
// paging is a net-new, user-requested feature, not a ported behavior. 8 cards/page per that request.
const PAGE_SIZE = 8;

function parsePrice(price: string): number {
  // "$44.900,00" -> 44900.00 (source uses "." as thousands separator, "," as decimal)
  const numeric = price.replace(/[^0-9.,]/g, "").replace(/\./g, "").replace(",", ".");
  return Number.parseFloat(numeric) || 0;
}

function parseMileage(mileage: string): number {
  return Number.parseInt(mileage.replace(/[^0-9]/g, ""), 10) || 0;
}

function sortListings(listings: Listing[], sort: SortOption): Listing[] {
  if (UNSUPPORTED_SORTS.has(sort)) return listings;
  const copy = [...listings];
  switch (sort) {
    case "lowest-price":
      return copy.sort((a, b) => parsePrice(a.price) - parsePrice(b.price));
    case "highest-price":
      return copy.sort((a, b) => parsePrice(b.price) - parsePrice(a.price));
    case "lowest-mileage":
      return copy.sort((a, b) => parseMileage(a.spec.mileage) - parseMileage(b.spec.mileage));
    case "highest-mileage":
      return copy.sort((a, b) => parseMileage(b.spec.mileage) - parseMileage(a.spec.mileage));
    case "newest-year":
      return copy.sort((a, b) => Number(b.spec.year) - Number(a.spec.year));
    case "oldest-year":
      return copy.sort((a, b) => Number(a.spec.year) - Number(b.spec.year));
    default:
      return listings;
  }
}

// Same case-insensitive, bidirectional-substring match the source's `assets/js/filterCar.js`
// (`applyCarFilters`) uses when comparing a checked filter value against text scraped from a
// `.card-box` — reproduced here against the typed fields directly instead of re-scraping the DOM.
function fuzzyMatch(a: string, b: string): boolean {
  const aLower = a.toLowerCase();
  const bLower = b.toLowerCase();
  return aLower === bLower || aLower.includes(bLower) || bLower.includes(aLower);
}

export type FilterTag = { key: string; label: string; remove: (filters: FilterState) => FilterState };

// Mirrors the source's `assets/js/filterCar.js` `#filterTags` chips (`createFilterTag`/`addFilter`):
// one removable pill per active selection, regardless of whether that category actually narrows the
// visible listings. Body Style/Door count/Cylinders/Colors/Features tags are included here even
// though they're decorative (see the scope note in FilterSidebar.tsx) — the source shows a tag for
// those too, since the tag row just reflects "what's currently checked," not "what's filtering."
// The source also always injects two extra default tags ("No accidents", "Harga Bagus") that don't
// correspond to any real field — those are deliberately NOT reproduced (no `Listing` field backs
// them; inventing one would violate the no-data-invention rule), so this list only ever contains
// tags a user actually created by interacting with the sidebar.
function buildFilterTags(filters: FilterState, priceMin: number, priceMax: number): FilterTag[] {
  const tags: FilterTag[] = [];
  const arrayTag = (values: string[], key: keyof FilterState) => {
    for (const v of values) {
      tags.push({
        key: `${key}-${v}`,
        label: v,
        remove: (f) => ({ ...f, [key]: (f[key] as string[]).filter((x) => x !== v) }),
      });
    }
  };
  arrayTag(filters.brand, "brand");
  arrayTag(filters.model, "model");
  arrayTag(filters.fuelType, "fuelType");
  arrayTag(filters.transmission, "transmission");
  arrayTag(filters.bodyStyle, "bodyStyle");
  arrayTag(filters.doorCount, "doorCount");
  arrayTag(filters.cylinders, "cylinders");
  arrayTag(filters.features, "features");
  if (filters.exteriorColor) {
    tags.push({ key: "exteriorColor", label: `Exterior ${filters.exteriorColor}`, remove: (f) => ({ ...f, exteriorColor: null }) });
  }
  if (filters.interiorColor) {
    tags.push({ key: "interiorColor", label: `Interior ${filters.interiorColor}`, remove: (f) => ({ ...f, interiorColor: null }) });
  }
  if (filters.priceRange[0] !== priceMin || filters.priceRange[1] !== priceMax) {
    tags.push({
      key: "price",
      label: `Price: $${filters.priceRange[0].toLocaleString()} - $${filters.priceRange[1].toLocaleString()}`,
      remove: (f) => ({ ...f, priceRange: [priceMin, priceMax] }),
    });
  }
  return tags;
}

function applyFilters(listings: Listing[], filters: FilterState): Listing[] {
  return listings.filter((listing) => {
    if (filters.brand.length > 0 && !filters.brand.some((v) => fuzzyMatch(listing.brandLabel, v))) {
      return false;
    }
    if (filters.model.length > 0 && !filters.model.some((v) => fuzzyMatch(listing.title, v))) {
      return false;
    }
    if (filters.fuelType.length > 0 && !filters.fuelType.some((v) => fuzzyMatch(listing.spec.fuel, v))) {
      return false;
    }
    if (filters.transmission.length > 0 && !filters.transmission.some((v) => fuzzyMatch(listing.spec.transmission, v))) {
      return false;
    }
    const price = parsePrice(listing.price);
    if (price > 0 && (price < filters.priceRange[0] || price > filters.priceRange[1])) {
      return false;
    }
    return true;
  });
}

// Shared filter/sort/pagination state for every listing-browse page (grid2/3/4-columns,
// gridstyle-halfmap, liststyle-*, topmap, ...) — extracted once a second consumer needed the exact
// same ~150 lines of stateful logic, rather than duplicating it per page.
export function useListingFilters(listings: Listing[]) {
  const [sort, setSort] = useState<SortOption>("lowest-price");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [priceMin, priceMax] = useMemo(() => {
    const prices = listings.map((l) => parsePrice(l.price)).filter((p) => p > 0);
    if (prices.length === 0) return [0, 0];
    return [Math.floor(Math.min(...prices) / 500) * 500, Math.ceil(Math.max(...prices) / 500) * 500];
  }, [listings]);

  const [filters, setFilters] = useState<FilterState>({
    brand: [],
    model: [],
    fuelType: [],
    transmission: [],
    priceRange: [priceMin, priceMax],
    bodyStyle: [],
    doorCount: [],
    cylinders: [],
    exteriorColor: null,
    interiorColor: null,
    features: [],
  });

  // Re-anchor the default range once the real min/max is known (listings are static per-page, so
  // this effectively only runs once, but stays correct if the section is ever reused with a
  // different listings array).
  useEffect(() => {
    setFilters((prev) => ({ ...prev, priceRange: [priceMin, priceMax] }));
  }, [priceMin, priceMax]);

  const filteredListings = useMemo(() => applyFilters(listings, filters), [listings, filters]);
  const sortedListings = useMemo(() => sortListings(filteredListings, sort), [filteredListings, sort]);
  const filterTags = useMemo(() => buildFilterTags(filters, priceMin, priceMax), [filters, priceMin, priceMax]);

  function clearAllFilters() {
    setFilters({
      brand: [],
      model: [],
      fuelType: [],
      transmission: [],
      priceRange: [priceMin, priceMax],
      bodyStyle: [],
      doorCount: [],
      cylinders: [],
      exteriorColor: null,
      interiorColor: null,
      features: [],
    });
  }

  const totalPages = Math.max(1, Math.ceil(sortedListings.length / PAGE_SIZE));

  // Changing filters or sort re-scopes the result set — jump back to page 1 like a typical listing
  // page, instead of leaving the user stranded mid-list (or on an empty page if the new set is smaller).
  useEffect(() => {
    setPage(1);
  }, [filters, sort]);

  const pageStart = (page - 1) * PAGE_SIZE;
  const pagedListings = sortedListings.slice(pageStart, pageStart + PAGE_SIZE);
  const rangeStart = sortedListings.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, sortedListings.length);

  return {
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
  };
}
