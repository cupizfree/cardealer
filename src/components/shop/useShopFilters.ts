"use client";

import { useEffect, useMemo, useState } from "react";
import type { Product } from "@/data/products";
import { parsePrice } from "@/data/products";

export type ShopFilterState = {
  categories: string[];
  brandings: string[];
  priceRange: [number, number];
};

export type ShopFilterTag = {
  key: string;
  label: string;
  remove: (filters: ShopFilterState) => ShopFilterState;
};

// The "Sort by" dropdown (Best Match/Lowest Price/.../Oldest Listed) has no matching logic anywhere in
// `shop.js` — confirmed via full search — it's `app.js`'s generic `core-dropdown` open/close/label-swap
// widget only, same as `ProductReviews`' comment-sort dropdown. Real sort was a deliberate, disclosed
// enhancement built for the Listing family (see `useListingFilters.ts`); this hook does NOT add the
// same enhancement here since it wasn't asked for and wouldn't be reproducing real source behavior —
// it stays a label-only decorative widget, matching what shop.html's real, JS-driven page actually does.

// Traced `shop.js`'s `applyShopFilters`/`loadProductsFromJson` in full: category, branding, and price
// range ARE genuinely real, live-filtering the JSON-sourced product list — reproduced here against the
// same `category`/`branding` values on `Product.shop`. Source's own `#slider-range` bounds are
// hardcoded `data-min="120" data-max="750"` regardless of the real $68-$5,983 product range (a real
// mismatch: the cheapest/most expensive real products could never be reached by that slider) — same
// call as `useListingFilters`'s own price-range recalibration: compute the real min/max from the actual
// data instead of reproducing source's own broken bounds.
const PAGE_SIZE = 6;

function buildFilterTags(filters: ShopFilterState, priceMin: number, priceMax: number): ShopFilterTag[] {
  const tags: ShopFilterTag[] = [];
  for (const value of filters.categories) {
    tags.push({
      key: `category-${value}`,
      label: value,
      remove: (f) => ({ ...f, categories: f.categories.filter((v) => v !== value) }),
    });
  }
  for (const value of filters.brandings) {
    tags.push({
      key: `branding-${value}`,
      label: value,
      remove: (f) => ({ ...f, brandings: f.brandings.filter((v) => v !== value) }),
    });
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

function applyFilters(products: Product[], filters: ShopFilterState): Product[] {
  return products.filter((product) => {
    if (filters.categories.length > 0 && !filters.categories.includes(product.shop?.category ?? "")) {
      return false;
    }
    if (filters.brandings.length > 0 && !filters.brandings.includes(product.shop?.branding ?? "")) {
      return false;
    }
    const price = parsePrice(product.price);
    if (price < filters.priceRange[0] || price > filters.priceRange[1]) {
      return false;
    }
    return true;
  });
}

export function useShopFilters(products: Product[]) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [page, setPage] = useState(1);

  const [priceMin, priceMax] = useMemo(() => {
    const prices = products.map((p) => parsePrice(p.price));
    if (prices.length === 0) return [0, 0];
    return [Math.floor(Math.min(...prices) / 10) * 10, Math.ceil(Math.max(...prices) / 10) * 10];
  }, [products]);

  const [filters, setFilters] = useState<ShopFilterState>({
    categories: [],
    brandings: [],
    priceRange: [priceMin, priceMax],
  });

  useEffect(() => {
    setFilters((prev) => ({ ...prev, priceRange: [priceMin, priceMax] }));
  }, [priceMin, priceMax]);

  const filteredProducts = useMemo(() => applyFilters(products, filters), [products, filters]);
  const filterTags = useMemo(() => buildFilterTags(filters, priceMin, priceMax), [filters, priceMin, priceMax]);

  function clearAllFilters() {
    setFilters({ categories: [], brandings: [], priceRange: [priceMin, priceMax] });
  }

  useEffect(() => {
    setPage(1);
  }, [filters]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const pageStart = (page - 1) * PAGE_SIZE;
  const pagedProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE);
  const rangeStart = filteredProducts.length === 0 ? 0 : pageStart + 1;
  const rangeEnd = Math.min(pageStart + PAGE_SIZE, filteredProducts.length);

  return {
    isFilterOpen,
    setIsFilterOpen,
    page,
    setPage,
    priceMin,
    priceMax,
    filters,
    setFilters,
    filteredProducts,
    pagedProducts,
    filterTags,
    clearAllFilters,
    totalPages,
    rangeStart,
    rangeEnd,
  };
}
