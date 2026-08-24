"use client";

import { useState } from "react";
import Image from "next/image";
import type { Product } from "@/data/products";
import ShopProductCard from "./ShopProductCard";
import ShopFilterFields from "./ShopFilterFields";
import ShopFilterTagsRow from "./ShopFilterTagsRow";
import Pagination from "@/components/common/Pagination";
import { useShopFilters } from "./useShopFilters";
import { FilterIcon } from "@/components/common/icons";

// Migrated from ../aurexo/shop.html lines 490-953. Real category/branding/price-range filtering + real
// pagination (standing rule for any page with `.pagination` markup — source's own is static, non-
// paging markup, see `useShopFilters.ts`'s own comment); "Sort by" stays a decorative label-swap
// dropdown, matching source's actual (real-widget-but-no-real-resort) behavior.
export default function ShopSidebarSection({ products }: { products: Product[] }) {
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [sortLabel, setSortLabel] = useState("Lowest Price");
  const {
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
  } = useShopFilters(products);

  const onFilterChange = (patch: Partial<typeof filters>) => setFilters((prev) => ({ ...prev, ...patch }));

  const SORT_OPTIONS = [
    "Best Match",
    "Lowest Price",
    "Highest Price",
    "Lowest Mileage",
    "Highest Mileage",
    "Nearest Location",
    "Best Deal",
    "Newest Year",
    "Oldest Year",
    "Newest Listed",
    "Oldest Listed",
  ];

  return (
    <div className="inner-page-sidebar">
      <div className="inner-page-sidebar__content">
        <div className="row mb-32">
          <div className="col-md-6 flex items-center">
            <div className="flex items-center gap-16">
              <button className="btn-filter hidden md-block" onClick={() => setIsFilterOpen(true)}>
                <FilterIcon />
                Filters
              </button>
              <p>
                Showing {rangeStart} – {rangeEnd} of {filteredProducts.length} Products
              </p>
            </div>
          </div>
          <div className="col-md-6">
            <div className="flex items-center gap-8 justify-end md-flex-start md-mt-16">
              <p>Sort by:</p>
              <div className={`core-dropdown${isSortOpen ? " active" : ""}`}>
                <button className="core-dropdown__button" type="button" onClick={() => setIsSortOpen((open) => !open)}>
                  <span className="core-dropdown__selected">{sortLabel}</span>
                  <Image src="/assets/icons/chevron-down-primary.svg" alt="chevron" className="core-dropdown__icon" width={20} height={20} />
                </button>
                <div className="core-dropdown__menu">
                  <ul className="core-dropdown__list">
                    {SORT_OPTIONS.map((option) => (
                      <li className="core-dropdown__item" key={option}>
                        <button
                          type="button"
                          className={`core-dropdown__option${option === sortLabel ? " active" : ""}`}
                          onClick={() => {
                            setSortLabel(option);
                            setIsSortOpen(false);
                          }}
                        >
                          {option}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="row mb-32">
          <ShopFilterTagsRow
            matchCount={filteredProducts.length}
            filterTags={filterTags}
            onRemoveTag={(remove) => setFilters((prev) => remove(prev))}
            onClearAll={clearAllFilters}
          />
        </div>

        <div className="grid grid-cols-3 xl-grid-cols-2 sm-grid-cols-1 gap-x-30 gap-y-40 mb-30">
          {pagedProducts.map((product) => (
            <ShopProductCard key={product.id} product={product} />
          ))}
        </div>

        {filteredProducts.length > 0 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
      </div>

      <div className="inner-page-sidebar__nav filter-sidebar-desktop md-hidden">
        <ShopFilterFields filters={filters} onFilterChange={onFilterChange} priceMin={priceMin} priceMax={priceMax} />
      </div>

      {/* Mobile popup — source's own `.filter-sidebar-mobile` content is genuinely empty (confirmed via
          direct source read: header + close button only, no fields inside at all), preserved as-is
          rather than filling it with the desktop fields it never had. */}
      <div className={`filter-sidebar filter-sidebar-popup${isFilterOpen ? " active" : ""}`} id="filterSidebar">
        <div className="filter-sidebar__overlay" onClick={() => setIsFilterOpen(false)} />
        <div className="filter-sidebar__panel">
          <div className="filter-sidebar__header bg-white">
            <p className="h5">Advanced Search</p>
            <button className="filter-sidebar__close" onClick={() => setIsFilterOpen(false)} aria-label="Close">
              <Image src="/assets/icons/X.svg" alt="close" width={20} height={20} />
            </button>
          </div>
          <div className="filter-sidebar__content filter-sidebar-mobile" />
        </div>
      </div>
    </div>
  );
}
