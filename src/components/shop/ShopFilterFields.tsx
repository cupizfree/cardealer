"use client";

import RangeSlider from "@/components/listing/RangeSlider";
import type { ShopFilterState } from "./useShopFilters";

const CATEGORIES = [
  { value: "breake-system", label: "Breake System", count: 12 },
  { value: "engine-oil", label: "Engine Oil", count: 43 },
  { value: "cleaning-system", label: "Cleaning System", count: 21 },
  { value: "car-battery", label: "Car Battery", count: 5 },
  { value: "car-accessories", label: "Car Accessories", count: 17 },
  { value: "care-care", label: "Care Care", count: 27 },
  { value: "tools", label: "Tools", count: 17 },
];

const BRANDING = [
  { value: "pro-series", label: "Pro-Series", count: 12 },
  { value: "monroe", label: "Monroe", count: 23 },
  { value: "penzoil", label: "Penzoil", count: 4 },
  { value: "fram", label: "Fram", count: 16 },
];

// Migrated from ../aurexo/shop.html's permanent `.inner-page-sidebar__nav` (lines 837-928). Category
// and Branding checkboxes are real (`shop.js`'s `applyShopFilters` genuinely filters the JSON-sourced
// product list on these two fields) — their displayed counts, however, are source's own literal
// placeholder numbers (12/43/21/5/17/27/17, 12/23/4/16), unrelated to the 9 real products' actual
// distribution (e.g. "Cleaning System" matches zero real products) — preserved verbatim as decorative
// labels, same "checkbox works, count is decorative" split already applied to the Listing family's own
// filter fields. The search input has no matching handler anywhere in source (confirmed via search) —
// UI_ONLY, `onSubmit` just prevents the default GET navigation.
export default function ShopFilterFields({
  filters,
  onFilterChange,
  priceMin,
  priceMax,
}: {
  filters: ShopFilterState;
  onFilterChange: (patch: Partial<ShopFilterState>) => void;
  priceMin: number;
  priceMax: number;
}) {
  function toggle(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  return (
    <>
      <form className="widget-search w-full mb-34" onSubmit={(event) => event.preventDefault()}>
        <div className="widget-search w-full mb-36">
          <input className="input-normal" type="text" name="search-header" placeholder="Search products..." />
          <button type="submit" className="widget-search-btn" aria-label="Search">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15.8047 15.8047L21.0012 21.0012" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        <p className="h4 mb-16">Categories</p>
        <div className="filter-features mb-32 style-2">
          {CATEGORIES.map((category) => (
            <label className="filter-checkbox style-4" key={category.value}>
              <input
                type="checkbox"
                name="category"
                value={category.value}
                checked={filters.categories.includes(category.value)}
                onChange={() => onFilterChange({ categories: toggle(filters.categories, category.value) })}
              />
              <span>
                {category.label} <em>({category.count})</em>
              </span>
            </label>
          ))}
        </div>

        <div className="divider mb-32" />

        <p className="h4 mb-22">Price Range</p>
        <div className="mb-28">
          <div className="search-cars__range style2">
            <div className="search-cars__range-wrapper mb-22" id="yearRangeWrapper">
              <RangeSlider
                min={priceMin}
                max={priceMax}
                step={10}
                value={filters.priceRange}
                onChange={(priceRange) => onFilterChange({ priceRange })}
              />
            </div>
            <div className="ranges-value gap-40 grid grid-cols-2">
              <div>
                <p className="text-sm mb-4">Min price</p>
                <span className="value flex">
                  <span id="yearMin" className="block">
                    {filters.priceRange[0].toLocaleString()}
                  </span>
                  $
                </span>
              </div>
              <div>
                <p className="text-sm mb-4">Max price</p>
                <span className="value flex">
                  <span id="yearMax" className="block">
                    {filters.priceRange[1].toLocaleString()}
                  </span>
                  $
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="divider mb-32" />

        <p className="h4 mb-16">Branding</p>
        <div className="filter-features style-2">
          {BRANDING.map((brand) => (
            <label className="filter-checkbox style-4" key={brand.value}>
              <input
                type="checkbox"
                name="branding"
                value={brand.value}
                checked={filters.brandings.includes(brand.value)}
                onChange={() => onFilterChange({ brandings: toggle(filters.brandings, brand.value) })}
              />
              <span>
                {brand.label}
                <em>({brand.count})</em>
              </span>
            </label>
          ))}
        </div>
      </form>
    </>
  );
}
