"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RangeSlider from "./RangeSlider";
import CheckboxDropdown from "./CheckboxDropdown";
import ColorDropdown from "./ColorDropdown";
import type { FilterState } from "./FilterSidebar";

function toggleValue(list: string[], value: string): string[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
}

// Aurexo's horizontal "hero" search bar (`.search-cars__filters` + collapsible
// `.search-cars__advanced` panel, see ../aurexo/listing-topmap.html and assets/js/app.js's
// `filterToggle()`) — a different UI shell than the sidebar's `FilterFields`, but real filtering
// (Brand/Model/Fuel Type/Transmission) drives the exact same shared `useListingFilters` state, so
// it's wired through the same `filters`/`onFilterChange` props rather than owning its own state.
//
// Scope decision: Miles, (primary bar) Price, Drive Type, Color, Cylinders, and the Year range
// slider have no corresponding real `Listing` field — same "decorative if no per-card data" rule
// already applied to Body Style/Door count/Cylinders/Colors on the sidebar pages (see
// docs/migration/COMPONENT_MAP.md #24) — so they get local component state for visual
// open/close/select interaction only, not wired into the shared filter/tag state. The source's
// "Fitur" checklist under Advanced (~34 checkboxes, itself riddled with copy-paste id/label
// mismatches — e.g. `id="AdjustableSteering"` paired with the label "Engine Start Stop Button") is
// deliberately NOT reproduced at all: purely decorative filler with no functional or visual payoff
// proportional to transcribing it. See docs/migration/COMPONENT_MAP.md #28.
export default function TopSearchFilterBar({
  filters,
  onFilterChange,
  matchCount,
  isAdvancedOpen,
  onToggleAdvanced,
}: {
  filters: Pick<FilterState, "brand" | "model" | "fuelType" | "transmission">;
  onFilterChange: (patch: Partial<FilterState>) => void;
  matchCount: number;
  isAdvancedOpen: boolean;
  onToggleAdvanced: () => void;
}) {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  // Decorative-only local state (see scope note above) — never read by useListingFilters.
  const [miles, setMiles] = useState<string[]>([]);
  const [maxPrice, setMaxPrice] = useState<string[]>([]);
  const [driveType, setDriveType] = useState<string[]>([]);
  const [cylinders, setCylinders] = useState<string[]>([]);
  const [color, setColor] = useState<string | null>(null);
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2026]);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".filter-select-dropdown")) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function toggleDropdown(name: string) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  return (
    <div className="container filter-sidebar-desktop">
      <div className="search-cars__filters">
        <CheckboxDropdown
          name="brand"
          label="Pilih Merek"
          toggleId="topmapBrandToggle"
          defaultText="Semua Merek"
          options={["Audi", "Chevrolet", "Hyundai", "Mustang"]}
          selected={filters.brand}
          onToggle={(value) => onFilterChange({ brand: toggleValue(filters.brand, value) })}
          isOpen={openDropdown === "brand"}
          onToggleOpen={() => toggleDropdown("brand")}
          layout="bar"
        />

        <CheckboxDropdown
          name="model"
          label="Pilih Model"
          toggleId="topmapModelToggle"
          defaultText="Semua Model"
          options={["A3", "A4", "A6", "A8"]}
          selected={filters.model}
          onToggle={(value) => onFilterChange({ model: toggleValue(filters.model, value) })}
          isOpen={openDropdown === "model"}
          onToggleOpen={() => toggleDropdown("model")}
          layout="bar"
        />

        <CheckboxDropdown
          name="miles"
          label="Pilih Jarak Tempuh"
          toggleId="topmapMilesToggle"
          defaultText="Semua jarak"
          options={["0-10k", "$10k-$20k"]}
          selected={miles}
          onToggle={(value) => setMiles((prev) => toggleValue(prev, value))}
          isOpen={openDropdown === "miles"}
          onToggleOpen={() => toggleDropdown("miles")}
          layout="bar"
        />

        <CheckboxDropdown
          name="maxPrice"
          label="Harga Maksimal"
          toggleId="topmapMaxPriceToggle"
          defaultText="Semua Harga"
          options={["0-10k", "$10k-$20k"]}
          selected={maxPrice}
          onToggle={(value) => setMaxPrice((prev) => toggleValue(prev, value))}
          isOpen={openDropdown === "maxPrice"}
          onToggleOpen={() => toggleDropdown("maxPrice")}
          layout="bar"
        />

        <button type="button" className="search-cars__filter" onClick={onToggleAdvanced} aria-label="Toggle advanced filters">
          <Image src="/assets/icons/filter.svg" alt="Filter" width={20} height={20} />
        </button>

        <button type="button" className="search-cars__search flex items-center gap-8 justify-center md-w-full">
          <Image src="/assets/icons/search.svg" alt="search" width={16} height={16} />
          Show {matchCount.toLocaleString()} Matches
        </button>
      </div>

      {isAdvancedOpen && (
        // Source's base CSS sets `display: none` on `.search-cars__advanced` (jQuery's
        // `slideToggle()` sets an inline `display` directly — see assets/js/app.js's
        // `filterToggle()`); since we mount/unmount instead of animating, force it visible here.
        <div className="search-cars__advanced" id="advancedFilters" style={{ display: "block" }}>
          <div className="search-cars__advanced-content">
            <div className="search-cars__advanced-row">
              <CheckboxDropdown
                name="Bahan Bakar"
                label="Bahan Bakar"
                toggleId="topmapFuelTypeToggle"
                defaultText="All Fuel Type"
                options={["Bensin", "Solar", "Listrik"]}
                selected={filters.fuelType}
                onToggle={(value) => onFilterChange({ fuelType: toggleValue(filters.fuelType, value) })}
                isOpen={openDropdown === "Bahan Bakar"}
                onToggleOpen={() => toggleDropdown("Bahan Bakar")}
              />

              <CheckboxDropdown
                name="Transmisi"
                label="Transmisi"
                toggleId="topmapTransmissionToggle"
                defaultText="All Transmission"
                options={["Manual", "Matic"]}
                selected={filters.transmission}
                onToggle={(value) => onFilterChange({ transmission: toggleValue(filters.transmission, value) })}
                isOpen={openDropdown === "Transmisi"}
                onToggleOpen={() => toggleDropdown("Transmisi")}
              />

              <CheckboxDropdown
                name="DriveType"
                label="Penggerak"
                toggleId="topmapDriveTypeToggle"
                defaultText="All Drive Type"
                options={["FWD", "RWD", "AWD"]}
                selected={driveType}
                onToggle={(value) => setDriveType((prev) => toggleValue(prev, value))}
                isOpen={openDropdown === "DriveType"}
                onToggleOpen={() => toggleDropdown("DriveType")}
              />

              <ColorDropdown
                name="color"
                label="Warna"
                toggleId="topmapColorToggle"
                selected={color}
                onSelect={setColor}
                isOpen={openDropdown === "color"}
                onToggleOpen={() => toggleDropdown("color")}
              />

              <CheckboxDropdown
                name="Silinder"
                label="Silinder"
                toggleId="topmapCylindersToggle"
                defaultText="All Cylinders"
                options={["4", "3", "2"]}
                selected={cylinders}
                onToggle={(value) => setCylinders((prev) => toggleValue(prev, value))}
                isOpen={openDropdown === "Silinder"}
                onToggleOpen={() => toggleDropdown("Silinder")}
              />

              <div className="search-cars__range">
                <p className="search-cars__range-label">
                  Tahun: <span>{yearRange[0]}</span> - <span>{yearRange[1]}</span>
                </p>
                <div className="search-cars__range-wrapper" id="yearRangeWrapper">
                  <RangeSlider min={2015} max={2026} step={1} value={yearRange} onChange={setYearRange} />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
